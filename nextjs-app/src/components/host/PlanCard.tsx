'use client';

interface PlanCardProps {
  name: string;
  price: string;
  period: string;
  features: string[];
  highlighted?: boolean;
  onSelect: () => void;
}

export default function PlanCard({ name, price, period, features, highlighted = false, onSelect }: PlanCardProps) {
  return (
    <div className={`
      p-6 bg-white/5 backdrop-blur-md rounded-xl transition relative
      ${highlighted ? 'border-2 border-white/30' : 'border border-white/10'}
    `}>
      {highlighted && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-white text-black rounded-full text-xs font-semibold">
          Most Popular
        </div>
      )}
      
      <h3 className="text-xl font-semibold mb-1">{name}</h3>
      <div className="mb-6">
        <span className="text-4xl font-bold">{price}</span>
        <span className="text-zinc-400">/{period}</span>
      </div>
      
      <ul className="space-y-3 mb-6">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start gap-2 text-sm text-zinc-300">
            <svg className="text-white flex-shrink-0 mt-0.5" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      
      <button
        onClick={onSelect}
        className={`
          w-full py-3 rounded-lg font-semibold transition
          ${highlighted 
            ? 'bg-white text-black hover:bg-zinc-200' 
            : 'border border-zinc-700 hover:border-zinc-500'
          }
        `}
      >
        Subscribe
      </button>
    </div>
  );
}
