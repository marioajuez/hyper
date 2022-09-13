
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
  private percentRewards: number;
  private indexMembershipSelected: any;

  constructor(
    private fb: FormBuilder,
    private membershipService: MembershipService,
    private changeDetectorRef: ChangeDetectorRef,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.createForm();
    this.getListMembershipsFirebase();

    this.form.valueChanges.subscribe ( control  => {
      // this.percentRewards = 0
      this.percentRewards = Number(Number(this.form.get('percentRewards').value).toLocaleString());
      // console.log( this.percentRewards);
    });
  }

  public cancel(){
    this.isEdit = false;
    this.form.get('name').setValidators([Validators.required, validatorNameDuplicate(this.listMemberShips) ]);
    this.form.reset();
  }

  public createMembership(): void {

    this.isEdit = false;
    const dateTimeNow =  new Date().getTime();

    const membership: Hyperfund.Membership= {
      id_au: this.membershipService.idAutoIncrementMembership,
      name: this.form.get('name').value ,
      totalDays :this.form.get('totalDays').value,
      initialMembershipLeverage: this.form.get('initialMembershipLeverage').value,
      percentRewards: this.form.get('percentRewards').value,
      minimumBalanceRebuy: this.form.get('minimumBalanceRebuy').value,
      state: true,
      date: dateTimeNow,
      dateUpdate: dateTimeNow
    }

    this.membershipService
    .createMemberShipsFirebase(membership)
    .subscribe( resp => {

      this.form.reset();
      this.toastService.success('Se creo con exito');
      console.log(resp,'Se creo con exito');
    }, 
    error => {
       console.log(error, 'Ah ocurrido un problema');
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
      console.log("Se elimino correctamente");
    }, error => {
      console.log(" ha ocurrido un problema");
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
        console.log(error);
      })
  }

  /**
  * get list memberships
  * @autor mjuez
  * @return void
  */

  public updateMembershipFirebase(): void {

    const dataMembership = (this.listMemberShips[this.indexMembershipSelected] as Hyperfund.Membership);
    const idMembership = dataMembership.id_document;
    const data: Hyperfund.Membership = {
      name: this.form.get('name').value ,
      totalDays: this.form.get('totalDays').value,
      initialMembershipLeverage: this.form.get('initialMembershipLeverage').value,
      percentRewards: String(this.percentRewards),
      minimumBalanceRebuy: this.form.get('minimumBalanceRebuy').value,
      // state: 
    }

    this.membershipService
    .updateMemberShipsHyperfund(data, idMembership)
    .pipe(
      finalize(() => {
        this.isEdit = false
      })
    )
    .subscribe((resp: any) => {
      console.log('se modifci correcctamente');
      
    }, (error: any)=> {
      
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

    this.form.valueChanges.subscribe( data => {
      // console.log(this.form);
    })
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



