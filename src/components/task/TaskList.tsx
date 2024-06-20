import { Task } from "@/types/index";
import TaskCard from "./TaskCard";
import { statusTranslation } from "@/locales/es";
import { motion } from "framer-motion";

type TaskListProps = {
  tasks: Task[];
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

const TaskList = ({ tasks }: TaskListProps) => {
  const groupedTasks = tasks.reduce((acc, task) => {
    let currentGroup = acc[task.status] ? [...acc[task.status]] : [];
    currentGroup = [...currentGroup, task];
    return { ...acc, [task.status]: currentGroup };
  }, initialStatusGroups);

  return (
    <div className="mt-10">
      <div className="flex gap-5 overflow-x-scroll 2xl:overflow-auto pb-32">
        {Object.entries(groupedTasks).map(([status, tasks]) => (
          <div key={status} className="min-w-[300px] 2xl:min-w-0 2xl:w-1/5">
            <div>
              <h3 className={`text-xl`}>{statusTranslation[status]}</h3>
              <div
                className={`border-b-8 rounded ${statusStyles[status]}`}
              ></div>
            </div>
            <motion.ul
              className="mt-2 space-y-3"
              variants={listVariants}
              initial="hidden"
              animate="visible"
            >
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
                    <TaskCard task={task} />
                  </motion.li>
                ))
              )}
            </motion.ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskList;
