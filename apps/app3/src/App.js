import "./App.css";
import Table from "./Table.js";
import React, { useState } from "react";

function MyDrop({ value, onChange }) {
  return (
    <select
      name="select"
      value={value}
      onChange={onChange}
    >
      <option value={"one"}>Option 1</option>
      <option value={"two"}>Option 2</option>
    </select>
  );
}

function App() {
  const [value, setValue] = useState("one");
  const onChange = (e) => setValue(e.target.value)

  return (
    <div style={{ height: "800px" }}>
      <MyDrop value={value} onChange={onChange} />
      <div className="App" style={{ height: "600px" }}>
        <Table colSet={value} />
      </div>
    </div>
  );
}

export default App;
