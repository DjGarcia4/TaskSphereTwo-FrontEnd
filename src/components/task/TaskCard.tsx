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
};
const TaskCard = ({ task }: TaskCardProps) => {
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
      error: "Error al eliminar la tarea",
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
        <div className="realtive">
          <div className=" bg-red-400 p-[4px] rounded-full absolute right-[249px]"></div>
          <button className="flex items-center text-gray-400 hover:text-pink-600 transition-colors gap-1 text-xs">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-5 "
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m7.875 14.25 1.214 1.942a2.25 2.25 0 0 0 1.908 1.058h2.006c.776 0 1.497-.4 1.908-1.058l1.214-1.942M2.41 9h4.636a2.25 2.25 0 0 1 1.872 1.002l.164.246a2.25 2.25 0 0 0 1.872 1.002h2.092a2.25 2.25 0 0 0 1.872-1.002l.164-.246A2.25 2.25 0 0 1 16.954 9h4.636M2.41 9a2.25 2.25 0 0 0-.16.832V12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 12V9.832c0-.287-.055-.57-.16-.832M2.41 9a2.25 2.25 0 0 1 .382-.632l3.285-3.832a2.25 2.25 0 0 1 1.708-.786h8.43c.657 0 1.281.287 1.709.786l3.284 3.832c.163.19.291.404.382.632M4.5 20.25h15A2.25 2.25 0 0 0 21.75 18v-2.625c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125V18a2.25 2.25 0 0 0 2.25 2.25Z"
              />
            </svg>
            2
          </button>
        </div>
        <div className="bg-purple-400 hover:bg-purple-600 px-2 py-1 text-white  transition-colors rounded-lg text-xs">
          Jared Garcia
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
