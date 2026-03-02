'use client';

import { useEffect, useState, useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Pie } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface Feedback {
  score: number;
  comment?: string;
  createdAt: string;
}

interface ReputationAnalyticsProps {
  wallet: string;
  currentScore: number;
  feedbackCount: number;
}

export default function ReputationAnalytics({ wallet, currentScore, feedbackCount }: ReputationAnalyticsProps) {
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeedback();
  }, [wallet]);

  const fetchFeedback = async () => {
    try {
      const res = await fetch(`https://api.saidprotocol.com/api/agents/${wallet}/feedback`);
      if (res.ok) {
        const data = await res.json();
        setFeedback(data.feedback || []);
      }
    } catch (err) {
      console.error('Failed to fetch feedback:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="py-8 text-center text-zinc-400">
        <div className="inline-block w-6 h-6 border-2 border-zinc-600 border-t-white rounded-full animate-spin"></div>
        <p className="mt-2 text-sm">Loading analytics...</p>
      </div>
    );
  }

  if (feedback.length === 0) {
    return null;
  }

  // Calculate sentiment breakdown
  const positive = feedback.filter(f => f.score >= 4).length;
  const neutral = feedback.filter(f => f.score === 3).length;
  const negative = feedback.filter(f => f.score <= 2).length;

  // Calculate 30-day trend (group by day, calculate average)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const recentFeedback = feedback.filter(f => new Date(f.createdAt) >= thirtyDaysAgo);
  
  // Group by day
  const dayMap = new Map<string, number[]>();
  recentFeedback.forEach(f => {
    const date = new Date(f.createdAt).toISOString().split('T')[0];
    if (!dayMap.has(date)) {
      dayMap.set(date, []);
    }
    dayMap.get(date)!.push(f.score);
  });

  // Calculate cumulative average over time
  const sortedDates = Array.from(dayMap.keys()).sort();
  let runningScores: number[] = [];
  const trendData = sortedDates.map(date => {
    runningScores.push(...dayMap.get(date)!);
    const avg = runningScores.reduce((a, b) => a + b, 0) / runningScores.length;
    return {
      date,
      score: Number(avg.toFixed(2))
    };
  });

  // Prepare chart data
  const lineChartData = {
    labels: trendData.map(d => new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })),
    datasets: [
      {
        label: 'Reputation Score',
        data: trendData.map(d => d.score),
        borderColor: 'rgb(249, 158, 11)',
        backgroundColor: 'rgba(249, 158, 11, 0.1)',
        fill: true,
        tension: 0.4,
      }
    ]
  };

  const pieChartData = {
    labels: ['Positive (4-5)', 'Neutral (3)', 'Negative (1-2)'],
    datasets: [
      {
        data: [positive, neutral, negative],
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',
          'rgba(249, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)',
        ],
        borderColor: [
          'rgb(34, 197, 94)',
          'rgb(249, 158, 11)',
          'rgb(239, 68, 68)',
        ],
        borderWidth: 1,
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 5,
        grid: {
          color: 'rgba(255, 255, 255, 0.05)',
        },
        ticks: {
          color: '#71717a',
        }
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#71717a',
        }
      }
    }
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: '#a1a1aa',
          padding: 15,
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
      }
    }
  };

  const percentile = Math.round((positive / feedback.length) * 100);

  return (
    <section className="mb-8">
      <h2 className="text-lg font-semibold mb-4">Reputation Analytics</h2>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl">
          <div className="text-zinc-400 text-xs font-semibold uppercase tracking-wider mb-1">Percentile Rank</div>
          <div className="text-3xl font-bold">{percentile}%</div>
          <div className="text-sm text-zinc-500 mt-1">Top {100 - percentile}% of agents</div>
        </div>
        <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl">
          <div className="text-zinc-400 text-xs font-semibold uppercase tracking-wider mb-1">Total Reviews</div>
          <div className="text-3xl font-bold">{feedbackCount}</div>
          <div className="text-sm text-zinc-500 mt-1">
            <span className="text-green-400">{positive} positive</span>
          </div>
        </div>
        <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl">
          <div className="text-zinc-400 text-xs font-semibold uppercase tracking-wider mb-1">Current Score</div>
          <div className="text-3xl font-bold">{currentScore.toFixed(2)}</div>
          <div className="text-sm text-zinc-500 mt-1">Out of 5.00</div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Trend Chart */}
        {trendData.length > 0 && (
          <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-xl">
            <h3 className="text-sm font-semibold mb-4">30-Day Reputation Trend</h3>
            <div className="h-64">
              <Line data={lineChartData} options={chartOptions} />
            </div>
          </div>
        )}

        {/* Sentiment Breakdown */}
        <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-xl">
          <h3 className="text-sm font-semibold mb-4">Feedback Sentiment</h3>
          <div className="h-64">
            <Pie data={pieChartData} options={pieOptions} />
          </div>
        </div>
      </div>
    </section>
  );
}
