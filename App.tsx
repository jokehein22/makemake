
import React, { useState, useEffect, useCallback } from 'react';
// FIX: Use Firebase v9 compat imports to support the v8 namespaced API, which resolves numerous type errors.
import firebase from 'firebase/compat/app';
import 'firebase/compat/database';
import type { UserData, Transaction, Offer } from './types';
import { firebaseConfig, CONFIG } from './constants';
import { initUser, addTransaction, updateOfferStatus } from './services/firebaseService';
import { initializeMonetage, showRewardedAd } from './services/monetageService';
import Header from './components/Header';
import BalanceCard from './components/BalanceCard';
import OffersCard from './components/OffersCard';
import ActivityCard from './components/ActivityCard';
import HowItWorksCard from './components/HowItWorksCard';
import ReferralCard from './components/ReferralCard';

const App: React.FC = () => {
    const [user, setUser] = useState<UserData | null>(null);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [tg, setTg] = useState<any>(null);

    useEffect(() => {
        const telegram = (window as any).Telegram?.WebApp;
        if (telegram) {
            telegram.ready();
            telegram.expand();
            setTg(telegram);
        }

        let userData: { id: string; username: string; } | null = null;
        let startParam: string | null = null;

        if (telegram?.initDataUnsafe?.user) {
            const tgUser = telegram.initDataUnsafe.user;
            userData = {
                id: tgUser.id.toString(),
                username: tgUser.username || tgUser.first_name || 'User',
            };
            startParam = telegram.initDataUnsafe.start_param;
        } else {
            const testId = localStorage.getItem('makebanks_test_id') || `test_${Date.now()}`;
            localStorage.setItem('makebanks_test_id', testId);
            userData = {
                id: testId,
                username: 'TestUser',
            };
            console.warn("Running in test mode. Telegram data not found.");
        }

        if (!userData) {
            setError("Could not identify user.");
            setLoading(false);
            return;
        }

        const { id: userId, username } = userData;
        
        try {
            // FIX: Use Firebase v8 initialization.
            if (!firebase.apps.length) {
                firebase.initializeApp(firebaseConfig);
            }
            const db = firebase.database();
            
            initUser(db, userId, username, startParam || null).then(() => {
                initializeMonetage(userId); // Initialize the ad SDK
            }).catch(e => {
                console.error("Firebase init error:", e);
                setError("Could not connect to the database.");
                setLoading(false);
            });

            // FIX: Use Firebase v8 `ref()` to create a reference.
            const userRef = db.ref(`users/${userId}`);
            const transactionsRef = db.ref(`users/${userId}/transactions`);

            // FIX: Use Firebase v8 `on()` to listen for data changes.
            const onUserValue = (snapshot: firebase.database.DataSnapshot) => {
                const data = snapshot.val();
                if (data) {
                    setUser({
                        id: userId,
                        username: data.username,
                        balance: data.points_balance || 0,
                        offers: data.offers || {},
                    });
                }
                setLoading(false);
            };

            const onTransactionsValue = (snapshot: firebase.database.DataSnapshot) => {
                if (snapshot.exists()) {
                    const txs: Transaction[] = [];
                    snapshot.forEach(child => {
                        txs.push({ id: child.key!, ...child.val() });
                    });
                    setTransactions(txs.sort((a, b) => b.timestamp - a.timestamp));
                }
            };

            userRef.on('value', onUserValue);
            transactionsRef.on('value', onTransactionsValue);

            // FIX: Add cleanup function to remove listeners on unmount.
            return () => {
                userRef.off('value', onUserValue);
                transactionsRef.off('value', onTransactionsValue);
            };

        } catch (e) {
            console.error("Firebase setup error:", e);
            setError("An error occurred while setting up the application.");
            setLoading(false);
        }
    }, []);

    const handleWithdraw = useCallback(async () => {
        if (!user || !tg) return;
        if (user.balance < CONFIG.minWithdrawal) {
            tg.showAlert(`You need at least ${CONFIG.minWithdrawal} points to withdraw.`);
            return;
        }

        tg.showConfirm(`Withdraw ${CONFIG.minWithdrawal} points ($${(CONFIG.minWithdrawal / CONFIG.pointsPerDollar).toFixed(2)})? Your request will be processed by the bot admin.`, async (confirmed: boolean) => {
            if (confirmed) {
                try {
                    // FIX: Use Firebase v8 `firebase.database()` to get database instance.
                    const db = firebase.database();
                    await addTransaction(db, user.id, user.username, -CONFIG.minWithdrawal, 'Withdrawal Request', 'spend');
                    tg.HapticFeedback.notificationOccurred('success');
                    tg.showAlert('Withdrawal requested successfully! Check the bot for updates.');
                } catch (err) {
                    console.error('Withdrawal failed:', err);
                    tg.showAlert('Withdrawal failed. Please try again.');
                }
            }
        });
    }, [user, tg]);
    
    const handleOfferClick = useCallback(async (offer: Offer, status: string) => {
        if (!user || !tg) return;
        // FIX: Use Firebase v8 `firebase.database()` to get database instance.
        const db = firebase.database();

        // Handle in-app ad offers
        if (offer.type === 'ad') {
            try {
                // You can add a loading indicator here
                const rewarded = await showRewardedAd();
                if (rewarded) {
                    await addTransaction(db, user.id, user.username, offer.reward, offer.title, 'earn');
                    tg.HapticFeedback.notificationOccurred('success');
                    tg.showAlert(`You earned ${offer.reward} points!`);
                } else {
                    tg.showAlert('Ad was closed before completion. No points earned.');
                }
            } catch (e) {
                console.error("Ad error:", e);
                tg.showAlert('Could not load ad. Please try again later.');
            }
            return;
        }
        
        // Handle standard CPA offers
        if (status === 'completed') return;

        if (status === 'pending') {
            tg.showConfirm(`Claim ${offer.reward} points reward for "${offer.title}"?`, async (confirmed: boolean) => {
                 if (confirmed) {
                    try {
                        await addTransaction(db, user.id, user.username, offer.reward, `CPA Offer: ${offer.title}`, 'earn');
                        await updateOfferStatus(db, user.id, offer.id, 'completed');
                        tg.HapticFeedback.notificationOccurred('success');
                    } catch (err) {
                        console.error('Claim failed:', err);
                        tg.showAlert('Failed to claim reward. Please try again.');
                    }
                 }
            });
            return;
        }

        const offerUrl = `${offer.url}${user.id}`;
        tg.openLink(offerUrl);

        setTimeout(async () => {
            try {
                await updateOfferStatus(db, user.id, offer.id, 'pending');
                tg.HapticFeedback.impactOccurred('medium');
            } catch (err) {
                console.error('Update failed:', err);
            }
        }, 2000);

    }, [user, tg]);


    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-slate-400">
                <div className="w-10 h-10 border-4 border-slate-700 border-t-green-500 rounded-full animate-spin"></div>
                <p className="mt-4 text-lg">Connecting to MakeBanks...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-red-900/20 text-red-300 p-4 text-center">
                <p>Error: {error}</p>
            </div>
        );
    }
    
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-slate-200 font-sans">
            <Header username={user?.username} />
            <main className="max-w-md mx-auto p-4 pb-20">
                {user && (
                    <>
                        <BalanceCard
                            balance={user.balance}
                            onWithdraw={handleWithdraw}
                            onMissionsClick={() => tg?.openTelegramLink(`https://t.me/${CONFIG.botUsername}`)}
                        />
                         <ReferralCard userId={user.id} />
                        <OffersCard offers={user.offers} onOfferClick={handleOfferClick} />
                        <ActivityCard transactions={transactions} />
                        <HowItWorksCard />
                    </>
                )}

                <footer className="text-center py-8 text-xs text-slate-500">
                    🔐 Secure · 🚀 Fast · 💯 Verified<br />
                    MakeBanks © 2025
                </footer>
            </main>
        </div>
    );
};

export default App;
