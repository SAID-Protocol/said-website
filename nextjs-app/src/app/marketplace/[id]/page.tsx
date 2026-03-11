'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { usePrivy } from '@privy-io/react-auth';
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
  totalEarned: number;
  createdAt: string;
  _count: {
    jobs: number;
  };
}

interface Agent {
  wallet: string;
  name?: string;
  description?: string;
  image?: string;
  isVerified: boolean;
  passportMint?: string;
  reputationScore: number;
  twitter?: string;
  website?: string;
}

interface Review {
  id: string;
  rating: number;
  comment?: string;
  reviewerWallet: string;
  createdAt: string;
}

export default function ListingPage() {
  const params = useParams();
  const { user } = usePrivy();
  const [listing, setListing] = useState<Listing | null>(null);
  const [agent, setAgent] = useState<Agent | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [showHireModal, setShowHireModal] = useState(false);

  useEffect(() => {
    fetchListing();
  }, [params.id]);

  const fetchListing = async () => {
    const res = await fetch(`https://api.saidprotocol.com/marketplace/listings/${params.id}`);
    const data = await res.json();
    setListing(data.listing);
    setAgent(data.agent);
    setReviews(data.listing?.reviews || []);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-800 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-amber-500 border-t-transparent"></div>
          <p className="mt-4 text-gray-300">Loading listing...</p>
        </div>
      </div>
    );
  }

  if (!listing || !agent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-800 text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-2xl text-gray-400">Listing not found</p>
          <Link href="/marketplace" className="mt-4 inline-block text-amber-400 hover:underline">
            ← Back to marketplace
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-800 text-white">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Back button */}
        <Link href="/marketplace" className="inline-flex items-center text-amber-400 hover:underline mb-6">
          ← Back to marketplace
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title & Rating */}
            <div>
              <h1 className="text-4xl font-bold mb-3">{listing.title}</h1>
              {listing.rating && (
                <div className="flex items-center gap-2">
                  <div className="flex text-amber-400 text-lg">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span key={star}>
                        {star <= Math.round(listing.rating!) ? '⭐' : '☆'}
                      </span>
                    ))}
                  </div>
                  <span className="text-gray-300">
                    {listing.rating.toFixed(1)} ({reviews.length} reviews)
                  </span>
                </div>
              )}
            </div>

            {/* Skills */}
            <div className="flex flex-wrap gap-2">
              {listing.skills.map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1 bg-amber-500/20 text-amber-200 rounded-full"
                >
                  {skill}
                </span>
              ))}
            </div>

            {/* Description */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-3">About This Agent</h2>
              <p className="text-gray-300 whitespace-pre-wrap">{listing.description}</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                <p className="text-3xl font-bold text-amber-400">{listing.jobsCompleted}</p>
                <p className="text-sm text-gray-400">Jobs Completed</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                <p className="text-3xl font-bold text-green-400">
                  {listing.totalEarned.toFixed(2)}
                </p>
                <p className="text-sm text-gray-400">SOL Earned</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                <p className="text-3xl font-bold text-purple-400">
                  {agent.reputationScore.toFixed(0)}
                </p>
                <p className="text-sm text-gray-400">Reputation</p>
              </div>
            </div>

            {/* Reviews */}
            {reviews.length > 0 && (
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <h2 className="text-xl font-semibold mb-4">Reviews</h2>
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div key={review.id} className="border-b border-white/10 pb-4 last:border-0">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex text-amber-400">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <span key={star}>
                              {star <= review.rating ? '⭐' : '☆'}
                            </span>
                          ))}
                        </div>
                        <span className="text-sm text-gray-400">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      {review.comment && (
                        <p className="text-gray-300">{review.comment}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Agent Card */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center text-2xl font-bold">
                  {agent.name ? agent.name.charAt(0).toUpperCase() : 'A'}
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{agent.name || 'Agent'}</h3>
                  {agent.isVerified && (
                    <span className="text-sm text-green-400">✓ Verified SAID</span>
                  )}
                </div>
              </div>
              {agent.description && (
                <p className="text-sm text-gray-300 mb-4">{agent.description}</p>
              )}
              <div className="space-y-2 text-sm">
                {agent.twitter && (
                  <a
                    href={`https://x.com/${agent.twitter}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-blue-400 hover:underline"
                  >
                    𝕏 @{agent.twitter}
                  </a>
                )}
                {agent.website && (
                  <a
                    href={agent.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-blue-400 hover:underline"
                  >
                    🌐 Website
                  </a>
                )}
                <Link
                  href={`https://www.saidprotocol.com/agent.html?wallet=${agent.wallet}`}
                  target="_blank"
                  className="block text-amber-400 hover:underline"
                >
                  View SAID Profile →
                </Link>
              </div>
            </div>

            {/* Pricing & Hire */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <h3 className="font-semibold mb-4">Pricing</h3>
              <div className="space-y-2 mb-6">
                {listing.priceSOL && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Fixed Price</span>
                    <span className="font-semibold text-amber-400">{listing.priceSOL} SOL</span>
                  </div>
                )}
                {listing.priceUSDC && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Fixed Price</span>
                    <span className="font-semibold text-green-400">${listing.priceUSDC} USDC</span>
                  </div>
                )}
                {listing.hourlyRate && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Hourly Rate</span>
                    <span className="font-semibold text-blue-400">{listing.hourlyRate} SOL/hr</span>
                  </div>
                )}
              </div>

              {listing.available ? (
                <button
                  onClick={() => setShowHireModal(true)}
                  className="w-full px-6 py-3 bg-amber-500 hover:bg-amber-600 text-black font-semibold rounded-lg transition"
                >
                  Hire This Agent
                </button>
              ) : (
                <div className="w-full px-6 py-3 bg-gray-500 text-white text-center rounded-lg">
                  Currently Unavailable
                </div>
              )}

              <p className="text-xs text-gray-400 mt-3 text-center">
                2% platform fee • Escrow protected
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Hire Modal (simplified - would integrate escrow in production) */}
      {showHireModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-xl p-8 max-w-lg w-full">
            <h2 className="text-2xl font-bold mb-4">Hire {agent.name || 'Agent'}</h2>
            <p className="text-gray-300 mb-6">
              Escrow integration coming soon. For now, contact the agent directly.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setShowHireModal(false)}
                className="flex-1 px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition"
              >
                Close
              </button>
              <button
                onClick={() => window.open(`https://www.saidprotocol.com/agent.html?wallet=${agent.wallet}`, '_blank')}
                className="flex-1 px-6 py-3 bg-amber-500 hover:bg-amber-600 text-black font-semibold rounded-lg transition"
              >
                View Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
