import { Component, Inject, ViewChild, TemplateRef, ComponentFactoryResolver, ViewContainerRef, ComponentRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'dialog-shell',
  templateUrl: './dialog-shell.component.html'
})
export class DialogShell {

  // @ViewChild('target', { read: ViewContainerRef, static: false}) vcRef: ViewContainerRef;

  // componentRef: ComponentRef<any>;

  // constructor(
  //   public dialogRef: MatDialogRef<DialogShell>,
  //   private resolver: ComponentFactoryResolver,
  //   @Inject(MAT_DIALOG_DATA) public data: any) { }

  // ngOnInit() {
  //   const factory = this.resolver.resolveComponentFactory(this.data.component);
  //   this.componentRef = this.vcRef.createComponent(factory);
  // }

  // ngOnDestroy() {
  //   if (this.componentRef) {
  //     this.componentRef.destroy();
  //   }
  // }  
}


