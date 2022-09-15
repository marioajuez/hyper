import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { from, Observable, of, Subscriber, Subscription, TeardownLogic } from 'rxjs';
import { finalize, map } from 'rxjs/operators';
import { AngularFirestore, AngularFirestoreCollection, DocumentData, Query, QueryFn, QueryGroupFn, Reference } from '@angular/fire/firestore';
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

      of(this.firestore.collection("memberships").ref.where('state', '==', true))
      .pipe( 
        map((query:Query)=> query),
        map((query:Query)=> {

          query.onSnapshot({
            next: (snapshot) => {
              snapshot.docChanges()

            },
            complete: () => {

            }
          })


      
          return query;



        }


        // let data = []
        // return query.onSnapshot( snapshot => {

        //   return snapshot.docChanges();
        //     // snapshot.docChanges().forEach( change  => {
        //     //     // console.log(change);
        //     //     // data.push(change.doc.data());
        //     // })

        // })
        

      )).subscribe( resp =>{

        console.log(resp);
      })

      // const prueba = this.firestore.collection("memberships").ref.where('state', '==', true) as Query;
      // prueba.onSnapshot({

      // })
      // prueba.
      // prueba.onSnapshot((e)=>{
      //   console.log(e);

      // }


 

      // this.firestore.collection("memberships").ref.orderBy('date','desc').onSnapshot( snapshot =>{

  
      //   // snapshot.docChanges().forEach( change  => {
      //   //   console.log(change.doc.data());
      //   // })
      // })
      //https://googleapis.dev/nodejs/firestore/latest/DocumentReference.html#update
  }

  
  public getMemberShipsHyperfund(): Observable<Hyperfund.Memberships> {
    return this.httpClient.get('./assets/memberships.json').pipe() as Observable<Hyperfund.Memberships>;
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
        decimalRewards: data.decimalRewards,
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

  public updateStateMembership ( dataMembership: Hyperfund.Membership, idMembership: any ): Observable<any> {
    
    const data: Hyperfund.Membership | any = {
      state:  dataMembership.state,
      dateUpdate: dataMembership.dateUpdate,
    }

    return of(this.firestore.collection('memberships').doc(String(idMembership)).update(data)) as Observable<any>;
  }

  public updateMemberShipsHyperfund(dataMembership: Hyperfund.Membership, idMembership: any ): Observable<any>{

    const data: Hyperfund.Membership = {
      name: dataMembership.name,
      totalDays: dataMembership.totalDays,
      initialMembershipLeverage: dataMembership.initialMembershipLeverage,
      percentRewards: dataMembership.percentRewards,
      decimalRewards: dataMembership.decimalRewards,
      minimumBalanceRebuy: dataMembership.minimumBalanceRebuy
    }

    return of(this.firestore.collection('memberships').doc(String(idMembership)).update(data)) as Observable<any>;
  }

  public getMemberShipsEnables() : Observable<any> {


    // return of(this.firestore.collection("memberships").ref.where('state', '==', true).onSnapshot)


    // return of(this.firestore.collection("memberships")
    //   .ref.where('state', '==', true)
    //   // .onSnapshot( snapshot =>{
    //   //       snapshot.docChanges().forEach( change  => {
    //   //       console.log(change.doc.data());
    //   //   })
    // }))


    return new Observable();
  }

  get idAutoIncrementMembership(){
    return this.idMembership;
  }
}
