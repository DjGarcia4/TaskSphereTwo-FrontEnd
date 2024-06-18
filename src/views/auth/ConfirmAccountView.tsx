import { Link, useNavigate } from "react-router-dom";
import { PinInput, PinInputField } from "@chakra-ui/pin-input";
import { useState } from "react";
import { ConfirmToken } from "@/types/index";
import { useMutation } from "@tanstack/react-query";
import { confirmAccount } from "@/api/AuthAPI";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

const listVariants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

export default function ConfirmAccountView() {
  const [token, setToken] = useState<ConfirmToken["token"]>("");
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: confirmAccount,
  });
  const handleChange = (token: ConfirmToken["token"]) => {
    setToken(token);
  };
  const handleComplete = async (token: ConfirmToken["token"]) => {
    const myPromise = mutation.mutateAsync({ token });
    toast.promise(myPromise, {
      loading: "Confirmando Cuenta...",
      success: "Cuenta confirmada correctamente, ya puedes iniciar sesión",
      error: (err) => {
        const errorMessage = err.message || "Error sin especificar";
        return errorMessage;
      },
    });
    await myPromise;
    navigate("/auth/login");
  };
  return (
    <>
      <h1 className="text-5xl ">Confirma tu Cuenta</h1>
      <p className="text-2xl font-light  mt-5">
        Ingresa el código que recibiste {""}
        <span className=" text-pink-600"> por e-mail</span>
      </p>
      <motion.form
        className="space-y-8 p-10 bg-white mt-10 rounded-lg shadow-lg"
        initial="hidden"
        animate="visible"
        variants={listVariants}
      >
        <motion.label
          className="font-normal text-2xl text-center block"
          variants={itemVariants}
        >
          Código de 6 dígitos
        </motion.label>
        <motion.div
          className=" flex justify-center gap-5"
          variants={listVariants}
        >
          <PinInput
            value={token}
            onChange={handleChange}
            onComplete={handleComplete}
          >
            {Array.from({ length: 6 }).map((_, index) => (
              <motion.div key={index} variants={itemVariants}>
                <PinInputField className="w-10 h-15 p-3 rounded-lg bg-gray-300 placeholder-gray-300 text-center" />
              </motion.div>
            ))}
          </PinInput>
        </motion.div>
      </motion.form>

      <motion.nav
        className="mt-10 flex flex-col space-y-4"
        variants={itemVariants}
      >
        <Link
          to="/auth/request-code"
          className="text-center text-gray-500 font-normal hover:text-pink-600 cursor-pointer transition-colors"
        >
          Solicitar un nuevo Código
        </Link>
      </motion.nav>
    </>
  );
}
