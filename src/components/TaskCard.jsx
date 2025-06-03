import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AccordionDetail from "./AccodionDetail";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useTasks } from "../contexts/taskContext";
import { useState } from "react";
import TaskDialog from "./TaskDialog";
import { Button, Dialog, DialogPanel, DialogTitle } from "@headlessui/react";

export default function TaskCard({ task }) {
  const { deleteTask } = useTasks();
  const [isEditOpen, setIsEditOpen] = useState(false);

  const openEdit = () => setIsEditOpen(true);
  const closeEdit = () => setIsEditOpen(false);

  //popup
  let [isOpen, setIsOpen] = useState(false);
  function open() {
    setIsOpen(true);
  }

  function close() {
    setIsOpen(false);
  }

  const calculateTaskCompletion = (task) => {
    const totalBought = task.items.reduce(
      (sum, item) => sum + item.boughtedItem,
      0
    );
    const totalFull = task.items.reduce(
      (sum, item) => sum + item.fullNumber,
      0
    );
    if (totalFull === 0) return 0;
    return Math.round((totalBought / totalFull) * 100);
  };

  const itemPercentage = calculateTaskCompletion(task);
  return (
    <>
      <Accordion dir="rtl" className="rounded-xl">
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1-content"
          id="panel1-header"
        >
          <div>
            <p className="font-bold text-xl">{task.name}</p>

            <p className="text-gray-500 text-sm">
              {" "}
              تم إنجاز {itemPercentage} %
            </p>
          </div>
        </AccordionSummary>
        <AccordionDetails className="flex flex-col gap-4">
          {/* if no items */}
          {task.items.length === 0 ? (
            <p className="text-gray-500 text-center">لا توجد مهام</p>
          ) : (
            ""
          )}
          {task.items.map((item) => {
            return (
              <AccordionDetail
                key={item._id}
                item={item}
                taskId={task._id}
              ></AccordionDetail>
            );
          })}
          <div className="mt-2 flex gap-4">
            <div className="text-card-purple-500" onClick={openEdit}>
              <EditIcon fontSize="x-small"></EditIcon>
            </div>
            <div
              className="text-amber-800"
              onClick={() => {
                open();
              }}
            >
              <DeleteIcon fontSize="x-small"></DeleteIcon>
            </div>
          </div>
        </AccordionDetails>
      </Accordion>
      {/* delete popup */}
      <Dialog
        dir="rtl"
        open={isOpen}
        as="div"
        className="relative z-10 focus:outline-none"
        onClose={close}
      >
        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <DialogPanel
              transition
              className="w-full max-w-md rounded-xl bg-white shadow-md p-6 backdrop-blur-2xl duration-300 ease-out data-closed:transform-[scale(95%)] data-closed:opacity-0"
            >
              <DialogTitle
                as="h3"
                className="text-base/7 font-bold text-black"
              >
                حذف مهمة
              </DialogTitle>
              <div className="mt-2 text-sm/6 text-black" dir="rtl">
                <p className=" text-amber-800">هل انت متاكد من حذف المهمة ؟</p>
              </div>
              <div className="mt-4 flex gap-4">
                <Button
                  className="inline-flex items-center gap-2 rounded-md bg-gray-700 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:not-data-focus:outline-none data-focus:outline data-focus:outline-white data-hover:bg-gray-600 data-open:bg-gray-700"
                  onClick={() => {
                    deleteTask(task._id);
                  }}
                >
                  حذف
                </Button>
                <Button
                  className="inline-flex items-center gap-2 rounded-md bg-gray-700 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:not-data-focus:outline-none data-focus:outline data-focus:outline-white data-hover:bg-gray-600 data-open:bg-gray-700"
                  onClick={close}
                >
                  الغاء
                </Button>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
      {/* edit popup */}
      <TaskDialog
        isOpen={isEditOpen}
        onClose={closeEdit}
        editMode={true}
        taskToEdit={task}
      />
    </>
  );
}
