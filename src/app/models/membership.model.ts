export declare module Hyperfund {
    export interface Memberships {
      memberships: Membership[];
    }
  
    export interface Membership {
      id?: number;
      id_au?: number;
      date?: any;
      name: string;
      totalDays: string;
      initialMembershipLeverage: string;
      percentRewards: string;
      minimumBalanceRebuy: string;
      state: string | any;
    }
}