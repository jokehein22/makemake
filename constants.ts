
import type { Offer } from './types';

export const CONFIG = {
  pointsPerDollar: 100,
  minWithdrawal: 900,
  welcomeBonus: 100,
  adReward: 25,
  referralBonusPercentage: 0.10, // 10%
  botUsername: "makeabanksbot"
};

export const cpaOffers: Offer[] = [
  {
    id: 'monetage_ad_1',
    title: 'Watch & Earn',
    description: 'Watch a short video ad to earn instant points.',
    icon: '🎬',
    reward: CONFIG.adReward,
    url: '#', // Not a real link
    type: 'ad',
  },
  {
    id: 'offer_16024',
    title: 'Win $1,000 Gift Card',
    description: 'Enter your email for a chance to win big prizes!',
    icon: '🎁',
    reward: 50,
    url: 'https://smrturl.co/a/s5b1cc2f405/16024?s1=',
    type: 'cpa',
  },
  {
    id: 'offer_2',
    title: 'Quick Survey - 2 Minutes',
    description: 'Answer 5 simple questions and earn instantly',
    icon: '📋',
    reward: 75,
    url: 'https://your-cpa-link.com?subid=',
    type: 'cpa',
  },
  {
    id: 'offer_4',
    title: 'Install Partner App',
    description: 'Download our partner app and open it once',
    icon: '📱',
    reward: 100,
    url: 'https://your-cpa-link.com?subid=',
    type: 'cpa',
  },
  {
    id: 'offer_5',
    title: 'Free Premium Trial',
    description: 'Start a free trial (cancel anytime, no charges)',
    icon: '⭐',
    reward: 150,
    url: 'https://your-cpa-link.com?subid=',
    type: 'cpa',
  }
];

export const firebaseConfig = {
  apiKey: "AIzaSyB84Ue4s3jfqFPPvzD_x7oOoJY-cCdEKQo",
  authDomain: "makebanks-e4017.firebaseapp.com",
  databaseURL: "https://makebanks-e4017-default-rtdb.firebaseio.com",
  projectId: "makebanks-e4017",
  storageBucket: "makebanks-e4017.firebasestorage.app",
  messagingSenderId: "472261443234",
  appId: "1:472261443234:web:7f754e47f8b2594e0e21fb"
};
