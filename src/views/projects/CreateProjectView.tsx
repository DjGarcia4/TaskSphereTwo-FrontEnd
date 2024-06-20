import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import ProjectForm from "@/components/projects/ProjectForm";
import { ProjectFormData } from "@/types/index";
import { createProject } from "@/api/ProjectAPI";
import toast from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";

const CreateProjectView = () => {
  const navigate = useNavigate();
  const initialValues: ProjectFormData = {
    projectName: "",
    clientName: "",
    description: "",
  };
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: initialValues });

  const mutation = useMutation({
    mutationFn: createProject,
  });

  const handleForm = async (data: ProjectFormData) => {
    const myPromise = mutation.mutateAsync(data);

    toast.promise(myPromise, {
      loading: "Creando Proyecto...",
      success: "Proyecto creado correctamente!",
      error: "Error al crear el proyecto",
    });

    await myPromise;
    navigate("/");
  };

  return (
    <motion.div
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -100, opacity: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="flex justify-between">
        <div>
          <h1 className="text-4xl md:text-5xl">Crear Proyecto</h1>
          <p className="text-1xl md:text-2xl font-light text-gray-500 mt-5">
            Llena el siguiente formulario para crear un proyecto.
          </p>
        </div>
        <nav className="my-5">
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
        <ProjectForm register={register} errors={errors} />
        <input
          type="submit"
          value="Crear Proyecto"
          className="bg-pink-600 hover:bg-pink-700 px-10 py-3 text-white text-xl cursor-pointer transition-colors rounded-lg w-full"
        />
      </form>
    </motion.div>
  );
};

export default CreateProjectView;
