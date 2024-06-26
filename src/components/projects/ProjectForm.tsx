import { FieldErrors, UseFormRegister } from "react-hook-form";
import ErrorMessage from "../ErrorMessage";
import { ProjectFormData } from "@/types/index";
import { motion } from "framer-motion";

type ProjectFormProps = {
  register: UseFormRegister<ProjectFormData>;
  errors: FieldErrors<ProjectFormData>;
};

const itemVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

export default function ProjectForm({ register, errors }: ProjectFormProps) {
  return (
    <>
      <motion.div className="mb-5 space-y-3" variants={itemVariants}>
        <label htmlFor="projectName" className="text-sm uppercase font-bold">
          Nombre del Proyecto
        </label>
        <input
          id="projectName"
          className="w-full p-3  border border-gray-200 rounded-lg"
          type="text"
          placeholder="Nombre del Proyecto"
          {...register("projectName", {
            required: "El Titulo del Proyecto es obligatorio",
          })}
        />

        {errors.projectName && (
          <ErrorMessage>{errors.projectName.message}</ErrorMessage>
        )}
      </motion.div>

      <motion.div className="mb-5 space-y-3" variants={itemVariants}>
        <label htmlFor="clientName" className="text-sm uppercase font-bold">
          Nombre Cliente
        </label>
        <input
          id="clientName"
          className="w-full p-3  border border-gray-200 rounded-lg"
          type="text"
          placeholder="Nombre del Cliente"
          {...register("clientName", {
            required: "El Nombre del Cliente es obligatorio",
          })}
        />

        {errors.clientName && (
          <ErrorMessage>{errors.clientName.message}</ErrorMessage>
        )}
      </motion.div>

      <motion.div className="mb-5 space-y-3" variants={itemVariants}>
        <label htmlFor="description" className="text-sm uppercase font-bold">
          Descripción
        </label>
        <textarea
          id="description"
          className="w-full p-3  border border-gray-200 rounded-lg"
          placeholder="Descripción del Proyecto"
          {...register("description", {
            required: "Una descripción del proyecto es obligatoria",
          })}
        />

        {errors.description && (
          <ErrorMessage>{errors.description.message}</ErrorMessage>
        )}
      </motion.div>
    </>
  );
}
