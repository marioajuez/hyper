import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

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

  constructor(private httpClient: HttpClient) {
    // this.getMemberShipsHyperfund();
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
    // memberships.push(membership)
    // localStorage.setItem('memberships', JSON.stringify(memberships));
  }
  
  public getMemberShipsHyperfund(): Observable<Hyperfund.Memberships> {
    return this.httpClient.get('./assets/memberships.json').pipe(
      map((resp: any) => {
        const membershipsSaves = JSON.parse(localStorage.getItem('memberships')) as Array<any> || [];
        const memberships= resp.memberships as Array<any>;

        // let returnMembership = { 
        //   memberships: []
        // }

        // if (memberships.length > membershipsSaves?.length){
        //     returnMembership.memberships = memberships;
        //     localStorage.setItem('memberships', JSON.stringify(returnMembership));
        // }
        // else {
        //   returnMembership.memberships = membershipsSaves;
        //   localStorage.setItem('memberships', JSON.stringify(membershipsSaves));
        // }

        // console.log(resp);
        // console.log(returnMembership);


        return resp;
      })
    ) as Observable<Hyperfund.Memberships>;
  }
}
