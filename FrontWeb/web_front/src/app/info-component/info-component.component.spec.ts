import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoComponentComponent } from './info-component.component';

describe('InfoComponentComponent', () => {
  let component: InfoComponentComponent;
  let fixture: ComponentFixture<InfoComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InfoComponentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InfoComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
