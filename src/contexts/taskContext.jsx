import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

// نسوي السياق
const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  // هنا غيرت
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState({
    show: false,
  });
  //

  const fetchTasks = async () => {
    try {
      const response = await axios.get(
        "https://dabsh-api.onrender.com/api/tasks",
      );
      setTasks(response.data);
      setLoading(false);
    } catch (error) {
      console.error("فشل في جلب المهام", error);
    }
  };

  const updateItemCount = async (taskId, itemId, action) => {
    const updatedTasks = tasks.map((task) => {
      if (task._id !== taskId) return task;

      const updatedItems = task.items.map((item) => {
        if (item._id !== itemId) return item;

        let newCount = item.boughtedItem;
        if (action === "increment" && item.boughtedItem < item.fullNumber) {
          newCount++;
        } else if (action === "decrement" && item.boughtedItem > 0) {
          newCount--;
        }

        return { ...item, boughtedItem: newCount };
      });

      return { ...task, items: updatedItems };
    });

    setTasks(updatedTasks);
    const updatedTask = updatedTasks.find((t) => t._id === taskId);

    try {
      await axios.put(
        `https://dabsh-api.onrender.com/api/tasks/${taskId}`,
        updatedTask,
      );
    } catch (error) {
      console.error("فشل في تحديث المهمة في السيرفر:", error);
    }
  };

  const addTask = async (newTask) => {
    const res = await axios.post(
      "https://dabsh-api.onrender.com/api/tasks",
      newTask,
    );
    // setTasks((prev) => [...prev, res.data]);
    setTasks((prev) => [res.data, ...prev]);
  };

  const updateTask = async (updatedTask) => {
    const sanitizedTask = {
      ...updatedTask,
      items: updatedTask.items.map((item) => ({
        ...item,
        boughtedItem: item.boughtedItem ?? 0,
        fullNumber: item.fullNumber ?? 0,
      })),
    };

    try {
      const res = await axios.put(
        `https://dabsh-api.onrender.com/api/tasks/${sanitizedTask._id}`,
        sanitizedTask,
      );

      setTasks((prev) =>
        prev.map((task) => (task._id === sanitizedTask._id ? res.data : task)),
      );
    } catch (error) {
      console.error("فشل في تحديث المهمة:", error);
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await axios.delete(`https://dabsh-api.onrender.com/api/tasks/${taskId}`);
      setTasks((prev) => prev.filter((task) => task._id !== taskId));
    } catch (error) {
      console.error("فشل في حذف المهمة:", error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <TaskContext.Provider
      value={{
        tasks,
        setTasks,
        updateItemCount,
        addTask,
        deleteTask,
        updateTask,
        loading,
        setIsSaving,
        isSaving,
        toast,
        setToast,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => useContext(TaskContext);
