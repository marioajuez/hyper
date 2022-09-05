import { Component, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, NgForm, ValidatorFn, Validators } from '@angular/forms';
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

  private percentRewards: number;

  constructor(
    private fb: FormBuilder,
    private membershipService: MembershipService
  ) {}


  ngOnInit(): void {
    this.createForm();
    this.getListMemberships();

    this.form.valueChanges.subscribe ( control  => {
      this.percentRewards = Number(this.form.get('percentRewards').value as number);
      this.percentRewards.toLocaleString();
      console.log(this.percentRewards);
    });
  }

  public createMembership(): void {
      this.membershipService.createMemberShipsHyperfund(this.form.getRawValue());
      this.listMemberShips = JSON.parse(localStorage.getItem('memberships'));
  }


  public editMembership(event: Event, idMembership?: number, indexElement?: number): void{

    const membership = this.listMemberShips[indexElement];
    const target = (event.target as HTMLInputElement);

    const percentRewards = Number(membership?.percentRewards) * 100;

    this.form.get('name').setValue(membership?.id);
    this.form.get('initialMembershipLeverage').setValue(membership?.initialMembershipLeverage);
    this.form.get('percentRewards').setValue(percentRewards);
    this.form.get('minimumBalanceRebuy').setValue(membership?.minimumBalanceRebuy);
    this.form.get('totalDays').setValue(membership?.totalDays);
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
        this.form.setValidators(validatorNameDuplicate(resp.memberships));
        // this.form.updateValueAndValidity();
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
    },{});
  }
}


export const validatorNameDuplicate = (listMemberships?: any): ValidatorFn  => {
  return (control: AbstractControl): {[key: string]: any} => {

    let isDuplicate = false;

    for (const membership of listMemberships){
      if ( membership['name'] === control.get('name').value) {
          isDuplicate = true
      }
    }
    // control.get('name').markAsTouched();

    return (isDuplicate) ? { nameExist: true } : null; 
  };

}
