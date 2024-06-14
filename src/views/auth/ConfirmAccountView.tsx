import { Link, useNavigate } from "react-router-dom";
import { PinInput, PinInputField } from "@chakra-ui/pin-input";
import { useState } from "react";
import { ConfirmToken } from "@/types/index";
import { useMutation } from "@tanstack/react-query";
import { confirmAccount } from "@/api/AuthAPI";
import toast from "react-hot-toast";

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
      success: "Cuenta confirmada conrrectamente, ya puedes iniciar sesión",
      error: (err) => {
        // Captura y muestra mensajes de error personalizados
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
      <form className="space-y-8 p-10 bg-white mt-10 rounded-lg shadow-lg">
        <label className="font-normal text-2xl text-center block">
          Código de 6 dígitos
        </label>
        <div className=" flex justify-center gap-5">
          <PinInput
            value={token}
            onChange={handleChange}
            onComplete={handleComplete}
          >
            <PinInputField className="w-10 h-15 p-3 rounded-lg bg-gray-300 placeholder-gray-300 text-center" />
            <PinInputField className="w-10 h-15 p-3 rounded-lg bg-gray-300 placeholder-gray-300 text-center" />
            <PinInputField className="w-10 h-15 p-3 rounded-lg bg-gray-300 placeholder-gray-300 text-center" />
            <PinInputField className="w-10 h-15 p-3 rounded-lg bg-gray-300 placeholder-gray-300 text-center" />
            <PinInputField className="w-10 h-15 p-3 rounded-lg bg-gray-300 placeholder-gray-300 text-center" />
            <PinInputField className="w-10 h-15 p-3 rounded-lg bg-gray-300 placeholder-gray-300 text-center" />
          </PinInput>
        </div>
      </form>

      <nav className="mt-10 flex flex-col space-y-4">
        <Link
          to="/auth/request-code"
          className="text-center text-gray-500 font-normal hover:text-pink-600 cursor-pointer transition-colors"
        >
          Solicitar un nuevo Código
        </Link>
      </nav>
    </>
  );
}
