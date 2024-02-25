import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AgGridAngular } from 'ag-grid-angular';
import { CellClickedEvent, ColDef, ColGroupDef,GridApi, GridReadyEvent,IRowNode,RefreshCellsParams,} from 'ag-grid-community';
import { AngularSlickgridModule, Column, GridOption  } from 'angular-slickgrid';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css'
import "@slickgrid-universal/common/dist/styles/css/slickgrid-theme-bootstrap.css";




const URL_CUSTOMERS = "https://raw.githubusercontent.com/a-tremblay/grid-poc/main/data/transactions.json";


@Component({
  selector: 'app-sorting',
  templateUrl: './sorting.component.html',
  styleUrl: './sorting.component.css'
})
export class SortingComponent {
  rowData$ :Observable<any[]>;
  gridOptions!: GridOption;
  columnDefinitions: Column[] = [];
  dataset!: any[];
  gridApi!: GridApi;


  constructor(private http: HttpClient){}


  // make grid sortable and have the function of filter
  public colDefs: (ColDef | ColGroupDef)[] = [
    // transactions.json
    { field: '_id', headerName: 'ID', sortable: true},
    { field: 'direction', headerName: 'Direction', sortable: true},
    { field: 'description', headerName: 'Description', sortable: true},
    { field: 'accountId', headerName: 'Account ID', sortable: true},
    { field: '_revalTransaction', headerName: 'Reval Transaction', sortable: true},
    {
      headerName: 'Quantity',
      children: [
          { field: '_quantity._actualQuantity._amount', headerName: 'Amount',sortable: true },
          { field: '_quantity._actualQuantity._precision',headerName: 'Precision', columnGroupShow: 'open',sortable: true },
          { field: '_quantity._actualQuantity._symbol',headerName: 'Symbol', columnGroupShow: 'open',sortable: true },
          { field: '_quantity._currency',headerName: 'Currency', columnGroupShow: 'open', sortable: true },
          { 
            field: '_quantity',
            headerName: 'Quantity Amount(Symbol / Currency)',
            valueFormatter: params => `${params.value._actualQuantity._amount} ${params.value._actualQuantity._symbol} / ${params.value._currency}`,
            sortable: true
          }
        ]
    },
    {
      headerName: 'Valuation',
      children: [
          { field: '_valuation._value._amount', headerName: 'Amount',sortable: true },
          { field: '_valuation._value._precision',headerName: 'Precision', columnGroupShow: 'open',sortable: true },
          { field: '_valuation._value._symbol',headerName: 'Symbol', columnGroupShow: 'open',sortable: true },
          { field: '_valuation',
            headerName: 'Valuation Value(Amount + Symbol)',
            valueFormatter: params => `${params.value._value._amount} ${params.value._value._symbol}`,
            sortable: true
          },
        ]
    },
    {
      headerName: 'Valuation Normalized',
      children: [
          { field: '_valuation._normalizedValue._amount', headerName: 'Amount',sortable: true },
          { field: '_valuation._normalizedValue._precision',headerName: 'Precision', columnGroupShow: 'open',sortable: true },
          { field: '_valuation._normalizedValue._symbol',headerName: 'Symbol', columnGroupShow: 'open',sortable: true },
          { field: '_valuation',
            headerName: 'Valuation Normalized Value(Amount + Symbol)',
            valueFormatter: params => `${params.value._normalizedValue._amount} ${params.value._normalizedValue._symbol}`,
            sortable: true
          },
        ]
    },
    { field: '_transactionDate', headerName:'Transaction Date',sortable: true},
    { field: 'category', headerName:'Category',sortable: true},
    { field: 'classifications', headerName:'Classifications',sortable: true}
  ];


  /* Define grid Options and Columns */
  defineGrid() {
    // the columns field property is type-safe, try to add a different string not representing one of DataItems properties
    this.columnDefinitions = [
    { id: 'id', name: 'ID', field: '_id', sortable: true },
    { id: 'direction', name: 'Direction', field: 'direction', sortable: true },
    { id: 'description', name: 'Description', field: 'description', sortable: true },
    { id: 'accountId', name: 'Account ID', field: 'accountId', sortable: true},
    { id: 'revalTransaction', name: 'Reval Transaction', field: '_revalTransaction', sortable: true },
    {
      id: 'quantityAmountSymbolCurrency', name: 'Quantity Amount(Symbol / Currency)', field: '_quantity',
      formatter: (row, cell, value, columnDef, dataContext) => `${value._actualQuantity._amount} ${value._actualQuantity._symbol} / ${value._currency}`,
      sortable: true
    }, 
    {
      id: 'valuationValueAmountSymbolCurrency', name: 'Valuation Value(Amount + Symbol)', field: '_valuation',
      formatter: (row, cell, value, columnDef, dataContext) => `${value._value._amount} ${value._value._symbol}`,
      sortable: true
    },
    {
      id: 'valuationNormalizedValueAmountSymbolCurrency', name: 'Valuation Normalized Value(Amount + Symbol)', field: '_valuation',
      formatter: (row, cell, value, columnDef, dataContext) => `${value._normalizedValue._amount} ${value._normalizedValue._symbol}`,
      sortable: true
    },
    {
      id: 'quantityPrecision', name: 'Quantity Precision', field: '_quantity',
      formatter: (row, cell, value, columnDef, dataContext) => `${value._actualQuantity._precision}`,
      sortable: true
    }, 
    {
      id: 'valuationValuePrecision', name: 'Valuation Value Precision', field: '_valuation',
      formatter: (row, cell, value, columnDef, dataContext) => `${value._value._precision}`,
      sortable: true
    }, 
    {
      id: 'valuationNormalizedValuePrecision', name: 'Valuation Normalized Value Precision', field: '_valuation',
      formatter: (row, cell, value, columnDef, dataContext) => `${value._normalizedValue._precision}`,
      sortable: true
    }, 

    { id: 'transactionDate', name: 'Transaction Date', field: '_transactionDate',sortable: true},
    { id: 'category', name: 'Category', field: 'category',sortable: true},
    {
      id: 'classifications', name: 'Classifications', field: 'classifications',
      formatter: (row, cell, value, columnDef, dataContext) => value.join(', '),
      sortable: true
    }
    ];

    this.gridOptions = {
      enableAutoResize: true,
      enableSorting: true,
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
