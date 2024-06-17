import { useForm } from "react-hook-form";
import { UserRegistrationForm } from "@/types/index";
import ErrorMessage from "@/components/ErrorMessage";
import { useMutation } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { createAccount } from "@/api/AuthAPI";
import toast from "react-hot-toast";

export default function RegisterView() {
  const navigate = useNavigate();
  const initialValues: UserRegistrationForm = {
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  };

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<UserRegistrationForm>({ defaultValues: initialValues });

  const password = watch("password");
  const mutation = useMutation({
    mutationFn: createAccount,
  });

  const handleRegister = async (formData: UserRegistrationForm) => {
    const myPromise = mutation.mutateAsync(formData);

    toast.promise(myPromise, {
      loading: "Registrando Cuenta...",
      success: "Cuenta registrada, revisa tu email para confirmarla",
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
      <h1 className="text-4xl ">Crear Cuenta</h1>
      <p className="text-2xl font-light mt-2">
        Llena el formulario para {""}
        <span className=" text-pink-600"> crear tu cuenta</span>
      </p>

      <form
        onSubmit={handleSubmit(handleRegister)}
        className="space-y-5 p-10 mt-2 bg-white rounded-lg shadow-lg"
        noValidate
      >
        <div className="flex flex-col ">
          <label className="font-normal text-2xl" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="Email de Registro"
            className="w-full p-3  border-gray-300 border rounded-lg"
            {...register("email", {
              required: "El Email de registro es obligatorio",
              pattern: {
                value: /\S+@\S+\.\S+/,
                message: "E-mail no válido",
              },
            })}
          />
          {errors.email && <ErrorMessage>{errors.email.message}</ErrorMessage>}
        </div>

        <div className="flex flex-col ">
          <label className="font-normal text-2xl">Nombre</label>
          <input
            type="name"
            placeholder="Nombre de Registro"
            className="w-full p-3  border-gray-300 border rounded-lg"
            {...register("name", {
              required: "El Nombre de usuario es obligatorio",
            })}
          />
          {errors.name && <ErrorMessage>{errors.name.message}</ErrorMessage>}
        </div>

        <div className="flex flex-col ">
          <label className="font-normal text-2xl">Password</label>

          <input
            type="password"
            placeholder="Password de Registro"
            className="w-full p-3  border-gray-300 border rounded-lg"
            {...register("password", {
              required: "El Password es obligatorio",
              minLength: {
                value: 8,
                message: "El Password debe ser mínimo de 8 caracteres",
              },
            })}
          />
          {errors.password && (
            <ErrorMessage>{errors.password.message}</ErrorMessage>
          )}
        </div>

        <div className="flex flex-col ">
          <label className="font-normal text-2xl">Repetir Password</label>

          <input
            id="password_confirmation"
            type="password"
            placeholder="Repite Password de Registro"
            className="w-full p-3  border-gray-300 border rounded-lg"
            {...register("password_confirmation", {
              required: "Repetir Password es obligatorio",
              validate: (value) =>
                value === password || "Los Passwords no son iguales",
            })}
          />

          {errors.password_confirmation && (
            <ErrorMessage>{errors.password_confirmation.message}</ErrorMessage>
          )}
        </div>

        <input
          type="submit"
          value="Registrarme"
          className="bg-pink-600 hover:bg-pink-700 px-10 py-3 text-white text-xl  cursor-pointer transition-colors rounded-lg w-full"
        />
      </form>
      <nav className=" mt-5 flex flex-col space-y-4">
        <Link
          to="/auth/login"
          className=" text-center text-gray-500 font-normal hover:text-pink-600 cursor-pointer transition-colors"
        >
          ¿Ya tienes cuenta? Inicia Sesión
        </Link>
        <Link
          to="/auth/forgot-password "
          className=" text-center text-gray-500 font-normal hover:text-pink-600 cursor-pointer transition-colors"
        >
          ¿Olvidaste tu contraseña? Restablecela
        </Link>
      </nav>
    </>
  );
}
