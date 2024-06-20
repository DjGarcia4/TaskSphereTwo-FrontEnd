import AddMemberModal from "@/components/team/AddMemberModal";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";

import { getProjectTeam, removeUserFromProject } from "@/api/TeamAPI";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react/jsx-runtime";
import { EllipsisVerticalIcon } from "@heroicons/react/20/solid";
import { TeamMember } from "@/types/index";
import toast from "react-hot-toast";

const ProjectTeamView = () => {
  const navigate = useNavigate();
  const params = useParams();
  const projectId = params.projectId!;
  const queryClient = useQueryClient();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["projectTeam", projectId],
    queryFn: () => getProjectTeam(projectId),
    retry: false,
  });
  const mutation = useMutation({
    mutationFn: removeUserFromProject,
  });
  const handleDeleteUser = async (userId: TeamMember["_id"]) => {
    const data = {
      projectId,
      userId,
    };
    const myPromise = mutation.mutateAsync(data);

    toast.promise(myPromise, {
      loading: "Eliminando Colaborador...",
      success: "Colaborador eliminado!",
      error: (err) => {
        const errorMessage = err.message || "Error sin especificar";
        return errorMessage;
      },
    });
    await myPromise;
    queryClient.invalidateQueries({ queryKey: ["projectTeam", projectId] });
  };
  if (isLoading) return "Cargando...";
  if (isError) return <Navigate to={"/404"} />;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  if (data)
    return (
      <>
        <motion.div
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -100, opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-4">
            <div>
              <h1 className=" text-4xl md:text-5xl ">Administrar Equipo</h1>
              <p className="  text-xl md:text-2xl font-light text-gray-500 mt-5">
                Administra el equipo de trabajo para este proyecto
              </p>
            </div>
            <nav className=" flex justify-center gap-3 h-10">
              <button
                onClick={() => navigate("?addMember=true")}
                className=" bg-pink-600 hover:bg-pink-700 px-5 text-white text-1xl cursor-pointer transition-colors rounded-lg flex justify-center items-center gap-2"
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
                    d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z"
                  />
                </svg>
                Añadir Colaborador
              </button>
              <Link
                to={`/projects/${projectId}`}
                className=" bg-pink-600 hover:bg-pink-700 px-5 text-white text-1xl cursor-pointer transition-colors rounded-lg flex justify-center items-center gap-2"
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
                    d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3"
                  />
                </svg>
              </Link>
            </nav>
          </div>

          {data.length ? (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-10"
              initial="hidden"
              animate="visible"
              variants={containerVariants}
            >
              {data?.map((member) => (
                <motion.div
                  key={member._id}
                  className="bg-white shadow rounded-lg flex justify-between gap-x-6 px-5 py-10"
                  variants={itemVariants}
                >
                  <div className="flex min-w-0 gap-x-4">
                    <div className="min-w-0 flex-auto space-y-2">
                      <p className="text-2xl  ">{member.name}</p>
                      <p className="text-sm text-gray-400">{member.email}</p>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-x-6">
                    <Menu as="div" className="relative flex-none">
                      <Menu.Button className="-m-2.5 block p-2.5 text-gray-500 hover:text-pink-600 transition-colors">
                        <span className="sr-only">opciones</span>
                        <EllipsisVerticalIcon
                          className="h-9 w-9"
                          aria-hidden="true"
                        />
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
                              className="block px-3 py-1 text-sm leading-6 text-red-500"
                              onClick={() => {
                                handleDeleteUser(member._id);
                              }}
                            >
                              Eliminar del Proyecto
                            </button>
                          </Menu.Item>
                        </Menu.Items>
                      </Transition>
                    </Menu>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <p className="text-center py-20">No hay miembros en este equipo</p>
          )}
          <AddMemberModal />
        </motion.div>
      </>
    );
};

export default ProjectTeamView;
