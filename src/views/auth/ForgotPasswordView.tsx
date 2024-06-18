import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { ForgotPasswordForm } from "../../types";
import ErrorMessage from "@/components/ErrorMessage";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { forgotPassword } from "@/api/AuthAPI";
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

export default function ForgotPasswordView() {
  const initialValues: ForgotPasswordForm = {
    email: "",
  };
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: initialValues });

  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: forgotPassword,
  });

  const handleForgotPassword = async (formData: ForgotPasswordForm) => {
    const myPromise = mutation.mutateAsync(formData);
    toast.promise(
      myPromise,
      {
        loading: "Enviando instrucciones...",
        success: "Instrucciones enviadas, revisa tu email",
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
        <h1 className="text-4xl">Restablecer Contraseña</h1>
        <p className="text-2xl font-light mt-2">
          ¿Olvidaste tu Contraseña? coloca tu email{""}
          <span className="text-pink-600"> y reestablece tu contaseña</span>
        </p>

        <motion.form
          onSubmit={handleSubmit(handleForgotPassword)}
          className="space-y-8 p-10 bg-white rounded-lg shadow-lg mt-5"
          noValidate
          initial="hidden"
          animate="visible"
          variants={formVariants}
        >
          <motion.div className="flex flex-col gap-5" variants={itemVariants}>
            <label className="font-normal text-2xl" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="Email de Registro"
              className="w-full p-3 border-gray-300 border rounded-lg"
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

          <motion.input
            type="submit"
            value="Enviar Instrucciones"
            className="bg-pink-600 hover:bg-pink-700 px-10 py-3 text-white text-xl cursor-pointer transition-colors rounded-lg w-full"
            variants={itemVariants}
          />
        </motion.form>

        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <nav className="mt-10 flex flex-col space-y-4">
            <Link
              to="/auth/login"
              className="text-center text-gray-500 font-normal hover:text-pink-600 cursor-pointer transition-colors"
            >
              ¿Ya tienes cuenta? Iniciar Sesión
            </Link>
            <Link
              to="/auth/register"
              className="text-center text-gray-500 font-normal hover:text-pink-600 cursor-pointer transition-colors"
            >
              ¿No tienes cuenta? Crea una
            </Link>
          </nav>
        </motion.div>
      </motion.div>
    </>
  );
}
