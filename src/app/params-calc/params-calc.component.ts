// angular 
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators, FormControl } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { finalize } from 'rxjs/operators';
// material
import { MatCheckboxChange } from '@angular/material/checkbox';
// models
import { Hyperfund } from '../models/membership.model';
// services
import { MembershipService } from '../services/membership/membership.service';
// libraries external
import { ToastService } from 'angular-toastify';


@Component({
  selector: 'app-params-calc',
  templateUrl: './params-calc.component.html',
  styleUrls: ['./params-calc.component.scss']
})
export class ParamsCalcComponent implements OnInit {

  public loadMemberships = new BehaviorSubject<boolean>(true)
  public form: FormGroup;
  public listMemberShips = [];
  public isEdit = false;

  private indexMembershipSelected: any;
  private dateTimeNow: number;

  constructor(
    private fb: FormBuilder,
    private membershipService: MembershipService,
    private toastService: ToastService,
    private changeDetectorRef: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.createForm();
    this.getListMembershipsFirebase();
  }

  /**
  * show again the form de register membership
  * @autor mjuez
  * @return void
  */

  public cancel(){
    this.isEdit = false;
    this.form.get('name').setValidators([Validators.required, validatorNameDuplicate(this.listMemberShips) ]);
    this.form.reset();
  }
 
  /**
  * register membership in the database(firebase)
  * @autor mjuez
  * @return void
  */

  public createMembership(): void {

    this.isEdit = false;

    this.dateTimeNow = new Date().getTime();

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
  * deleted membership selected by user
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
  * get list memberships regitared in the database (firebase)
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


  /**
  * update only the status of the selected membership
  * @return void
  */
  
  public checkedMembership(event: MatCheckboxChange , indexElement?: number): void  {

    this.indexMembershipSelected = indexElement;
    this.dateTimeNow = new Date().getTime();

    const valueCheck = event.checked;
    const membership: Hyperfund.Membership = this.listMemberShips[indexElement];
    membership.state = valueCheck;
    membership.dateUpdate = this.dateTimeNow;
  }

  /**
  * update only the status of the selected membership
  * @return void
  */

  public updateStateMembership(): void {

    const dataMembership = (this.listMemberShips[this.indexMembershipSelected] as Hyperfund.Membership);
    const idMembership = dataMembership.id_document;

    this.membershipService
    .updateStateMembership(dataMembership, idMembership)
    .subscribe((resp: any) => {
      this.form.reset();
      this.toastService.success('successfully updated state');
    }, (error: any)=> {
      this.toastService.error('A problem has occurred');
    });
  }

  /**
  * updates the membership values ​​in the database with 
  * the new values ​​entered by the user
  * @return void
  */

  public updateMembershipFirebase(): void {

    this.dateTimeNow = new Date().getTime();

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
        this.form.reset();
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
  * set the selected membership values ​​for the form and
  * notify the dom (template) to show the buttons for (cancel, update)
  * @param event: Event,
  * @param indexElement?: number,
  * @param idMembership?: any
  * @return void
  */

  public editMembership(event: Event, indexElement?: number, idMembership?: any): void  {

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

  /**
  * returns a validation message according to the field received as a parameter
  * and the specific message is assigned for each 
  * validation registered in the field when activated by the user
  * @param control: FormControl | AbstractControl
  * @param idMembership?: any
  * @return string | any
  */

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
  * build form reactive
  * @return void
  */

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


/**
* validates that the name of a membership already created is not repeated,
* it can also pass to the index to exclude the name of a membership currently 
* this parameter is used for the functionality of editing the membership and finally
* isreactive form in the field to the reactive form said validation for the field 'name'.
* @param listMemberships?: any[] 
* @param discardIndex: number
* @return ValidatorFn
*/

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



