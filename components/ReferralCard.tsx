
import React, { useState } from 'react';
import Card from './Card';
import { CONFIG } from '../constants';

interface ReferralCardProps {
    userId: string;
}

const ReferralCard: React.FC<ReferralCardProps> = ({ userId }) => {
    const [copied, setCopied] = useState(false);
    const referralLink = `https://t.me/${CONFIG.botUsername}?start=${userId}`;

    const handleCopy = () => {
        navigator.clipboard.writeText(referralLink).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
        const tg = (window as any).Telegram?.WebApp;
        if (tg?.HapticFeedback) {
            tg.HapticFeedback.impactOccurred('light');
        }
    };

    return (
        <Card icon="🤝" title="Invite Friends, Earn More">
            <p className="text-sm text-slate-400 mb-4 leading-relaxed">
                Share your link with friends. When they join and earn, you'll get <strong>{CONFIG.referralBonusPercentage * 100}% of their earnings</strong>, forever!
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
                <input
                    type="text"
                    readOnly
                    value={referralLink}
                    className="flex-grow bg-slate-800 border border-slate-700 text-slate-300 text-sm rounded-lg p-3 w-full"
                />
                <button
                    onClick={handleCopy}
                    className="w-full sm:w-auto px-6 py-3 bg-green-500 text-slate-900 font-bold rounded-lg hover:bg-green-400 transition-colors whitespace-nowrap"
                >
                    {copied ? 'Copied!' : 'Copy Link'}
                </button>
            </div>
        </Card>
    );
};

export default ReferralCard;
