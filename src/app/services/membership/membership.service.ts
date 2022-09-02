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
    console.log(form);

    const { 
      initialMembershipLeverage,
      minimumBalanceRebuy,
      name,
      percentRewards,
      totalDays} = form;

    const membership = {
      id: '1',
      name: '2',
      totalDays: '3',
      initialMembershipLeverage: '4',
      percentRewards: '',
      minimumBalanceRebuy: '',
    };
    const memberships = JSON.parse(localStorage.getItem('memberships'));
    console.log(memberships);
    // memberships.push({});
  }

  public getMemberShipsHyperfund(): Observable<Hyperfund.Memberships> {
    return this.httpClient.get('./assets/memberships.json').pipe(
      map((resp) => {
        localStorage.setItem('memberships', JSON.stringify(resp));
        return resp;
      })
    ) as Observable<Hyperfund.Memberships>;
  }
}
