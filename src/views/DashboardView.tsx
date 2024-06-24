import { getProjects } from "@/api/ProjectAPI";
import { useQuery } from "@tanstack/react-query";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Fragment } from "react";
import { EllipsisVerticalIcon } from "@heroicons/react/20/solid";
import { Menu, Transition } from "@headlessui/react";
import { Project } from "../types";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { isManager } from "@/util/policies";
import DeleteProjectModal from "@/components/projects/DeleteProjectModal";

const listVariants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

const DashboardView = () => {
  const { data: user, isLoading: authLoading } = useAuth();
  const { data, isLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: getProjects,
  });

  const navigate = useNavigate();
  const location = useLocation();

  if (isLoading && authLoading) return "Cargando...";
  if (data && user)
    return (
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 100, opacity: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="flex flex-col md:flex-row justify-between">
          <div>
            <h1 className="text-4xl md:text-5xl">Mis Proyectos</h1>
            <p className="text-1xl md:text-2xl font-light text-gray-500 mt-5">
              Maneja y administra tus proyectos.
            </p>
          </div>
          <nav className="my-5">
            <Link
              to="/projects/create"
              className="bg-pink-600 hover:bg-pink-700 py-3 text-white text-1xl cursor-pointer transition-colors px-6 rounded-lg flex justify-center items-center gap-2"
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
                  d="M13.5 16.875h3.375m0 0h3.375m-3.375 0V13.5m0 3.375v3.375M6 10.5h2.25a2.25 2.25 0 0 0 2.25-2.25V6a2.25 2.25 0 0 0-2.25-2.25H6A2.25 2.25 0 0 0 3.75 6v2.25A2.25 2.25 0 0 0 6 10.5Zm0 9.75h2.25A2.25 2.25 0 0 0 10.5 18v-2.25a2.25 2.25 0 0 0-2.25-2.25H6a2.25 2.25 0 0 0-2.25 2.25V18A2.25 2.25 0 0 0 6 20.25Zm9.75-9.75H18a2.25 2.25 0 0 0 2.25-2.25V6A2.25 2.25 0 0 0 18 3.75h-2.25A2.25 2.25 0 0 0 13.5 6v2.25a2.25 2.25 0 0 0 2.25 2.25Z"
                />
              </svg>
              Nuevo Proyecto
            </Link>
          </nav>
        </div>
        {data.length ? (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 my-5 "
            variants={listVariants}
            initial="hidden"
            animate="visible"
          >
            {data.map((project: Project) => (
              <motion.div
                className="bg-white px-5 pt-5 pb-9 rounded-lg shadow relative flex flex-col justify-between"
                key={project._id}
                variants={itemVariants}
              >
                {isManager(project.manager, user._id) && (
                  <>
                    <div className="flex shrink-0 items-center gap-x-6 absolute right-0">
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
                              <Link
                                to={`/projects/${project._id}/edit`}
                                className="block px-3 py-1 text-sm leading-6 text-gray-900 hover:bg-gray-100 transition-colors"
                              >
                                Editar Proyecto
                              </Link>
                            </Menu.Item>
                            <Menu.Item>
                              <button
                                type="button"
                                className="block px-3 py-1 text-sm leading-6 text-red-500 hover:bg-gray-100 transition-colors w-full text-left"
                                onClick={() => {
                                  navigate(
                                    location.pathname +
                                      `?deleteProject=${project._id}`
                                  );
                                }}
                              >
                                Eliminar Proyecto
                              </button>
                            </Menu.Item>
                          </Menu.Items>
                        </Transition>
                      </Menu>
                    </div>
                  </>
                )}

                <div className="my-2">
                  <Link
                    to={`/projects/${project._id}`}
                    className="text-2xl hover:text-pink-600 transition-colors"
                  >
                    {project.projectName}
                  </Link>
                  <h1 className="text-1xl">{project.clientName}</h1>
                  <p className="text-gray-400">{project.description}</p>
                </div>
                <div className="w-full flex justify-end">
                  <Link
                    to={`/projects/${project._id}`}
                    className="bg-emerald-400 hover:bg-emerald-600 px-2 py-1 text-white cursor-pointer transition-colors rounded-lg text-sm"
                  >
                    Ver Proyecto
                  </Link>
                </div>
                {!isManager(project.manager, user._id) ? (
                  <>
                    <div className=" text-right absolute left-0 bottom-0 w-full">
                      <p className=" text-white bg-rose-400 rounded-b-lg p-1 text-sm">
                        Colaborador
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className=" text-right absolute left-0 bottom-0 w-full">
                      <p className=" text-white bg-emerald-400 rounded-b-lg p-1 text-sm">
                        Manager
                      </p>
                    </div>
                  </>
                )}
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <p className="text-center py-20">
            No hay proyectos aún{" "}
            <Link to="/projects/create" className="text-pink-600">
              Crea un Proyecto
            </Link>
          </p>
        )}
        <DeleteProjectModal />
      </motion.div>
    );
};

export default DashboardView;
