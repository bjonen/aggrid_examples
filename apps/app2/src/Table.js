import React, { useMemo, useEffect, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

function GridExample() {
  // never changes, so we can use useMemo
  const columnDefs = useMemo(
    () => [
      { field: "athlete" },
      { field: "age" },
      { field: "country" },
      { field: "year" },
      { field: "date" },
      { field: "sport" },
      { field: "gold" },
      { field: "silver" },
      { field: "bronze" },
      { field: "total" },
    ],
    []
  );

  // never changes, so we can use useMemo
  const defaultColDef = useMemo(
    () => ({
      resizable: true,
      sortable: true,
    }),
    []
  );

  // changes, needs to be state
  const [rowData, setRowData] = useState();

  // gets called once, no dependencies, loads the grid data
  useEffect(() => {
    fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
      .then((resp) => resp.json())
      .then((data) => setRowData(data));
  }, []);

  return (
    <AgGridReact
      className="ag-theme-alpine"
      animateRows="true"
      columnDefs={columnDefs}
      defaultColDef={defaultColDef}
      rowData={rowData}
      rowSelection="multiple"
      suppressRowClickSelection="true"
    />
  );
}

export default GridExample;
