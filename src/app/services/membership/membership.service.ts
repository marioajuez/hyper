// angular
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// rxjs
import { Observable, of} from 'rxjs';
import { map, switchMap} from 'rxjs/operators';
// firebase angular
import { AngularFirestore, Query } from '@angular/fire/firestore';
// models
import { Hyperfund } from 'src/app/models/membership.model';


@Injectable({
  providedIn: 'root',
})
export class MembershipService {
  private idMembership = 0;

  constructor(
    private httpClient: HttpClient,
    private angularFirestore: AngularFirestore
  ) {}

  /**
  * get list of all memberships (hyperfund) registered in firebase
  * @return Observable<any> 
  */

  public getAllMemberShipsFirebase(): Observable<any> {

    return this.angularFirestore.collection('memberships').valueChanges()
      .pipe(
        map((memberships: Hyperfund.Membership[]) => {

          /** 
           * take the id with the largest number of registered memberships in firebase. 
           * In order to assign consecutively the ids (id_autoincrement) for new memberships.
          */

          // the registered membership ids are extracted
          const idAutoMemberships = memberships.map( membership => membership.id_au);
          //the largest id (id_autoincrement) is obtained and the value is prevented from remaining as infinite
          this.idMembership = ( memberships.length === 0 ) ? 0 : Math.max(...idAutoMemberships);
          this.idMembership++;
          // The update date memberships are ordered from the most recent to the oldest
          return memberships.sort(
            (current, next) => 
              current.dateUpdate - next.dateUpdate
            ).reverse();
        })
      ) as Observable<any>;
  }

  /**
  * create a membership in the database (firebase)
  * @param data: Hyperfund.Membership
  * @return Observable<any>
  */

  public createMemberShipsFirebase(
    data: Hyperfund.Membership
  ): Observable<any> {

    const id_auto = this.angularFirestore.createId();
    const membership: Hyperfund.Membership = {
      id_document: id_auto,
      id_au: data.id_au,
      name: data.name,
      totalDays: data.totalDays,
      initialMembershipLeverage: data.initialMembershipLeverage,
      percentRewards: data.percentRewards,
      decimalRewards: data.decimalRewards,
      minimumBalanceRebuy: data.minimumBalanceRebuy,
      state: data.state,
      date: data.date,
      dateUpdate: data.dateUpdate
    };

    return of(
      this.angularFirestore.collection('memberships').doc(id_auto).set(membership)
    ) as Observable<any>;
  }

  /**
   * delete a membership in the database (firebase)
   * @param id: any
   * @return Observable<any>
   */

  public deleteMemberShipsFirebase(id: any): Observable<any> {
    return of(
      this.angularFirestore.collection('memberships').doc(String(id)).delete()
    ) as Observable<any>;
  }

  /**
  * update a membership registered in the database (firebase)
  * @param dataMembership: Hyperfund.Membership
  * @param idMembership: any
  * @return Observable<any>
  */

  public updateMemberShipsFirebase(
    dataMembership: Hyperfund.Membership,
    idMembership: any
  ): Observable<any> {

    const data: Hyperfund.Membership = {
      name: dataMembership.name,
      totalDays: dataMembership.totalDays,
      initialMembershipLeverage: dataMembership.initialMembershipLeverage,
      percentRewards: dataMembership.percentRewards,
      decimalRewards: dataMembership.decimalRewards,
      minimumBalanceRebuy: dataMembership.minimumBalanceRebuy
    }

    return of(
      this.angularFirestore.collection('memberships').doc(String(idMembership)).update(data)
    ) as Observable<any>;
  }

  /**
   * update the status of a membership list (hyperfund) in firebase
   * @param listMemberships: Hyperfund.Membership[] 
   * @returns Observable<any>
   */

  public updateStateListMembershipsFirebase(
    listMemberships: Hyperfund.Membership[]
  ): Observable<any> {

    const collectionRef = this.angularFirestore.collection('memberships');
    const batch = this.angularFirestore.firestore.batch();

    listMemberships.forEach((membership: Hyperfund.Membership) => {
      batch.set(collectionRef.doc(membership.id_document).ref, membership);
    })

    return of(batch.commit());
  }

  /**
   *  get a list of all active memberships (hyperfund)
   *  @returns Observable<any>
   */

  public getMemberShipsEnables(): Observable<any> {

    return of(this.angularFirestore.collection("memberships").ref.where('state', '==', true))
      .pipe(
        switchMap((query: Query) => {
          return new Observable(subscriber => {
            query.onSnapshot({
              next(snapshot) {
                const data = snapshot.docs.map((change) => change.data());
                subscriber.next(data);
              }
            })
          })
        }),
      )
  }

  get idAutoIncrementMembership() {
    return this.idMembership;
  }

  // de aqui para abaja revisar que se pueda usar, de lo contrario eliminar

  public getMemberShipsHyperfund(): Observable<Hyperfund.Memberships> {
    return this.httpClient.get('./assets/memberships.json').pipe() as Observable<Hyperfund.Memberships>;
  }


}
