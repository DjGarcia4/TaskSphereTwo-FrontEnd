import { useForm } from "react-hook-form";
import { UserLoginForm } from "@/types/index";
import ErrorMessage from "@/components/ErrorMessage";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { login } from "@/api/AuthAPI";
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

export default function LoginView() {
  const navigate = useNavigate();
  const initialValues: UserLoginForm = {
    email: "",
    password: "",
  };
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: initialValues });
  const mutation = useMutation({
    mutationFn: login,
  });

  const handleLogin = async (formData: UserLoginForm) => {
    const myPromise = mutation.mutateAsync(formData);
    toast.promise(
      myPromise,
      {
        loading: "Iniciando Sesión...",
        success: `¡Bienvenido!`,
        error: (err) => {
          const errorMessage = err.message || "Error sin especificar";
          return errorMessage;
        },
      },
      {
        position: "top-left",
      }
    );
    await myPromise;
    navigate("/");
  };

  return (
    <>
      <motion.div
        initial={{ x: "-100vw" }}
        animate={{ x: 0 }}
        exit={{ x: "100vw" }}
        transition={{
          type: "spring",
          stiffness: 120,
          damping: 20,
          duration: 0.5,
        }}
      >
        <h1 className="text-4xl ">Iniciar Sesión</h1>
        <p className="text-2xl font-light mt-2">
          Comienza a planear tus proyectos{""}
          <span className=" text-pink-600"> iniciando sesión</span>
        </p>

        <motion.form
          onSubmit={handleSubmit(handleLogin)}
          className="space-y-4 p-10 bg-white rounded-lg shadow-lg mt-3.5"
          noValidate
          initial="hidden"
          animate="visible"
          variants={formVariants}
        >
          <motion.div className="flex flex-col" variants={itemVariants}>
            <label className="font-normal text-2xl">Email</label>
            <input
              id="email"
              type="email"
              placeholder="Email de Registro"
              className="w-full p-3  border-gray-300 border rounded-lg"
              {...register("email", {
                required: "El Email es obligatorio",
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
            <label className="font-normal text-2xl">Password</label>
            <input
              type="password"
              placeholder="Password de Registro"
              className="w-full p-3  border-gray-300 border rounded-lg"
              {...register("password", {
                required: "El Password es obligatorio",
              })}
            />
            {errors.password && (
              <ErrorMessage>{errors.password.message}</ErrorMessage>
            )}
          </motion.div>

          <motion.input
            type="submit"
            value="Iniciar Sesión"
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
              to="/auth/register"
              className=" text-center text-gray-500 font-normal hover:text-pink-600 cursor-pointer transition-colors"
            >
              ¿No tienes cuenta? Crea una
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
}
