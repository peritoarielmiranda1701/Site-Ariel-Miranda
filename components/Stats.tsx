import React from 'react';
import { STATS } from '../constants';

interface StatsProps {
  data?: typeof STATS;
}

const Stats: React.FC<StatsProps> = ({ data = STATS }) => {
  return (
    <div className="relative -mt-16 z-20 container mx-auto px-4 sm:px-6">
      <div className="bg-navy-900 rounded shadow-2xl border-b-4 border-gold-500 p-8 md:p-12 reveal">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 divide-y md:divide-y-0 md:divide-x divide-white/10">
          {data.map((stat, index) => (
            <div key={index} className="text-center pt-4 md:pt-0">
              <p className="text-3xl md:text-4xl lg:text-5xl font-heading font-extrabold text-white mb-2">
                {stat.value}
              </p>
              <p className="text-gold-400 uppercase tracking-widest text-[10px] md:text-xs font-bold">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Stats;