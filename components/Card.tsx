
import React from 'react';

interface CardProps {
    icon: string;
    title: string;
    children: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ icon, title, children }) => {
    return (
        <div className="bg-slate-950/50 backdrop-blur-xl border border-green-500/10 rounded-2xl p-6 mb-4 shadow-2xl shadow-slate-950/50 transition-all hover:border-green-500/20">
            <div className="flex items-center gap-3 mb-5">
                <span className="text-2xl">{icon}</span>
                <h2 className="text-lg font-bold text-white">{title}</h2>
            </div>
            {children}
        </div>
    );
};

export default Card;
