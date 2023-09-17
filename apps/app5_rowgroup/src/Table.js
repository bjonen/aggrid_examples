import React, {
  useMemo,
  useEffect,
  useState,
  useRef,
} from "react";
import { AgGridReact } from "ag-grid-react";
import data from "./data.json";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import "ag-grid-enterprise"

function GridExample() {
  const gridRef = useRef();
  const [rowData, setRowData] = useState();

  const yieldAggFunc = (params) => {
    // This is called each time we perform an aggregation step
    console.log("Call to yieldAggFunc", params)
    var weightedPfSum = 0
    var weightedBmSum = 0
    var weightSum = 0
    var bmWeightSum = 0
    params.values.forEach((value) => {
      // leaf nodes
      if (value && value.weight && value.yield) {
        weightedPfSum += value.weight * value.yield
        weightSum += value.weight
      }
      if (value && value.bmweight && value.yield) {
        weightedBmSum += value.bmweight * value.yield
        bmWeightSum += value.bmweight
      }
      // aggregation of aggregations
      if (value && value.weightedPfSum && value.weightSum) {
        weightedPfSum += value.weightedPfSum * value.weightSum
        weightSum += value.weightSum
      }
      if (value && value.weightedBmSum && value.bmWeightSum) {
        weightedBmSum += value.weightedBmSum * value.bmWeightSum
        bmWeightSum += value.bmWeightSum
      }
    });
    return createValueObject(weightedPfSum, weightedBmSum, weightSum, bmWeightSum);
  };

  const createValueObject = (weightedPfSum, weightedBmSum, weightSum, bmWeightSum) => {
    console.log("createValueObject", weightedPfSum, weightedBmSum, weightSum, bmWeightSum)
    return {
      // Remember aggregation properties on aggregation nodes to recurse
      weightedPfSum: weightedPfSum,
      weightedBmSum: weightedBmSum,
      weightSum: weightSum,
      bmWeightSum: bmWeightSum,
      toString: () => `${weightedPfSum.toFixed(2)} (${weightedBmSum.toFixed(2)})`,
    };
  };

  var columnDefs = [
    { field: "portf", rowGroup: true, suppressColumnsToolPanel: true, },
    {
      field: "yield", aggFunc: yieldAggFunc,
      valueGetter: (params) => {
        if (!params.node.group) {
          // no need to handle group levels - calculated in the 'ratioAggFunc'
          return {
            weight: params.data.weight,
            bmweight: params.data.bmweight,
            yield: params.data.yield,
            toString: () => params.data.yield,
          }
        }
      }
    },
    { field: "security", },
    { field: "weight", aggFunc: 'sum' },
    { field: "bmweight", aggFunc: 'sum' },
    { field: "issuer", rowGroup: true },
  ]

  const autoGroupColumnDef = useMemo(() => {
    return {
      minWidth: 220,
    };
  }, []);

  // gets called once, no dependencies, loads the grid data
  useEffect(() => {
    setRowData(data)
  }, []);

  return (
    <div style={{ height: "100%" }}>
      <AgGridReact
        ref={gridRef}
        className="ag-theme-alpine"
        animateRows="true"
        columnDefs={columnDefs}
        autoGroupColumnDef={autoGroupColumnDef}
        suppressAggFuncInHeader={true}
        rowData={rowData}
        suppressBrowserResizeObserver={true}
      />
    </div>
  );
}

export default GridExample;
