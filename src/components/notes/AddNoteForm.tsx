import { NoteFormData } from "@/types/index";
import { useForm } from "react-hook-form";
import ErrorMessage from "../ErrorMessage";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNote } from "@/api/NoteAPI";
import { useLocation, useParams } from "react-router-dom";
import toast from "react-hot-toast";

const AddNoteForm = () => {
  const initialValues: NoteFormData = {
    content: "",
  };
  const params = useParams();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const projectId = params.projectId!;
  const taskId = queryParams.get("viewTask")!;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({ defaultValues: initialValues });

  const queryCliente = useQueryClient();
  const mutation = useMutation({
    mutationFn: createNote,
  });

  const handleAddNote = async (formData: NoteFormData) => {
    const data = {
      projectId,
      taskId,
      formData,
    };

    const myPromise = mutation.mutateAsync(data);

    toast.promise(myPromise, {
      loading: "Creando Nota...",
      success: "Nota creada correctamente!",
      error: (err) => {
        const errorMessage = err.message || "Error sin especificar";
        return errorMessage;
      },
    });
    await myPromise;
    queryCliente.invalidateQueries({ queryKey: ["task", taskId] });
    queryCliente.invalidateQueries({ queryKey: ["project", projectId] });
    reset();
  };
  return (
    <form
      onSubmit={handleSubmit(handleAddNote)}
      className="flex gap-3 items-end"
      noValidate
    >
      <div className=" flex flex-col gap-2 w-10/12 md:w-11/12">
        <label htmlFor="content">Crear Nota</label>
        <input
          type="text"
          id="content"
          placeholder="Contenido de la nota"
          className="w-full p-2 border border-gray-300 rounded-lg"
          {...register("content", {
            required: "El contenido de la nota es obligatorio",
          })}
        />
        {errors.content && (
          <ErrorMessage>{errors.content.message}</ErrorMessage>
        )}
      </div>
      <button
        type="submit"
        value="Agregar Nota"
        className="bg-pink-600 hover:bg-pink-700 text-white cursor-pointer transition-colors rounded-lg w-2/12 md:w-1/12 p-2 flex items-center justify-center"
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
            d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
          />
        </svg>
      </button>
    </form>
  );
};

export default AddNoteForm;
