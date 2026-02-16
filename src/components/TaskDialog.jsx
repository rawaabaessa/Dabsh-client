import { useState, useEffect } from "react";
import { useTasks } from "../contexts/taskContext";
import { TextField } from "@mui/material";
import { Button, Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import toast from "react-hot-toast";
import { ThreeDots } from "react-loader-spinner";

export default function TaskDialog({ isOpen, onClose, editMode, taskToEdit }) {
  const { addTask, updateTask } = useTasks();
  const { setIsSaving, isSaving } = useTasks();
  const { setToast } = useTasks();

  const [title, setTitle] = useState("");
  const [items, setItems] = useState([{ itemName: "", fullNumber: 1 }]);

  const [titleErrorMessage, setTitleErrorMessage] = useState("");
  const [itemErrorMessage, setItemErrorMessage] = useState("");

  useEffect(() => {
    if (editMode && taskToEdit) {
      setTitle(taskToEdit.name);
      setItems(
        taskToEdit.items.map((item) => ({
          ...item,
        })),
      );
    } else {
      setTitle("");
      setItems([{ itemName: "", fullNumber: 1 }]);
    }
  }, [editMode, taskToEdit, isOpen]);

  const handleSave = async () => {
    setTitleErrorMessage("");
    setItemErrorMessage("");
    if (!title.trim()) {
      setTitleErrorMessage("يرجى كتابة عنوان المهمة");
      return;
    }
    const invalidItem = items.find(
      (item) => !item.itemName.trim() || item.fullNumber <= 0,
    );

    if (invalidItem) {
      setItemErrorMessage("تأكد أن كل عنصر له اسم وعدد أكبر من صفر");
      return;
    }
    if (items == "") {
      setItemErrorMessage("يرجى اضافة عناصر");
      return;
    }

    const updatedTask = {
      _id: taskToEdit?._id,
      name: title,
      items: items.map((item) => ({
        ...item,
        boughtedItem: editMode ? item.boughtedItem : 0,
      })),
    };

    try {
      setIsSaving(true);
      if (editMode) {
        await updateTask(updatedTask);
        onClose();
        setToast({
          show: true,
        });
        toast.success("تمت تحديث المهمة بنجاح");
      } else {
        await addTask(updatedTask);
        onClose();
        setToast({
          show: true,
        });
        toast.success("تمت اضافة المهمة بنجاح");
      }
      onClose();
    } catch {
      setToast({
        show: true,
      });
      toast.error("حدث خطأ، يرجى المحاولة مرة اخرى");
    } finally {
      setIsSaving(false);
    }
    onClose();
  };

  const addItem = () => {
    setItemErrorMessage("");
    setItems((prev) => [...prev, { itemName: "", fullNumber: 1 }]);
  };

  const removeItem = (index) => {
    setItemErrorMessage("");
    const updated = [...items];
    updated.splice(index, 1);
    setItems(updated);
  };

  return (
    <Dialog
      dir="rtl"
      open={isOpen}
      as="div"
      className="relative z-10 focus:outline-none"
      onClose={onClose}
    >
      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <DialogPanel
            transition
            className="w-full max-w-md rounded-xl bg-white shadow-md p-6 backdrop-blur-2xl duration-300 ease-out data-closed:transform-[scale(95%)] data-closed:opacity-0"
          >
            <DialogTitle as="h3" className="text-base/7 font-bold text-black">
              {editMode ? "تعديل المهمة" : "إضافة مهمة"}
            </DialogTitle>
            <div className="mt-2 text-sm/6 text-black" dir="rtl">
              <div>
                <label className="block mb-2 text-sm font-semibold text-gray-700">
                  العنوان
                </label>
                <input
                  type="text"
                  className="w-full rounded-xl border border-gray-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-card-purple-500"
                  placeholder="فساتين"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              {titleErrorMessage && (
                <p className="text-red-500 text-sm mt-3">{titleErrorMessage}</p>
              )}
              <label className="mt-4 block mb-2 text-sm font-semibold text-gray-700">
                عناصر المهمة
              </label>
              {items.map((item, index) => (
                <div className="mt-4 flex justify-between items-center gap-3">
                  <div>
                    <label className="block mb-2 text-sm font-semibold text-gray-700">
                      اسم العنصر
                    </label>
                    <input
                      type="text"
                      className="w-full rounded-xl border border-gray-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-card-purple-500"
                      placeholder="فساتين"
                      value={item.itemName}
                      onChange={(e) => {
                        const updated = [...items];
                        updated[index].itemName = e.target.value;
                        setItems(updated);
                      }}
                    />
                  </div>

                  <div>
                    <label className="block mb-2 text-sm font-semibold text-gray-700">
                      العدد
                    </label>
                    <input
                      type="number"
                      min="1"
                      className="w-full rounded-xl border border-gray-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-card-purple-500"
                      placeholder="أدخل العدد"
                      value={item.fullNumber}
                      onChange={(e) => {
                        const updated = [...items];
                        updated[index].fullNumber = Number(e.target.value);
                        setItems(updated);
                      }}
                    />
                  </div>
                  <button
                    className="self-end w-10 h-10 flex items-center justify-center rounded-xl border border-card-purple-500 text-card-purple-500 text-xl hover:bg-blue-100"
                    onClick={() => removeItem(index)}
                  >
                    -
                  </button>
                </div>
              ))}
              {itemErrorMessage && (
                <p className="text-red-500 text-sm mt-3">{itemErrorMessage}</p>
              )}
              <button
                className="my-4 w-10 h-10 flex items-center justify-center rounded-xl border border-card-purple-500 text-card-purple-500 text-xl hover:bg-blue-100"
                onClick={addItem}
              >
                +
              </button>
            </div>

            <div className="mt-4 flex gap-4">
              <Button
                className="inline-flex items-center gap-2 rounded-md bg-card-purple-500 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:not-data-focus:outline-none data-focus:outline data-focus:outline-white data-open:bg-gray-700"
                onClick={() => {
                  handleSave();
                }}
              >
                {isSaving ? (
                  <ThreeDots
                    height="28"
                    width="28"
                    color="#ffff"
                    ariaLabel="bars-loading"
                    wrapperStyle={{}}
                    wrapperClass=""
                    visible={true}
                  />
                ) : editMode ? (
                  "تحديث"
                ) : (
                  "إضافة"
                )}
              </Button>
              <Button
                className="inline-flex items-center gap-2 rounded-md bg-transparent border border-card-purple-500 text-gray-700 data-hover:bg-card-purple-500 hover:text-white px-3 py-1.5 text-sm/6 font-semibold shadow-inner shadow-white/10 focus:not-data-focus:outline-none data-focus:outline data-focus:outline-white data-open:bg-gray-700"
                onClick={() => {
                  onClose();
                }}
              >
                الغاء
              </Button>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}
