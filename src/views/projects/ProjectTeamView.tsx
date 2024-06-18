import AddMemberModal from "@/components/team/AddMemberModal";
import { Link, useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";

const ProjectTeamView = () => {
  const navigate = useNavigate();
  const params = useParams();
  const projectId = params.projectId!;
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
              className=" bg-pink-600 hover:bg-pink-700 px-5 text-white text-1xl cursor-pointer transition-colors rounded-lg"
            >
              Añadir Colaborador
            </button>
            <Link
              to={`/projects/${projectId}`}
              className=" bg-pink-600 hover:bg-pink-700 px-5 text-white text-1xl cursor-pointer transition-colors rounded-lg flex items-center"
            >
              Volver
            </Link>
          </nav>
        </div>
        <AddMemberModal />
      </motion.div>
    </>
  );
};

export default ProjectTeamView;
