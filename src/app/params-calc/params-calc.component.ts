// angular 
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators, FormControl, ValidationErrors } from '@angular/forms';
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
// utilities
import { getUniqueListBy } from '../util/util'

@Component({
  selector: 'app-params-calc',
  templateUrl: './params-calc.component.html',
  styleUrls: ['./params-calc.component.scss'],

})
export class ParamsCalcComponent implements OnInit {

  private indexMembershipSelected: number;
  private dateTimeNow: number;
  public loadMemberships = new BehaviorSubject<boolean>(true);
  public form: FormGroup;
  public listMemberShips: Hyperfund.Membership[] = [];
  public membershipsSelected: Hyperfund.Membership[] = [];
  public formDataEditInitial: any = {};
  public isEdit: boolean = false;

  constructor(
    private fb: FormBuilder,
    private membershipService: MembershipService,
    private toastService: ToastService,
    private changeDetectorRef: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    this.createForm();
    this.getAllMemberShips();
  }

  /**
  * show again the form de register membership
  * @autor mjuez
  * @return void
  */

  public cancel() {
    this.isEdit = false;
    this.form.clearValidators();
    this.form.get('name').setValidators(
      [Validators.required, validatorNameDuplicate(this.listMemberShips)]
    );
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
      .subscribe(resp => {
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
  * @param idMembership: number | string
  * @return void
  */

  public deleteMembership(idMembership: number | string): void {

    this.isEdit = false;
    this.form.reset();
    this.membershipService
      .deleteMemberShipsFirebase(idMembership)
      .subscribe(resp => {
        this.toastService.success('successfully deleted');
      }, error => {
        this.toastService.error('A problem has occurred');
      })
  }

  /**
  * update only the status of the selected membership
  * @param event: MatCheckboxChange,
  * @param indexElement?: number
  * @return void
  */

  public checkedMembership(
    event: MatCheckboxChange,
    indexElement?: number
  ): void {

    this.dateTimeNow = new Date().getTime();

    const valueCheck = event.checked;
    const membership: Hyperfund.Membership = this.listMemberShips[indexElement];
    const membershipCopy: Hyperfund.Membership = { ...membership };

    // memberships are removed, which is assigned the value that it 
    // already has in firebase and the method stops executing
    if (membership.state === valueCheck) {

      const indexDeleteMembership = this.membershipsSelected.findIndex(
        (element) => element.id_document === membershipCopy.id_document
      );
      this.membershipsSelected.splice(indexDeleteMembership, 1);
      return;
    }

    membershipCopy.state = valueCheck;
    membershipCopy.dateUpdate = this.dateTimeNow;
    this.membershipsSelected.push(membershipCopy);
  }

  /**
  * update only the status of the selected membership
  * @return void
  */

  public updateStateListMembership(): void {
    this.membershipService
      .updateStateListMembershipsFirebase(this.membershipsSelected)
      .pipe(
        finalize(() => {
          this.membershipsSelected = [];
        })
      )
      .subscribe((resp) => {
        this.toastService.success('successfully updated state');
      }, error => {
        this.toastService.error('A problem has occurred');
      });
  }

  /**
  * updates the membership values ​​in the database with 
  * the new values ​​entered by the user
  * @return void
  */

  public updateMembership(): void {

    this.dateTimeNow = new Date().getTime();

    const dataMembership = (this.listMemberShips[this.indexMembershipSelected] as Hyperfund.Membership);
    const idMembership = dataMembership.id_document;
    const data: Hyperfund.Membership = {

      dateUpdate: this.dateTimeNow,
      name: this.form.get('name').value,
      totalDays: Number(this.form.get('totalDays').value),
      initialMembershipLeverage: Number(this.form.get('initialMembershipLeverage').value),
      percentRewards: Number(this.form.get('percentRewards').value),
      decimalRewards: Number(this.form.get('percentRewards').value) / 100,
      minimumBalanceRebuy: Number(this.form.get('minimumBalanceRebuy').value)
    }

    this.membershipService
      .updateMemberShipsFirebase(data, idMembership)
      .pipe(
        finalize(() => {
          this.form.clearValidators();
          this.form.get('name').setValidators(
            [Validators.required, validatorNameDuplicate(this.listMemberShips)]
          );
          this.form.reset();
          this.isEdit = false
        })
      )
      .subscribe((resp: any) => {
        this.toastService.success('successfully updated');
      }, (error: any) => {
        this.toastService.error('A problem has occurred');
      });
  }

  /**
  * set the selected membership values ​​for the form and
  * notify the dom (template) to show the buttons for (cancel, update)
  * @param event: Event,
  * @param indexElement?: number,
  * @return void
  */

  public editMembership(
    event: Event,
    indexElement?: number
  ): void {

    this.form.get('name').setValidators(
      [Validators.required, validatorNameDuplicate(this.listMemberShips, indexElement)]
    );

    this.indexMembershipSelected = indexElement;
    this.isEdit = true;

    const target = (event.target as HTMLInputElement);
    const membership: Hyperfund.Membership = this.listMemberShips[indexElement];

    // It is very important!, that the name of the keys 
    //of the object correspond to the keys of the editing form (formGroup))

    const fillFormData = {
      name: String(membership?.name),
      initialMembershipLeverage: Number(membership?.initialMembershipLeverage),
      percentRewards: Number(membership?.percentRewards),
      minimumBalanceRebuy: Number(membership?.minimumBalanceRebuy),
      totalDays: Number(membership?.totalDays)
    }

    this.form.setValidators([validatorChangeFormData(fillFormData)]);

    for (const keyForm of Object.keys(fillFormData)) {
      this.form.get(keyForm).setValue(fillFormData[keyForm]);
    }

  }

  /**
  * returns a validation message according to the field received as a parameter
  * and the specific message is assigned for each 
  * validation registered in the field when activated by the user
  * @param control: FormControl | AbstractControl
  * @param idMembership?: any
  * @return string | any
  */

  public getMessageValidationFieldForm(
    control: FormControl | AbstractControl
  ): string | null {

    const messagesValidation = {
      required: 'The field is required',
      nameExist: 'the name membership already exist',
      max: 'max',
      min: (valueMin: any) => `The value cannot be less than ${valueMin}`,
    };

    for (const nameValidation of Object.keys(messagesValidation)) {
      if (control.hasError(nameValidation)) {
        if (typeof (messagesValidation[nameValidation]) === 'function') {
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
    }, {});
  }

  /**
  * get list memberships registared in the database (firebase)
  * @return void
  */

  private getAllMemberShips(): void {

    this.membershipService
      .getAllMemberShipsFirebase()
      .pipe(finalize(() => { }))
      .subscribe(
        (memberships) => {
          this.loadMemberships.next(false);
          this.listMemberShips = memberships;
          this.form.get('name').setValidators(
            [Validators.required, validatorNameDuplicate(memberships)]
          );
        }, error => {
          this.toastService.error('A problem has occurred');
        })
  }
}

// VALIDATORS
/**
* validates that the name of a membership already created in the database (firebase) is not repeated.
* can also be passed to the index to exclude the name of a membership currently, 
* this parameter is used for membership editing functionality and finally.
* This validation applies only to the "name" field of the reactive form
* @param listMemberships?: Hyperfund.Membership[],
* @param discardIndex = -1
* @return ValidatorFn
*/

export const validatorNameDuplicate = (
  listMemberships?: Hyperfund.Membership[],
  discardIndex = -1
): ValidatorFn => {

  return (
    control: AbstractControl
  ): { [key: string]: boolean | null } => {

    let isDuplicate = false;
    for (const [index, value] of listMemberships.entries()) {
      if (
        value['name'] === control.value &&
        index !== discardIndex
      ) {
        isDuplicate = true;
      }
    }
    return (isDuplicate) ? { nameExist: true } : null;
  };
}

/**
* get changes data membership (firebase)
* @return void
*/
export const validatorChangeFormData = (
  dataInitialFormEdit: any,
): ValidatorFn => {

  return (
    form: FormGroup
  ): ValidationErrors | null => {

    const fieldsForm: string[] = Object.keys(dataInitialFormEdit);
    let notChangedData = true;
    for (const key of fieldsForm) {

      let fieldDataInitial = String(dataInitialFormEdit[key]);
      let controlField = String(form.get(key).value);

      if (fieldDataInitial !== controlField) {
        notChangedData = false;
      }
    }
    return (notChangedData) ? { notChangeData: true } : null;
  };

  // falta revisar esl campo porcentaje y ademas revisar para eliminar validacion
}



