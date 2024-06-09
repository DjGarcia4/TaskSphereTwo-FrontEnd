import { Link, useNavigate } from "react-router-dom";
import ProjectForm from "./ProjectForm";
import { Project, ProjectFormData } from "@/types/index";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProject } from "@/api/ProjectAPI";
import toast from "react-hot-toast";

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
    <>
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
          value="Guardar Cambios"
          className="bg-pink-600 hover:bg-pink-700 px-10 py-3 text-white text-xl  cursor-pointer transition-colors rounded-lg w-full"
        />
      </form>
    </>
  );
};

export default EditProjectForm;
