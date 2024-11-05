import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormsModule,
  ReactiveFormsModule
} from '@angular/forms';

import {
  BaseColor,
  FormFieldComponent,
  InputDirective,
  SelectComponent,
  OptionComponent
} from 'components.test';

@Component({
  selector: 'app-root',
  imports: [
    FormFieldComponent,
    InputDirective,
    SelectComponent,
    OptionComponent,
    FormsModule,
    ReactiveFormsModule
  ],
  template: `
    <div class="flex w-full">
      <div class="w-1/2 flex flex-col gap-4 p-4">
        @for (color of color; track $index) {
          <nrp-form-field [color]="color">
            <input nrpInput type="text" placeholder="Placeholder">
          </nrp-form-field>
  
          <nrp-form-field [color]="color">
            <nrp-select>
              <nrp-option value="1">asdasdasd</nrp-option>
              <nrp-option value="2">asdasdasd</nrp-option>
              <nrp-option value="3">asdasdasd</nrp-option>
              <nrp-option value="4">asdasdasd</nrp-option>
            </nrp-select>
          </nrp-form-field>
        }
      </div>
  
      <div class="w-1/2 flex flex-col gap-4 p-4 light bg-white">
        @for (color of color; track $index) {
          <nrp-form-field [color]="color">
            <input nrpInput type="text" placeholder="Placeholder">
          </nrp-form-field>
          <nrp-form-field [color]="color">
            <nrp-select>
              <nrp-option value="1">asdasdasd</nrp-option>
              <nrp-option value="2">asdasdasd</nrp-option>
              <nrp-option value="3">asdasdasd</nrp-option>
              <nrp-option value="4">asdasdasd</nrp-option>
            </nrp-select>
          </nrp-form-field>
        }
  
        <form [formGroup]="formGroup">
          <nrp-form-field>
            <nrp-select formControlName="select1">
              <nrp-option [value]="1">
                Lorem ipsum 1
              </nrp-option>
              <nrp-option [value]="2">
                Lorem ipsum 2
              </nrp-option>
              <nrp-option [value]="3">
                Lorem ipsum 3
              </nrp-option>
              <nrp-option [value]="4">
                Lorem ipsum 4
              </nrp-option>
            </nrp-select>
          </nrp-form-field>

          <nrp-form-field>
            <nrp-select formControlName="select2" [disabled]="true">
              <nrp-option [value]="1">
                Lorem ipsum 1
              </nrp-option>
              <nrp-option [value]="2">
                Lorem ipsum 2
              </nrp-option>
              <nrp-option [value]="3">
                Lorem ipsum 3
              </nrp-option>
              <nrp-option [value]="4">
                Lorem ipsum 4
              </nrp-option>
            </nrp-select>
          </nrp-form-field>

          <nrp-form-field class="w-64">
            <nrp-select formControlName="select3" [value]="3" multi>
              <nrp-option [value]="1">
                Lorem ipsum 1
              </nrp-option>
              <nrp-option [value]="2">
                Lorem ipsum 2
              </nrp-option>
              <nrp-option [value]="3" disabled>
                Lorem ipsum 3
              </nrp-option>
              <nrp-option [value]="4">
                Lorem ipsum 4
              </nrp-option>
            </nrp-select>
          </nrp-form-field>
        </form>
      </div>
    </div>
  `,
  styles: []
})
export class AppComponent {

  color: BaseColor[] = ['default', 'blue', 'red'];

  formBuilder = inject(FormBuilder);
  formGroup = this.formBuilder.group({
    select1: new FormControl(2),
    select2: new FormControl([]),
    select3: new FormControl(undefined),
  });

  constructor() {
    this.formGroup.valueChanges.subscribe(x => console.log(x));

    setTimeout(() => {
      this.formGroup.patchValue({ select1: 4 });
    }, 7000);
  }

}
