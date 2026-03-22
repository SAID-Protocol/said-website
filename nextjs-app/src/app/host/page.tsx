'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { usePrivy } from '@privy-io/react-auth';
import { useWallets, useSignAndSendTransaction } from '@privy-io/react-auth/solana';
import toast from 'react-hot-toast';
import { 
  address, 
  createSolanaRpc,
  pipe,
  createTransactionMessage,
  setTransactionMessageFeePayer,
  setTransactionMessageLifetimeUsingBlockhash,
  appendTransactionMessageInstructions,
  compileTransaction,
  getTransactionEncoder,
} from '@solana/kit';
import { findAssociatedTokenPda, getTransferInstruction, TOKEN_PROGRAM_ADDRESS } from '@solana-program/token';
import HostNavbar from '@/components/HostNavbar';
import HostFooter from '@/components/HostFooter';
import AsciiBackground from '@/components/AsciiBackground';
import StepIndicator from '@/components/host/StepIndicator';
import { api, Agent } from '@/lib/api';
import TemplateCard from '@/components/host/TemplateCard';
import SkillToggleCard from '@/components/host/SkillToggleCard';
import AutonomyCard from '@/components/host/AutonomyCard';
import PlanCard from '@/components/host/PlanCard';
import {
  SearchIcon,
  PencilIcon,
  MessageCircleIcon,
  BarChartIcon,
  CogIcon,
  TrendingUpIcon,
  ShieldIcon,
  TargetIcon,
  EditIcon,
  EyeIcon,
  UsersIcon,
  ZapIcon,
  RocketIcon,
} from '@/components/host/icons';

type Step = 1 | 2 | 3 | 4 | 5;
type AutonomyLevel = 'observer' | 'assistant' | 'autonomous';
type PersonalityPreset = 'professional' | 'casual' | 'research' | 'trading' | 'custom';

const TEMPLATES = [
  { id: 'research', icon: <SearchIcon />, name: 'Research Assistant', description: 'Finds information, summarizes content, answers questions' },
  { id: 'content', icon: <PencilIcon />, name: 'Content Creator', description: 'Drafts posts, writes copy, manages social presence' },
  { id: 'support', icon: <MessageCircleIcon />, name: 'Customer Support', description: 'Answers questions, handles requests, routes issues' },
  { id: 'analyst', icon: <BarChartIcon />, name: 'On-Chain Analyst', description: 'Tracks metrics, sends alerts, monitors on-chain data' },
  { id: 'automator', icon: <CogIcon />, name: 'Task Automator', description: 'Runs recurring workflows, schedules actions' },
  { id: 'defi', icon: <TrendingUpIcon />, name: 'DeFi Monitor', description: 'Tracks LP positions, yield, wallet balances, token prices' },
  { id: 'guardian', icon: <ShieldIcon />, name: 'Wallet Guardian', description: 'Monitors for suspicious transactions, alerts on anomalies' },
  { id: 'custom', icon: <TargetIcon />, name: 'Custom', description: 'Start from scratch — full control' },
];

const PERSONALITY_PRESETS = [
  {
    id: 'professional' as PersonalityPreset,
    name: 'Professional Analyst',
    description: 'Formal, detail-oriented, reactive',
    icon: <BarChartIcon />,
    systemPrompt: 'You are a professional analyst. Be formal, thorough, and detail-oriented. Wait for explicit instructions before taking action.',
  },
  {
    id: 'casual' as PersonalityPreset,
    name: 'Casual Helper',
    description: 'Friendly, concise, proactive',
    icon: <MessageCircleIcon />,
    systemPrompt: 'You are a friendly and casual helper. Keep responses concise but helpful. Proactively suggest relevant actions.',
  },
  {
    id: 'research' as PersonalityPreset,
    name: 'Research Deep-Diver',
    description: 'Thorough, methodical, proactive',
    icon: <SearchIcon />,
    systemPrompt: 'You are a thorough research assistant. Dive deep into topics, provide comprehensive analysis, and proactively explore related areas.',
  },
  {
    id: 'trading' as PersonalityPreset,
    name: 'Trading Executor',
    description: 'Direct, fast, autonomous',
    icon: <TrendingUpIcon />,
    systemPrompt: 'You are a direct trading executor. Act quickly, communicate efficiently, and operate autonomously within defined parameters.',
  },
  {
    id: 'custom' as PersonalityPreset,
    name: 'Custom',
    description: 'Define your own system prompt',
    icon: <CogIcon />,
    systemPrompt: '',
  },
];

