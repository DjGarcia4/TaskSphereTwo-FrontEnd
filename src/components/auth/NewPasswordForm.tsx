import type { ConfirmToken, NewPasswordForm } from "../../types";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import ErrorMessage from "@/components/ErrorMessage";
import { useMutation } from "@tanstack/react-query";
import { updatePasswordWithToken } from "@/api/AuthAPI";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

type NewPasswordFormProps = {
  token: ConfirmToken["token"];
};

const formVariants = {
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
    y: -50, // move item up by 50px
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
    toast.promise(
      myPromise,
      {
        loading: "Restableciendo contraseña...",
        success: "Contraseña modificada correctamente",
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

  const password = watch("password");

  return (
    <>
      <motion.form
        onSubmit={handleSubmit(handleNewPassword)}
        className=" p-10 space-y-4 bg-white mt-10 rounded-lg shadow-lg"
        noValidate
        variants={formVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div className="flex flex-col s" variants={itemVariants}>
          <label className="font-normal text-2xl">Contraseña Nueva</label>
          <input
            type="password"
            placeholder="Contraseña de Registro"
            className="w-full p-3 border-gray-300 border rounded-lg"
            {...register("password", {
              required: "La contraseña es obligatoria",
              minLength: {
                value: 8,
                message: "La contraseña debe ser mínimo de 8 caracteres",
              },
            })}
          />
          {errors.password && (
            <ErrorMessage>{errors.password.message}</ErrorMessage>
          )}
        </motion.div>
        <motion.div className="flex flex-col s" variants={itemVariants}>
          <label className="font-normal text-2xl">
            Repetir Contraseña Nueva
          </label>
          <input
            id="password_confirmation"
            type="password"
            placeholder="Repite Contraseña de Registro"
            className="w-full p-3 border-gray-300 border rounded-lg"
            {...register("password_confirmation", {
              required: "Repetir Contraseña es obligatorio",
              validate: (value) =>
                value === password || "Las contraseñas no son iguales",
            })}
          />
          {errors.password_confirmation && (
            <ErrorMessage>{errors.password_confirmation.message}</ErrorMessage>
          )}
        </motion.div>
        <motion.input
          type="submit"
          value="Restablecer Contraseña"
          className="bg-pink-600 hover:bg-pink-700 px-10 py-3 text-white text-xl cursor-pointer transition-colors rounded-lg w-full"
          variants={itemVariants}
        />
      </motion.form>
    </>
  );
}
