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
import NotesPanel from "../notes/NotesPanel";

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
                  <Dialog.Panel className="w-full max-w-4xl transform h-auto max-h-[700px] md:max-h-[800px] bg-gray-50 overflow-scroll rounded-2xl text-left align-middle shadow-xl transition-all p-5 space-y-4">
                    {/* <p className="text-sm">
                      Agregada el: {formatDate(data.createdAt)}
                    </p>
                    <p className="text-sm">
                      Última actualización: {formatDate(data.updatedAt)}
                    </p> */}
                    <div className=" bg-white shadow rounded-lg p-5 grid grid-cols-2 items-center">
                      <div>
                        <Dialog.Title as="h3" className=" text-4xl  my-1">
                          {data.name}
                        </Dialog.Title>
                        <p className="text-lg  mb-2 text-gray-400">
                          {data.description}
                        </p>
                      </div>
                      <div className=" full flex justify-end">
                        <div className=" text-gray-400">
                          <p className="text-sm">
                            Agregada el: {formatDate(data.createdAt)}
                          </p>

                          <p className="text-sm">
                            Última actualización: {formatDate(data.updatedAt)}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="w-full grid grid-cols-2 gap-10  bg-white rounded-lg p-5 shadow">
                      <div className=" space-y-3">
                        <div className="s">
                          <label className="">Estado Actual: </label>
                          <select
                            className=" w-full p-2 bg-white border border-gray-300 rounded-lg"
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
                              <div className="">
                                <label className="">Tarea Asignada a: </label>
                                <select
                                  className=" w-full p-2 bg-white border border-gray-300 rounded-lg"
                                  defaultValue={data.assignedTo._id}
                                  onChange={handleAssigned}
                                >
                                  <option value={user?._id}>
                                    {user?.name}
                                  </option>

                                  {team.map((member) => (
                                    <option key={member._id} value={member._id}>
                                      {member.name}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            ) : (
                              <div>
                                <p>Tarea asignada a: </p>
                                <p className=" text-pink-600">
                                  {data.assignedTo.name}
                                </p>
                              </div>
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
                                <option value="">
                                  Asigna tarea a un miembro
                                </option>
                                <option value={user?._id}>{user?.name}</option>
                                {team.map((member) => (
                                  <option key={member._id} value={member._id}>
                                    {member.name}
                                  </option>
                                ))}
                              </select>
                            </div>
                          ) : (
                            <p className="text-red-500 text-center">
                              Tarea aún sin asignar
                            </p>
                          )
                        ) : (
                          <p>No hay miembros para asignar tarea</p>
                        )}
                      </div>
                      {data.completedBy.length ? (
                        <div>
                          <p className="">Historial de cambios:</p>
                          <div className="relative h-auto max-h-28 overflow-y-auto ">
                            <ul className="pr-2 relative z-10 divide-y divide-gray-200">
                              {data.completedBy.map((activityLog) => (
                                <li
                                  key={activityLog._id}
                                  className=" list-decimal text-gray-500"
                                >
                                  Cambiado a{" "}
                                  <span className="text-pink-600">
                                    {statusTranslation[activityLog.status]}
                                  </span>{" "}
                                  por:{" "}
                                  <span className="text-pink-600">
                                    {activityLog.user.name}
                                  </span>
                                </li>
                              ))}
                            </ul>
                            <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white pointer-events-none"></div>
                          </div>
                        </div>
                      ) : (
                        <p className=" text-center">No hay cambios aún</p>
                      )}
                    </div>
                    <NotesPanel notes={data.notes} />
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>
      </>
    );
}
