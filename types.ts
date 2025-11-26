
export interface UserData {
    id: string;
    username: string;
    balance: number;
    offers: { [offerId: string]: UserOffer };
    referredBy?: string;
}

export interface UserOffer {
    status: 'new' | 'pending' | 'completed';
    started_at?: number;
    completed_at?: number;
}

export interface Transaction {
    id: string;
    amount: number;
    description: string;
    type: 'earn' | 'spend' | 'bonus' | 'referral';
    timestamp: number;
}

export interface Offer {
    id: string;
    title: string;
    description: string;
    icon: string;
    reward: number;
    url: string;
    type?: 'cpa' | 'ad';
}
