import React, {
  useMemo,
  useEffect,
  useState,
  useCallback,
  useRef,
} from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

function GridExample({ colSet }) {
  const gridRef = useRef();
  const [rowData, setRowData] = useState();
  console.log("GridExample", colSet);
  console.log("window", window.colState);

  var columnDefs =
    colSet === "one"
      ? [{ field: "athlete" }, { field: "age" }, { field: "country" }]
      : [{ field: "year" }, { field: "age" }, { field: "country" }];
  if (Object.hasOwn(window, "colState")) {
    if (Object.hasOwn(window.colState, colSet)) {
      columnDefs = [...window.colState[colSet]];
    }
  }
  console.log("columnDefs", columnDefs);

  const onColumnMoved = useCallback(
    (e) => {
      if (e !== undefined) {
        console.log("Event Column Moved", e);
        var state = e.columnApi.getColumnState();
        state.forEach((col) => (col.field = col.colId));
        state = [...state];
        window.colState = window.colState || {};
        window.colState[colSet] = state;
        console.log("onColumnMoved", window.colState);
        // setColState({ colSet: state });
      }
    },
    [colSet]
  );

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
      {/* <button onClick={saveState}>abc</button> */}
      <AgGridReact
        ref={gridRef}
        className="ag-theme-alpine"
        animateRows="true"
        columnDefs={columnDefs}
        // applyOrder={false}
        defaultColDef={defaultColDef}
        rowData={rowData}
        // https://github.com/ag-grid/ag-grid/issues/2588#issuecomment-461073510
        suppressBrowserResizeObserver={true}
        // https://www.ag-grid.com/react-data-grid/column-state/#column-events
        onColumnMoved={onColumnMoved}
        //onGridReady={onGridReady}
      />
    </div>
  );
}

export default GridExample;
