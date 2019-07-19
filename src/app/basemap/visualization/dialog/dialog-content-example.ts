// import {Component, Input} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';

import { Input, Component, Inject, ViewChild, TemplateRef, ComponentFactoryResolver, ViewContainerRef, ComponentRef } from '@angular/core';
/**
 * @title Dialog with header, scrollable content and actions
 */
@Component({
  selector: 'dialog-content-example',
  templateUrl: 'dialog-content-example.html',
  styleUrls: ['dialog-content-example.css'],
})
export class DialogContentExample {
  @Input() dialogType: string = 'dialog!';
  @Input() component: any = DialogContentExampleDialog;

  constructor(public dialog: MatDialog) {}

  openDialog() {
    const dialogRef = this.dialog.open(this.component, {
      // backdropClass: 'backdropBackground'
      hasBackdrop: true
      // data: { component: this.component}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
}

@Component({
  selector: 'dialog-content-example-dialog',
  templateUrl: 'dialog-content-example-dialog.html',
}) 
export class DialogContentExampleDialog {}






// // import {Component, Input} from '@angular/core';
// import {MatDialog} from '@angular/material/dialog';

// import { Input, Component, Inject, ViewChild, TemplateRef, ComponentFactoryResolver, ViewContainerRef, ComponentRef } from '@angular/core';
// /**
//  * @title Dialog with header, scrollable content and actions
//  */
// @Component({
//   selector: 'dialog-content-example',
//   templateUrl: 'dialog-content-example.html',
//   styleUrls: ['dialog-content-example.css'],
// })
// export class DialogContentExample {
//   @Input() dialogType: string = 'dialog!';
//   @Input() component: any = DialogContentExampleDialog;

//   constructor(public dialog: MatDialog) {}

//   openDialog() {
//     const dialogRef = this.dialog.open(DialogDialog, {
//       // backdropClass: 'backdropBackground'
//       // hasBackdrop: true
//       data: { component: this.component}
//     });

//     dialogRef.afterClosed().subscribe(result => {
//       console.log(`Dialog result: ${result}`);
//     });
//   }
// }


// // export class AppComponent  {
// //    constructor(public dialog: MatDialog) {}

// //   openDialog(): void {
// //     let dialogRef = this.dialog.open(DialogDialog, {
// //       width: '250px',
// //       data: { component: DynamicComponent }
// //     });
// //   }

// // }

// @Component({
//   selector: 'dialog-content-example-dialog',
//   templateUrl: 'dialog-content-example-dialog.html',
// }) 
// export class DialogContentExampleDialog {}


// /**  Copyright 2019 Google Inc. All Rights Reserved.
//     Use of this source code is governed by an MIT-style license that
//     can be found in the LICENSE file at http://angular.io/license */

// @Component({
//   selector: 'dialog-comp',
//   templateUrl: './dialog.component.html',
// })
// export class DialogDialog {

//   @ViewChild('target', { read: ViewContainerRef }) vcRef: ViewContainerRef;

//   componentRef: ComponentRef<any>;

//   constructor(
//     public dialogRef: MatDialogRef<DialogContentExampleDialog>,
//     private resolver: ComponentFactoryResolver,
//     @Inject(MAT_DIALOG_DATA) public data: any) { }

//   ngOnInit() {
//     const factory = this.resolver.resolveComponentFactory(this.data.component);
//     this.componentRef = this.vcRef.createComponent(factory);
//   }


//   ngOnDestroy() {
//     if (this.componentRef) {
//       this.componentRef.destroy();
//     }
//   }  
// }
