import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useNavigate, useParams } from "react-router-dom";
import TaskForm from "./TaskForm";
import { Task, TaskFormData } from "@/types/index";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateTask } from "@/api/TaskAPI";
import toast from "react-hot-toast";

type EditTaskModalProps = {
  data: Task;
  show: boolean;
  taskId: Task["_id"];
};

export default function EditTaskModal({
  data,
  show,
  taskId,
}: EditTaskModalProps) {
  const navigate = useNavigate();
  const params = useParams();
  const projectId = params.projectId!;
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TaskFormData>({
    defaultValues: { name: data.name, description: data.description },
  });

  const mutation = useMutation({
    mutationFn: updateTask,
  });

  const handleEditTask = async (formData: TaskFormData) => {
    const data = {
      projectId,
      taskId,
      formData,
    };
    const myPromise = mutation.mutateAsync(data);

    toast.promise(myPromise, {
      loading: "Editando Tarea...",
      success: "Tarea Actualizada correctamente!",
      error: "Error al editar la tarea",
    });
    await myPromise;

    queryClient.invalidateQueries({ queryKey: ["project", projectId] });
    queryClient.invalidateQueries({ queryKey: ["task", taskId] });
    navigate(location.pathname, { replace: true });
    reset();
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
                    Editar Tarea
                  </Dialog.Title>

                  <p className="text-xl md:text-1xl text-gray-500">
                    Realiza cambios a una tarea en {""}
                    <span className="text-pink-500">este formulario</span>.
                  </p>

                  <form
                    className="mt-10 space-y-3"
                    noValidate
                    onSubmit={handleSubmit(handleEditTask)}
                  >
                    <TaskForm register={register} errors={errors} />
                    <input
                      type="submit"
                      value="Guardar Cambios"
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
