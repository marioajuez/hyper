
// angular 
import { Component, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, NgForm, ValidatorFn, Validators } from '@angular/forms';
// models
import { Hyperfund } from '../models/membership.model';
// services
import { MembershipService } from '../services/membership/membership.service';

@Component({
  selector: 'app-params-calc',
  templateUrl: './params-calc.component.html',
  styleUrls: ['./params-calc.component.scss']
})
export class ParamsCalcComponent implements OnInit {

  @ViewChild('formMembership', { static: true }) formMembership: NgForm ;
  public selectedMembership: string = '';

  public form: FormGroup;
  public listMemberShips = [];
  public isEdit = false;
  private percentRewards: number;
  private indexMembershipSelected: any;

  constructor(
    private fb: FormBuilder,
    private membershipService: MembershipService
  ) {}


  ngOnInit(): void {
    this.createForm();
    this.getListMembershipsFirebase();

    this.form.valueChanges.subscribe ( control  => {
      this.percentRewards = Number(this.form.get('percentRewards').value as number);
      this.percentRewards.toLocaleString();
      console.log(this.percentRewards);
    });
  }

  public cancel(){
    this.isEdit = false;
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

    this.membershipService.getMemberShipsFirebase_().subscribe(
      (memberships)=> {
        console.log(memberships);
        this.listMemberShips =  memberships;
        this.form.setValidators(validatorNameDuplicate(memberships));
        console.log(this.listMemberShips);
      }, error => {
        console.log(error);
      })
  }

  public updateMembershipFirebase(): void {

    const dataMembership = (this.listMemberShips[this.indexMembershipSelected] as Hyperfund.Membership);
    const idMembership = dataMembership.id_document;
    const data: Hyperfund.Membership = {
      name: this.form.get('name').value ,
      totalDays: this.form.get('totalDays').value,
      initialMembershipLeverage: this.form.get('initialMembershipLeverage').value,
      percentRewards: this.form.get('percentRewards').value,
      minimumBalanceRebuy: this.form.get('minimumBalanceRebuy').value,
      // state: 
    }

    console.log(data);

    this.membershipService
    .updateMemberShipsHyperfund(data, idMembership)
    .subscribe((resp: any) => {
      // console.log(re);

      console.log('se modifci correcctamente');
    }, (error: any)=> {});
  }

  /**
  * set value membership selected to form
  * @autor mjuez
  * @return void
  */
  public editMembership(event: Event, indexElement?: number, idMembership?: any): void{

    this.indexMembershipSelected = indexElement;
    this.isEdit = true;
    
    const target = (event.target as HTMLInputElement);
    const membership: Hyperfund.Membership = this.listMemberShips[indexElement];
    const percentRewards = Number(membership?.percentRewards) * 100;

    this.form.get('name').setValue(membership?.name);
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

  private getListMemberships  (): void {

    this.membershipService.getMemberShipsHyperfund()
    .subscribe(
      (resp)=> {
        this.listMemberShips.push(...resp.memberships);
        this.form.setValidators(validatorNameDuplicate(resp.memberships));
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
    return (isDuplicate) ? { nameExist: true } : null; 
  };

}
