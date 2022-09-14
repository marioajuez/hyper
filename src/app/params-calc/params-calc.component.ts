
// angular 
import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, NgForm, ValidatorFn, Validators, FormControl, Validator } from '@angular/forms';
import { BehaviorSubject, pipe, Subject } from 'rxjs';
// models
import { Hyperfund } from '../models/membership.model';
// services
import { MembershipService } from '../services/membership/membership.service';
import { finalize } from 'rxjs/operators';
import { ToastService } from 'angular-toastify';
import { MatCheckboxChange } from '@angular/material/checkbox';

@Component({
  selector: 'app-params-calc',
  templateUrl: './params-calc.component.html',
  styleUrls: ['./params-calc.component.scss']
})
export class ParamsCalcComponent implements OnInit {

  @ViewChild('formMembership', { static: true }) formMembership: NgForm ;
  public selectedMembership: string = '';

  public loadMemberships = new BehaviorSubject<boolean>(true)

  public form: FormGroup;
  public listMemberShips = [];
  public isEdit = false;
  private indexMembershipSelected: any;
  private dateTimeNow: number = new Date().getTime();

  constructor(
    private fb: FormBuilder,
    private membershipService: MembershipService,
    private changeDetectorRef: ChangeDetectorRef,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.createForm();
    this.getListMembershipsFirebase();
  }

  public cancel(){
    this.isEdit = false;
    this.form.get('name').setValidators([Validators.required, validatorNameDuplicate(this.listMemberShips) ]);
    this.form.reset();
  }

  public createMembership(): void {

    this.isEdit = false;

    const membership: Hyperfund.Membership = {
      id_au: this.membershipService.idAutoIncrementMembership,
      state: true,
      date: this.dateTimeNow,
      dateUpdate: this.dateTimeNow,

      name: this.form.get('name').value,
      totalDays: Number(this.form.get('totalDays').value),
      initialMembershipLeverage: Number(this.form.get('initialMembershipLeverage').value),
      percentRewards: Number(this.form.get('percentRewards').value),
      decimalRewards: Number(this.form.get('percentRewards').value) / 100,
      minimumBalanceRebuy: Number(this.form.get('minimumBalanceRebuy').value),
    }

    this.membershipService
    .createMemberShipsFirebase(membership)
    .subscribe( resp => {
      this.form.reset();
      this.toastService.success('successfully created');
    }, 
    error => {
      this.toastService.error('A problem has occurred');
    });
  }

  /**
  * get list memberships
  * @autor mjuez
  * @return void
  */

  public deleteMembership(idMembership: number | string ): void {

    this.isEdit = false;
    this.form.reset();
    this.membershipService
    .deleteMemberShipsHyperfund(idMembership)
    .subscribe( resp =>{
      this.toastService.success('successfully deleted');
    }, error => {
      this.toastService.error('A problem has occurred');
    })
  }

  /**
  * get list memberships
  * @autor mjuez
  * @return void
  */
  private getListMembershipsFirebase(): void {

    this.membershipService
    .getMemberShipsFirebase_()
    .pipe(finalize(() => {}))
    .subscribe(
      (memberships)=> {
        this.loadMemberships.next(false);
        this.listMemberShips = memberships;
        this.form.get('name').setValidators([ Validators.required, validatorNameDuplicate(memberships)]); 
      }, error => {
        this.toastService.error('A problem has occurred');
      })
  }

  public checkedMembership(event: MatCheckboxChange , indexElement?: number): void{

    this.indexMembershipSelected = indexElement;
    const valueCheck = event.checked;

    const membership: Hyperfund.Membership = this.listMemberShips[indexElement];
    membership.state = valueCheck;
    membership.dateUpdate = this.dateTimeNow;
  }

  /**
  * get list memberships
  * @autor mjuez
  * @return void
  */

  public updateStateMembership(): void {

    const dataMembership = (this.listMemberShips[this.indexMembershipSelected] as Hyperfund.Membership);
    const idMembership = dataMembership.id_document;

    this.membershipService
    .updateStateMembership(dataMembership, idMembership)
    .subscribe((resp: any) => {
      this.toastService.success('successfully updated state');
    }, (error: any)=> {
      this.toastService.error('A problem has occurred');
    });

  }

  public updateMembershipFirebase(): void {

    const dataMembership = (this.listMemberShips[this.indexMembershipSelected] as Hyperfund.Membership);
    const idMembership = dataMembership.id_document;
    const data: Hyperfund.Membership = {

      dateUpdate: this.dateTimeNow,
      name: this.form.get('name').value ,
      totalDays: Number(this.form.get('totalDays').value),
      initialMembershipLeverage: Number(this.form.get('initialMembershipLeverage').value),
      percentRewards: Number(this.form.get('percentRewards').value),
      decimalRewards: Number(this.form.get('percentRewards').value) / 100,
      minimumBalanceRebuy: Number(this.form.get('minimumBalanceRebuy').value)
    }

    this.membershipService
    .updateMemberShipsHyperfund(data, idMembership)
    .pipe(
      finalize(() => {
        this.isEdit = false
      })
    )
    .subscribe((resp: any) => {
      this.toastService.success('successfully updated');
    }, (error: any)=> {
      this.toastService.error('A problem has occurred');
    });
  }

  /**
  * set value membership selected to form
  * @autor mjuez
  * @return void
  */
  public editMembership(event: Event, indexElement?: number, idMembership?: any): void{

    this.form.get('name').setValidators([Validators.required, validatorNameDuplicate(this.listMemberShips, indexElement)]);

    this.indexMembershipSelected = indexElement;
    this.isEdit = true;

    const target = (event.target as HTMLInputElement);
    const membership: Hyperfund.Membership = this.listMemberShips[indexElement];

    this.form.get('name').setValue(membership?.name);
    this.form.get('initialMembershipLeverage').setValue(membership?.initialMembershipLeverage);
    this.form.get('percentRewards').setValue(membership?.percentRewards);
    this.form.get('minimumBalanceRebuy').setValue(membership?.minimumBalanceRebuy);
    this.form.get('totalDays').setValue(membership?.totalDays);
  }

  public getMessageValidationFieldForm(control: FormControl | AbstractControl): string | any {

    const messagesValidation = {
      required: 'The field is required',
      nameExist: 'the name membership already exist',
      max: 'max',
      min: (valueMin: any)=>`The value cannot be less than ${valueMin}`,
    };

    for (const nameValidation of Object.keys(messagesValidation)){
      if (control.hasError(nameValidation)) {
          if (typeof(messagesValidation[nameValidation]) === 'function' ){
              const paramValidation = control.getError(nameValidation)[nameValidation];
              return messagesValidation[nameValidation](paramValidation)
          }
          return messagesValidation[nameValidation]
      }
    }
    return null;
  }

  /**
  * get list memberships
  * @autor mjuez
  * @return void
  */

  private getListMemberships (): void {

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
      percentRewards: ['', [Validators.required, Validators.min(0.1)]],
      minimumBalanceRebuy: ['', [Validators.required]],
      totalDays: ['', [Validators.required]],
    },{});
  }
}


export const validatorNameDuplicate = (listMemberships?: any[], discardIndex = -1): ValidatorFn => {


  return (control: AbstractControl): {[key: string]: any} => {

      let isDuplicate = false;
      for (const [index, value] of listMemberships.entries()){
        if ( value['name'] === control.value && index !== discardIndex ) {
            isDuplicate = true
        }

       else if ( value['name'] === control.value && discardIndex === -1 ) {
            isDuplicate = true
        }
      }
      return (isDuplicate) ? { nameExist: true } : null; 
    };
}



