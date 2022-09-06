import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { from, Observable, of } from 'rxjs';
import { finalize, map } from 'rxjs/operators';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import * as firebase from 'firebase';
import { Hyperfund } from 'src/app/models/membership.model';
// import { Firestore, collectionData, collection } from '@angular/fire/firestore';

// declare module Hyperfund {
//   export interface Memberships {
//     memberships: Membership[];
//   }

//   export interface Membership {
//     id: string;
//     name: string;
//     totalDays: string;
//     initialMembershipLeverage: string;
//     percentRewards: string;
//     minimumBalanceRebuy: string;
//   }
// }

@Injectable({
  providedIn: 'root',
})
export class MembershipService {
  private memberships: any;

    items: Observable<any[]>;
    private readonly itemsRef: AngularFirestoreCollection<any>;

  constructor(
    private httpClient: HttpClient, 
    private firestore: AngularFirestore
    ) {

      // firestore.collection('tasks').get().subscribe( (resp)=> {
      //   console.log(resp);
      // });

      // console.log(this.itemsRef);

      // this.items = this.itemsRef.valueChanges().map()
      
      
      // map(snap => snap.docs.map(data => doc.data()));
      // this.items = from(this.itemsRef); // you can also do this with no mapping
 
    

      // firestore.collection('tasks').valueChanges().subscribe( resp => {
      //   console.log(resp);
      // })

      // firestore.collection('tasks').doc('aFhmQh1911OwhSGzMMhd').update(
      //   { title: 'andres', description: 'juez' }
      // )

      // firestore.collection('tasks').get().subscribe( resp => {
      //   console.log(resp);
      // })

      // this.firestore.collection("memberships").get().subscribe((resp) => {
      //   resp.docs.forEach((doc) => {
      //     console.log(doc.data());
      //   })
      // });

      //  this.firestore.collection('tasks').get(
      //   {
         
      //   }
      //  )


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

    const membership: Hyperfund.Membership = {
        // id: "2",
        name: data.name,
        totalDays: data.totalDays,
        initialMembershipLeverage: data.initialMembershipLeverage,
        percentRewards: data.percentRewards,
        minimumBalanceRebuy: data.minimumBalanceRebuy,
        state: '0'
    };

    return of(this.firestore.collection('memberships').add(membership)) as Observable<any> ;
  }

   public getMemberShipsFirebase(): Observable<any>{

      return this.firestore.collection('memberships').valueChanges() as Observable<any>;
  }
}
