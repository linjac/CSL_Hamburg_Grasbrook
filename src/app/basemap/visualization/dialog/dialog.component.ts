// import { Component, OnInit } from '@angular/core';
import { Input, Component, Inject, ViewChild, TemplateRef, ComponentFactoryResolver, ViewContainerRef, ComponentRef } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

// import { LayerControlComponent } from '../../map-controls/layer-control/layer-control.component'; // TODO: a placeholder component for a radar chart component
// import { ChartPlaceholderComponent } from "../../basemap.component"
import { DialogShell } from "./dialog-shell.component";
import { ChartPlaceholderComponent } from "./chart-holder-comp";
import { RadarChartComponent } from "../radar-chart/radar-chart.component";

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent {
  @Input() dialogType: string = 'dialog!';

  constructor(public dialog: MatDialog,
    private visualization: ChartPlaceholderComponent 
    ) {}

  openDialog() {
    let dialogRef = this.dialog.open(DialogShell, {
      // backdropClass: 'backdropBackground'
      // hasBackdrop: true
      width: '250px',
      data: { component: { radar: RadarChartComponent, placeholder: ChartPlaceholderComponent} }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
}


// @Component({
//   selector: 'dialog-shell',
//   templateUrl: './dialog-shell.html'
// })
// export class DialogShell {

//   @ViewChild('target', { read: ViewContainerRef }) vcRef: ViewContainerRef;

//   componentRef: ComponentRef<any>;

//   constructor(
//     public dialogRef: MatDialogRef<DialogShell>,
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

// @Component({
//   selector: 'chart-placeholder-comp',
//   template: `
//   <div>jhgfds Placeholder component</div>
//   <div>Replace this component with radar chart</div>`
// })
// export class ChartPlaceholderComponent {

// }





