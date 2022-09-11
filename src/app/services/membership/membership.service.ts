import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { from, Observable, of } from 'rxjs';
import { finalize, map } from 'rxjs/operators';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Hyperfund } from 'src/app/models/membership.model';
// import { Firestore, collectionData, collection } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class MembershipService {
  private memberships: any;

    items: Observable<any[]>;
    private readonly itemsRef: AngularFirestoreCollection<any>;

    private idMembership = 1;

  constructor(
    private httpClient: HttpClient, 
    private firestore: AngularFirestore
    ) {

      const newId =  this.firestore.createId();
      console.log(newId);

      this.firestore.collection('memberships').get().subscribe( snap => {
        console.log(snap.size);
      });
 
      this.firestore.collection("memberships").ref.orderBy('date','desc').onSnapshot( snapshot =>{
        // console.log(snapshot);

        snapshot.docChanges().forEach( change  => {
          console.log(change.doc.data());
        })
      })
      
    
      //https://googleapis.dev/nodejs/firestore/latest/DocumentReference.html#update
 
  }

  public createMemberShipsHyperfund(form): void {
    const { 
      initialMembershipLeverage,
      minimumBalanceRebuy,
      name,
      percentRewards,
      totalDays} = form;
      
    const membership = {
        id: "2",
        name: "membership 3.0",
        totalDays: "1333",
        initialMembershipLeverage: "4",
        percentRewards: "0.003",
        minimumBalanceRebuy: "125"
    };
    const memberships = JSON.parse(localStorage.getItem('memberships'));

    console.log(memberships);
    memberships.push(membership)
    localStorage.setItem('memberships', JSON.stringify(memberships));
  }
  
  public getMemberShipsHyperfund(): Observable<Hyperfund.Memberships> {
    return this.httpClient.get('./assets/memberships.json').pipe(
      map((resp: any) => {
        const membershipsSaves = JSON.parse(localStorage.getItem('memberships')) as Array<any> || [];
        const memberships = resp.memberships

        let retornarMemberships = { memberships: []};
        if (memberships.length > membershipsSaves.length){ 

            retornarMemberships.memberships = memberships;
            localStorage.setItem('memberships', JSON.stringify(memberships));
        }else {
            retornarMemberships.memberships = membershipsSaves;
            localStorage.setItem('memberships', JSON.stringify(membershipsSaves));
        }

        return retornarMemberships;
      })
    ) as Observable<Hyperfund.Memberships>;
  }

  public createMemberShipsFirebase( data: Hyperfund.Membership ): Observable<any>{

    const id_auto = this.firestore.createId();
    const membership: Hyperfund.Membership = {
        id_document: id_auto,
        id_au: data.id_au,
        name: data.name,
        totalDays: data.totalDays,
        initialMembershipLeverage: data.initialMembershipLeverage,
        percentRewards: data.percentRewards,
        minimumBalanceRebuy: data.minimumBalanceRebuy,
        state: data.state,
        date: data.date,
        dateUpdate: data.dateUpdate
    };
    return of(this.firestore.collection('memberships').doc(id_auto).set(membership)) as Observable<any>;
  }

   public getMemberShipsFirebase(): Observable<any>{

      return this.firestore.collection('memberships').valueChanges().pipe( map( (data: any)=>{
        console.log(data);
        return data;
      }) ) as Observable<any>;
  }

  public getMemberShipsFirebase_(): Observable<any>{

    return this.firestore.collection('memberships').valueChanges()
    .pipe( 
        map( (memberships: any[])=>{
          // this.idMembership = changes.length;
          // https://www.anycodings.com/1questions/2549577/mongodb-and-nodejs-insert-id-with-auto-increment
          const sortData = [...memberships.sort( (a,b) => a?.id_au - b?.id_au )].reverse();
          this.idMembership = sortData[sortData.length -1]?.id_au || 0;
          this.idMembership++;
          return sortData;
        })
      ) as Observable<any>;
  }

  public deleteMemberShipsHyperfund(id: any): Observable<any>{
    return of(this.firestore.collection('memberships').doc(String(id)).delete()) as Observable<any>;
  }

  public updateMemberShipsHyperfund(dataMembership: Hyperfund.Membership, idMembership: any ): Observable<any>{

    const data: Hyperfund.Membership = {
      name: dataMembership.name,
      totalDays: dataMembership.totalDays,
      initialMembershipLeverage: dataMembership.initialMembershipLeverage,
      percentRewards: dataMembership.percentRewards,
      minimumBalanceRebuy: dataMembership.minimumBalanceRebuy,
    }

    return of(this.firestore.collection('memberships').doc(String(idMembership)).update(data)) as Observable<any>;
  }

  get idAutoIncrementMembership(){
    return this.idMembership;
  }
}
