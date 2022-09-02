import { Component, OnInit, AfterViewInit } from '@angular/core';

import {
  Input,
  Output,
  EventEmitter,
  ViewChild
} from "@angular/core";
import { MatPaginator, PageEvent } from "@angular/material/paginator";
import { from, Subject } from 'rxjs';
import { finalize, map, switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.scss']
})
export class PaginatorComponent implements OnInit {

  pageSize: number;
  pageIndex: number;
  length: number;
  goTo: number;
  pageNumbers: number[];
  @ViewChild(MatPaginator) paginator: MatPaginator;

  @Input() dataSource: any ; 
  @Input() disabled = false;
  @Input() hidePageSize = false;
  @Input() pageSizeOptions: number[];
  @Input() showFirstLastButtons = false;
  @Output() page = new EventEmitter<PageEvent>();

  
  @Input("pageIndex") set pageIndexChanged(pageIndex: number) {
    this.pageIndex = pageIndex;
  }
  @Input("length") set lengthChanged(length: number) {
    this.length = length;
    this.updateGoto();
  }
  @Input("pageSize") set pageSizeChanged(pageSize: number) {
    this.pageSize = pageSize;
    this.updateGoto();
  }

  @Input('eventForm') eventForm:Subject<any>;
  @Input('eventCheck') eventCheck:Subject<any>;

  dataFilterLength: number;


  constructor() {
    }
  
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit() {

    let formule_ =(Math.ceil( (this.dataSource.filteredData.length-1) / this.pageSize)*this.pageSize);
    let formule = Math.ceil( (this.dataSource.filteredData.length-1)/ this.pageSize)*this.pageSize-this.pageSize;
    
    this.dataSource.connect()
        .pipe(
          tap({
            next: (x: any) => {
              this.goTo = (x.length == 0)? Math.ceil( (this.dataSource.filteredData.length)/this.pageSize):this.goTo;
            },
            error: (err) => console.log('tap error', err),
            complete: () => console.log('tap complete')
          }),
        )
    .subscribe(
      res =>{

        // let initializate = this.goTo;
        // let finalizate = Math.ceil(this.dataSource.filteredData.length/ this.pageSize);
        // let diff = finalizate - initializate
        // for(let index = initializate; index <= finalizate; index++) {
        //     console.log( 
        //       (index * this.pageSize),
        //       this.pageSize,
        //       this.pageIndex,
        //       Math.ceil(this.dataSource.filteredData.length/ this.pageSize),
        //       this.dataSource.filteredData.length
        //     );
        // }
        this.pageNumbers = []
        for (let i = 1; i <= Math.ceil((this.dataSource.filteredData.length) / this.pageSize); i++) {
          this.pageNumbers.push(i);
        }

      }
    );
    
    this.eventForm.subscribe(e => {
      this.goTo = 1
      this.paginator.pageIndex = 0;
      this.pageNumbers = [];
      for (let i = 1; i <= Math.ceil(this.dataSource.filteredData.length / this.pageSize); i++) {
        this.pageNumbers.push(i);
      }
      this.dataSource.data = this.dataSource.data;
    });
    this.updateGoto();
  }

  updateGoto() {
    this.goTo = (this.pageIndex || 0) + 1;
  }

  paginationChange(pageEvt: PageEvent) {
    this.length = pageEvt.length;
    this.pageIndex = pageEvt.pageIndex;
    this.pageSize = pageEvt.pageSize;
    this.updateGoto();
    this.emitPageEvent(pageEvt);
  }

  goToChange() {
    this.paginator.pageIndex = this.goTo - 1;
    const event: PageEvent = {
      length: this.paginator.length,
      pageIndex: this.paginator.pageIndex,
      pageSize: this.paginator.pageSize
    };
    this.paginator.page.next(event);
    this.emitPageEvent(event);
  }

  emitPageEvent(pageEvent: PageEvent) {
    this.page.next(pageEvent);
  }
}
