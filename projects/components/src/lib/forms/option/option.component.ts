import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  InjectionToken,
  input,
  output
} from '@angular/core';
import { twMerge } from 'tailwind-merge';

import {
  BaseComponentDirective,
  BaseComponentInterface
} from '../../common';
import { outputToObservable } from '@angular/core/rxjs-interop';

/**
 * Styles of Option
 */
export interface OptionStyle extends BaseComponentInterface {
  disabled: string;
}

/**
 * Default Option styles, which would be merge with the provider, if exists
 */
const optionStyle: OptionStyle = {
  host: 'px-4 py-2 hover:bg-neutral-500 hover:bg-opacity-30 cursor-pointer',
  disabled: 'cursor-not-allowed'
};

/**
 * Provider to override default Option styles
 */
export const OPTION_STYLE = new InjectionToken<Partial<OptionStyle>>('Default styles of Option');

@Component({
  selector: 'nrp-option',
  standalone: true,
  imports: [],
  template: `<ng-content />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(click)': '_click()'
  }
})
export class OptionComponent extends BaseComponentDirective {

  private readonly _style = inject(OPTION_STYLE, { optional: true });
  override readonly host = computed(() => {
    const customAs = this.custom() as OptionStyle;

    const classes = [
      optionStyle.host,
      this._style?.host,
      customAs.host
    ];

    if (this.disabled()) {
      classes.push(
        optionStyle.disabled,
        this._style?.disabled,
        customAs.disabled
      );
    }

    return twMerge(classes);
  });

  value = input();

  disabled = input(false, { transform: booleanAttribute });

  protected _clicked = output<void>();
  clicked = outputToObservable(this._clicked);

  private readonly _elementRef = inject(ElementRef);

  getNativeElement() {
    return this._elementRef.nativeElement.innerHTML;
  }

  private _click() {
    if (this.disabled()) {
      return;
    }

    this._clicked.emit();
  }

}
