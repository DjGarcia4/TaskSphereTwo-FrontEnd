import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { RequestConfirmationCodeForm } from "../../types";
import ErrorMessage from "@/components/ErrorMessage";
import { useMutation } from "@tanstack/react-query";
import { requestConfirmationCode } from "@/api/AuthAPI";
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

export default function RegisterView() {
  const initialValues: RequestConfirmationCodeForm = {
    email: "",
  };

  const {
    register,
    handleSubmit,

    formState: { errors },
  } = useForm({ defaultValues: initialValues });

  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: requestConfirmationCode,
  });

  const handleRequestCode = async (formData: RequestConfirmationCodeForm) => {
    const myPromise = mutation.mutateAsync(formData);
    toast.promise(myPromise, {
      loading: "Solicitando nuevo codigo...",
      success:
        "Codigo solicitado correctamente, revisa tu email para confirmar tu cuenta",
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
      <h1 className="text-4xl  ">Solicitar Código de Confirmación</h1>
      <p className="text-2xl font-light  mt-5">
        Coloca tu e-mail para recibir {""}
        <span className=" text-pink-600"> un nuevo código</span>
      </p>

      <motion.form
        onSubmit={handleSubmit(handleRequestCode)}
        className="space-y-8 p-10 rounded-lg bg-white mt-10 shadow-lg"
        noValidate
        variants={listVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div className="flex flex-col gap-5" variants={listVariants}>
          <motion.label
            className="font-normal text-2xl"
            htmlFor="email"
            variants={itemVariants}
          >
            Email
          </motion.label>
          <motion.input
            id="email"
            type="email"
            placeholder="Email de Registro"
            className="w-full p-3 rounded-lg border-gray-300 border"
            {...register("email", {
              required: "El Email de registro es obligatorio",
              pattern: {
                value: /\S+@\S+\.\S+/,
                message: "E-mail no válido",
              },
            })}
            variants={itemVariants}
          />
          {errors.email && <ErrorMessage>{errors.email.message}</ErrorMessage>}
        </motion.div>

        <motion.input
          type="submit"
          value="Enviar Código"
          className="bg-pink-600 hover:bg-pink-700 px-10 py-3 text-white text-xl  cursor-pointer transition-colors rounded-lg w-full"
          variants={itemVariants}
        />
      </motion.form>

      <nav className="mt-10 flex flex-col space-y-4">
        <Link
          to="/auth/login"
          className="text-center text-gray-500 font-normal hover:text-pink-600 cursor-pointer transition-colors"
        >
          ¿Ya tienes cuenta? Inicia Sesión
        </Link>
        <Link
          to="/auth/forgot-password"
          className="text-center text-gray-500 font-normal hover:text-pink-600 cursor-pointer transition-colors"
        >
          ¿Olvidaste tu contraseña? Reestablecela
        </Link>
      </nav>
    </>
  );
}
