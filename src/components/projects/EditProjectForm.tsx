import { Link, useNavigate } from "react-router-dom";
import ProjectForm from "./ProjectForm";
import { Project, ProjectFormData } from "@/types/index";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProject } from "@/api/ProjectAPI";
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

type EditProjectFormProps = {
  data: ProjectFormData;
  projectId: Project["_id"];
};

const EditProjectForm = ({ data, projectId }: EditProjectFormProps) => {
  const navigate = useNavigate();
  const initialValues: ProjectFormData = {
    projectName: data.projectName,
    clientName: data.clientName,
    description: data.description,
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: initialValues });

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: updateProject,
  });

  const handleForm = async (formData: ProjectFormData) => {
    const data = {
      formData,
      projectId,
    };
    const myPromise = mutation.mutateAsync(data);

    toast.promise(myPromise, {
      loading: "Editando Proyecto...",
      success: "Proyecto Actualizado correctamente!",
      error: "Error al editar el proyecto",
    });
    await myPromise;
    queryClient.invalidateQueries({ queryKey: ["projects"] });
    queryClient.invalidateQueries({ queryKey: ["editProject", projectId] });
    navigate("/");
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="hidden"
      variants={formVariants}
    >
      <div className="flex  justify-between">
        <div>
          <h1 className=" text-4xl md:text-5xl ">Editar Proyecto</h1>
          <p className=" text-1xl md:text-2xl font-light text-gray-500 mt-5">
            Llena el siguiente formulario para editar un proyecto.
          </p>
        </div>
        <nav className=" my-5">
          <Link
            to="/"
            className="bg-pink-600 hover:bg-pink-700 px-5 py-3 text-white text-1xl cursor-pointer transition-colors rounded-lg flex justify-center items-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3"
              />
            </svg>
          </Link>
        </nav>
      </div>
      <form
        className="mt-10 bg-white shadow-lg p-10 rounded-lg"
        onSubmit={handleSubmit(handleForm)}
        noValidate
      >
        <motion.div variants={itemVariants}>
          <ProjectForm register={register} errors={errors} />
        </motion.div>
        <motion.input
          type="submit"
          value="Guardar Cambios"
          className="bg-pink-600 hover:bg-pink-700 px-10 py-3 text-white text-xl  cursor-pointer transition-colors rounded-lg w-full"
          variants={itemVariants}
        />
      </form>
    </motion.div>
  );
};

export default EditProjectForm;
