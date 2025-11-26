
import React from 'react';

interface HeaderProps {
    username?: string;
}

const Header: React.FC<HeaderProps> = ({ username }) => {
    return (
        <header className="bg-slate-950/80 backdrop-blur-lg p-4 border-b border-green-500/20 sticky top-0 z-50 shadow-lg">
            <div className="max-w-md mx-auto flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-400 rounded-lg flex items-center justify-center text-lg">
                        💰
                    </div>
                    <h1 className="text-xl font-extrabold bg-gradient-to-r from-green-500 to-green-400 text-transparent bg-clip-text">
                        MakeBanks
                    </h1>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/10 border border-green-500/30 rounded-full text-xs">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span>{username || 'Loading...'}</span>
                </div>
            </div>
        </header>
    );
};

export default Header;
