import { Component, Inject, ViewChild, TemplateRef, ComponentFactoryResolver, ViewContainerRef, ComponentRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

// import { DummyDirective } from './dummy.directive'

@Component({
  selector: 'dialog-shell',
  templateUrl: './dialog-shell.component.html'
})
export class DialogShell {

  @ViewChild('radarChart', { read: ViewContainerRef, static: true}) vcRef0: ViewContainerRef;
  @ViewChild('target2', { read: ViewContainerRef, static: true}) vcRef1: ViewContainerRef;

  // @ViewChild(DummyDirective, { read: ViewContainerRef, static: true}) vcRef: DummyDirective;


  // componentRef: ComponentRef[];
  componentRef: any[];

  constructor(
    public dialogRef: MatDialogRef<DialogShell>,
    private resolver: ComponentFactoryResolver,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    const factory0 = this.resolver.resolveComponentFactory(this.data.component.radar);
    const factory1 = this.resolver.resolveComponentFactory(this.data.component.placeholder);
    // const vcRef = this.dummy.viewContainerRef;
    console.log(this.vcRef0);
    this.componentRef = [this.vcRef0.createComponent(factory0), this.vcRef1.createComponent(factory1)];
  }

  ngOnDestroy() {
    if (this.componentRef) {
      this.componentRef[0].destroy();
      this.componentRef[1].destroy();
      console.log('dialog and component instances destroyed');
    }
  }  
}


