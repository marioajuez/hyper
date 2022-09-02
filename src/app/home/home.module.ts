import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { ComponentsModule } from '../components/components.module';
import { DirectivesModule } from '../directives/directives.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../components/material.module';
import { TranslateModule } from '@ngx-translate/core';
import { TableVirtualScrollModule } from 'ng-table-virtual-scroll';

@NgModule({
  declarations: [
    HomeComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    TranslateModule,
    ComponentsModule,
    MaterialModule,
    DirectivesModule,

    ReactiveFormsModule,
    FormsModule,
    TableVirtualScrollModule
  ]
})
export class HomeModule { }
