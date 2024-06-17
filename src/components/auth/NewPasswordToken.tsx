import { ConfirmToken } from "@/types/index";
import { PinInput, PinInputField } from "@chakra-ui/pin-input";
import { Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { validateToken } from "@/api/AuthAPI";
import toast from "react-hot-toast";

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
    toast.promise(myPromise, {
      loading: "Validando token...",
      success: "Token Valido correctamente, define tu nueva contraseña",
      error: (err) => {
        // Captura y muestra mensajes de error personalizados
        const errorMessage = err.message || "Error sin especificar";
        return errorMessage;
      },
    });
    await myPromise;
    setIsValidToken(true);
  };

  return (
    <>
      <form className="space-y-8 p-10 rounded-lg bg-white mt-10">
        <label className="font-normal text-2xl text-center block">
          Código de 6 dígitos
        </label>
        <div className="flex justify-center gap-5">
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
          to="/auth/forgot-password"
          className="text-center text-gray-500 font-normal hover:text-pink-600 cursor-pointer transition-colors"
        >
          Solicitar un nuevo Código
        </Link>
      </nav>
    </>
  );
}
