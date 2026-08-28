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
      const res = await fetch(`/api/agents/${wallet}/feedback`);
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
      <div className="ra-loading mono">
        <div style={{display:"none"}}></div>
        <p className="ra-loadtext">Loading analytics...</p>
      </div>
    );
  }

  if (feedback.length === 0) {
    return null;
  }

  // Calculate sentiment breakdown (0-100 scale)
  const positive = feedback.filter(f => f.score >= 70).length;
  const neutral = feedback.filter(f => f.score >= 40 && f.score < 70).length;
  const negative = feedback.filter(f => f.score < 40).length;

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
  const runningScores: number[] = [];
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
    labels: ['Positive (70-100)', 'Neutral (40-69)', 'Negative (0-39)'],
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
        max: 100,
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
    <section className="ra">
      <h2 className="ra-h">Reputation Analytics</h2>

      {/* Stats Cards */}
      <div className="ra-tiles">
        <div className="ra-tile">
          <div className="ra-tl mono">Percentile Rank</div>
          <div className="ra-tv">{percentile}%</div>
          <div className="ra-ts">Top {100 - percentile}% of agents</div>
        </div>
        <div className="ra-tile">
          <div className="ra-tl mono">Total Reviews</div>
          <div className="ra-tv">{feedbackCount}</div>
          <div className="ra-ts">
            <span className="ra-up">{positive} positive</span>
          </div>
        </div>
        <div className="ra-tile">
          <div className="ra-tl mono">Current Score</div>
          <div className="ra-tv">{currentScore.toFixed(2)}</div>
          <div className="ra-ts">Out of 100</div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="ra-charts">
        {/* Trend Chart */}
        {trendData.length > 0 && (
          <div className="ra-card">
            <h3 className="ra-ch">30-Day Reputation Trend</h3>
            <div className="h-64">
              <Line data={lineChartData} options={chartOptions} />
            </div>
          </div>
        )}

        {/* Sentiment Breakdown */}
        <div className="ra-card">
          <h3 className="ra-ch">Feedback Sentiment</h3>
          <div className="h-64">
            <Pie data={pieChartData} options={pieOptions} />
          </div>
        </div>
      </div>
      <style>{`
        .said-agent .ra{margin-bottom:8px}
        .said-agent .ra-loading{padding:40px 0;text-align:center;font-size:11px;letter-spacing:.14em;color:var(--faint)}
        .said-agent .ra-loadtext{font-size:11px;letter-spacing:.14em}
        .said-agent .ra-h{font-size:10.5px;letter-spacing:.16em;color:var(--faint);text-transform:uppercase;margin-bottom:14px}
        .said-agent .ra-tiles{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:20px}
        .said-agent .ra-tile{border:1px solid var(--line);border-radius:14px;padding:16px;background:var(--card)}
        .said-agent .ra-tl{font-size:9.5px;letter-spacing:.14em;color:var(--faint);margin-bottom:6px}
        .said-agent .ra-tv{font-size:24px;font-weight:500;letter-spacing:-.02em}
        .said-agent .ra-ts{margin-top:4px;font-size:12px;color:var(--dim)}
        .said-agent .ra-up{color:var(--good)}
        .said-agent .ra-charts{display:grid;grid-template-columns:1fr 1fr;gap:14px}
        .said-agent .ra-card{border:1px solid var(--line);border-radius:16px;padding:20px;background:var(--card)}
        .said-agent .ra-ch{font-size:10.5px;letter-spacing:.16em;color:var(--faint);text-transform:uppercase;margin-bottom:14px}
        @media (max-width:820px){
          .said-agent .ra-tiles{grid-template-columns:1fr}
          .said-agent .ra-charts{grid-template-columns:1fr}
        }
      `}</style>
    </section>
  );
}
