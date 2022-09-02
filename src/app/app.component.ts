
import {Component} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})

export class AppComponent{
  langs: string[] = [];

  constructor(
    private translate: TranslateService
  ){
    this.translate.setDefaultLang('en');
    this.translate.use('en');
    this.translate.addLangs(['en', 'es','fr']);
  }

}

