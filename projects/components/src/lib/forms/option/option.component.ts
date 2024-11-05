import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  InjectionToken,
  input,
  linkedSignal,
  output,
  signal,
  viewChild
} from '@angular/core';
import { outputToObservable } from '@angular/core/rxjs-interop';
import { twMerge } from 'tailwind-merge';

import {
  BaseComponent,
  BaseComponentInterface
} from '../../common';
import { SelectComponent } from '../select';

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
  disabled: 'cursor-not-allowed text-opacity-75'
};

/**
 * Provider to override default Option styles
 */
export const OPTION_STYLE = new InjectionToken<Partial<OptionStyle>>('Default styles of Option');

@Component({
  selector: 'nrp-option',
  template: `
    <div class="flex gap-2">
      @if (multi()) {
        <span>
          Y
        </span>
      }
      
      <span #content>
        <ng-content />
      </span>
    </div>

    @if (active()) {
      <span>X</span>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'class': 'flex justify-between gap-2',
    '(click)': '_click()'
  }
})
export class OptionComponent extends BaseComponent {

  private readonly _style = inject(OPTION_STYLE, { optional: true });
  override readonly host = computed(() => {
    const customAs = this.custom() as OptionStyle;

    const classes = [
      optionStyle.host,
      this._style?.host,
      customAs.host
    ];

    if (this._disabled()) {
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
  _disabled = linkedSignal(() => this.disabled());

  protected _clicked = output<void>();
  clicked = outputToObservable(this._clicked);

  private readonly _elementRef = inject(ElementRef);
  private readonly _content = viewChild<ElementRef>('content');

  private readonly _select = inject(SelectComponent);
  multi = computed(() => this._select.multi());

  active = signal(false);

  getNativeElement() {
    return this._content()!.nativeElement.innerHTML;
  }

  setActive(value: boolean) {
    this.active.set(value);
  }

  private _click() {
    if (this._disabled()) {
      return;
    }

    this._clicked.emit();
  }

}
