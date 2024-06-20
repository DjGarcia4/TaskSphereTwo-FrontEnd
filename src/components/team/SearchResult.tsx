import { addUserToProject } from "@/api/TeamAPI";
import { TeamMember } from "@/types/index";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";

type SearchResultProps = {
  user: TeamMember;
};

const SearchResult = ({ user }: SearchResultProps) => {
  const navigate = useNavigate();
  const params = useParams();
  const projectId = params.projectId!;
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: addUserToProject,
  });
  const handleAddMember = async () => {
    const data = {
      projectId,
      id: user._id.toString(),
    };
    const myPromise = mutation.mutateAsync(data);

    toast.promise(myPromise, {
      loading: "Agregando Colaborador...",
      success: "Colaborador agregado correctamente!",
      error: (err) => {
        const errorMessage = err.message || "Error sin especificar";
        return errorMessage;
      },
    });
    await myPromise;
    queryClient.invalidateQueries({ queryKey: ["projectTeam", projectId] });
    navigate(location.pathname, { replace: true });
  };
  return (
    <>
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <p className="mt-10 text-xl text-center ">Resultado:</p>
        <div className="flex justify-between items-center bg-gray-50 py-2 px-4 rounded-lg">
          <p className=" text-xl">{user.name}</p>
          <button
            type="button"
            className="bg-pink-600 hover:bg-pink-700 p-2 text-white text-1xl cursor-pointer transition-colors rounded-lg flex justify-center items-center"
            onClick={handleAddMember}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              className="size-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z"
              />
            </svg>
          </button>
        </div>
      </motion.div>
    </>
  );
};

export default SearchResult;
