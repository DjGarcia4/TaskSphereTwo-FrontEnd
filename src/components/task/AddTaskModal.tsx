import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import TaskForm from "./TaskForm";
import { useForm } from "react-hook-form";
import { TaskFormData } from "@/types/index";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTask } from "@/api/TaskAPI";
import toast from "react-hot-toast";

export default function AddTaskModal() {
  const navigate = useNavigate();

  //Leer si modal existe
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const modalTask = queryParams.get("newTask");
  const show = modalTask ? true : false;

  //Obtener projectId
  const params = useParams();
  const projectId = params.projectId!;

  const initialValues: TaskFormData = {
    name: "",
    description: "",
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ defaultValues: initialValues });

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createTask,
  });

  const handleCreateTask = async (formData: TaskFormData) => {
    const data = {
      projectId,
      formData,
    };
    const myPromise = mutation.mutateAsync(data);
    toast.promise(myPromise, {
      loading: "Creando Tarea...",
      success: "Tarea creada correctamente!",
      error: "Error al crear el Tarea",
    });

    await myPromise;
    reset();
    queryClient.invalidateQueries({ queryKey: ["project", projectId] });
    navigate("", { replace: true });
  };

  return (
    <>
      <Transition appear show={show} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => navigate(location.pathname, { replace: true })}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/60" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all p-8">
                  <Dialog.Title as="h3" className=" text-3xl md:text-4xl">
                    ¿Cual es la tarea?
                  </Dialog.Title>

                  <p className="text-xl md:text-1xl text-gray-500">
                    Llena el formulario y crea {""}
                    <span className="text-pink-600">una tarea</span>.
                  </p>
                  <form
                    className=" mt-10 space-y-3"
                    onSubmit={handleSubmit(handleCreateTask)}
                    noValidate
                  >
                    <TaskForm register={register} errors={errors} />
                    <input
                      type="submit"
                      value="Crear Tarea"
                      className="bg-pink-600 hover:bg-pink-700 px-10 py-3 text-white text-xl  cursor-pointer transition-colors rounded-lg w-full"
                    />
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
