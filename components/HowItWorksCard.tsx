
import React from 'react';
import Card from './Card';

const HowItWorksCard: React.FC = () => {
    const steps = [
        { title: "Complete Offers", description: "Click any quick earn offer above to start earning instantly." },
        { title: "Play Games", description: "Download games via missions in the MakeBanks bot." },
        { title: "Earn Points", description: "Get rewarded automatically when tasks are verified." },
        { title: "Withdraw", description: "Cash out when you reach 900 points ($9)." },
    ];

    return (
        <Card icon="❓" title="How It Works">
            <ol className="space-y-4">
                {steps.map((step, index) => (
                    <li key={index} className="flex items-start gap-4">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center font-bold text-slate-900 shrink-0 mt-1">
                            {index + 1}
                        </div>
                        <div>
                            <h4 className="font-bold text-white">{step.title}</h4>
                            <p className="text-sm text-slate-400">{step.description}</p>
                        </div>
                    </li>
                ))}
            </ol>
        </Card>
    );
};

export default HowItWorksCard;
