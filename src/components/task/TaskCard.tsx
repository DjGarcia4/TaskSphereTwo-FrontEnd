import { Task } from "@/types/index";
import { Fragment } from "react";
import { EllipsisHorizontalIcon } from "@heroicons/react/20/solid";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Menu, Transition } from "@headlessui/react";
import { useNavigate, useParams } from "react-router-dom";
import { deleteTask } from "@/api/TaskAPI";
import toast from "react-hot-toast";

type TaskCardProps = {
  task: Task;
  canEdit: boolean;
};
const TaskCard = ({ task, canEdit }: TaskCardProps) => {
  const navigate = useNavigate();

  const params = useParams();
  const projectId = params.projectId!;
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: deleteTask,
  });

  const handleDelete = async () => {
    const data = {
      projectId,
      taskId: task._id,
    };
    const myPromise = mutation.mutateAsync(data);

    toast.promise(myPromise, {
      loading: "Eliminando Tarea...",
      success: "Tarea Eliminada correctamente!",
      error: (err) => {
        const errorMessage = err.message || "Error al eliminar tarea";
        return errorMessage;
      },
    });
    await myPromise;

    queryClient.invalidateQueries({ queryKey: ["project", projectId] });
  };

  return (
    <div className=" bg-white rounded-lg shadow p-3 relative">
      <div className="flex shrink-0  gap-x-6 absolute top-1 right-2">
        <Menu as="div" className="relative flex-none">
          <Menu.Button className="-m-2.5 block p-2.5 text-gray-500 hover:text-pink-600 transition-colors">
            <span className="sr-only">opciones</span>
            <EllipsisHorizontalIcon className="h-6 w-6" aria-hidden="true" />
          </Menu.Button>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute top-4 right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
              <Menu.Item>
                <button
                  type="button"
                  className="block px-3 py-1 text-sm leading-6 text-gray-900 hover:bg-gray-100 transition-colors w-full text-left "
                  onClick={() =>
                    navigate(location.pathname + `?viewTask=${task._id}`)
                  }
                >
                  Ver Tarea
                </button>
              </Menu.Item>
              {canEdit && (
                <>
                  <Menu.Item>
                    <button
                      type="button"
                      className="block px-3 py-1 text-sm leading-6 text-gray-900 hover:bg-gray-100 transition-colors w-full text-left"
                      onClick={() =>
                        navigate(location.pathname + `?editTask=${task._id}`)
                      }
                    >
                      Editar Tarea
                    </button>
                  </Menu.Item>

                  <Menu.Item>
                    <button
                      type="button"
                      className="block px-3 py-1 text-sm leading-6 text-red-500 hover:bg-gray-100 transition-colors w-full text-left"
                      onClick={() => handleDelete()}
                    >
                      Eliminar Tarea
                    </button>
                  </Menu.Item>
                </>
              )}
            </Menu.Items>
          </Transition>
        </Menu>
      </div>
      <div className=" my-2">
        <button
          className=" text-xl hover:text-pink-600 transition-colors"
          onClick={() => navigate(location.pathname + `?viewTask=${task._id}`)}
        >
          {task.name}
        </button>

        <p className=" text-gray-400 text-1xl">{task.description}</p>
      </div>
      <div className=" w-full flex justify-between items-center">
        <div className="flex gap-2 items-center">
          <div className="realtive">
            {task.notes.length >= 1 && (
              <div className=" bg-red-400 p-[4px] rounded-full absolute right-[250px]"></div>
            )}

            <div className="flex items-center text-gray-400 hover:text-pink-600 transition-colors gap-1 text-xs">
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
                  d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z"
                />
              </svg>

              {task.notes.length}
            </div>
          </div>
          <div className="realtive">
            {task.completedBy.length >= 1 && (
              <div className=" bg-red-400 p-[4px] rounded-full absolute right-[210px]"></div>
            )}

            <div className="flex items-center text-gray-400 hover:text-pink-600 transition-colors gap-1 text-xs">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
                />
              </svg>

              {task.completedBy.length}
            </div>
          </div>
        </div>
        {task.assignedTo ? (
          <div className="bg-purple-400 hover:bg-purple-600 px-2 py-1 text-white  transition-colors rounded-lg text-xs">
            {task.assignedTo.name}
          </div>
        ) : (
          <div className="bg-red-400 hover:bg-red-600 px-2 py-1 text-white  transition-colors rounded-lg text-xs animate-pulse">
            Sin Asignar
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskCard;
