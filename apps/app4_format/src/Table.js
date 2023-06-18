// Default data types
// https://github.com/ag-grid/ag-grid/blob/d4306e840bc08c8efa0070c2f563ddd443002fce/grid-community-modules/core/src/ts/columns/dataTypeService.ts#L629

// Examples https://github.com/ag-grid/ag-grid/tree/d4306e840bc08c8efa0070c2f563ddd443002fce/grid-packages/ag-grid-docs/documentation/doc-pages/cell-data-types

// Column types can be defined by user and applied to multiple columns as strings
// https://www.ag-grid.com/javascript-data-grid/column-definitions/#default-column-definitions
// There are only two default column types:
// https://github.com/ag-grid/ag-grid/blob/d4306e840bc08c8efa0070c2f563ddd443002fce/grid-community-modules/core/src/ts/entities/defaultColumnTypes.ts
// numericColumn and rightAligned
// Examples for dates
// https://github.com/ag-grid/ag-grid/tree/d4306e840bc08c8efa0070c2f563ddd443002fce/grid-packages/ag-grid-docs/documentation/doc-pages/cell-data-types/examples
// General column definition https://github.com/ag-grid/ag-grid/blob/d4306e840bc08c8efa0070c2f563ddd443002fce/grid-community-modules/core/src/ts/entities/colDef.ts#L147
// Date filter module
// https://github.com/ag-grid/ag-grid/blob/d4306e840bc08c8efa0070c2f563ddd443002fce/grid-community-modules/core/src/ts/filter/provided/date/dateFilter.ts#L36
// dateString stays as string
// https://github.com/ag-grid/ag-grid/blob/d4306e840bc08c8efa0070c2f563ddd443002fce/grid-community-modules/core/src/ts/columns/dataTypeService.ts#L583
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

