import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ParamsCalcComponent } from './params-calc.component';


const routes: Routes = [
  {
    path:'',
    component: ParamsCalcComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ParamsCalcRoutingModule { }
