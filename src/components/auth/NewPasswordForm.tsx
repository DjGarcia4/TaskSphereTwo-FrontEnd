import type { ConfirmToken, NewPasswordForm } from "../../types";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import ErrorMessage from "@/components/ErrorMessage";
import { useMutation } from "@tanstack/react-query";
import { updatePasswordWithToken } from "@/api/AuthAPI";
import toast from "react-hot-toast";

type NewPasswordFormProps = {
  token: ConfirmToken["token"];
};

export default function NewPasswordForm({ token }: NewPasswordFormProps) {
  const navigate = useNavigate();
  const initialValues: NewPasswordForm = {
    password: "",
    password_confirmation: "",
  };
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({ defaultValues: initialValues });

  const mutation = useMutation({
    mutationFn: updatePasswordWithToken,
  });

  const handleNewPassword = async (formData: NewPasswordForm) => {
    const data = {
      formData,
      token,
    };
    const myPromise = mutation.mutateAsync(data);
    toast.promise(myPromise, {
      loading: "Restableciendo contraseña...",
      success: "Contraseña modificada correctamente",
      error: (err) => {
        // Captura y muestra mensajes de error personalizados
        const errorMessage = err.message || "Error sin especificar";
        return errorMessage;
      },
    });
    await myPromise;
    navigate("/auth/login");
  };

  const password = watch("password");

  return (
    <>
      <form
        onSubmit={handleSubmit(handleNewPassword)}
        className=" p-10 space-y-4 bg-white mt-10 rounded-lg shadow-lg"
        noValidate
      >
        <div className="flex flex-col s">
          <label className="font-normal text-2xl">Cotraseña Nueva</label>

          <input
            type="password"
            placeholder="Contraseña de Registro"
            className="w-full p-3  border-gray-300 border rounded-lg"
            {...register("password", {
              required: "La contraseña es obligatoria",
              minLength: {
                value: 8,
                message: "La contrseña debe ser mínimo de 8 caracteres",
              },
            })}
          />
          {errors.password && (
            <ErrorMessage>{errors.password.message}</ErrorMessage>
          )}
        </div>
        <div className="flex flex-col s">
          <label className="font-normal text-2xl">
            Repetir Contraseña Nueva
          </label>

          <input
            id="password_confirmation"
            type="password"
            placeholder="Repite Contraseña de Registro"
            className="w-full p-3  border-gray-300 border rounded-lg"
            {...register("password_confirmation", {
              required: "Repetir Contraseña es obligatorio",
              validate: (value) =>
                value === password || "Las contraseñas no son iguales",
            })}
          />

          {errors.password_confirmation && (
            <ErrorMessage>{errors.password_confirmation.message}</ErrorMessage>
          )}
        </div>
        <input
          type="submit"
          value="Restablecer Contraseña"
          className="bg-pink-600 hover:bg-pink-700 px-10 py-3 text-white text-xl  cursor-pointer transition-colors rounded-lg w-full"
        />
      </form>
    </>
  );
}
