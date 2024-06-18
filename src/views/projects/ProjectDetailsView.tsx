import { getProjectsById } from "@/api/ProjectAPI";
import AddTaskModal from "@/components/task/AddTaskModal";
import EditTaskData from "@/components/task/EditTaskData";
import TaskList from "@/components/task/TaskList";
import TaskModalDetails from "@/components/task/TaskModalDetails";

import { useQuery } from "@tanstack/react-query";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";

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
  const { data, isLoading, isError } = useQuery({
    queryKey: ["project", projectId],
    queryFn: () => getProjectsById(projectId),
  });

  if (isLoading) return "Cargando...";
  if (isError) return <Navigate to="/404" />;
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
              <h1 className="text-4xl md:text-5xl">{data.projectName}</h1>
              <p className="text-xl md:text-2xl font-light text-gray-500 mt-5">
                {data.description}
              </p>
            </div>
            <nav className="flex justify-center gap-3 h-10">
              <button
                onClick={() => navigate("?newTask=true")}
                className="bg-pink-600 hover:bg-pink-700 px-5 text-white text-1xl cursor-pointer transition-colors rounded-lg"
              >
                Crear Tarea
              </button>
              <Link
                to={"team"}
                className="bg-pink-600 hover:bg-pink-700 px-5 text-white text-1xl cursor-pointer transition-colors rounded-lg flex items-center"
              >
                Colaboradores
              </Link>
              <Link
                to={`/`}
                className=" bg-pink-600 hover:bg-pink-700 px-5 text-white text-1xl cursor-pointer transition-colors rounded-lg flex items-center"
              >
                Volver
              </Link>
            </nav>
          </div>
        </motion.div>

        <motion.div variants={listVariants} initial="hidden" animate="visible">
          <TaskList tasks={data.tasks} />
        </motion.div>
        <AddTaskModal />
        <EditTaskData />
        <TaskModalDetails />
      </>
    );
};

export default ProjectDetailsView;
