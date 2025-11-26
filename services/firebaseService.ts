
// FIX: Use Firebase v9 compat imports to support the v8 namespaced API, which resolves numerous type errors.
import firebase from 'firebase/compat/app';
import 'firebase/compat/database';
import { CONFIG } from '../constants';

// FIX: Use Firebase v8 compatible type for Database.
type Database = firebase.database.Database;

export const initUser = async (db: Database, userId: string, username: string, referrerId: string | null): Promise<void> => {
    // FIX: Use Firebase v8 `ref()` method.
    const userRef = db.ref(`users/${userId}`);
    // FIX: Use Firebase v8 `once('value')` to get data.
    const snapshot = await userRef.once('value');

    if (!snapshot.exists()) {
        const newUser: any = {
            telegram_id: userId,
            username: username,
            points_balance: CONFIG.welcomeBonus,
            // FIX: Use Firebase v8 ServerValue.TIMESTAMP.
            created_at: firebase.database.ServerValue.TIMESTAMP,
            offers: {}
        };
        
        if (referrerId) {
            // Check if referrer exists before adding
            // FIX: Use Firebase v8 `ref()` method.
            const referrerRef = db.ref(`users/${referrerId}`);
            // FIX: Use Firebase v8 `once('value')` to get data.
            const referrerSnapshot = await referrerRef.once('value');
            if (referrerSnapshot.exists()) {
                newUser.referredBy = referrerId;
            }
        }
        
        // FIX: Use Firebase v8 `set()` method on a reference.
        await userRef.set(newUser);
        await addTransaction(db, userId, username, CONFIG.welcomeBonus, '🎉 Welcome to MakeBanks!', 'bonus');
    }
};

export const addTransaction = async (db: Database, userId: string, username: string, amount: number, description: string, type: 'earn' | 'spend' | 'bonus' | 'referral'): Promise<void> => {
    // FIX: Use Firebase v8 `ref()` method.
    const userRef = db.ref(`users/${userId}`);
    // FIX: Use Firebase v8 `ref()` method.
    const txRef = db.ref(`users/${userId}/transactions`);
    // FIX: Use Firebase v8 `push()` method on a reference.
    const newTxKey = txRef.push().key;

    const updates: { [key: string]: any } = {};

    // Use a transaction to safely update the balance
    // FIX: Use Firebase v8 `transaction()` method on a reference.
    await userRef.transaction((currentUserData) => {
        if (currentUserData) {
            currentUserData.points_balance = (currentUserData.points_balance || 0) + amount;
            
            if (!currentUserData.transactions) {
                currentUserData.transactions = {};
            }
            currentUserData.transactions[newTxKey!] = {
                amount: amount,
                description: description,
                type: type,
                // FIX: Use Firebase v8 ServerValue.TIMESTAMP.
                timestamp: firebase.database.ServerValue.TIMESTAMP
            };
        }
        return currentUserData;
    });

    // Handle referral bonus if it's an 'earn' transaction
    if (type === 'earn' && amount > 0) {
        // FIX: Use Firebase v8 `once('value')` to get data.
        const userSnapshot = await userRef.once('value');
        const userData = userSnapshot.val();
        if (userData && userData.referredBy) {
            const referrerId = userData.referredBy;
            const bonusAmount = Math.floor(amount * CONFIG.referralBonusPercentage);
            if (bonusAmount > 0) {
                // IMPORTANT: This logic is client-side for demonstration.
                // In a production app, this MUST be handled server-side (e.g., Firebase Cloud Functions)
                // to prevent manipulation and ensure security.
                await addReferralBonus(db, referrerId, bonusAmount, username);
            }
        }
    }
};

const addReferralBonus = async (db: Database, referrerId: string, bonusAmount: number, referredUsername: string): Promise<void> => {
    // FIX: Use Firebase v8 `ref()` method.
    const referrerRef = db.ref(`users/${referrerId}`);
    // FIX: Use Firebase v8 `ref()` method.
    const referrerTxRef = db.ref(`users/${referrerId}/transactions`);
    // FIX: Use Firebase v8 `push()` method on a reference.
    const newTxKey = referrerTxRef.push().key;
    
    // FIX: Use Firebase v8 `transaction()` method on a reference.
    await referrerRef.transaction((referrerData) => {
        if (referrerData) {
            referrerData.points_balance = (referrerData.points_balance || 0) + bonusAmount;

            if (!referrerData.transactions) {
                referrerData.transactions = {};
            }
            referrerData.transactions[newTxKey!] = {
                amount: bonusAmount,
                description: `Referral bonus from ${referredUsername}`,
                type: 'referral',
                // FIX: Use Firebase v8 ServerValue.TIMESTAMP.
                timestamp: firebase.database.ServerValue.TIMESTAMP
            };
        }
        return referrerData;
    });
}

export const updateOfferStatus = async (db: Database, userId: string, offerId: string, status: 'pending' | 'completed'): Promise<void> => {
    const updates: { [key: string]: any } = {};
    // FIX: Use Firebase v8 ServerValue.TIMESTAMP.
    const timestamp = firebase.database.ServerValue.TIMESTAMP;
    updates[`/users/${userId}/offers/${offerId}/status`] = status;
    if (status === 'pending') {
        updates[`/users/${userId}/offers/${offerId}/started_at`] = timestamp;
    } else if (status === 'completed') {
        updates[`/users/${userId}/offers/${offerId}/completed_at`] = timestamp;
    }
    
    // FIX: Use Firebase v8 `update()` method on a reference.
    await db.ref().update(updates);
};
