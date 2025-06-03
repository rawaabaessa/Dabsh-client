import "react-circular-progressbar/dist/styles.css";
import "../../src/App.css";
import TaskCard from "./TaskCard";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import { useState, useMemo } from "react";
import { useTasks } from "../contexts/taskContext";
import TaskDialog from "./TaskDialog";

function Tasks() {
  const { tasks, loading } = useTasks();

  const calculateOverallCompletion = (tasks) => {
    let totalBought = 0;
    let totalFull = 0;

    tasks.forEach((task) => {
      task.items.forEach((item) => {
        totalBought += item.boughtedItem;
        totalFull += item.fullNumber;
      });
    });

    if (totalFull === 0) return 0;
    return Math.round((totalBought / totalFull) * 100);
  };

  const itemPercentage = calculateOverallCompletion(tasks);
  const allTask = useMemo(() => {
    return tasks.map((task) => {
      return <TaskCard task={task} key={task._id}></TaskCard>;
    });
  }, [tasks]);

  //popup
  let [isOpen, setIsOpen] = useState(false);
  function open() {
    setIsOpen(true);
  }

  function close() {
    setIsOpen(false);
  }

  return (
    <>
      <div className="container max-w-xl mx-auto p-4 flex flex-col gap-6">
        <div className="p-7 flex flex-col items-center gap-3 bg-card-purple-500 rounded-xl ">
          <h3 className="mb-2 font-bold font-primaryDark">الانجاز الكلي</h3>
          <CircularProgressbar
            className="w-40 h-40 mb-4"
            value={itemPercentage}
            text={`${itemPercentage}%`}
            strokeWidth={3}
            styles={buildStyles({
              textSize: "16px",
              pathColor: "black",
              textColor: "black",
              trailColor: "#acacac",
            })}
          ></CircularProgressbar>
        </div>
        <button
          className="w-full h-10 flex items-center justify-center rounded-xl border border-card-purple-500 text-card-purple-500 text-xl hover:bg-blue-100"
          onClick={open}
        >
          +
        </button>

        <TaskDialog
          isOpen={isOpen}
          onClose={close}
          editMode={false}
        ></TaskDialog>
        <div>
          {loading ? (
            <p className="text-gray-500 text-center" dir="rtl">
              جاري تحميل المهام .....
            </p>
          ) : tasks.length === 0 ? (
            <p className="text-gray-500 text-center">لا توجد مهام</p>
          ) : (
            allTask
          )}
        </div>
      </div>
    </>
  );
}

export default Tasks;
