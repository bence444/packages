import {
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChildren,
  inject,
  InjectionToken,
  input} from '@angular/core';
import { twMerge } from 'tailwind-merge';

import {
  BaseComponentDirective,
  BaseComponentInterface,
  FormFieldAccessor
} from '../../common';
import { BaseColor } from '../../types';

/**
 * Styles of FormField
 */
export interface FormFieldStyle extends BaseComponentInterface {
  disabled: string;
  color: Partial<{ [key in BaseColor]: string }>;
}

/**
 * Default FormField styles, which would be merge with the provider, if exists
 */
const formFieldStyle: FormFieldStyle = {
  host: `
    inline-flex justify-between items-center min-w-32 h-12 shadow
    rounded-md border-2 border-neutral-200 dark:border-neutral-700
    bg-neutral-100 focus-within:bg-neutral-50 dark:bg-neutral-800 dark:focus-within:bg-neutral-700
    text-neutral-600 dark:text-neutral-300
  `,
  disabled: 'cursor-not-allowed bg-neutral-300 dark:bg-neutral-600',
  color: {
    default: 'focus-within:border-neutral-300 dark:focus-within:border-neutral-500',
    blue: 'focus-within:border-blue-500 dark:focus-within:border-blue-700',
    red: 'focus-within:border-red-500 dark:focus-within:border-red-700'
  }
};

/**
 * Provider to override default FormField styles
 */
export const FORM_FIELD_STYLE = new InjectionToken<Partial<FormFieldStyle>>('Default styles of FormField');

/**
 * Input properties of FormField
 */
export interface FormFieldProperties {
  color: BaseColor;
}

/**
 * Default FormField properties
 */
const formFieldProperties: FormFieldProperties = {
  color: 'default'
};

/**
 * Provider to override default FormField properties
 */
export const FORM_FIELD_DEFAULT = new InjectionToken<Partial<FormFieldProperties>>('Default properties of FormField');

@Component({
  selector: 'nrp-form-field',
  standalone: true,
  imports: [],
  template: `<ng-content />`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormFieldComponent extends BaseComponentDirective {

  private readonly _style = inject(FORM_FIELD_STYLE, { optional: true });
  override readonly host = computed(() => {
    const customAs = this.custom() as FormFieldStyle;

    const classes = [
      formFieldStyle.host,
      this._style?.host,
      customAs.host,
      formFieldStyle.color[this.color()],
      this._style?.color![this.color()],
      customAs.color ? customAs.color[this.color()] : null
    ];

    if (this.isDisabled()) {
      classes.push(
        formFieldStyle.disabled,
        this._style?.disabled,
        customAs.disabled
      );
    }
    
    return twMerge(classes);
  });

  private readonly _properties = inject(FORM_FIELD_DEFAULT, { optional: true });
  color = input<BaseColor>(this._properties?.color ?? formFieldProperties.color);
  
  private readonly _accessorElements = contentChildren(FormFieldAccessor);
  readonly isDisabled = computed(() => this._accessorElements()
    .map(x => x.disabled())
    .includes(true)
  );

}
