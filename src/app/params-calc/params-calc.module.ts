// angular
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
// external libraries
import { TranslateModule } from '@ngx-translate/core';
import { NgxMaskModule } from 'ngx-mask';
import { ToastService, AngularToastifyModule } from 'angular-toastify'; 
// components
import { ParamsCalcComponent } from './params-calc.component';
// shared modules
import { ComponentsModule } from '../components/components.module';
import { MaterialModule } from '../components/material.module';
import { DirectivesModule } from '../directives/directives.module';
// routing
import { ParamsCalcRoutingModule } from './params-calc-routing.module';


@NgModule({
  declarations: [
    ParamsCalcComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    ParamsCalcRoutingModule,
    TranslateModule,
    ComponentsModule,
    MaterialModule,
    DirectivesModule,
    NgxMaskModule,
    AngularToastifyModule,
  ],
  providers: [
    // ToastService
  ]
})
export class ParamsCalcModule { }
