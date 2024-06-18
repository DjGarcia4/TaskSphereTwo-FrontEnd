import { useForm } from "react-hook-form";
import { UserRegistrationForm } from "@/types/index";
import ErrorMessage from "@/components/ErrorMessage";
import { useMutation } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { createAccount } from "@/api/AuthAPI";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

const formVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const RegisterView = () => {
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

    toast.promise(
      myPromise,
      {
        loading: "Registrando Cuenta...",
        success: "Cuenta registrada, revisa tu email para confirmarla",
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
    navigate("/auth/login");
  };

  return (
    <>
      <motion.div
        initial={{ x: "100vw" }}
        animate={{ x: 0 }}
        exit={{ x: "-100vw" }}
        transition={{
          type: "spring",
          stiffness: 120,
          damping: 20,
          duration: 0.5,
        }}
      >
        <h1 className="text-4xl ">Crear Cuenta</h1>
        <p className="text-2xl font-light mt-2">
          Llena el formulario para {""}
          <span className=" text-pink-600"> crear tu cuenta</span>
        </p>

        <motion.form
          onSubmit={handleSubmit(handleRegister)}
          className="space-y-5 p-10 mt-2 bg-white rounded-lg shadow-lg"
          noValidate
          initial="hidden"
          animate="visible"
          variants={formVariants}
        >
          <motion.div className="flex flex-col" variants={itemVariants}>
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
            {errors.email && (
              <ErrorMessage>{errors.email.message}</ErrorMessage>
            )}
          </motion.div>

          <motion.div className="flex flex-col" variants={itemVariants}>
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
          </motion.div>

          <motion.div className="flex flex-col" variants={itemVariants}>
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
          </motion.div>

          <motion.div className="flex flex-col" variants={itemVariants}>
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
              <ErrorMessage>
                {errors.password_confirmation.message}
              </ErrorMessage>
            )}
          </motion.div>

          <motion.input
            type="submit"
            value="Registrarme"
            className="bg-pink-600 hover:bg-pink-700 px-10 py-3 text-white text-xl cursor-pointer transition-colors rounded-lg w-full"
            variants={itemVariants}
          />
        </motion.form>
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
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
        </motion.div>
      </motion.div>
    </>
  );
};

export default RegisterView;
