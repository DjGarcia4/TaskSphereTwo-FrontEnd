import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import {
  Navigate,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { getTaskById, updateAssigne, updateStatus } from "@/api/TaskAPI";
import toast from "react-hot-toast";
import { formatDate } from "@/util/utils";
import { statusTranslation } from "@/locales/es";
import { Task, TeamMember } from "@/types/index";
import { useAuth } from "@/hooks/useAuth";

type TaskModalDetailsProps = {
  team: TeamMember[];
  canEdit: boolean;
};

export default function TaskModalDetails({
  team,
  canEdit,
}: TaskModalDetailsProps) {
  const { data: user } = useAuth();

  const navigate = useNavigate();
  const params = useParams();
  const projectId = params.projectId!;
  const queryClient = useQueryClient();

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const taskId = queryParams.get("viewTask")!;
  const show = taskId ? true : false;

  const { data, isError } = useQuery({
    queryKey: ["task", taskId],
    queryFn: () => getTaskById({ projectId, taskId }),
    enabled: !!taskId,
    retry: false,
  });
  const mutationState = useMutation({
    mutationFn: updateStatus,
  });
  const mutationAssigned = useMutation({
    mutationFn: updateAssigne,
  });
  const handleStatus = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const data = {
      projectId,
      taskId,
      status: e.target.value as Task["status"],
    };
    const myPromise = mutationState.mutateAsync(data);

    toast.promise(myPromise, {
      loading: "Actualizando Estado...",
      success: "Estado Actualizado correctamente!",
      error: "Error al actualizar el estado",
    });
    await myPromise;

    queryClient.invalidateQueries({ queryKey: ["project", projectId] });
    queryClient.invalidateQueries({ queryKey: ["task", taskId] });
  };
  const handleAssigned = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const data = {
      projectId,
      taskId,
      assignedTo: e.target.value as string,
    };
    const myPromise = mutationAssigned.mutateAsync(data);

    toast.promise(myPromise, {
      loading: "Asignando tarea...",
      success: "Tarea asignada correctamente!",
      error: "Error al asignar tarea",
    });
    await myPromise;

    queryClient.invalidateQueries({ queryKey: ["project", projectId] });
    queryClient.invalidateQueries({ queryKey: ["task", taskId] });
  };

  if (isError) {
    toast.error("Tarea no encontrada");
    return <Navigate to={`/projects/${projectId}`} />;
  }

  if (data)
    return (
      <>
        <Transition appear show={show} as={Fragment}>
          <Dialog
            as="div"
            className="relative z-10"
            onClose={() => {
              navigate(location.pathname, { replace: true });
            }}
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
                    <p className="text-sm">
                      Agregada el: {formatDate(data.createdAt)}
                    </p>
                    <p className="text-sm">
                      Última actualización: {formatDate(data.updatedAt)}
                    </p>
                    <Dialog.Title as="h3" className=" text-4xl  my-5">
                      {data.name}
                    </Dialog.Title>
                    <p className="text-lg  mb-2">
                      Descripción: {data.description}
                    </p>
                    <p>Historial de cambios:</p>
                    <ul className=" list-decimal ml-5">
                      {data.completedBy.map((activityLog) => (
                        <li key={activityLog._id}>
                          Cambiado a{" "}
                          <span className=" text-pink-600">
                            {statusTranslation[activityLog.status]}
                          </span>{" "}
                          por:{" "}
                          <span className=" text-pink-600">
                            {activityLog.user.name}
                          </span>
                        </li>
                      ))}
                    </ul>
                    <div className="my-5 space-y-3">
                      <label className="">Estado Actual: </label>
                      <select
                        className=" w-full p-3 bg-white border border-gray-300 rounded-lg"
                        defaultValue={data.status}
                        onChange={handleStatus}
                      >
                        {Object.entries(statusTranslation).map(
                          ([key, value]) => (
                            <option key={key} value={key}>
                              {value}
                            </option>
                          )
                        )}
                      </select>
                    </div>
                    {team ? (
                      data.assignedTo ? (
                        canEdit ? (
                          <div className="my-5 space-y-3">
                            <label className="">Tarea Asignada a: </label>
                            <select
                              className=" w-full p-3 bg-white border border-gray-300 rounded-lg"
                              defaultValue={data.assignedTo._id}
                              onChange={handleAssigned}
                            >
                              <option value={user?._id}>{user?.name}</option>

                              {team.map((member) => (
                                <option key={member._id} value={member._id}>
                                  {member.name}
                                </option>
                              ))}
                            </select>
                          </div>
                        ) : (
                          <p>
                            Tarea asignada a:{" "}
                            <span className=" text-pink-600">
                              {data.assignedTo.name}
                            </span>
                          </p>
                        )
                      ) : canEdit ? (
                        <div className="my-5 space-y-3">
                          <label className="text-red-500">
                            Tarea aún sin asignar
                          </label>
                          <select
                            className=" w-full p-3 bg-white border border-gray-300 rounded-lg"
                            onChange={handleAssigned}
                          >
                            <option value="">Asigna tarea a un miembro</option>
                            <option value={user?._id}>{user?.name}</option>
                            {team.map((member) => (
                              <option key={member._id} value={member._id}>
                                {member.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      ) : (
                        <p className="text-red-500">Tarea aún sin asignar</p>
                      )
                    ) : (
                      <p>No hay miembros para asignar tarea</p>
                    )}
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>
      </>
    );
}
