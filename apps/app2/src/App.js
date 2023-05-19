import "./App.css";
import Table from "./Table.js";
import React, { useState } from "react";

function MyDrop() {
  const [value, setValue] = useState("one");
  return (
    <select
      name="select"
      value={value}
      onChange={(e) => setValue(e.target.value)}
    >
      <option value={"one"}>Option 1</option>
      <option value={"two"}>Option 2</option>
    </select>
  );
}

function App() {
  return (
    <div style={{ height: "800px" }}>
      <MyDrop />
      <div className="App" style={{ height: "600px" }}>
        <Table />
      </div>
    </div>
  );
}

export default App;
