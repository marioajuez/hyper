import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from './material.module';
import { PaginatorComponent } from './paginator/paginator.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';




@NgModule({
  declarations: [
    PaginatorComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,

    ReactiveFormsModule,
    FormsModule
  ],
  exports:[
    PaginatorComponent
  ]
})
export class ComponentsModule { }
