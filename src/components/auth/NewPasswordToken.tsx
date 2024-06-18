import { ConfirmToken } from "@/types/index";
import { PinInput, PinInputField } from "@chakra-ui/pin-input";
import { Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { validateToken } from "@/api/AuthAPI";
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

type NewPasswordTokenProps = {
  token: ConfirmToken["token"];
  setToken: React.Dispatch<React.SetStateAction<string>>;
  setIsValidToken: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function NewPasswordToken({
  token,
  setToken,
  setIsValidToken,
}: NewPasswordTokenProps) {
  const mutation = useMutation({
    mutationFn: validateToken,
  });

  const handleChange = (token: ConfirmToken["token"]) => {
    setToken(token);
  };

  const handleComplete = async (token: ConfirmToken["token"]) => {
    const myPromise = mutation.mutateAsync({ token });
    toast.promise(
      myPromise,
      {
        loading: "Validando token...",
        success: "Token Valido correctamente, define tu nueva contraseña",
        error: (err) => {
          const errorMessage = err.message || "Error sin especificar";
          return errorMessage;
        },
      },
      {
        position: "top-center",
      }
    );
    await myPromise;
    setIsValidToken(true);
  };

  return (
    <>
      <motion.form
        className="space-y-8 p-10 rounded-lg bg-white mt-10"
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
          className="flex justify-center gap-5"
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
          to="/auth/forgot-password"
          className="text-center text-gray-500 font-normal hover:text-pink-600 cursor-pointer transition-colors"
        >
          Solicitar un nuevo Código
        </Link>
      </motion.nav>
    </>
  );
}
