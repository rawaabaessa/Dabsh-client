import { useTasks } from "../contexts/taskContext";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

export default function AccordionDetail({ item, taskId }) {
  const { updateItemCount } = useTasks(); 
  return (
    <div className="flex justify-between">
      <p>{item.itemName}</p>
      <div className="flex justify-between gap-4">
        <div
          className="w-6 h-6 flex items-center justify-center rounded-full bg-card-purple-500 text-white"
          onClick={() => updateItemCount(taskId, item._id, "increment")}
        >
          <AddIcon fontSize="x-small" />
        </div>

        <p className="w-12 text-center">
          {item.fullNumber} / {item.boughtedItem}
        </p>
        <div className="w-6 h-6 flex items-center justify-center rounded-full bg-card-purple-500 text-white">
          <RemoveIcon
            fontSize="x-small"
            onClick={() => updateItemCount(taskId, item._id, "decrement")}
          />
        </div>
      </div>
    </div>
  );
}