const GridExample = () => {
    const containerStyle = useMemo(() => ({ width: '100%', height: '100%' }), []);
    const gridStyle = useMemo(() => ({ height: '100%', width: '100%' }), []);
    const [rowData, setRowData] = useState();
    const [columnDefs, setColumnDefs] = useState([
        { field: 'athlete', cellDataType: false },
        {
            field: 'age',
            cellDataType: 'number'
            // type: ['rightAligned', 'numericColumn']
        },
        {
            field: 'date',
            cellDataType: 'dateString',
            // To find exact column defintion look at
            // columnApi/gridColumns/2/colDef/filterParams
            // comparator: (valueA, valueB, nodeA, nodeB, isDescending) => {
            //     console.log('comparator', valueA, valueB, nodeA, nodeB, isDescending)
            // }
        },
        // {
        //     field: 'date', headerName: 'Date2', cellDataType: 'dateStringTwo',
        //     // comparator: (filterDate, cellValue) => {
        //     //     const cellAsDate = convertToDate(cellValue)!;
        //     //     if (cellValue == null || cellAsDate < filterDate) { return -1; }
        //     //     if (cellAsDate > filterDate) { return 1; }
        //     //     return 0;
        // },
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
            // For this to work, we would have to convert date strings from API
            // to date objects
            date: {
                baseDataType: 'date',
                extendsDataType: 'date',
                // never reached
                valueParser: (params) => {
                    console.log('valueParser', params)
                    return params.newValue
                },
                // never reached
                valueFormatter: (params) => {
                    console.log('valueFormatter', params)
                }
            },
            dateString: {
                baseDataType: 'dateString',
                extendsDataType: 'dateString',
                // We shouldnt use the valueFormatter to change API formatting. Instead format the column in the API already
                // Take the string value of the column and format it for the user to see
                valueFormatter: (params) => {
                    console.log('valueFormatter', params)
                    const randomLetter = _ => String.fromCharCode(0 | Math.random() * 26 + 97)
                    return (params.value == null ? '' : randomLetter() + params.value)
                },
                // Take what the user sees in grid and convert it to string value of the column
                // In this case %Y/%m/%d without the x at the end
                valueParser: (params) => {
                    console.log('valueParser', params)
                    return params.newValue != null &&
                        params.newValue.match('\\d{2}/\\d{2}/\\d{4}')
                        ? params.newValue
                        : null

                },
                // Figure out if the column type is applicable to the column.
                dataTypeMatcher: (value) => {
                    // Called if a field does not have a cellDataType defined
                    return typeof value === 'string' && !!value.match('\\d{2}/\\d{2}/\\d{4}')
                },
                // Used in DateStringCellEditorInput
                // https://github.com/ag-grid/ag-grid/blob/d4306e840bc08c8efa0070c2f563ddd443002fce/grid-community-modules/core/src/ts/rendering/cellEditors/dateStringCellEditor.ts#L59
                // This is also used by `comparator` when doing filtering
                // https://github.com/ag-grid/ag-grid/blob/latest/grid-community-modules/core/src/ts/columns/dataTypeService.ts#L562
                // only triggered when one actually performs filtering
                // Interestingly it is not triggered when sorting. There we default to String.localeCompare()
                // Found out by setting a breakpoint in firefox in rowNodeSorter.ts and then run sort on column via GUI
                // https://github.com/ag-grid/ag-grid/blob/d4306e840bc08c8efa0070c2f563ddd443002fce/grid-community-modules/core/src/ts/rowNodes/rowNodeSorter.ts#L49
                // https://github.com/ag-grid/ag-grid/blob/d4306e840bc08c8efa0070c2f563ddd443002fce/grid-community-modules/core/src/ts/utils/generic.ts#L105
                dateParser: (value) => {
                    console.log('dateParser', value)
                    if (value == null || value === '') {
                        return undefined;
                    }
                    // Here we assume that the dates are coming in YYYY-MM-DD format
                    const dateParts = value.split('/');
                    return dateParts.length === 3
                        ? new Date(
                            parseInt(dateParts[2]),
                            parseInt(dateParts[1]) - 1,
                            parseInt(dateParts[0])
                        )
                        : undefined;
                },
                // Used in DateStringCellEditorInput
                dateFormatter: (value) =>
                    value == null
                        ? undefined
                        : `myDate: ${value.getDate()}/${value.getMonth() + 1
                        }/${value.getFullYear()}`,
            },
            dateStringTwo: {
                baseDataType: 'dateString',
                extendsDataType: 'dateString',
                valueParser: (params) => {
                    //console.log('valueParser', params)
                    return params.newValue != null &&
                        params.newValue.match('\\d{2}-\\d{2}--\\d{4}')
                        ? params.newValue
                        : null
                },
                // valueFormatter: (params) => (params.value == null ? '' : params.value),
                valueFormatter: (params) => {
                    //console.log('valueFormatter', params)
                    return (params.value == null ? '' : params.value)
                },
                dataTypeMatcher: (value) => {
                    // Called if a field does not have a cellDataType defined
                    return typeof value === 'string' && !!value.match('\\d{2}/\\d{2}/\\d{4}')

                }
            }
        }
    }, []);

    const onGridReady = useCallback((params) => {
        fetch('https://www.ag-grid.com/example-assets/olympic-winners.json')
            .then((resp) => resp.json())
            .then((data) => setRowData(data));
    }, []);

    const onFirstDataRendered = useCallback((params) => {
        console.log('onFirstDataRendered', params)
        console.log(params.columnApi.getAllColumns())
    }, []);

    return (
        <div style={containerStyle}>
            <div style={gridStyle} className="ag-theme-alpine">
                <AgGridReact
                    rowData={rowData}
                    columnDefs={columnDefs}
                    defaultColDef={defaultColDef}
                    dataTypeDefinitions={dataTypeDefinitions}
                    onFirstDataRendered={onFirstDataRendered}
                    onGridReady={onGridReady}
                ></AgGridReact>
            </div>
        </div>
    );
};


export default GridExample