const ADVANCED_SKILLS = [
  { id: 'swaps', icon: <EditIcon size={20} />, name: 'Token swaps', description: 'Execute DEX trades', risk: 'red' as const, comingSoon: true },
  { id: 'transfers', icon: <EditIcon size={20} />, name: 'Transfers', description: 'Send tokens', risk: 'red' as const, comingSoon: true },
  { id: 'lp', icon: <EditIcon size={20} />, name: 'LP interactions', description: 'Add/remove liquidity', risk: 'red' as const, comingSoon: true },
];

const USDC_MINT = address('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v');
const TREASURY_WALLET = address('HUpEuDs3FC4T3xMZ3n8EGe16QLJFSnjbd1Kzh6C22YyP');
const RPC_URL = 'https://mainnet.helius-rpc.com/?api-key=be1d86a2-00ff-4405-b693-1399154a5380';

const TIER_PRICES: Record<string, number> = {
  starter: 29,
  pro: 79,
  power: 199,
};

export default function HostAgentPage() {
  const { authenticated, ready, login } = usePrivy();
  const { wallets, ready: walletsReady } = useWallets();
  const { signAndSendTransaction } = useSignAndSendTransaction();
  const router = useRouter();
  const searchParams = useSearchParams();
  const tierFromUrl = searchParams.get('tier') as 'starter' | 'pro' | 'power' | null;
  const [currentStep, setCurrentStep] = useState<Step>(1);
  
  // Step 1: Define Your Agent
  const [customDescription, setCustomDescription] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [agentName, setAgentName] = useState('');
  const [selectedPersonality, setSelectedPersonality] = useState<PersonalityPreset>('casual');
  const [customSystemPrompt, setCustomSystemPrompt] = useState('');
  
  // Step 2: Connect & Configure
  const [telegramBotToken, setTelegramBotToken] = useState('');
  const [autonomyLevel, setAutonomyLevel] = useState<AutonomyLevel>('assistant');
  const [perActionLimit, setPerActionLimit] = useState('1');
  const [dailyLimit, setDailyLimit] = useState('10');
  const [enabledSkills, setEnabledSkills] = useState<Set<string>>(new Set());
  
  // Plan (from URL or step 3 fallback)
  const [selectedPlan, setSelectedPlan] = useState<'free' | 'starter' | 'pro' | 'power' | null>(tierFromUrl);
  const [annualBilling, setAnnualBilling] = useState(false);
  
  // Launch state
  const [isLaunching, setIsLaunching] = useState(false);
  const [launchError, setLaunchError] = useState<string | null>(null);
  const [createdAgent, setCreatedAgent] = useState<Agent | null>(null);
  
  // Payment state
  const [existingAgentCount, setExistingAgentCount] = useState<number | null>(null);
  const [paying, setPaying] = useState(false);
  const requiresPayment = existingAgentCount !== null && existingAgentCount > 0;
  
  // Check existing agents on auth
  useEffect(() => {
    if (authenticated && ready) {
      api.listAgents().then(agents => {
        setExistingAgentCount(agents.length);
      }).catch(() => {
        setExistingAgentCount(0); // Assume new user if API fails
      });
    }
  }, [authenticated, ready]);

  const canContinueStep1 = agentName.trim().length > 0;
  const canContinueStep2 = true; // All fields in step 2 are optional

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    const template = TEMPLATES.find(t => t.id === templateId);
    if (template && template.id !== 'custom') {
      setAgentName(template.name);
    } else {
      setAgentName('');
    }
  };

  const handlePersonalitySelect = (presetId: PersonalityPreset) => {
    setSelectedPersonality(presetId);
    const preset = PERSONALITY_PRESETS.find(p => p.id === presetId);
    if (preset && presetId !== 'custom') {
      setCustomSystemPrompt(preset.systemPrompt);
    }
  };

  const handlePlanSelect = async (plan: 'free' | 'starter' | 'pro' | 'power') => {
    if (!authenticated) {
      login();
      return;
    }
    
    setSelectedPlan(plan);
    setLaunchError(null);
    
    // If user already has agents, collect payment first
    if (requiresPayment && plan !== 'free') {
      setPaying(true);
      setCurrentStep(5);
      
      try {
        const price = TIER_PRICES[plan] || 29;
        await processPayment(price);
        // Immediately switch from "Processing Payment" to "Launching"
        setPaying(false);
        setIsLaunching(true);
        toast.success(`Payment of $${price} confirmed!`);
      } catch (err) {
        setPaying(false);
        const message = err instanceof Error ? err.message : 'Payment failed';
        if (message.includes('User rejected') || message.includes('user rejected')) {
          setLaunchError('Payment cancelled. You need to pay upfront to create additional agents.');
        } else {
          setLaunchError(message);
        }
        return;
      }
    } else {
      // Free trial — go straight to launching
      setIsLaunching(true);
      setCurrentStep(5);
    }
    
    try {
      // Build program.md from wizard config
      const programMd = buildProgramMd();
      
      // Build config object for the API
      const config: Record<string, unknown> = {
        name: agentName.trim(),
        template: selectedTemplate || 'custom',
        personality: selectedPersonality,
        skills: Array.from(enabledSkills),
        autonomy: autonomyLevel,
        tier: plan,
      };
      
      if (telegramBotToken.trim()) {
        config.telegramBotToken = telegramBotToken.trim();
      }
      
      if (autonomyLevel === 'autonomous') {
        config.spendingLimits = {
          perAction: parseFloat(perActionLimit) || 1,
          daily: parseFloat(dailyLimit) || 10,
        };
      }
      
      if (customSystemPrompt.trim()) {
        config.customInstructions = customSystemPrompt.trim();
      }
      
      const agent = await api.createAgent({
        name: agentName.trim(),
        tier: plan,
        program_md: programMd,
        config,
        telegram_token: telegramBotToken.trim() || undefined,
      });
      
      setCreatedAgent(agent);
    } catch (err) {
      setLaunchError(err instanceof Error ? err.message : 'Failed to create agent');
    } finally {
      setIsLaunching(false);
    }
  };
  
  const processPayment = async (amountUsd: number) => {
    const privyWallet = walletsReady ? wallets?.find(w => w.standardWallet?.name === 'Privy') : null;
    if (!privyWallet) {
      throw new Error('Wallet not found. Please refresh and try again.');
    }

    const { getLatestBlockhash } = createSolanaRpc(RPC_URL);
    const { value: latestBlockhash } = await getLatestBlockhash().send();
    
    const userAddress = address(privyWallet.address);
    const usdcAmount = BigInt(Math.floor(amountUsd * 1_000_000)); // USDC has 6 decimals
    
    const [userTokenAccount] = await findAssociatedTokenPda({
      mint: USDC_MINT,
      owner: userAddress,
      tokenProgram: TOKEN_PROGRAM_ADDRESS,
    });
    
    const [treasuryTokenAccount] = await findAssociatedTokenPda({
      mint: USDC_MINT,
      owner: TREASURY_WALLET,
      tokenProgram: TOKEN_PROGRAM_ADDRESS,
    });
    
    const transferInstruction = getTransferInstruction({
      source: userTokenAccount,
      destination: treasuryTokenAccount,
      authority: userAddress,
      amount: usdcAmount,
    });
    
    const transaction = pipe(
      createTransactionMessage({ version: 0 }),
      (tx) => setTransactionMessageFeePayer(userAddress, tx),
      (tx) => setTransactionMessageLifetimeUsingBlockhash(latestBlockhash, tx),
      (tx) => appendTransactionMessageInstructions([transferInstruction], tx),
      (tx) => compileTransaction(tx),
      (tx) => new Uint8Array(getTransactionEncoder().encode(tx))
    );
    
    console.log('[Launch] Processing $' + amountUsd + ' USDC payment');
    
    const result = await signAndSendTransaction({
      transaction,
      wallet: privyWallet,
    });
    
    const signatureStr = Buffer.from(result.signature).toString('base64');
    console.log('[Launch] Payment confirmed:', signatureStr);
    
    // Record payment with backend
    await api.payManually(signatureStr);
  };
  
  const buildProgramMd = (): string => {
    const template = TEMPLATES.find(t => t.id === selectedTemplate);
    const personality = PERSONALITY_PRESETS.find(p => p.id === selectedPersonality);
    
    const lines = [
      `# ${agentName}`,
      '',
      customDescription ? `## Mission\n${customDescription}` : '',
      '',
      template ? `## Template: ${template.name}` : '',
      '',
      personality ? `## Personality: ${personality.name}\n${personality.description}` : '',
      '',
      customSystemPrompt ? `## Custom Instructions\n${customSystemPrompt}` : '',
      '',
      `## Autonomy: ${autonomyLevel}`,
      autonomyLevel === 'autonomous' ? `- Per-action limit: $${perActionLimit}\n- Daily limit: $${dailyLimit}` : '',
      '',
      telegramBotToken ? '## Connections\n- Telegram bot configured' : '',
    ];
    
    return lines.filter(Boolean).join('\n');
  };

  const toggleSkill = (skillId: string, enabled: boolean) => {
    const newSkills = new Set(enabledSkills);
    if (enabled) {
      newSkills.add(skillId);
    } else {
      newSkills.delete(skillId);
    }
    setEnabledSkills(newSkills);
  };

  return (
    <div className="min-h-screen flex flex-col bg-black relative">
      <AsciiBackground />
      <div className="relative z-10 flex flex-col min-h-screen">
        <HostNavbar noCollapse />
        
        <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-8 pt-28 sm:pt-32 pb-12">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2 text-center">Host an Agent</h1>
          <p className="text-zinc-400 mb-8 text-center max-w-2xl mx-auto">
            {selectedPlan ? `${selectedPlan.charAt(0).toUpperCase() + selectedPlan.slice(1)} plan · 3-day free trial` : "We'll build, host, and run your AI agent for you. Just configure and deploy."}
          </p>
          
          {ready && !authenticated ? (
            <div className="text-center py-20">
              <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-6">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-zinc-400">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                </svg>
              </div>
              <h2 className="text-2xl font-bold mb-3">Sign in to get started</h2>
              <p className="text-zinc-400 mb-6">Create an account or log in to deploy your agent.</p>
              <button
                onClick={() => login()}
                className="px-8 py-3 bg-white text-black rounded-lg font-semibold hover:bg-zinc-200 transition"
              >
                Log In / Sign Up
              </button>
            </div>
          ) : (
          <>
          <StepIndicator 
            currentStep={currentStep} 
            steps={['Name', 'Personality', 'Connect', 'Launch']}
          />
          
          {/* Step 1: Name Your Agent */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <label className="block font-medium mb-2">Agent Name *</label>
                <input
                  type="text"
                  value={agentName}
                  onChange={(e) => setAgentName(e.target.value)}
                  placeholder="Give your agent a name..."
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg backdrop-blur-sm focus:outline-none focus:border-zinc-600 text-lg"
                />
              </div>

              <div>
                <h3 className="font-medium mb-2">Or start from a template</h3>
                <p className="text-sm text-zinc-400 mb-4">Pick a template to pre-fill name and personality, or skip and configure manually.</p>
                <div className="grid sm:grid-cols-2 gap-4">
                  {TEMPLATES.map(template => (
                    <TemplateCard
                      key={template.id}
                      icon={template.icon}
                      name={template.name}
                      description={template.description}
                      selected={selectedTemplate === template.id}
                      onClick={() => handleTemplateSelect(template.id)}
                    />
                  ))}
                </div>
              </div>
              
              <div className="flex justify-end pt-4">
                <button
                  onClick={() => setCurrentStep(2)}
                  disabled={!canContinueStep1}
                  className="px-8 py-3 bg-white text-black rounded-lg font-semibold hover:bg-zinc-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continue →
                </button>
              </div>
            </div>
          )}
          
          {/* Step 2: Personality & System Prompt */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="font-medium mb-4">Choose a personality</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  {PERSONALITY_PRESETS.map(preset => (
                    <button
                      key={preset.id}
                      onClick={() => handlePersonalitySelect(preset.id)}
                      className={`
                        p-4 bg-white/5 backdrop-blur-md border rounded-lg text-left transition
                        hover:border-zinc-600/80 hover:bg-zinc-900/40
                        ${selectedPersonality === preset.id ? 'border-white/40 bg-zinc-800/50' : 'border-white/10'}
                      `}
                    >
                      <div className="flex items-start gap-3">
                        <div className="text-zinc-400 mt-1">
                          {preset.icon}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold mb-1">{preset.name}</h4>
                          <p className="text-sm text-zinc-400">{preset.description}</p>
                        </div>
                        {selectedPersonality === preset.id && (
                          <svg className="text-white flex-shrink-0" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="20 6 9 17 4 12"/>
                          </svg>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block font-medium mb-1">System Prompt</label>
                <p className="text-sm text-zinc-400 mb-3">This is your agent&apos;s core mission — it guides every decision. {selectedPersonality !== 'custom' ? 'Pre-filled from your personality choice. Edit freely.' : 'Write your own instructions.'}</p>
                <textarea
                  value={customSystemPrompt}
                  onChange={(e) => setCustomSystemPrompt(e.target.value)}
                  placeholder="You are a helpful assistant that..."
                  rows={5}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg backdrop-blur-sm focus:outline-none focus:border-zinc-600 resize-none font-mono text-sm"
                />
              </div>

              <div className="flex justify-between pt-4">
                <button
                  onClick={() => setCurrentStep(1)}
                  className="px-8 py-3 border border-zinc-700 rounded-lg font-semibold hover:border-zinc-500 transition"
                >
                  ← Back
                </button>
                <button
                  onClick={() => setCurrentStep(3)}
                  className="px-8 py-3 bg-white text-black rounded-lg font-semibold hover:bg-zinc-200 transition"
                >
                  Continue →
                </button>
              </div>
            </div>
          )}
          
          {/* Step 3: Connect Telegram */}
          {currentStep === 3 && (
            <div className="space-y-6 max-w-2xl mx-auto">
              <div className="p-6 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl">
                <h3 className="text-lg font-semibold mb-2">Connect Telegram</h3>
                <p className="text-sm text-zinc-400 mb-4">Give your agent a Telegram bot so you can chat with it directly. This is optional — you can always add it later from the dashboard.</p>
                
                <input
                  type="text"
                  value={telegramBotToken}
                  onChange={(e) => setTelegramBotToken(e.target.value)}
                  placeholder="1234567890:ABCdefGHIjklMNOpqrsTUVwxyz"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg backdrop-blur-sm focus:outline-none focus:border-zinc-600 font-mono text-sm mb-4"
                />

                {/* Inline BotFather Guide */}
                <details className="group">
                  <summary className="cursor-pointer text-sm font-medium text-zinc-400 hover:text-white transition flex items-center gap-2">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="transition group-open:rotate-90">
                      <polyline points="9 18 15 12 9 6"/>
                    </svg>
                    How do I get a Telegram bot token?
                  </summary>
                  <div className="mt-3 p-4 bg-white/[0.03] border border-white/[0.06] rounded-lg space-y-3 text-sm">
                    <div className="flex gap-3">
                      <span className="shrink-0 w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold">1</span>
                      <p className="text-zinc-400">Open Telegram and search for <strong className="text-white">@BotFather</strong></p>
                    </div>
                    <div className="flex gap-3">
                      <span className="shrink-0 w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold">2</span>
                      <p className="text-zinc-400">Send <code className="px-1.5 py-0.5 bg-white/10 rounded text-white">/newbot</code></p>
                    </div>
                    <div className="flex gap-3">
                      <span className="shrink-0 w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold">3</span>
                      <p className="text-zinc-400">Choose a <strong className="text-white">display name</strong> for your bot (e.g. &quot;My SAID Agent&quot;)</p>
                    </div>
                    <div className="flex gap-3">
                      <span className="shrink-0 w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold">4</span>
                      <p className="text-zinc-400">Choose a <strong className="text-white">username</strong> ending in &quot;bot&quot; (e.g. &quot;mysaidagent_bot&quot;)</p>
                    </div>
                    <div className="flex gap-3">
                      <span className="shrink-0 w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold">5</span>
                      <p className="text-zinc-400">BotFather gives you a <strong className="text-white">token</strong> — paste it above</p>
                    </div>
                    <p className="text-zinc-500 text-xs pt-1">Takes about 30 seconds. Your bot will be private to you.</p>
                  </div>
                </details>
              </div>
              
              <div className="flex justify-between pt-4">
                <button
                  onClick={() => setCurrentStep(2)}
                  className="px-8 py-3 border border-zinc-700 rounded-lg font-semibold hover:border-zinc-500 transition"
                >
                  ← Back
                </button>
                <button
                  onClick={() => setCurrentStep(4)}
                  className="px-8 py-3 bg-white text-black rounded-lg font-semibold hover:bg-zinc-200 transition"
                >
                  {telegramBotToken.trim() ? 'Continue →' : 'Skip for now →'}
                </button>
              </div>
            </div>
          )}
          
          {/* Step 4: Review & Launch */}
          {currentStep === 4 && (
            <div className="space-y-6 max-w-2xl mx-auto">
              {selectedPlan ? (
                <>
                  <div className="p-6 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl">
                    <h3 className="text-lg font-semibold mb-4">Review & Launch</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center py-2 border-b border-white/5">
                        <span className="text-zinc-400">Agent Name</span>
                        <span className="font-medium">{agentName}</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-white/5">
                        <span className="text-zinc-400">Personality</span>
                        <span className="font-medium">{PERSONALITY_PRESETS.find(p => p.id === selectedPersonality)?.name}</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-white/5">
                        <span className="text-zinc-400">System Prompt</span>
                        <span className="font-medium text-right max-w-[250px] truncate">{customSystemPrompt ? customSystemPrompt.slice(0, 50) + '...' : 'Default'}</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-white/5">
                        <span className="text-zinc-400">Telegram</span>
                        <span className="font-medium">{telegramBotToken ? '✓ Connected' : 'Not set (can add later)'}</span>
                      </div>
                      <div className="flex justify-between items-center py-2">
                        <span className="text-zinc-400">Plan</span>
                        <span className="font-semibold text-white capitalize">
                          {selectedPlan}
                          {requiresPayment 
                            ? ` · $${TIER_PRICES[selectedPlan || 'starter']}/mo` 
                            : ' · 3-day free trial'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between pt-4">
                    <button
                      onClick={() => setCurrentStep(3)}
                      className="px-8 py-3 border border-zinc-700 rounded-lg font-semibold hover:border-zinc-500 transition"
                    >
                      ← Back
                    </button>
                    <button
                      onClick={() => handlePlanSelect(selectedPlan)}
                      disabled={paying}
                      className="px-8 py-3 bg-white text-black rounded-lg font-semibold hover:bg-zinc-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {paying 
                        ? 'Processing Payment...' 
                        : requiresPayment 
                          ? `💳 Pay $${TIER_PRICES[selectedPlan || 'starter']} & Launch`
                          : '🚀 Launch Agent'}
                    </button>
                  </div>
                </>
              ) : (
                /* Fallback: if no tier in URL, show plan selection */
                <div className="text-center py-12">
                  <p className="text-zinc-400 mb-4">No plan selected. Choose a plan from the pricing page.</p>
                  <a href="/#pricing" className="px-8 py-3 bg-white text-black rounded-lg font-semibold hover:bg-zinc-200 transition inline-block">
                    View Plans
                  </a>
                </div>
              )}
            </div>
          )}
          
          {/* Step 5: Launching / Success */}
          {currentStep === 5 && (
            <div className="max-w-3xl mx-auto">
              {(isLaunching || paying) && (
                <div className="text-center py-20">
                  <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-6 animate-pulse">
                    <RocketIcon size={40} />
                  </div>
                  <h2 className="text-3xl font-bold mb-2">
                    {paying ? 'Processing Payment...' : `Launching ${agentName}...`}
                  </h2>
                  <p className="text-zinc-400 mb-6">
                    {paying 
                      ? 'Please confirm the transaction in your wallet'
                      : 'Creating OpenRouter key → Spinning up infrastructure → Booting agent'}
                  </p>
                  <div className="w-64 h-1 bg-white/10 rounded-full mx-auto overflow-hidden">
                    <div className="h-full bg-white/60 rounded-full animate-[loading_2s_ease-in-out_infinite]" style={{ width: '60%' }} />
                  </div>
                </div>
              )}
              
              {launchError && (
                <div className="text-center py-12">
                  <div className="w-20 h-20 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-6">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-red-400">
                      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                  </div>
                  <h2 className="text-3xl font-bold mb-2">Launch Failed</h2>
                  <p className="text-zinc-400 mb-6">{launchError}</p>
                  <button
                    onClick={() => { setLaunchError(null); setCurrentStep(4); }}
                    className="px-8 py-3 border border-zinc-700 rounded-lg font-semibold hover:border-zinc-500 transition"
                  >
                    ← Try Again
                  </button>
                </div>
              )}
              
              {createdAgent && !isLaunching && !launchError && (
                <>
                  <div className="text-center mb-8">
                    <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
                      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-green-400">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    </div>
                    <h2 className="text-3xl font-bold mb-2">Your Agent is Live!</h2>
                    <p className="text-zinc-400">
                      {agentName} is now running on SAID infrastructure.
                    </p>
                  </div>
                  
                  <div className="p-6 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl mb-6">
                    <div className="flex items-start gap-4 mb-6">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-zinc-700 to-zinc-800 flex items-center justify-center flex-shrink-0">
                        {TEMPLATES.find(t => t.id === selectedTemplate)?.icon || <CogIcon size={32} />}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold mb-1">{createdAgent.name}</h3>
                        <div className="flex flex-wrap gap-2">
                          <div className="px-3 py-1 bg-zinc-800 rounded-full text-xs">
                            <span className="text-zinc-500">ID:</span> <code className="font-mono">{createdAgent.id.slice(0, 8)}...</code>
                          </div>
                          <div className="px-3 py-1 bg-zinc-800 rounded-full text-xs">
                            <span className="text-zinc-500">Tier:</span> {createdAgent.tier}
                          </div>
                          <div className={`px-3 py-1 rounded-full text-xs ${
                            createdAgent.status === 'running' 
                              ? 'bg-green-500/20 border border-green-500/30 text-green-400'
                              : 'bg-yellow-500/20 border border-yellow-500/30 text-yellow-400'
                          }`}>
                            {createdAgent.status === 'running' ? '● Running' : `● ${createdAgent.status}`}
                          </div>
                          {createdAgent.flyAppName && (
                            <div className="px-3 py-1 bg-zinc-800 rounded-full text-xs">
                              <span className="text-zinc-500">Fly:</span> <code className="font-mono">{createdAgent.flyAppName}</code>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/10">
                      <div className="text-center">
                        <div className="text-2xl font-bold">${createdAgent.aiCreditsLimit}</div>
                        <div className="text-xs text-zinc-500">API Credits</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold">${createdAgent.aiCreditsUsed?.toFixed(2) || '0.00'}</div>
                        <div className="text-xs text-zinc-500">Used</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-400">{createdAgent.status}</div>
                        <div className="text-xs text-zinc-500">Status</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid sm:grid-cols-2 gap-3">
                    <button 
                      onClick={() => router.push(`/dashboard?agent=${createdAgent.id}`)}
                      className="px-4 py-3 bg-white text-black rounded-lg text-sm font-semibold hover:bg-zinc-200 transition"
                    >
                      Open Dashboard →
                    </button>
                    <button 
                      onClick={() => router.push('/my-agents')}
                      className="px-4 py-3 border border-zinc-700 rounded-lg text-sm hover:border-zinc-500 transition"
                    >
                      View All Agents
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
          </>
          )}
        </main>

        <HostFooter />
      </div>
    </div>
  );
}
