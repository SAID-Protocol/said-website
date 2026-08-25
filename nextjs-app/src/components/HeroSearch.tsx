'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

/** Registry search for the ink homepage — quiet field, hairline border. */
export default function HeroSearch() {
  const router = useRouter();
  const [query, setQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/agents?search=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className="flex gap-2">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search agents by name, wallet, or skill"
        className="flex-1 min-w-0 px-4 h-12 bg-[#111113] border border-[#212124] rounded-md text-[#EDEDEE] placeholder-[#5A5A60] text-[15px] focus:outline-none focus:border-[#5A5A60]"
      />
      <button
        type="submit"
        className="px-6 h-12 bg-[#EDEDEE] text-[#0A0A0B] rounded-md text-[15px] font-medium hover:bg-white transition-colors cursor-pointer"
      >
        Search
      </button>
    </form>
  );
}
