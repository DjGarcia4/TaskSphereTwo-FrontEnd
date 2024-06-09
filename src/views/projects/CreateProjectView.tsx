import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import ProjectForm from "@/components/projects/ProjectForm";
import { ProjectFormData } from "@/types/index";
import { createProject } from "@/api/ProjectAPI";
import toast from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";

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
    <>
      <div className="flex  justify-between">
        <div>
          <h1 className=" text-4xl md:text-5xl ">Crear Proyecto</h1>
          <p className=" text-1xl md:text-2xl font-light text-gray-500 mt-5">
            Llena el siguiente formulario para crear un proyecto.
          </p>
        </div>
        <nav className=" my-5">
          <Link
            to="/"
            className=" bg-pink-600 hover:bg-pink-700 px-10 py-3 text-white text-1xl  cursor-pointer transition-colors rounded-lg"
          >
            Volver
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
          className="bg-pink-600 hover:bg-pink-700 px-10 py-3 text-white text-xl  cursor-pointer transition-colors rounded-lg w-full"
        />
      </form>
    </>
  );
};

export default CreateProjectView;
