import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ParamsCalcRoutingModule } from './params-calc-routing.module';
import { TranslateModule } from '@ngx-translate/core';
import { ComponentsModule } from '../components/components.module';
import { MaterialModule } from '../components/material.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { DirectivesModule } from '../directives/directives.module';
import { ParamsCalcComponent } from './params-calc.component';


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

  ]
})
export class ParamsCalcModule { }
