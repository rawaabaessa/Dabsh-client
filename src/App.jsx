import Tasks from "./components/Tasks.jsx";
import { TaskProvider } from "./contexts/taskContext";

function App() {
  return (
    <>
      <TaskProvider>
        <Tasks />
      </TaskProvider>
    </>
  );
}

export default App;
