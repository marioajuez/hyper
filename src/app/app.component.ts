
import { Platform } from '@angular/cdk/platform';
import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})

export class AppComponent implements OnInit{
  langs: string[] = [];

  constructor(
    @Inject(DOCUMENT) private document: any,
    private translate: TranslateService,
    private platform: Platform,

  ){}

  ngOnInit(){

    this.translate.setDefaultLang('en');
    this.translate.use('en');
    this.translate.addLangs(['en', 'es','fr']);

    if (this.platform.ANDROID || this.platform.IOS) {
      this.document.body.classList.add("is-mobile");
    }

  }


}

