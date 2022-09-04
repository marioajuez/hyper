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