import { Component } from '@angular/core';

@Component({
  selector: 'app-grid-navigation',
  templateUrl: './grid-navigation.component.html',
  styleUrl: './grid-navigation.component.css'
})
export class GridNavigationComponent {
  features = [
    { name: 'Summary', link: '/summary'},
    { name: 'Data Rendering', link: '/data-render' },
    { name: 'Sorting', link: '/sorting' },
    { name: 'Filtering', link: '/filtering' },
    {name: 'Selection and Cell Renderers', link: '/selection'},
    {name: 'Editing', link: '/editing'}
  ];
}
