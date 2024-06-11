import { getProjectsById } from "@/api/ProjectAPI";
import AddTaskModal from "@/components/task/AddTaskModal";
import EditTaskData from "@/components/task/EditTaskData";
import TaskList from "@/components/task/TaskList";
import TaskModalDetails from "@/components/task/TaskModalDetails";

import { useQuery } from "@tanstack/react-query";
import { Navigate, useNavigate, useParams } from "react-router-dom";

const PrjectDetailsView = () => {
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
        <div className="flex flex-col md:flex-row  justify-between">
          <div>
            <h1 className=" text-4xl md:text-5xl ">{data.projectName}</h1>
            <p className="  text-xl md:text-2xl font-light text-gray-500 mt-5">
              {data.description}
            </p>
          </div>
          <nav className=" my-5">
            <button
              onClick={() => navigate("?newTask=true")}
              className=" bg-pink-600 hover:bg-pink-700 px-10 py-3 text-white text-1xl cursor-pointer transition-colors rounded-lg"
            >
              Crear Tarea
            </button>
          </nav>
        </div>
        <TaskList tasks={data.tasks} />
        <AddTaskModal />
        <EditTaskData />
        <TaskModalDetails />
      </>
    );
};

export default PrjectDetailsView;
