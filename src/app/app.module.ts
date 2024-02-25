import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AgGridModule } from 'ag-grid-angular';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { GridNavigationComponent } from './grid-navigation/grid-navigation.component';
import { DataRenderingComponent } from './data-rendering/data-rendering.component';
import {AngularSlickgridModule} from "angular-slickgrid";
import {AgGridAngular} from "ag-grid-angular";
import { SummaryComponent } from './summary/summary.component';
import { FilteringComponent } from './filtering/filtering.component';
import { SortingComponent } from './sorting/sorting.component';
import { SelectionComponent } from './selection/selection.component';
import { MyCellComponent } from './my-cell/my-cell.component';
import 'ag-grid-enterprise';
import { EditingComponent } from './editing/editing.component';
import 'flatpickr/dist/l10n/fr';

@NgModule({
  declarations: [
    AppComponent,
    GridNavigationComponent,
    DataRenderingComponent,
    SummaryComponent,
    FilteringComponent,
    SortingComponent,
    SelectionComponent,
    MyCellComponent,
    EditingComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    AgGridModule,
    AgGridAngular,
    AngularSlickgridModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
