import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/firestore';
// import { Firestore, collectionData, collection } from '@angular/fire/firestore';

declare module Hyperfund {
  export interface Memberships {
    memberships: Membership[];
  }

  export interface Membership {
    id: string;
    name: string;
    totalDays: string;
    initialMembershipLeverage: string;
    percentRewards: string;
    minimumBalanceRebuy: string;
  }
}

@Injectable({
  providedIn: 'root',
})
export class MembershipService {
  private memberships: any;

  constructor(
    private httpClient: HttpClient, 
    private firestore: AngularFirestore
    ) {

      // firestore.collection('tasks').valueChanges().subscribe( resp => {
      //   console.log(resp);
      // })

      // firestore.collection('tasks').doc('aFhmQh1911OwhSGzMMhd').update(
      //   { title: 'andres', description: 'juez' }
      // )

      // firestore.collection('tasks').get().subscribe( resp => {
      //   console.log(resp);
      // })

      this.firestore
      .collection("tasks")
      .get()
      .subscribe((ss) => {
        ss.docs.forEach((doc) => {
          console.log(doc.data());
      // this.myArray.push(doc.data());
      });
  });

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
}
