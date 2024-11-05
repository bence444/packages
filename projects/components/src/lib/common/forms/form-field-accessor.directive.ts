import {
  booleanAttribute,
  Directive,
  input
} from '@angular/core';

import { BaseComponentDirective } from '../base';

@Directive({
  selector: '[nrpFormFieldAccessor]',
  standalone: true
})
export class FormFieldAccessor extends BaseComponentDirective {

  /**
   * Whether the component is disabled or not
   */
  disabled = input(false, { transform: booleanAttribute });

}
