import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import ProjectForm from "@/components/projects/ProjectForm";

const CreateProjectView = () => {
  const initialValues = {
    projectName: "",
    clientName: "",
    description: "",
  };
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: initialValues });

  const handleForm = (data) => {
    console.log(data);
  };
  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h1 className=" text-5xl ">Crear Proyecto</h1>
          <p className=" text-2xl font-light text-gray-500 mt-5">
            Llena el siguiente formulario para crear un proyecto.
          </p>
        </div>
        <nav className=" my-5">
          <Link
            to="/"
            className=" bg-pink-600 hover:bg-pink-700 px-10 py-3 text-white text-xl  cursor-pointer transition-colors rounded-lg"
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
