
import React from 'react';
import Card from './Card';
import type { UserOffer, Offer } from '../types';
import { cpaOffers } from '../constants';

interface OffersCardProps {
    offers: { [offerId: string]: UserOffer };
    onOfferClick: (offer: Offer, status: string) => void;
}

const OfferItem: React.FC<{ offer: Offer; userOffer?: UserOffer; onClick: () => void; }> = ({ offer, userOffer, onClick }) => {
    const status = userOffer?.status || 'new';
    
    let badge;
    switch(status) {
        case 'completed':
            badge = <span className="px-2 py-1 text-xs font-bold bg-green-500/20 text-green-400 border border-green-500/40 rounded-full">✓ COMPLETED</span>;
            break;
        case 'pending':
            badge = <span className="px-2 py-1 text-xs font-bold bg-orange-500/20 text-orange-400 border border-orange-500/40 rounded-full animate-pulse">⏳ PENDING</span>;
            break;
        default:
            badge = <span className="px-2 py-1 text-xs font-bold bg-blue-500/20 text-blue-400 border border-blue-500/40 rounded-full">NEW</span>;
    }

    return (
        <div 
            className={`bg-slate-800/50 p-4 rounded-xl border border-slate-700 transition-all duration-300 hover:border-green-500 hover:bg-slate-800 hover:-translate-y-1 ${status === 'completed' ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
            onClick={onClick}
        >
            <div className="flex gap-4 mb-4">
                <div className="text-4xl">{offer.icon}</div>
                <div>
                    <h4 className="font-bold text-white">{offer.title}</h4>
                    <p className="text-sm text-slate-400">{offer.description}</p>
                </div>
            </div>
            <div className="flex justify-between items-center mt-4">
                <div className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-slate-900 font-bold rounded-full text-sm">
                    +{offer.reward} pts
                </div>
                {badge}
            </div>
        </div>
    );
}

const OffersCard: React.FC<OffersCardProps> = ({ offers, onOfferClick }) => {
    return (
        <Card icon="🌟" title="Quick Earn Offers">
             <p className="text-sm text-slate-400 mb-4 leading-relaxed">
                Complete these instant tasks for bonus rewards. No game downloads required!
            </p>
            <div className="flex flex-col gap-3">
                {cpaOffers.map(offer => (
                    <OfferItem 
                        key={offer.id} 
                        offer={offer} 
                        userOffer={offers[offer.id]} 
                        onClick={() => onOfferClick(offer, offers[offer.id]?.status || 'new')}
                    />
                ))}
            </div>
        </Card>
    );
};

export default OffersCard;
