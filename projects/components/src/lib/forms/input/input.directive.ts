import {
  computed,
  Directive,
  forwardRef,
  inject,
  InjectionToken
} from '@angular/core';
import { twMerge } from 'tailwind-merge';

import {
  BaseComponentInterface,
  FormFieldAccessor
} from '../../common';

/**
 * Styles of Input
 */
export interface InputStyle extends BaseComponentInterface {
  disabled: string;
}

/**
 * Default Input styles, which would be merge with the provider, if exists
 */
const inputStyle: InputStyle = {
  host: 'flex-auto h-full px-2 bg-transparent border-none ring-none outline-none',
  disabled: 'cursor-not-allowed'
};

/**
 * Provider to override default Input styles
 */
export const INPUT_STYLE = new InjectionToken<Partial<InputStyle>>('Default styles of Input');

@Directive({
  selector: '[nrpInput]',
  standalone: true,
  providers: [
    {
      provide: FormFieldAccessor,
      useExisting: forwardRef(() => InputDirective)
    }
  ]
})
export class InputDirective extends FormFieldAccessor {

  private readonly _style = inject(INPUT_STYLE, { optional: true });
  override readonly host = computed(() => {
    const customAs = this.custom() as InputStyle;

    const classes = [
      inputStyle.host,
      this._style?.host,
      customAs.host
    ];

    if (this.disabled()) {
      classes.push(
        inputStyle.disabled,
        this._style?.disabled,
        customAs.disabled
      );
    }

    return twMerge(classes);
  });

}
