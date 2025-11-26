
import React from 'react';
import Card from './Card';
import type { Transaction } from '../types';

interface ActivityCardProps {
    transactions: Transaction[];
}

const TransactionItem: React.FC<{ tx: Transaction }> = ({ tx }) => {
    const isPositive = tx.amount >= 0;
    
    let icon;
    let iconBg;
    switch(tx.type) {
        case 'earn': icon = '💰'; iconBg = 'bg-green-500/20'; break;
        case 'spend': icon = '💸'; iconBg = 'bg-red-500/20'; break;
        case 'bonus': icon = '🎁'; iconBg = 'bg-yellow-500/20'; break;
        case 'referral': icon = '🤝'; iconBg = 'bg-blue-500/20'; break;
        default: icon = '🧾'; iconBg = 'bg-slate-500/20';
    }

    const date = new Date(tx.timestamp).toLocaleDateString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric'
    });

    return (
        <div className="flex items-center gap-4 p-3 bg-slate-800/50 rounded-lg border border-slate-700/50">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl shrink-0 ${iconBg}`}>
                {icon}
            </div>
            <div className="flex-1">
                <p className="font-semibold text-white text-sm">{tx.description}</p>
                <p className="text-xs text-slate-400">{date}</p>
            </div>
            <div className={`font-bold text-sm whitespace-nowrap ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                {isPositive ? '+' : ''}{tx.amount} pts
            </div>
        </div>
    );
}


const ActivityCard: React.FC<ActivityCardProps> = ({ transactions }) => {
    return (
        <Card icon="📜" title="Recent Activity">
            {transactions.length > 0 ? (
                <div className="flex flex-col gap-2 max-h-96 overflow-y-auto pr-2">
                    {transactions.map(tx => <TransactionItem key={tx.id} tx={tx} />)}
                </div>
            ) : (
                <div className="text-center py-10 text-slate-500">
                    <div className="text-5xl mb-4">📭</div>
                    <p>No transactions yet. Start earning!</p>
                </div>
            )}
        </Card>
    );
};

export default ActivityCard;
