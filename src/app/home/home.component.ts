
import { ChangeDetectorRef, Component, ElementRef, EventEmitter, OnInit, Output, ViewChild, AfterViewInit } from '@angular/core';
import { FormGroup, FormControl, NgForm } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';
import { Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';

interface dataTable {
  days?: number,
  date?: any,
  amount: number,
  dailyInterest?: number,
  dailyRewards?: number,
  membershipBalance?: number,
  rebuy?: number,
  index?: number
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  @ViewChild('f', { static: true }) ngForm: NgForm;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('table', { read: ElementRef }) paginatorTable: ElementRef;

  public userData = {
    date: new Date(),
    membership: "400",
  };


  // ----  constants calc dependients
  public initialMembershipLeverage: number;
  public percentRewards: number;
  public totalDays: number;
  public minimumBalanceRebuy: number;
  //---------------

  // ----- variables to display in view (template)  ---
  public membershipInitialX:number;
  public recompenseFinal: number;
  public dateReturnInvest = { date: null, day: null };
  // ------------------------

  table: dataTable[] = [];
  // public dataSource = new MatTableDataSource();
  public dataSource: MatTableDataSource<any>;
  public displayedColumns: string[] = ['day', 'date', 'amount', 'dailyInterest', 'dailyRewards', 'rebuy', 'balance'];


  private timeout: any = null;
  private showTableFirstTime = false;

  // --------- variables to store calculations ------------
  private rebuy;
  private amount;
  private dailyRewards;
  private membershipBalance

  // es - en -fr
  public langs = []

  // --------------------------------------------
  constructor(
    private translate: TranslateService

  ) {

  
    // membership 1.0
      // this.totalDays = 600;
      // this.initialMembershipLeverage = 3;
      // this.percentRewards = 0.005;
      // this.minimumBalanceRebuy = 50;

    // membership 2.0
      this.totalDays = 1333;
      this.initialMembershipLeverage = 4;
      this.percentRewards = 0.003;
      this.minimumBalanceRebuy = 125;


    // view template
      this.membershipInitialX = Number(this.userData.membership) * this.initialMembershipLeverage;


    this.initilizateTable();
    this.dataSource = new MatTableDataSource(this.table);
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.ngForm.valueChanges.subscribe(resp => {
    })
  }


  ngOnInit() {
    this.langs = this.translate.getLangs()
  }

  changeLanguaje(event) {
    const lang = event.target.innerText.toLowerCase();
    this.translate.use(lang);
  }

  protected initilizateTable() {

    this.amount = Number(this.userData.membership);
    this.membershipBalance = this.amount *  this.initialMembershipLeverage  - this.amount * this.percentRewards;
    this.dailyRewards = this.amount * this.percentRewards;
    this.rebuy = Number((this.dailyRewards / this.minimumBalanceRebuy).toString().split('.')[0]) * this.minimumBalanceRebuy;

    this.calculate({
      amount: this.amount,
      dailyRewards: this.dailyRewards,
      membershipBalance: this.membershipBalance,
      rebuy: this.rebuy,
      index: -1
    }, { initializateTable: true, rebuyNever: true })
  }

  private createOrUpdateTable(data: dataTable, initializateTable = false) {

    if (initializateTable) {
      this.table.push({
        days: data.days + 1,
        date: new Date(this.userData.date).setDate(
          new Date(this.userData.date).getDate() + data.days),
        amount: data.amount,
        dailyInterest: data.dailyInterest,
        dailyRewards: data.dailyRewards,
        rebuy: data.rebuy,
        membershipBalance: data.membershipBalance,
      });
    } else {
      this.table[data.days].amount = data.amount;
      this.table[data.days].dailyInterest = data.dailyInterest;
      this.table[data.days].dailyRewards = data.dailyRewards;
      this.table[data.days].rebuy = data.rebuy;
      this.table[data.days].membershipBalance = data.membershipBalance;
    }
  }

  private calculate(data: dataTable, { rebuyNever = false, rebuyAlways = false, initializateTable = false } = {}) {

    //se inicializa el ciclo segun el indice que llegue
    for (let i = data.index + 1; i < this.totalDays; i++) {

      // se crea por primera la tabla de datos o se actualiza
      this.createOrUpdateTable({
        days: i,
        amount: data.amount,
        dailyInterest: data.amount * this.percentRewards,
        dailyRewards: data.dailyRewards,
        rebuy: data.rebuy,
        membershipBalance: data.membershipBalance,
      }, initializateTable);

      if (data.dailyRewards >= this.minimumBalanceRebuy) {

        //esta formula es para que se reinvierta siempre o algunas veces.
        data.amount += data.rebuy;
        data.membershipBalance += data.rebuy * this.initialMembershipLeverage - data.amount * this.percentRewards;
        data.dailyRewards -= data.rebuy;
      }
      else data.membershipBalance += data.rebuy * this.initialMembershipLeverage - data.amount * this.percentRewards; // Recompensas en Saldo en ejecución

      data.dailyRewards += data.amount * this.percentRewards; // Saldo Diario de las recompensas
      data.rebuy = Number((data.dailyRewards / this.minimumBalanceRebuy ).toString().split('.')[0]) * this.minimumBalanceRebuy; // se obtiene el valor de la recompra
    }
    this.recompenseFinal = this.table[this.table.length - 1].membershipBalance;
  }


  protected updateTable() {

    // this.amount = (this.userData.membership);
    // this.dailyRewards = this.amount * 0.005;
    // this.rebuy = parseFloat((this.dailyRewards / 50.0).toString().split('.')[0]) * 50.0;
    // this.membershipBalance = this.amount * 3 - this.amount * 0.005;

    this.amount = Number(this.userData.membership);
    this.dailyRewards = this.amount * this.percentRewards;
    this.rebuy = Number((this.dailyRewards / this.minimumBalanceRebuy).toString().split('.')[0]) * this.minimumBalanceRebuy;
    this.membershipBalance = this.amount * this.initialMembershipLeverage - this.amount * this.percentRewards;

    this.calculate(
      {
        amount: this.amount,
        dailyRewards: this.dailyRewards,
        membershipBalance: this.membershipBalance,
        rebuy: this.rebuy,
        index: -1
      }, {
      rebuyAlways: true
    }
    )
  }


  public triggerEventKey(event: any) {
    if (this.userData.membership != null)
      this.membershipInitialX = Number(this.userData.membership) * this.initialMembershipLeverage;
    else
      this.membershipInitialX = 0;

    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      this.updateTable();
    }, 1000);
  }

  public dataPicker(event?) {
    this.table.forEach((element, index) => {
      element.date = new Date(this.userData.date).setDate(
        new Date(this.userData.date).getDate() + (index + 1)
      );
    });
  }

  public paginationChange(paginationDetails) {
    this.paginatorTable.nativeElement.scrollIntoView({ behavior: "smooth" });
  }

}
