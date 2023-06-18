import React, { useCallback, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

const GridExample = () => {
    const containerStyle = useMemo(() => ({ width: '100%', height: '100%' }), []);
    const gridStyle = useMemo(() => ({ height: '100%', width: '100%' }), []);
    const [rowData, setRowData] = useState();
    const [columnDefs, setColumnDefs] = useState([
        { field: 'athlete' },
        { field: 'age' },
        { field: 'date' },
    ]);
    const defaultColDef = useMemo(() => {
        return {
            filter: true,
            floatingFilter: true,
            sortable: true,
            resizable: true,
            editable: true,
        };
    }, []);
    const dataTypeDefinitions = useMemo(() => {
        return {
            dateString: {
                baseDataType: 'dateString',
                extendsDataType: 'dateString',
                valueParser: (params) => {
                    console.log('valueParser', params)
                    return params.newValue != null &&
                        params.newValue.match('\\d{2}/\\d{2}/\\d{4}')
                        ? params.newValue
                        : null
                },
                valueFormatter: (params) => (params.value == null ? '' : params.value),
                dataTypeMatcher: (value) =>
                    typeof value === 'string' && !!value.match('\\d{2}/\\d{2}/\\d{4}'),
                dateParser: (value) => {
                    console.log('dateParser', value)
                    if (value == null || value === '') {
                        return undefined;
                    }
                    const dateParts = value.split('/');
                    return dateParts.length === 3
                        ? new Date(
                            parseInt(dateParts[2]),
                            parseInt(dateParts[1]) - 1,
                            parseInt(dateParts[0])
                        )
                        : undefined;
                },
                dateFormatter: (value) => {
                    console.log('dateFormatter', value)
                    return value == null
                        ? undefined
                        : `${value.getDate()}/${value.getMonth() + 1
                        }/${value.getFullYear()}`

                }
            },
        };
    }, []);

    const onGridReady = useCallback((params) => {
        fetch('https://www.ag-grid.com/example-assets/olympic-winners.json')
            .then((resp) => resp.json())
            .then((data) => setRowData(data));
    }, []);

    return (
        <div style={containerStyle}>
            <div style={gridStyle} className="ag-theme-alpine">
                <AgGridReact
                    rowData={rowData}
                    columnDefs={columnDefs}
                    defaultColDef={defaultColDef}
                    dataTypeDefinitions={dataTypeDefinitions}
                    onGridReady={onGridReady}
                ></AgGridReact>
            </div>
        </div>
    );
};

export default GridExample
