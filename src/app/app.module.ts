import { BrowserModule } from "@angular/platform-browser";
import { NgModule, OnInit } from "@angular/core";
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { BasemapComponent } from "./basemap/basemap.component";
import {
  MatIconModule,
  MatSnackBarModule,
  MatTooltipModule
} from "@angular/material";
import { HomeComponent } from "./home/home.component";
import { MapSettingComponent } from "./basemap/map-controls/map-setting/map-setting.component";
import { LegendComponent } from "./basemap/map-controls/legend/legend.component";
import { LayerControlComponent } from "./basemap/map-controls/layer-control/layer-control.component";
import { ConfigurationService } from "./services/configuration.service";
import { CityIOService } from "./services/cityio.service";
import { LoginComponent } from "./login/login.component";
import { fakeBackendProvider } from "./interceptors/fake-backend";
import { JwtInterceptor } from "./interceptors/jwt.interceptor";
import { ReactiveFormsModule } from "@angular/forms";
import { ErrorInterceptor } from "./interceptors/error.interceptor";
import { ModalComponent } from './basemap/visualization/modal/modal.component';

import { ModalModule } from './basemap/visualization/modal/modal.module';
import { FormsModule } from '@angular/forms'; // <-- NgModel lives here
import { DialogContentExample, DialogContentExampleDialog } from './basemap/visualization/dialog/dialog-content-example';
import { MatDialogModule, MAT_DIALOG_DEFAULT_OPTIONS, MAT_DIALOG_DATA} from '@angular/material/dialog';

import { DialogComponent } from './basemap/visualization/dialog/dialog.component';
import { DialogShell } from './basemap/visualization/dialog/dialog-shell.component';
import { ChartPlaceholderComponent  } from './basemap/visualization/dialog/chart-holder-comp';
import { DummyDirective } from './basemap/visualization/dialog/dummy.directive';
import { RadarChartComponent } from './basemap/visualization/radar-chart/radar-chart.component';

@NgModule({
  declarations: [
    AppComponent,
    BasemapComponent,
    HomeComponent,
    MapSettingComponent,
    LegendComponent,
    LayerControlComponent,
    LoginComponent,

    ModalComponent,
    DialogContentExample,
    DialogContentExampleDialog,
    DialogComponent,
    DialogShell,
    ChartPlaceholderComponent,
    DummyDirective,
    RadarChartComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatIconModule,
    MatTooltipModule,
    ReactiveFormsModule,
    ModalModule,
    FormsModule,
    MatDialogModule

  ],
  exports: [MatSnackBarModule, ChartPlaceholderComponent],
  providers: [
    HttpClientModule,
    CityIOService,
    ConfigurationService,

    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },

    // provider used to create fake backend
    fakeBackendProvider,

    MatDialogModule,
    { provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: {hasBackdrop: true}},
    ChartPlaceholderComponent,
    RadarChartComponent
    // { provide: MAT_DIALOG_DATA }
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    DialogContentExample, 
    DialogContentExampleDialog, 
    DialogComponent, 
    DialogShell, 
    ChartPlaceholderComponent,
    RadarChartComponent]
})
export class AppModule implements OnInit {
  ngOnInit() {}
}
