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
      totalDays: number;
      initialMembershipLeverage: number;
      percentRewards: number;
      decimalRewards: number;
      minimumBalanceRebuy: number;
      state?: boolean;
    }
}