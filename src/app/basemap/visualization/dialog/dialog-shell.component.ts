import { Component, Inject, ViewChild, TemplateRef, ComponentFactoryResolver, ViewContainerRef, ComponentRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

// import { DummyDirective } from './dummy.directive'

@Component({
  selector: 'dialog-shell',
  templateUrl: './dialog-shell.component.html',
  styleUrls: ['./dialog-shell.component.scss']
})
export class DialogShell {

  /*
   * For each dynamic component created in dialog, have a ViewChild for that component
   */

  @ViewChild('radarChart', { read: ViewContainerRef, static: true}) radar: ViewContainerRef;
  // @ViewChild('placeholder', { read: ViewContainerRef, static: true}) placeholder: ViewContainerRef;

  componentRef: any[]; 

  constructor(
    public dialogRef: MatDialogRef<DialogShell>,
    private resolver: ComponentFactoryResolver,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this.dialogRef.updateSize('100vh','90vh');
    const factory0 = this.resolver.resolveComponentFactory(this.data.radar);
    // const factory1 = this.resolver.resolveComponentFactory(this.data.component.placeholder);
    this.componentRef = [ this.radar.createComponent(factory0) ];
  }

  ngOnDestroy() {
    if (this.componentRef) {
      // destroy each component instance upon closing -destroying- the dialog
      for (let component of this.componentRef) {
        component.destroy();
      }
    }
  }  
}


