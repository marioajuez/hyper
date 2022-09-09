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

    private idMembership = 1;

  constructor(
    private httpClient: HttpClient, 
    private firestore: AngularFirestore
    ) {

      // this.firestore.collection("memberships").

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
      
      // orderBy('desc').onSnapshot( snapshot => {
      //   // console.log(object);

      // //   // 
      // //   console.log(snapshot.docChanges());

      // //   // snapshot.
      // //   // snapshot.docChanges().forEach(change => {
      // //   //     console.log(change);
      // //   //   // if (change.type === "added") {
      // //   //   //   setPalette( prevPalette => ([
      // //   //   //     { id: change.doc.id, ...change.doc.data() },
      // //   //   //     ...prevPalette
      // //   //   //   ]))
      // //   //   // }
      // //   // })

      // // });


      // let documentRef = firestore.doc('tasks/7nleL3BVOlQv1L5gcA0F');

      // documentRef.update({foo: 'bar'}).then(res => {
      //   console.log(`Document updated at ${res}`);
      // });

      // this.firestore
      //   .collection("tasks")
      //   .get()
      //   .pipe( 
          
      //     map( (ss: any) => {

      //       console.log(ss.id);


      //       const docs  =  []

      //       ss.docs.forEach((doc) => {
      //         docs.push(doc.data());
      //       });

      //       console.log(docs);
      //       return ss;

      //     })
          
      //   ).subscribe ( resp => {
      //     console.log(resp);
      //   })


        //https://googleapis.dev/nodejs/firestore/latest/DocumentReference.html#update

        
  
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
        id_au: data.id,
        name: data.name,
        totalDays: data.totalDays,
        initialMembershipLeverage: data.initialMembershipLeverage,
        percentRewards: data.percentRewards,
        minimumBalanceRebuy: data.minimumBalanceRebuy,
        state: data.state,
        date: data.date
    };
    return of(this.firestore.collection('memberships').add(membership)) as Observable<any> ;
  }

   public getMemberShipsFirebase(): Observable<any>{

      return this.firestore.collection('memberships').valueChanges().pipe( map( (data: any)=>{
        console.log(data);
        return data;
      }) ) as Observable<any>;
  }


  public getMemberShipsFirebase_(): Observable<any>{

    return this.firestore.collection("memberships").snapshotChanges()
      .pipe(
        map( (changes: any)=> {
            // this.idMembership = changes.length;
            // https://www.anycodings.com/1questions/2549577/mongodb-and-nodejs-insert-id-with-auto-increment
            const sortChanges = [...changes.sort( (a,b) => a.payload.doc.data().id_au - b.payload.doc.data().id_au )]
            this.idMembership = sortChanges[sortChanges.length -1].payload.doc.data().id_au;
            this.idMembership++;
            return sortChanges;
        }),
        map( (changes: any[]) => {
            const document = changes.map((element, index) => {
                const data = changes[index].payload.doc.data() as any;
                const id = changes[index].payload.doc.id as any;
                return  { id, ...data};
            });
            return document;
        })
    );
  }

  public deleteMemberShipsHyperfund(id: any): Observable<any>{
    return of(this.firestore.collection('memberships').doc(String(id)).delete()) as Observable<any>;
  }

  get idAutoIncrementMembership(){
    return this.idMembership;
  }
}
