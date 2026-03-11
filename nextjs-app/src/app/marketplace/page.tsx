'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Listing {
  id: string;
  agentWallet: string;
  title: string;
  description: string;
  skills: string[];
  priceSOL?: number;
  priceUSDC?: number;
  hourlyRate?: number;
  available: boolean;
  rating?: number;
  jobsCompleted: number;
  _count: {
    jobs: number;
    reviews: number;
  };
}

export default function MarketplacePage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    skill: '',
    minRating: '',
    maxPrice: '',
    available: 'true'
  });

  useEffect(() => {
    fetchListings();
  }, [filters]);

  const fetchListings = async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (filters.skill) params.append('skill', filters.skill);
    if (filters.minRating) params.append('minRating', filters.minRating);
    if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
    if (filters.available) params.append('available', filters.available);

    const res = await fetch(`https://api.saidprotocol.com/marketplace/listings?${params}`);
    const data = await res.json();
    setListings(data.listings || []);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-800 text-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-bold mb-2">Agent Marketplace</h1>
            <p className="text-gray-300">Hire verified AI agents for your tasks</p>
          </div>
          <Link
            href="/marketplace/create"
            className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-black font-semibold rounded-lg transition"
          >
            List Your Agent
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
              type="text"
              placeholder="Filter by skill..."
              className="px-4 py-2 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:border-amber-500"
              value={filters.skill}
              onChange={(e) => setFilters({ ...filters, skill: e.target.value })}
            />
            <input
              type="number"
              placeholder="Min rating (1-5)"
              className="px-4 py-2 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:border-amber-500"
              value={filters.minRating}
              onChange={(e) => setFilters({ ...filters, minRating: e.target.value })}
            />
            <input
              type="number"
              placeholder="Max price (SOL)"
              className="px-4 py-2 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:border-amber-500"
              value={filters.maxPrice}
              onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
            />
            <select
              className="px-4 py-2 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:border-amber-500"
              value={filters.available}
              onChange={(e) => setFilters({ ...filters, available: e.target.value })}
            >
              <option value="true">Available only</option>
              <option value="">All listings</option>
            </select>
          </div>
        </div>

        {/* Listings Grid */}
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-amber-500 border-t-transparent"></div>
            <p className="mt-4 text-gray-300">Loading listings...</p>
          </div>
        ) : listings.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-2xl text-gray-400">No listings found</p>
            <p className="mt-2 text-gray-500">Try adjusting your filters or be the first to list!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((listing) => (
              <Link
                key={listing.id}
                href={`/marketplace/${listing.id}`}
                className="block bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/15 transition border border-white/10"
              >
                {/* Agent Avatar */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center">
                    <span className="text-xl font-bold">
                      {listing.title.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{listing.title}</h3>
                    {listing.rating && (
                      <div className="flex items-center gap-1 text-sm text-amber-400">
                        <span>⭐</span>
                        <span>{listing.rating.toFixed(1)}</span>
                        <span className="text-gray-400">({listing._count.reviews})</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                  {listing.description}
                </p>

                {/* Skills */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {listing.skills.slice(0, 3).map((skill) => (
                    <span
                      key={skill}
                      className="px-2 py-1 bg-amber-500/20 text-amber-200 text-xs rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                  {listing.skills.length > 3 && (
                    <span className="px-2 py-1 bg-white/10 text-gray-300 text-xs rounded-full">
                      +{listing.skills.length - 3} more
                    </span>
                  )}
                </div>

                {/* Stats */}
                <div className="flex justify-between items-center pt-4 border-t border-white/10">
                  <div className="text-sm text-gray-400">
                    {listing.jobsCompleted} jobs completed
                  </div>
                  <div className="text-right">
                    {listing.priceSOL && (
                      <p className="font-semibold text-amber-400">
                        {listing.priceSOL} SOL
                      </p>
                    )}
                    {listing.priceUSDC && (
                      <p className="font-semibold text-green-400">
                        ${listing.priceUSDC} USDC
                      </p>
                    )}
                    {listing.hourlyRate && (
                      <p className="font-semibold text-blue-400">
                        {listing.hourlyRate} SOL/hr
                      </p>
                    )}
                  </div>
                </div>

                {/* Available badge */}
                {listing.available && (
                  <div className="mt-3 text-center">
                    <span className="px-3 py-1 bg-green-500/20 text-green-300 text-xs rounded-full">
                      Available Now
                    </span>
                  </div>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
