import React, {
  useMemo,
  useEffect,
  useState,
  useRef,
  useCallback,
} from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

function GridExample() {
  const gridRef = useRef();

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

  // Both works. Not sure why putting this in onGridReady would make sense
  useEffect(() => {
    fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
      .then((resp) => resp.json())
      .then((data) => setRowData(data));
  }, []);
  // const onGridReady = useCallback((params) => {
  //   fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
  //     .then((resp) => resp.json())
  //     .then((data) => setRowData(data));
  // }, []);

  const onFirstDataRendered = useCallback((params) => {
    gridRef.current.columnApi.applyColumnState({
      state: [
        { colId: "total" },
        { colId: "athlete" },
        { colId: "silver" },
        { colId: "bronze" },
      ],
      applyOrder: true,
    });
  }, []);

  return (
    <AgGridReact
      ref={gridRef}
      className="ag-theme-alpine"
      animateRows="true"
      columnDefs={columnDefs}
      defaultColDef={defaultColDef}
      rowData={rowData}
      // onGridReady={onGridReady}
      onFirstDataRendered={onFirstDataRendered}
    />
  );
}

export default GridExample;
