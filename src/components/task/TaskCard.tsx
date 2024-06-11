import { Task } from "@/types/index";
import { Fragment } from "react";
import { EllipsisVerticalIcon } from "@heroicons/react/20/solid";
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
      <div className="flex shrink-0  gap-x-6 absolute right-0">
        <Menu as="div" className="relative flex-none">
          <Menu.Button className="-m-2.5 block p-2.5 text-gray-500 hover:text-gray-900">
            <span className="sr-only">opciones</span>
            <EllipsisVerticalIcon className="h-9 w-9" aria-hidden="true" />
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
            <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
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
        <div className=" text-2xl hover:text-pink-600 transition-colors">
          {task.name}
        </div>

        <p className=" text-gray-400">{task.description}</p>
      </div>
      <div className=" w-full flex justify-between">
        <div>
          <p>Notas</p>
        </div>
        <div className="bg-emerald-500 hover:bg-emerald-600 px-2 py-1 text-white cursor-pointer transition-colors rounded-lg text-sm">
          Jared Garcia
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
