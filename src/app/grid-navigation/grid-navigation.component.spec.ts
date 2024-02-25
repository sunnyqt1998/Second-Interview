import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GridNavigationComponent } from './grid-navigation.component';

describe('GridNavigationComponent', () => {
  let component: GridNavigationComponent;
  let fixture: ComponentFixture<GridNavigationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GridNavigationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GridNavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
