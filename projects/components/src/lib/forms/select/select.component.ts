import {
  AfterContentInit,
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChildren,
  DestroyRef,
  ElementRef,
  forwardRef,
  inject,
  InjectionToken,
  input,
  OnDestroy,
  OnInit,
  output,
  signal
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { SelectionModel } from '@angular/cdk/collections';
import {
  ConnectedPosition,
  Overlay,
  OverlayModule
} from '@angular/cdk/overlay';
import {
  takeUntilDestroyed,
  toObservable
} from '@angular/core/rxjs-interop';
import { Subject, takeUntil } from 'rxjs';
import { twMerge } from 'tailwind-merge';

import {
  BaseComponentInterface,
  FormFieldAccessor
} from '../../common';
import { OptionComponent } from '../option';

/**
 * Styles of Select
 */
export interface SelectStyle extends BaseComponentInterface {
  disabled: string;
  trigger: string;
  icon: string;
  dropdown: string;
}

/**
 * Default Select styles, which would be merge with the provider, if exists
 */
const selectStyle: SelectStyle = {
  host: 'flex flex-auto gap-2 h-full',
  disabled: 'cursor-not-allowed',
  trigger: 'flex flex-grow justify-start items-center px-2',
  icon: 'flex items-center px-2',
  dropdown: 'flex flex-col flex-grow rounded-md py-2 bg-neutral-50 dark:bg-neutral-700'
};

/**
 * Provider to override default Select styles
 */
export const SELECT_STYLE = new InjectionToken<Partial<SelectStyle>>('Default styles of Select');

/**
 * Input properties of Select
 */
export interface SelectProperties {
  placeholder: string;
  multi: boolean;
}

/**
 * Default Select properties
 */
const selectProperties: SelectProperties = {
  placeholder: 'Choose a item',
  multi: false
};

/**
 * Provider to override default Select properties
 */
export const SELECT_DEFAULT = new InjectionToken<Partial<SelectProperties>>('Default properties of Select');

@Component({
  selector: 'nrp-select',
  imports: [OverlayModule],
  templateUrl: './select.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: FormFieldAccessor,
      useExisting: forwardRef(() => SelectComponent)
    },
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectComponent),
      multi: true
    }
  ],
  host: {}
})
export class SelectComponent extends FormFieldAccessor
  implements ControlValueAccessor, AfterContentInit, OnInit, OnDestroy {

  private readonly _style = inject(SELECT_STYLE, { optional: true });

  override readonly host = computed(() => {
    const customAs = this.custom() as SelectStyle;
    
    const classes = [
      selectStyle.host,
      this._style?.host,
      customAs.host
    ];

    if (this._disabled()) {
      classes.push(
        selectStyle.disabled,
        this._style?.disabled,
        customAs.disabled
      );
    }

    return twMerge(classes);
  });

  readonly triggerClass = computed(() => {
    const customAs = this.custom() as SelectStyle;
    
    const classes = [
      selectStyle.trigger,
      this._style?.trigger,
      customAs.trigger
    ];

    return twMerge(classes);
  });

  readonly iconClass = computed(() => {
    const customAs = this.custom() as SelectStyle;
    
    const classes = [
      selectStyle.icon,
      this._style?.icon,
      customAs.icon
    ];

    return twMerge(classes);
  });

  readonly dropdownClass = computed(() => {
    const customAs = this.custom() as SelectStyle;
    
    const classes = [
      selectStyle.dropdown,
      this._style?.dropdown,
      customAs.dropdown
    ];

    return twMerge(classes);
  });

  private readonly _properties = inject(SELECT_DEFAULT, { optional: true });
  placeholder = input(this._properties?.placeholder ?? selectProperties.placeholder);
  multi = input(this._properties?.multi ?? selectProperties.multi, { transform: booleanAttribute });

  value = input<any>();
  valueChange = output<unknown>();

  readonly visibleText = signal<unknown>(this.placeholder());

  private readonly _destroyRef = inject(DestroyRef);
  private readonly _overlay = inject(Overlay);
  private readonly _elementRef = inject(ElementRef);

  private readonly _destroyed = new Subject<void>();
  
  private readonly _options = contentChildren(OptionComponent, { descendants: true });
  private readonly _options$ = toObservable(this._options);
  private _mappedOptions: OptionComponent[] = [];

  // @ts-expect-error
  private _value: SelectionModel<unknown>;

  readonly isOpened = signal(false);

  readonly positions: ConnectedPosition[] = [
    {
      originX: 'start',
      originY: 'bottom',
      overlayX: 'start',
      overlayY: 'top',
      offsetY: 8
    },
    {
      originX: 'end',
      originY: 'bottom',
      overlayX: 'end',
      overlayY: 'top',
      offsetY: 8
    },
    {
      originX: 'start',
      originY: 'top',
      overlayX: 'start',
      overlayY: 'bottom',
      offsetY: -8
    },
    {
      originX: 'end',
      originY: 'top',
      overlayX: 'end',
      overlayY: 'bottom',
      offsetY: -8
    },
  ];

  readonly scrollStrategy = this._overlay.scrollStrategies.reposition();

  overlayWidth: string | number = 0;

  constructor() {
    super();
  }

  ngOnInit(): void {
    let value = this.value();
    if (!value) {
      value = this.multi() ? [] : undefined;
    }

    this._value = new SelectionModel(this.multi(), value);
  }

  ngAfterContentInit(): void {
    this._options$
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe(options => 
        this._mapOptions(options.map(x => x)));

    console.log(this.value());
    if (this.value()) {
      this.writeValue(this.value());
    }
  }

  ngOnDestroy(): void {
    this._destroyed.next();
    this._destroyed.complete();
  }

  writeValue(obj: any): void {
    this._mappedOptions.forEach(option => {
      if (option.value() === obj) {
        this._updateValue(option);
      }
    });
  }

  registerOnChange(fn: (value: any) => void): void {
    this.onChangeFn = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouchFn = fn;
  }
  
  setDisabledState?(isDisabled: boolean): void {
    this._disabled.set(isDisabled);
  }

  onChangeFn: (value: any) => void = () => {};
  onTouchFn = () => {};

  open() {
    if (this._disabled()) {
      return;
    }

    this.overlayWidth = this._elementRef
      .nativeElement.getBoundingClientRect().width;

    this.isOpened.set(true);
    this.onTouchFn();
  }

  close() {
    if (this._disabled()) {
      return;
    }

    this.isOpened.set(false);
    this.onTouchFn();
  }

  private _mapOptions(options: OptionComponent[]) {
    this._destroyed.next();

    this._mappedOptions = options;

    options.forEach(option => {
      option.clicked
        .pipe(takeUntil(this._destroyed))
        .subscribe(() => this._updateValue(option));
    });
  }

  private _updateValue(option: OptionComponent) {
    if (this._disabled()) {
      return;
    }

    let changed = false;
    let valueToEmit;

    if (this._value.isMultipleSelection()) {
      changed = this._handleMultiChange(option.value());
      valueToEmit = this._value.selected;
    }
    else {
      changed = this._handleSingleChange(option.value());
      valueToEmit = this._value.selected[0] ?? undefined;
    }

    if (changed) {
      if (!this._value.isMultipleSelection()) {
        this.close();
      }

      this._mapVisibleText();

      this.valueChange.emit(valueToEmit);
      this.onChangeFn(valueToEmit);
    }
  }

  private _handleMultiChange(option: unknown): boolean {
    if (this._value.isSelected(option)) {
      return this._value.deselect(option) ?? false;
    }
    else {
      return this._value.select(option) ?? false;
    }
  }

  private _handleSingleChange(option: unknown): boolean {
    if (this._value.isSelected(option)) {
      return false;
    }

    return this._value.select(option) ?? false;
  }

  private _mapVisibleText() {
    const selectedValues = this._mappedOptions
      .filter(option => this._value.selected.includes(option.value()))
      .map(option => option.getNativeElement());

    const toDisplay = selectedValues?.length === 0
      ? this.placeholder()
      : selectedValues.join(' ');

    this.visibleText.set(toDisplay);
  }

}
