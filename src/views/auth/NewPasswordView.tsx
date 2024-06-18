import { useState } from "react";
import NewPasswordToken from "@/components/auth/NewPasswordToken";
import NewPasswordForm from "@/components/auth/NewPasswordForm";
import { ConfirmToken } from "@/types/index";
import { motion } from "framer-motion";

export default function NewPasswordView() {
  const [token, setToken] = useState<ConfirmToken["token"]>("");
  const [isValidToken, setIsValidToken] = useState(false);
  return (
    <>
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <h1 className="text-5xl ">Restablecer Contraseña</h1>
        <p className="text-2xl font-light  mt-5">
          Ingresa el código que recibiste {""}
          <span className=" text-pink-600"> por e-mail</span>
        </p>
      </motion.div>
      {!isValidToken ? (
        <NewPasswordToken
          token={token}
          setToken={setToken}
          setIsValidToken={setIsValidToken}
        />
      ) : (
        <NewPasswordForm token={token} />
      )}
    </>
  );
}
