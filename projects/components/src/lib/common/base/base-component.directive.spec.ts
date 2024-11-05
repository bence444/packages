import { BaseComponent } from './base-component.directive';

describe('BaseComponent', () => {
  it('should create an instance', () => {
    const directive = new BaseComponent();
    expect(directive).toBeTruthy();
  });
});
