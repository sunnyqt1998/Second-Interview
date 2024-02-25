import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AgGridAngular, ICellRendererAngularComp } from 'ag-grid-angular';
import { CellClickedEvent, ValueParserParams, ColDef, ColGroupDef,GridApi, GridReadyEvent,IRowNode,IGroupCellRendererParams,ICellRendererParams, CheckboxSelectionCallbackParams, HeaderCheckboxSelectionCallbackParams, RowPinnedType} from 'ag-grid-community';
import { AngularSlickgridModule, Column, Editors, FieldType, GridOption  } from 'angular-slickgrid';
// import {iTransaction} from "../../assets/data/transactionInterface";
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import 'ag-grid-enterprise';
import { MyCellComponent } from '../my-cell/my-cell.component';





const URL_CUSTOMERS = "https://raw.githubusercontent.com/a-tremblay/grid-poc/main/data/transactions.json";




export interface iTransaction {
  "_id": string;
  "direction": string;
  "description":string;
  "accountId": string;
  "_revalTransaction": boolean;
  "_quantity": object;
  "_valuation":object;
  "_transactionDate": string | object;
  "category":string;
  "classifications": string[];
  buttonText?: string;
}

@Component({
  selector: 'app-editing',
  templateUrl: './editing.component.html',
  styleUrl: './editing.component.css'
})
export class EditingComponent {
  rowData$ :Observable<any[]>;
  gridOptions!: GridOption;
  columnDefinitions: Column[] = [];
  dataset!: any[];
  gridApi!: GridApi;
  public rowSelection: 'single' | 'multiple' = 'multiple';
  public rowGroupPanelShow: 'always' | 'onlyWhenGrouping' | 'never' = 'always';
  public pivotPanelShow: 'always' | 'onlyWhenPivoting' | 'never' = 'always';


  constructor(private http: HttpClient){}

  // make grid sortable and have the function of filter
  public colDefs: (ColDef | ColGroupDef)[] = [
    // transactions.json
    { field: '_id', headerName: 'ID', sortable: true, filter: 'agTextColumnFilter', cellRenderer: MyCellComponent, 
      cellRendererParams:{
        buttonText: 'ID'
    },
      checkboxSelection: checkboxSelection,
      headerCheckboxSelection: headerCheckboxSelection,
      // enablePivot: true,
      // enableValue: true,
    },
    { field: 'direction', headerName: 'Direction', sortable: true, filter: 'agTextColumnFilter', editable: true},
    { field: 'description', headerName: 'Description', sortable: true, filter: 'agTextColumnFilter',cellRenderer: MyCellComponent,
      cellRendererParams:{
        buttonText: 'Description'
    },editable: true},
    { field: 'accountId', headerName: 'Account ID', sortable: true, filter: 'agTextColumnFilter',cellRenderer: MyCellComponent,
      cellRendererParams:{
        buttonText: 'Account ID'
    }},
    { field: '_revalTransaction', headerName: 'Reval Transaction', sortable: true, filter: 'agTextColumnFilter',editable: true},
    {
      headerName: 'Quantity',
      children: [
          { field: '_quantity._actualQuantity._amount', headerName: 'Amount',sortable: true, filter: 'agNumberColumnFilter',
            valueParser: numberValueParser,
            cellRenderer: 'agAnimateShowChangeCellRenderer', // Show the changes in animation
            editable: true
          },
          { field: '_quantity._actualQuantity._precision',headerName: 'Precision', columnGroupShow: 'open',sortable: true, filter: 'agNumberColumnFilter',editable: true },
          { field: '_quantity._actualQuantity._symbol',headerName: 'Symbol', columnGroupShow: 'open',sortable: true , filter: 'agTextColumnFilter',editable: true},
          { field: '_quantity._currency',headerName: 'Currency', columnGroupShow: 'open', sortable: true , filter: 'agTextColumnFilter',editable: true},
          { 
            field: '_quantity',
            headerName: 'Quantity Amount(Symbol / Currency)',
            valueFormatter: params => `${params.value._actualQuantity._amount} ${params.value._actualQuantity._symbol} / ${params.value._currency}`,
            sortable: true, filter: 'agTextColumnFilter'
          }
        ]
    },
    {
      headerName: 'Valuation',
      children: [
          { field: '_valuation._value._amount', headerName: 'Amount',sortable: true, filter: 'agNumberColumnFilter',
            valueParser: numberValueParser,
            cellRenderer: 'agAnimateShowChangeCellRenderer', // Show the changes in animation 
            editable: true
          },
          { field: '_valuation._value._precision',headerName: 'Precision', columnGroupShow: 'open',sortable: true, filter: 'agNumberColumnFilter',editable: true },
          { field: '_valuation._value._symbol',headerName: 'Symbol', columnGroupShow: 'open',sortable: true, filter: 'agTextColumnFilter',editable: true },
          { field: '_valuation',
            headerName: 'Valuation Value(Amount + Symbol)',
            valueFormatter: params => `${params.value._value._amount} ${params.value._value._symbol}`,
            sortable: true, filter: 'agTextColumnFilter'
          },
        ]
    },
    {
      headerName: 'Valuation Normalized',
      children: [
          { field: '_valuation._normalizedValue._amount', headerName: 'Amount',sortable: true, filter: 'agNumberColumnFilter',
            valueParser: numberValueParser,
            cellRenderer: 'agAnimateShowChangeCellRenderer', // Show the changes in animation  
            editable: true 
          },
          { field: '_valuation._normalizedValue._precision',headerName: 'Precision', columnGroupShow: 'open',sortable: true, filter: 'agNumberColumnFilter',editable: true },
          { field: '_valuation._normalizedValue._symbol',headerName: 'Symbol', columnGroupShow: 'open',sortable: true , filter: 'agTextColumnFilter',editable: true},
          { field: '_valuation',
            headerName: 'Valuation Normalized Value(Amount + Symbol)',
            valueFormatter: params => `${params.value._normalizedValue._amount} ${params.value._normalizedValue._symbol}`,
            sortable: true, filter: 'agTextColumnFilter'
          },
        ]
    },
    { field: '_transactionDate', headerName:'Transaction Date',sortable: true, filter: 'agDateColumnFilter',editable: true},
    { field: 'category', headerName:'Category',sortable: true, filter: 'agSetColumnFilter',editable: true},
    { field: 'classifications', headerName:'Classifications',sortable: true, filter: 'agSetColumnFilter',editable: true}
  ];

