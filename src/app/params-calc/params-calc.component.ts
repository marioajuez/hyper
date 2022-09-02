import { Component, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { MembershipService } from '../services/membership/membership.service';

@Component({
  selector: 'app-params-calc',
  templateUrl: './params-calc.component.html',
  styleUrls: ['./params-calc.component.scss']
})
export class ParamsCalcComponent implements OnInit {

  public form: FormGroup;
  public selectedMembership: string = '';

  @ViewChild('formMembership', { static: true }) formMembership: NgForm ;

  public listMemberShips = [];

  public card = {
        name: '',
        initialMembershipLeverage: '',
        percentRewards: '',
        minimumBalanceRebuy:'',
        totalDays: '',
  }

  constructor(
    private fb: FormBuilder,
    private membershipService: MembershipService
  ) {}


  ngOnInit(): void {
    this.createForm();
    this.form.valueChanges.subscribe( resp => {
      console.log(resp);
    })

    this.getListMemberships();
  }


  public createMembership(): void {
      this.membershipService.createMemberShipsHyperfund(this.form.getRawValue());
  }

  /**
  * get list memberships
  * @autor mjuez
  * @return void
  */

  private getListMemberships(): void {

    this.membershipService.getMemberShipsHyperfund()
    .subscribe(
      (resp)=> {
        this.listMemberShips.push(...resp.memberships);
      }, error => {
      console.log(error);
      })
  }

  private createForm(): void {

    this.form = this.fb.group({
      name: ['', [Validators.required]],
      initialMembershipLeverage: ['', [Validators.required]],
      percentRewards: ['', [Validators.required]],
      minimumBalanceRebuy: ['', [Validators.required]],
      totalDays: ['', [Validators.required]],
    });
  }
}
