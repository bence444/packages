import {
  computed,
  Directive,
  input
} from '@angular/core';

/**
 * Interface that every component interface extends. Not exported in public-api
 */
export interface BaseComponentInterface {
  host: string;
}

@Directive({
  selector: '[nrpComponent]',
  standalone: true,
  host: {
    '[class]': 'host()'
  }
})
export class BaseComponent {
  
  custom = input<Partial<BaseComponentInterface>>({ host: '' });

  readonly host = computed(() => this.custom().host);

}
