import { Component, OnInit } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';


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
  selector: 'app-my-cell',
  template: `
    <button (click)="onClick($event)">{{buttonText}}</button>{{value}}
  `,
  styles: ``
})
export class MyCellComponent implements OnInit, ICellRendererAngularComp{
  value: any;
  buttonText: string = 'Default';
  
  
  ngOnInit(): void {
    
  }
  agInit(params: ICellRendererParams<any, any, any> & iTransaction): void {
    this.value = params.value;
    this.buttonText = params.buttonText ?? 'Default';
  }
  refresh(params: ICellRendererParams<any, any, any>): boolean {
    return false
  }

  onClick(event: any){
    alert('Cell value is ' + this.value)
  }

}
