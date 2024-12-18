import {
  booleanAttribute,
  Directive,
  input,
  linkedSignal
} from '@angular/core';

import { BaseComponent } from '../base';

@Directive({
  selector: '[nrpFormFieldAccessor]',
  standalone: true
})
export class FormFieldAccessor extends BaseComponent {

  /**
   * Whether the component is disabled or not
   */
  disabled = input(false, { transform: booleanAttribute });
  _disabled = linkedSignal(() => this.disabled());

}
