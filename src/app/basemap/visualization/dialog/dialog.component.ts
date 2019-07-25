import { Input, Component, Inject, ViewChild, TemplateRef, ComponentFactoryResolver, ViewContainerRef, ComponentRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { DialogShell } from "./dialog-shell.component";
import { RadarChartComponent } from "../radar-chart/radar-chart.component";

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent {
  @Input() dialogType: string = 'dialog!';

  constructor(public dialog: MatDialog,
    ) {}

  openDialog() {
    let dialogRef = this.dialog.open(DialogShell, {
      // backdropClass: 'backdropBackground'
      hasBackdrop: true,
      width: '250px',
      data: { component: { radar: RadarChartComponent } } // inject more dynamic components into dialog
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
}


