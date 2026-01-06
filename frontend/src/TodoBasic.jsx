import { useState } from "react";

function TodoBasic() {
  const [task, setTask] = useState("");
  const [todoList, setTodoList] = useState([]);

  function addTask() {
    if (task.trim() === "") return; // ignore empty tasks

    setTodoList([...todoList, task]);
    setTask(""); // clear input
  }

  return (
    <div>
      <h2>Basic Todo</h2>

      <input 
        type="text"
        placeholder="Enter task"
        value={task}
        onChange={(e) => setTask(e.target.value)}
      />

      <button onClick={addTask}>Add</button>

      <ul>
        {todoList.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

export default TodoBasic;
