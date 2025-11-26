
import React from 'react';
import { CONFIG } from '../constants';
import Card from './Card';

interface BalanceCardProps {
    balance: number;
    onWithdraw: () => void;
    onMissionsClick: () => void;
}

const BalanceCard: React.FC<BalanceCardProps> = ({ balance, onWithdraw, onMissionsClick }) => {
    const dollars = (balance / CONFIG.pointsPerDollar).toFixed(2);
    const progress = Math.min(balance / CONFIG.minWithdrawal, 1);
    const canWithdraw = balance >= CONFIG.minWithdrawal;
    const needed = CONFIG.minWithdrawal - balance;

    return (
        <Card icon="💰" title="Your Balance">
            <div className="text-center p-8 bg-gradient-to-br from-green-500/10 to-green-500/5 rounded-xl mb-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-grid-slate-800 [mask-image:linear-gradient(0deg,#fff,rgba(255,255,255,0.6))]"></div>
                 <div className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] bg-[radial-gradient(circle,rgba(34,197,94,0.1)_0%,transparent_70%)] animate-[spin_20s_linear_infinite]"></div>
                <div className="relative z-10">
                    <div className="text-5xl font-black bg-gradient-to-r from-green-400 to-emerald-400 text-transparent bg-clip-text mb-2">
                        {balance} pts
                    </div>
                    <div className="text-lg text-slate-400">${dollars}</div>
                </div>
            </div>

            <div className="mb-4">
                <div className="flex justify-between mb-2 text-sm">
                    <span className="text-slate-400">Withdrawal Progress</span>
                    <span className="font-bold text-green-400">{balance} / {CONFIG.minWithdrawal} pts</span>
                </div>
                <div className="h-3.5 bg-slate-800 rounded-full overflow-hidden border border-green-500/20">
                    <div
                        className="h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-500 ease-out"
                        style={{ width: `${progress * 100}%` }}
                    ></div>
                </div>
            </div>

            <div className={`p-4 rounded-lg flex items-center gap-3 text-sm ${canWithdraw ? 'bg-green-500/15 border border-green-500/40 text-green-400' : 'bg-red-500/10 border border-red-500/30 text-red-400'}`}>
                <span className="text-2xl">{canWithdraw ? '✅' : '🔒'}</span>
                <div>
                    {canWithdraw ? (
                        <strong>Ready to withdraw!</strong>
                    ) : (
                        <span>Earn <strong>{needed} more points</strong> to unlock withdrawals</span>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-5">
                <button onClick={onMissionsClick} className="w-full text-center bg-gradient-to-r from-green-500 to-emerald-500 text-slate-900 font-bold py-3 rounded-full hover:scale-105 transition-transform">
                    🎮 View Missions
                </button>
                <button onClick={onWithdraw} disabled={!canWithdraw} className="w-full text-center bg-green-500/10 border border-green-500/40 text-green-400 font-bold py-3 rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:bg-green-500/20 transition">
                    💸 Withdraw
                </button>
            </div>
             <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-5 text-center text-xs text-slate-400">
                <div className="p-2 bg-slate-800/50 rounded-lg border border-slate-700">💎 100 pts = $1</div>
                <div className="p-2 bg-slate-800/50 rounded-lg border border-slate-700">📊 Min: 900 pts</div>
                <div className="p-2 bg-slate-800/50 rounded-lg border border-slate-700">🎁 Bonus: +100</div>
                <div className="p-2 bg-slate-800/50 rounded-lg border border-slate-700">⚡ Instant</div>
            </div>
        </Card>
    );
};

export default BalanceCard;
