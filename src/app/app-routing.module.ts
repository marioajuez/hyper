import { NgModule } from '@angular/core';
import { Routes, RouterModule, Router } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';


const routes: Routes = [

  {
    path:'',
    redirectTo: 'params',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomeModule),
  },
  {
    path: 'params',
    loadChildren: () => import('./params-calc/params-calc.module').then(m => m.ParamsCalcModule),
  }
];

@NgModule({
  imports: [RouterModule.forRoot(
        routes, 
        {
          useHash: true
        }
      // { initialNavigation : false }
    )
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { 

  constructor(router: Router) {
    // router.navigateByUrl("/login");
  }
}