  /* Define grid Options and Columns */
  defineGrid() {
    // the columns field property is type-safe, try to add a different string not representing one of DataItems properties
    this.columnDefinitions = [
    { id: 'id', name: 'ID', field: '_id' , filterable: true,sortable: true},
    { id: 'direction', name: 'Direction', field: 'direction', filterable: true ,sortable: true, editor: { model: Editors.longText   }},
    { id: 'description', name: 'Description', field: 'description', filterable: true ,sortable: true, editor: { model: Editors.longText   }},
    { id: 'accountId', name: 'Account ID', field: 'accountId', filterable: true,sortable: true},
    { id: 'revalTransaction', name: 'Reval Transaction', field: '_revalTransaction', filterable: true,sortable: true ,editor: { model: Editors.checkbox }},
    {
      id: 'quantityAmountSymbolCurrency', name: 'Quantity Amount(Symbol / Currency)', field: '_quantity',
      formatter: (row, cell, value, columnDef, dataContext) => `${value._actualQuantity._amount} ${value._actualQuantity._symbol} / ${value._currency}`,
      filterable: true,sortable: true
    }, 
    {
      id: 'valuationValueAmountSymbolCurrency', name: 'Valuation Value(Amount + Symbol)', field: '_valuation',
      formatter: (row, cell, value, columnDef, dataContext) => `${value._value._amount} ${value._value._symbol}`,
      filterable: true,sortable: true
    },
    {
      id: 'valuationNormalizedValueAmountSymbolCurrency', name: 'Valuation Normalized Value(Amount + Symbol)', field: '_valuation',
      formatter: (row, cell, value, columnDef, dataContext) => `${value._normalizedValue._amount} ${value._normalizedValue._symbol}`,
      filterable: true,sortable: true
    },
    {
      id: 'quantityPrecision', name: 'Quantity Precision', field: '_quantity',
      formatter: (row, cell, value, columnDef, dataContext) => `${value._actualQuantity._precision}`,
      filterable: true,sortable: true,
    }, 
    {
      id: 'valuationValuePrecision', name: 'Valuation Value Precision', field: '_valuation',
      formatter: (row, cell, value, columnDef, dataContext) => `${value._value._precision}`,
      filterable: true,sortable: true,
    }, 
    {
      id: 'valuationNormalizedValuePrecision', name: 'Valuation Normalized Value Precision', field: '_valuation',
      formatter: (row, cell, value, columnDef, dataContext) => `${value._normalizedValue._precision}`,
      filterable: true,sortable: true,
    }, 

    { id: 'transactionDate', name: 'Transaction Date', field: '_transactionDate', filterable: true,sortable: true, 
      editor: {
      model: Editors.date,
      // you can also add an optional placeholder
      placeholder: 'choose a date'
    }},
    { id: 'category', name: 'Category', field: 'category', filterable: true,sortable: true},
    {
      id: 'classifications', name: 'Classifications', field: 'classifications',
      formatter: (row, cell, value, columnDef, dataContext) => value.join(', '),
      filterable: true,sortable: true }
    ];

    this.gridOptions = {
      enableFiltering: true,
      enableAutoResize: true,
      enableSorting: true,
      enableCellNavigation: true,
      editable: true,
      enableCheckboxSelector: true,
      enableRowSelection: true,
      rowSelectionOptions: {
        // True (Single Selection), False (Multiple Selections)
        selectActiveRow: false
      },
      enablePagination: true,
      pagination: {
        pageSizes: [5, 10, 20, 25, 50],
        pageSize: 10
      },
    };
  }

