import { Project, Task, TaskStatus } from "@/types/index";
import TaskCard from "./TaskCard";
import { statusTranslation } from "@/locales/es";
import { motion } from "framer-motion";
import DropTask from "./DropTask";
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateStatus } from "@/api/TaskAPI";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";

type TaskListProps = {
  tasks: Task[];
  canEdit: boolean;
};

type GroupedTasks = {
  [key: string]: Task[];
};

const initialStatusGroups: GroupedTasks = {
  pending: [],
  onHold: [],
  inProgress: [],
  underReview: [],
  completed: [],
};

const statusStyles: { [key: string]: string } = {
  pending: "border-b-slate-500",
  onHold: "border-b-red-500",
  inProgress: "border-b-blue-500",
  underReview: "border-b-amber-500",
  completed: "border-b-emerald-500",
};

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
    y: -50, // move item up by 50px
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

const TaskList = ({ tasks, canEdit }: TaskListProps) => {
  const params = useParams();
  const projectId = params.projectId!;
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: updateStatus,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project", projectId] });
      // queryClient.invalidateQueries({
      //   queryKey: ["task", active.id.toString()],
      // });
    },
  });

  const groupedTasks = tasks.reduce((acc, task) => {
    const currentGroup = acc[task.status] ? [...acc[task.status]] : [];
    currentGroup.push(task);
    currentGroup.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    ); // Ordenar por fecha de creación
    return { ...acc, [task.status]: currentGroup };
  }, initialStatusGroups);

  const handleDragEnd = (e: DragEndEvent) => {
    const { over, active } = e;
    if (over && active) {
      const taskId = active.id.toString();
      const status = over.id as TaskStatus;
      mutate({ projectId, taskId, status });
      queryClient.setQueryData(["project", projectId], (prevData: Project) => {
        const updatedTasks = prevData.tasks.map((task) => {
          if (task._id === taskId) {
            return { ...task, status };
          }
          return task;
        });
        return { ...prevData, tasks: updatedTasks };
      });
    }
  };
  return (
    <div className="mt-10">
      <div className="flex gap-5 overflow-x-scroll md:overflow-scroll-none 2xl:overflow-auto pb-32 ">
        <DndContext onDragEnd={handleDragEnd}>
          {Object.entries(groupedTasks).map(([status, tasks]) => (
            <div key={status} className="min-w-[300px] 2xl:min-w-0 2xl:w-1/5 ">
              <div>
                <h3 className={`text-xl`}>{statusTranslation[status]}</h3>
                <div
                  className={`border-b-8 rounded ${statusStyles[status]}`}
                ></div>
              </div>
              <DropTask status={status} />
              <motion.ul
                className="mt-2 space-y-3 p-1"
                variants={listVariants}
                initial="hidden"
                animate="visible"
              >
                {/* este es para limitar la columna y poder hacer scroll en y <motion.ul
                className="mt-2 space-y-3 h-[500px] overflow-y-scroll p-1"
                variants={listVariants}
                initial="hidden"
                animate="visible"
              > */}
                {tasks.length === 0 ? (
                  <li className="text-gray-500 text-center pt-3">
                    No Hay tareas
                  </li>
                ) : (
                  tasks.map((task, index) => (
                    <motion.li
                      key={task._id}
                      variants={itemVariants}
                      custom={index}
                    >
                      <TaskCard task={task} canEdit={canEdit} />
                    </motion.li>
                  ))
                )}
              </motion.ul>
            </div>
          ))}
        </DndContext>
      </div>
    </div>
  );
};

export default TaskList;
