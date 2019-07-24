import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[dummy-host]',
})
export class DummyDirective {
  constructor(public viewContainerRef: ViewContainerRef) { }
}