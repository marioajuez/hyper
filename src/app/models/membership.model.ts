export declare module Hyperfund {
    export interface Memberships {
      memberships: Membership[];
    }
  
    export interface Membership {
      id?: number;
      id_au?: number;
      id_document?: any;
      date?: any;
      dateUpdate?: any;
      name: string;
      totalDays: string;
      initialMembershipLeverage: string;
      percentRewards: string;
      minimumBalanceRebuy: string;
      state?: boolean;
    }
}