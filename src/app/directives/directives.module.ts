import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaxValidatorDirective } from './max-validator.directive';
import { MinValidatorDirective } from './min-validator.directive';



@NgModule({
  declarations: [
    MaxValidatorDirective,
    MinValidatorDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [
    MaxValidatorDirective,
    MinValidatorDirective
  ]
})
export class DirectivesModule { }
