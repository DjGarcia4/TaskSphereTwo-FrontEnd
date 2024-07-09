import { getProjectsById } from "@/api/ProjectAPI";
import AddTaskModal from "@/components/task/AddTaskModal";
import EditTaskData from "@/components/task/EditTaskData";
import TaskList from "@/components/task/TaskList";
import TaskModalDetails from "@/components/task/TaskModalDetails";

import { useQuery } from "@tanstack/react-query";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { isManager } from "@/util/policies";
import { useMemo } from "react";
import { Project } from "@/types/index";

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

const ProjectDetailsView = () => {
  const navigate = useNavigate();
  const params = useParams();
  const projectId = params.projectId!;
  const { data: user, isLoading: authLoading } = useAuth();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["project", projectId],
    queryFn: () => getProjectsById(projectId),
  });
  const canEdit = useMemo(
    () =>
      data?.manager.some(
        (manager: Project["manager"]) =>
          manager.toString() === user?._id.toString()
      ),
    [data, user]
  );

  if (isLoading && authLoading) return "@gando...";
  if (isError) return <Navigate to="/404" />;
  if (data && user)
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
              <h1 className="text-4xl md:text-5xl">{data.projectName}</h1>
              <p className="text-xl md:text-2xl font-light text-gray-500 mt-5 md:w-[800px]">
                {data.description}
              </p>
            </div>
            <nav className="flex justify-center gap-3 h-10">
              {isManager(data.manager, user._id) && (
                <>
                  {" "}
                  <button
                    onClick={() => navigate("?newTask=true")}
                    className="bg-pink-600 hover:bg-pink-700 px-5 text-white text-1xl cursor-pointer transition-colors rounded-lg flex justify-center items-center gap-2"
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
                        d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
                      />
                    </svg>
                    Crear Tarea
                  </button>
                  <Link
                    to={"team"}
                    className="bg-pink-600 hover:bg-pink-700 px-5 text-white text-1xl cursor-pointer transition-colors rounded-lg flex justify-center items-center gap-2"
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
                        d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z"
                      />
                    </svg>
                    Colaboradores
                  </Link>
                </>
              )}

              <Link
                to={`/`}
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
        </motion.div>

        <motion.div variants={listVariants} initial="hidden" animate="visible">
          <div>
            <TaskList tasks={data.tasks} canEdit={canEdit} />
          </div>
        </motion.div>
        <AddTaskModal />
        <EditTaskData />
        <TaskModalDetails team={data.team} canEdit={canEdit} />
      </>
    );
};

export default ProjectDetailsView;
