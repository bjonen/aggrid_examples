import "./App.css";
import Table from "./Table.js";
import React from "react";

import { ModuleRegistry } from "@ag-grid-community/core";
import { RowGroupingModule } from "@ag-grid-enterprise/row-grouping";

ModuleRegistry.registerModules([RowGroupingModule]);

function App() {

  return (
    <div style={{ height: "800px" }}>
      <div className="App" style={{ height: "600px" }}>
        <Table />
      </div>
    </div>
  );
}

export default App;