    // Here are some rendering features.
    onAccountIdFirst() {
      this.gridApi.moveColumns(['accountId'], 0);
    }
  
    onSwapTwo() {
      this.gridApi.moveColumnByIndex(3, 4);
    }

  onFlashTwoColumns() {
    // flash whole column, so leave row selection out
    this.gridApi.flashCells({ columns: ['description','_revalTransaction'],
    flashDuration: 2000,
    fadeDuration: 1000, });
  }

  onFlashTwoRows() {
    // pick second and third row at random
    var rowNode1 = this.gridApi.getDisplayedRowAtIndex(1)!;
    var rowNode2 = this.gridApi.getDisplayedRowAtIndex(2)!;
    // flash whole row, so leave column selection out
    this.gridApi.flashCells({ rowNodes: [rowNode1, rowNode2],
      flashDuration: 2000,
      fadeDuration: 1000, });
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }


  // How to Use Grid API
  @ViewChild(AgGridAngular) agGrid!: AgGridAngular;


  // Clear the Selection
  clearSelection(){
    this.agGrid.api.deselectAll();
  }

  // Update some values in Quantity Amount, Valuation Amount and Valuation Normalized Amount randomly
  onUpdateSomeValues() {
    const rowCount = this.gridApi.getDisplayedRowCount();
    for (let i = 0; i < 10; i++) {
      const row = Math.floor(Math.random() * rowCount);
      const rowNode = this.gridApi.getDisplayedRowAtIndex(row)!;
      rowNode.setDataValue('_quantity._actualQuantity._amount', Math.floor(Math.random() * 10000));
      rowNode.setDataValue('_valuation._value._amount', Math.floor(Math.random() * 10000));
      rowNode.setDataValue('_valuation._normalizedValue._amount', Math.floor(Math.random() * 10000));
    }
  }

  // Start editing a cell
  onBtStartEditing(key?: string, pinned?: RowPinnedType) {
    this.gridApi.setFocusedCell(0, 'direction', pinned);
    this.gridApi.startEditingCell({
      rowIndex: 0,
      colKey: 'direction',
      // set to 'top', 'bottom' or undefined
      rowPinned: pinned,
      key: key,
    });
  }
  // Stop editing a cell
  onBtStopEditing() {
    this.gridApi.stopEditing();
  }

  onBtNextCell() {
    this.gridApi.tabToNextCell();
  }

  onBtPreviousCell() {
    this.gridApi.tabToPreviousCell();
  }

  ngOnInit(){
    // transactions.json
    this.rowData$ = this.http.get<any[]>("https://raw.githubusercontent.com/a-tremblay/grid-poc/main/data/transactions.json")
    
    this.defineGrid();
    this.http.get((URL_CUSTOMERS)).subscribe(((data: any[]) => this.dataset = data.map((item, index)=>{
      item['id'] = index;
      return item;
    })) as any);
  }

}

function numberValueParser(params: ValueParserParams) {
  return Number(params.newValue);
}

var checkboxSelection = function (params: CheckboxSelectionCallbackParams) {
  // we put checkbox on the name if we are not doing grouping
  return params.api.getRowGroupColumns().length === 0;
};
var headerCheckboxSelection = function (
  params: HeaderCheckboxSelectionCallbackParams
) {
  // we put checkbox on the name if we are not doing grouping
  return params.api.getRowGroupColumns().length === 0;
};