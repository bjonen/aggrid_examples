
import React, { useCallback, useMemo, useState, useRef } from 'react';
// import { ExcelExportModule } from '@ag-grid-enterprise/excel-export';
// import "@ag-grid-enterprise/excel-export"
import { AgGridReact } from 'ag-grid-react';
// import 'ag-grid-enterprise';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

const GridExample = () => {
  const containerStyle = useMemo(() => ({ width: '100%', height: '100%' }), []);
  const gridStyle = useMemo(() => ({ height: '100%', width: '100%' }), []);
  const [rowData, setRowData] = useState();
  const [columnDefs, setColumnDefs] = useState([
    // { field: 'athlete' },
    // { field: 'age', minWidth: 100, cellDataType: 'text' },
    // { field: 'hasGold', minWidth: 100, headerName: 'Gold' },
    // { field: 'dateObject', headerName: 'Date', cellDataType: 'date' },
    {
      field: 'dateInString', headerName: 'Date (String)',
      // Fixing an incompatible cellDataType results in no render at all
      // dateString by default expects dates to come in as YYYY-MM-DD
      cellDataType: 'dateStringTwo'
    },
    // { field: 'countryObject', headerName: 'Country' },
  ]);
  const ref = useRef()
  const defaultColDef = useMemo(() => {
    return {
      flex: 1,
      minWidth: 180,
      filter: true,
      floatingFilter: true,
      sortable: true,
      resizable: true,
      editable: true,
    };
  }, []);
  // const dataTypeDefinitions = {}
  const dataTypeDefinitions = {
    // We are overriding dateString
    dateStringTwo: {
      baseDataType: 'dateString',
      extendsDataType: 'dateString',
      dateParser: (value) => {
        console.log('dateParser', value)
      },
      dateFormatter: (value) => {
        console.log('dateFormatter', value)
      },
      valueParser: (params) => {
        console.log('valueParser', params)
      },
      valueFormatter: (params) => {
        console.log('valueFormatter', params)
        return "x"
      },
      // valueParser: (params) => {
      //   console.log('valueParser', params)
      //   return params.newValue != null && params.newValue.match('\\d{2}/\\d{2}/\\d{4}')
      //     ? params.newValue
      //     : null
      // },
      dataTypeMatcher: (value) => {
        console.log('dataTypeMatcher dateString', value)
      }
      // valueFormatter: (params) => {
      //   console.log('valueFormatter', params)
      //   return (params.value == null ? '' : params.value + 'x')
      // },
      // dataTypeMatcher: (value) => {
      //   // typeof value === 'string' && !!value.match('\\d{2}/\\d{2}/\\d{4}'),
      //   console.log('dataTypeMatcher dateString', value)
      //   return typeof value === 'string' && !!value.match('\\d{4}-\\d{2}-\\d{2}')
      // },
      // dateParser: (value) => {
      //   console.log('dateParser', value)
      //   if (value == null || value === '') {
      //     return undefined;
      //   }
      //   const dateParts = value.split('/');
      //   return dateParts.length === 3
      //     ? new Date(
      //       parseInt(dateParts[2]),
      //       parseInt(dateParts[1]) - 1,
      //       parseInt(dateParts[0])
      //     )
      //     : undefined;
      // },
      // dateFormatter: (value) => {
      //   console.log('dateFormatter', value)
      //   return (value == null
      //     ? undefined
      //     : `abc${value.getDate()}/${value.getMonth() + 1}/${value.getFullYear()}3`)

      // }
    },
  }
  const onGridReady = useCallback((params) => {
    fetch('https://www.ag-grid.com/example-assets/olympic-winners.json')
      .then((resp) => resp.json())
      .then((data) =>
        setRowData(
          data.map((rowData) => {
            const dateParts = rowData.date.split('/');
            return {
              ...rowData,
              // Here we fix the input date format for our formatter
              dateInString: `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`,
              dateObject: new Date(
                parseInt(dateParts[2]),
                parseInt(dateParts[1]) - 1,
                parseInt(dateParts[0])
              ),
              countryObject: {
                name: rowData.country,
              },
              hasGold: rowData.gold > 0,
            };
          })
        )
      );
  }, []);

  const onFirstDataRendered = useCallback((params) => {
    console.log('onFirstDataRendered', params)
  }, []);

  const handleClick = (e) => {
    console.log(e, ref)
    ref.current.api.exportDataAsExcel()
  }

  return (
    <div style={containerStyle}>
      <button onClick={handleClick}>
        Xls export
      </button>
      <div style={gridStyle} className="ag-theme-alpine">
        <AgGridReact
          ref={ref}
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          dataTypeDefinitions={dataTypeDefinitions}
          onGridReady={onGridReady}
          onFirstDataRendered={onFirstDataRendered}
        ></AgGridReact>
      </div>
    </div>
  );
};

export default GridExample;
