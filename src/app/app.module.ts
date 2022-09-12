// angular
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
// directives 
import { DirectivesModule } from './directives/directives.module';
// material 
import { ComponentsModule } from './components/components.module';
import { MaterialModule } from './components/material.module';

// envs
import { environment } from '../environments/environment';

// external libraries
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TableVirtualScrollModule } from 'ng-table-virtual-scroll';
import { NgxMaskModule, IConfig } from 'ngx-mask';
import { ToastService, AngularToastifyModule } from 'angular-toastify'; 

// firebase
import { AngularFireModule } from '@angular/fire';
import { AngularFireAnalyticsModule } from '@angular/fire/analytics';
import { AngularFirestoreModule } from '@angular/fire/firestore';

export const options: Partial<IConfig> | (() => Partial<IConfig>) = null;

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,

    HttpClientModule,
    MaterialModule,
    ComponentsModule,
    DirectivesModule,

    ReactiveFormsModule,
    FormsModule,

    TableVirtualScrollModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
    NgxMaskModule.forRoot(),
    AngularToastifyModule,
    // firebase

    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule.enablePersistence( 
      {
         synchronizeTabs: true
      }
    )
  

    
  ],
  providers: [ToastService],

  bootstrap: [AppComponent]
})
export class AppModule { }
