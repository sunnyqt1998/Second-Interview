import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DataRenderingComponent } from './data-rendering/data-rendering.component';
import { SummaryComponent } from './summary/summary.component';
import { FilteringComponent } from './filtering/filtering.component';
import { SortingComponent } from './sorting/sorting.component';
import {SelectionComponent} from "./selection/selection.component";
import {EditingComponent} from "./editing/editing.component";

const routes: Routes = [
  {
    path: 'summary',
    component: SummaryComponent
  },
  {
    path: 'data-render',
    component: DataRenderingComponent
  },
  {
    path: 'sorting',
    component: SortingComponent
  },
  {
    path: 'filtering',
    component: FilteringComponent
  },
  {
    path: 'selection',
    component: SelectionComponent
  },
  {
    path: 'editing',
    component: EditingComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})


export class AppRoutingModule { }
  