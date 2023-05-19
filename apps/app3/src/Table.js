import React, { useMemo, useEffect, useState, useCallback, useRef } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";


function GridExample({ colSet }) {
  const gridRef = useRef();
  const [rowData, setRowData] = useState();
  const [colState, setColState] = useState({})
  console.log("GridExample", colSet)
  const columnDefs = [
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
  ]
  // const columnDefs = (colSet === "one" ? [
  //   { field: "athlete" },
  //   { field: "age" },
  //   { field: "country" },
  //   { field: "year" },
  //   { field: "date" },
  //   { field: "sport" },
  //   { field: "gold" },
  //   { field: "silver" },
  //   { field: "bronze" },
  //   { field: "total" },
  // ] : [
  //   { field: "athlete" },
  //   { field: "age" },
  //   { field: "country" },
  //   { field: "year" }
  // ])

  const saveState = (e) => {
    console.log("saveState", gridRef)
    gridRef.current.columnApi.applyColumnState({
      state: [
        { colId: "total" },
        { colId: "athlete" },
        { colId: "silver" },
        { colId: "bronze" },
      ],
      applyOrder: true
    })
  }


  const onGridReady = (e) => {
    console.log("onGridREady", e)
    gridRef.current.columnApi.applyColumnState({
      state: [
        { colId: "total" },
        { colId: "athlete" },
        { colId: "silver" },
        { colId: "bronze" },
      ],
      applyOrder: true
    })
  }
  //   const state = e.columnApi.getColumnState()
  //   console.log("state", state)
  //   // if (Object.hasOwn(colState, colSet)) {
  //   //   e.columnApi.applyColumnState(
  //   //     { state: colState[colSet] }
  //   //   )
  //   // } else {
  //   //   e.columnApi.applyColumnState({
  //   //     state: [
  //   //       { colId: "athlete" },
  //   //       { colId: "age" },
  //   //       { colId: "country" },
  //   //       { colId: "year" },
  //   //       { colId: "date" },
  //   //       { colId: "sport" },
  //   //       { colId: "gold" },
  //   //       { colId: "silver" },
  //   //       { colId: "bronze" },
  //   //       { colId: "total" },
  //   //     ]
  //   //   }
  //   //   )
  //   // }
  // }

  // const onColumnMoved = useCallback((e) => {
  //   if (e !== undefined) {
  //     console.log('Event Column Moved', e);
  //     const state = e.columnApi.getColumnState()
  //     setColState({ colSet: state })
  //   }
  // }, [])

  // never changes, so we can use useMemo
  const defaultColDef = useMemo(
    () => ({
      resizable: true,
      sortable: true,
    }),
    []
  );

  // gets called once, no dependencies, loads the grid data
  useEffect(() => {
    fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
      .then((resp) => resp.json())
      .then((data) => setRowData(data));
  }, []);

  return (
    <div style={{ height: "100%" }}>
      <button onClick={saveState}>abc</button>
      <AgGridReact
        ref={gridRef}
        className="ag-theme-alpine"
        animateRows="true"
        columnDefs={columnDefs}
        // applyOrder={false}
        defaultColDef={defaultColDef}
        rowData={rowData}
        rowSelection="multiple"
        suppressRowClickSelection="true"
        // https://github.com/ag-grid/ag-grid/issues/2588#issuecomment-461073510
        suppressBrowserResizeObserver={true}
        // https://www.ag-grid.com/react-data-grid/column-state/#column-events
        // onColumnMoved={onColumnMoved}
        onGridReady={onGridReady}
      />
    </div>
  );
}

export default GridExample;
