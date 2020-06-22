import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EditEmployeePage } from './edit-employee.page';

describe('EditEmployeePage', () => {
  let component: EditEmployeePage;
  let fixture: ComponentFixture<EditEmployeePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditEmployeePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EditEmployeePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
