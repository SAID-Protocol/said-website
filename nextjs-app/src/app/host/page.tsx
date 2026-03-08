'use client';

import { useState } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AsciiBackground from '@/components/AsciiBackground';
import StepIndicator from '@/components/host/StepIndicator';
import TemplateCard from '@/components/host/TemplateCard';
import PersonalitySlider from '@/components/host/PersonalitySlider';
import SkillToggleCard from '@/components/host/SkillToggleCard';
import AutonomyCard from '@/components/host/AutonomyCard';
import PlanCard from '@/components/host/PlanCard';

type Step = 1 | 2 | 3 | 4;
type AutonomyLevel = 'observer' | 'assistant' | 'autonomous';

const TEMPLATES = [
  { id: 'research', icon: '🔍', name: 'Research Assistant', description: 'Finds information, summarizes content, answers questions' },
  { id: 'content', icon: '📝', name: 'Content Creator', description: 'Drafts posts, writes copy, manages social presence' },
  { id: 'support', icon: '💬', name: 'Customer Support', description: 'Answers questions, handles requests, routes issues' },
  { id: 'analyst', icon: '📊', name: 'On-Chain Analyst', description: 'Tracks metrics, sends alerts, monitors on-chain data' },
  { id: 'automator', icon: '🤖', name: 'Task Automator', description: 'Runs recurring workflows, schedules actions' },
  { id: 'defi', icon: '💹', name: 'DeFi Monitor', description: 'Tracks LP positions, yield, wallet balances, token prices' },
  { id: 'guardian', icon: '🛡️', name: 'Wallet Guardian', description: 'Monitors for suspicious transactions, alerts on anomalies' },
  { id: 'custom', icon: '🎯', name: 'Custom', description: 'Start from scratch — full control' },
];

const SKILLS = {
  knowledge: [
    { id: 'web-search', icon: '🔍', name: 'Web search', description: 'Find information online', risk: 'green' as const },
    { id: 'doc-analysis', icon: '📄', name: 'Document analysis', description: 'Read and analyze files', risk: 'green' as const },
    { id: 'news', icon: '📰', name: 'News monitoring', description: 'Track news and updates', risk: 'green' as const },
  ],
  communication: [
    { id: 'messaging', icon: '💬', name: 'Messaging', description: 'Send messages to users', risk: 'green' as const },
    { id: 'email', icon: '📧', name: 'Email drafts', description: 'Compose email messages', risk: 'green' as const },
    { id: 'telegram', icon: '✈️', name: 'Telegram alerts', description: 'Send Telegram notifications', risk: 'green' as const },
  ],
  social: [
    { id: 'twitter-post', icon: '🐦', name: 'X/Twitter posting', description: 'Publish tweets', risk: 'yellow' as const },
    { id: 'engagement', icon: '👥', name: 'Engagement', description: 'Like, reply, retweet', risk: 'yellow' as const },
    { id: 'scheduling', icon: '📅', name: 'Content scheduling', description: 'Schedule posts', risk: 'yellow' as const },
  ],
  analysis: [
    { id: 'data-tracking', icon: '📊', name: 'Data tracking', description: 'Monitor metrics over time', risk: 'green' as const },
    { id: 'reports', icon: '📈', name: 'Report generation', description: 'Create data reports', risk: 'green' as const },
    { id: 'trends', icon: '📉', name: 'Trend detection', description: 'Identify patterns', risk: 'green' as const },
  ],
  integrations: [
    { id: 'webhooks', icon: '🔗', name: 'Webhooks', description: 'Send webhook requests', risk: 'yellow' as const },
    { id: 'api', icon: '🌐', name: 'API calls', description: 'External API integration', risk: 'yellow' as const },
    { id: 'custom', icon: '⚙️', name: 'Custom connections', description: 'Build custom integrations', risk: 'yellow' as const },
  ],
  'onchain-read': [
    { id: 'wallet-monitor', icon: '👁️', name: 'Wallet monitoring', description: 'Watch wallet activity', risk: 'green' as const },
    { id: 'tx-tracking', icon: '🔄', name: 'Transaction tracking', description: 'Monitor transactions', risk: 'green' as const },
    { id: 'token-data', icon: '🪙', name: 'Token data', description: 'Fetch token prices & info', risk: 'green' as const },
  ],
  'onchain-write': [
    { id: 'swaps', icon: '🔄', name: 'Token swaps', description: 'Execute DEX trades', risk: 'red' as const },
    { id: 'transfers', icon: '💸', name: 'Transfers', description: 'Send tokens', risk: 'red' as const },
    { id: 'lp', icon: '🌊', name: 'LP interactions', description: 'Add/remove liquidity', risk: 'red' as const },
  ],
  'payments-receive': [
    { id: 'x402-receive', icon: '💰', name: 'x402 micropayments receive', description: 'Accept USDC payments', risk: 'green' as const },
  ],
  'payments-send': [
    { id: 'x402-send', icon: '💳', name: 'x402 micropayments send', description: 'Send USDC payments', risk: 'red' as const },
  ],
};

export default function HostAgentPage() {
  const { authenticated, login } = usePrivy();
  const [currentStep, setCurrentStep] = useState<Step>(1);
  
  // Step 1: Template
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [customDescription, setCustomDescription] = useState('');
  
  // Step 2: Configuration
  const [agentName, setAgentName] = useState('');
  const [agentTagline, setAgentTagline] = useState('');
  const [showAdvancedPersonality, setShowAdvancedPersonality] = useState(false);
  const [systemPrompt, setSystemPrompt] = useState('');
  const [commStyle, setCommStyle] = useState(50);
  const [initiative, setInitiative] = useState(50);
  const [detailLevel, setDetailLevel] = useState(50);
  const [enabledSkills, setEnabledSkills] = useState<Set<string>>(new Set());
  const [autonomyLevel, setAutonomyLevel] = useState<AutonomyLevel>('assistant');
  const [perActionLimit, setPerActionLimit] = useState('1');
  const [dailyLimit, setDailyLimit] = useState('10');
  const [modelTier, setModelTier] = useState<'fast' | 'balanced' | 'premium'>('balanced');
  const [showAdvancedModel, setShowAdvancedModel] = useState(false);
  
  // Step 3: Plan
  const [selectedPlan, setSelectedPlan] = useState<'starter' | 'pro' | 'power' | null>(null);
  const [annualBilling, setAnnualBilling] = useState(false);
  
  const canContinueStep1 = selectedTemplate !== null;
  const canContinueStep2 = agentName.trim().length > 0;

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    const template = TEMPLATES.find(t => t.id === templateId);
    if (template && template.id !== 'custom') {
      setAgentName(template.name);
      setAgentTagline(template.description);
      // Pre-enable relevant skills based on template
      const newSkills = new Set<string>();
      if (templateId === 'research') {
        newSkills.add('web-search');
        newSkills.add('doc-analysis');
        newSkills.add('messaging');
      } else if (templateId === 'content') {
        newSkills.add('web-search');
        newSkills.add('twitter-post');
        newSkills.add('scheduling');
      } else if (templateId === 'support') {
        newSkills.add('messaging');
        newSkills.add('email');
        newSkills.add('telegram');
      } else if (templateId === 'analyst') {
        newSkills.add('data-tracking');
        newSkills.add('reports');
        newSkills.add('wallet-monitor');
        newSkills.add('tx-tracking');
        newSkills.add('token-data');
      } else if (templateId === 'automator') {
        newSkills.add('webhooks');
        newSkills.add('api');
        newSkills.add('messaging');
      } else if (templateId === 'defi') {
        newSkills.add('wallet-monitor');
        newSkills.add('token-data');
        newSkills.add('data-tracking');
        newSkills.add('telegram');
      } else if (templateId === 'guardian') {
        newSkills.add('wallet-monitor');
        newSkills.add('tx-tracking');
        newSkills.add('telegram');
      }
      setEnabledSkills(newSkills);
    } else {
      setAgentName('');
      setAgentTagline('');
      setEnabledSkills(new Set());
    }
  };

  const handlePlanSelect = (plan: 'starter' | 'pro' | 'power') => {
    setSelectedPlan(plan);
    // Auto-advance to success page
    setTimeout(() => setCurrentStep(4), 300);
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
        <Navbar />
        
        <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-8 pt-28 sm:pt-32 pb-12">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2 text-center">Host an Agent</h1>
          <p className="text-zinc-400 mb-8 text-center max-w-2xl mx-auto">
            We'll build, host, and run your AI agent for you. Just configure and deploy.
          </p>
          
          <StepIndicator 
            currentStep={currentStep} 
            steps={['Choose Template', 'Configure', 'Choose Plan', 'Launch']}
          />
          
          {/* Step 1: Choose Template */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <label className="block font-medium mb-3">Describe what you want your agent to do</label>
                <textarea
                  value={customDescription}
                  onChange={(e) => setCustomDescription(e.target.value)}
                  placeholder="e.g., Monitor my portfolio and alert me on Telegram when specific conditions are met..."
                  rows={3}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg backdrop-blur-sm focus:outline-none focus:border-zinc-600 resize-none"
                />
              </div>
              
              <div>
                <h3 className="font-medium mb-4">Or choose a template</h3>
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
          
          {/* Step 2: Configure */}
          {currentStep === 2 && (
            <div className="space-y-8">
              {/* Identity */}
              <div className="p-6 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl">
                <h3 className="text-lg font-semibold mb-4">Identity</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block font-medium mb-2 text-sm">Agent Name *</label>
                    <input
                      type="text"
                      value={agentName}
                      onChange={(e) => setAgentName(e.target.value)}
                      placeholder="My Agent"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg backdrop-blur-sm focus:outline-none focus:border-zinc-600"
                    />
                  </div>
                  <div>
                    <label className="block font-medium mb-2 text-sm">Tagline <span className="text-zinc-500 font-normal">(max 120 chars)</span></label>
                    <input
                      type="text"
                      value={agentTagline}
                      onChange={(e) => setAgentTagline(e.target.value.slice(0, 120))}
                      placeholder="A helpful assistant that..."
                      maxLength={120}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg backdrop-blur-sm focus:outline-none focus:border-zinc-600"
                    />
                    <div className="text-xs text-zinc-500 mt-1 text-right">{agentTagline.length}/120</div>
                  </div>
                </div>
              </div>
              
              {/* Personality */}
              <div className="p-6 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl">
                <h3 className="text-lg font-semibold mb-4">Personality</h3>
                <div className="space-y-6">
                  <PersonalitySlider
                    label="Communication Style"
                    leftLabel="Casual"
                    rightLabel="Professional"
                    value={commStyle}
                    onChange={setCommStyle}
                  />
                  <PersonalitySlider
                    label="Initiative"
                    leftLabel="Waits for instructions"
                    rightLabel="Proactively suggests"
                    value={initiative}
                    onChange={setInitiative}
                  />
                  <PersonalitySlider
                    label="Detail Level"
                    leftLabel="Brief & concise"
                    rightLabel="Thorough & detailed"
                    value={detailLevel}
                    onChange={setDetailLevel}
                  />
                  
                  <div className="pt-4 border-t border-white/10">
                    <button
                      onClick={() => setShowAdvancedPersonality(!showAdvancedPersonality)}
                      className="text-sm text-zinc-400 hover:text-white transition flex items-center gap-2"
                    >
                      Advanced
                      <svg 
                        className={`transition-transform ${showAdvancedPersonality ? 'rotate-180' : ''}`}
                        width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                      >
                        <polyline points="6 9 12 15 18 9"/>
                      </svg>
                    </button>
                    {showAdvancedPersonality && (
                      <div className="mt-4">
                        <label className="block font-medium mb-2 text-sm">System Prompt</label>
                        <textarea
                          value={systemPrompt}
                          onChange={(e) => setSystemPrompt(e.target.value)}
                          placeholder="You are a helpful assistant that..."
                          rows={6}
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg backdrop-blur-sm focus:outline-none focus:border-zinc-600 resize-none font-mono text-sm"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Skills */}
              <div className="p-6 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl">
                <h3 className="text-lg font-semibold mb-4">Skills</h3>
                <div className="space-y-6">
                  {Object.entries(SKILLS).map(([category, skills]) => (
                    <div key={category}>
                      <h4 className="text-sm font-medium text-zinc-400 mb-3 uppercase tracking-wide">
                        {category === 'knowledge' && '📚 Knowledge'}
                        {category === 'communication' && '💬 Communication'}
                        {category === 'social' && '📱 Social Media'}
                        {category === 'analysis' && '📊 Analysis'}
                        {category === 'integrations' && '🔗 Integrations'}
                        {category === 'onchain-read' && '⛓️ On-chain Read'}
                        {category === 'onchain-write' && '⛓️ On-chain Write'}
                        {category === 'payments-receive' && '💰 Payments Receive'}
                        {category === 'payments-send' && '💰 Payments Send'}
                      </h4>
                      <div className="grid sm:grid-cols-2 gap-3">
                        {skills.map(skill => (
                          <SkillToggleCard
                            key={skill.id}
                            icon={skill.icon}
                            name={skill.name}
                            description={skill.description}
                            risk={skill.risk}
                            enabled={enabledSkills.has(skill.id)}
                            onToggle={(enabled) => toggleSkill(skill.id, enabled)}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Autonomy */}
              <div className="p-6 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl">
                <h3 className="text-lg font-semibold mb-4">Autonomy Level</h3>
                <div className="space-y-3">
                  <AutonomyCard
                    icon="👀"
                    title="Observer"
                    description="Monitors and responds when asked. Never takes action on its own."
                    value="observer"
                    selected={autonomyLevel === 'observer'}
                    onSelect={() => setAutonomyLevel('observer')}
                  />
                  <AutonomyCard
                    icon="🤝"
                    title="Assistant"
                    description="Researches, drafts, and suggests. Asks before external actions."
                    value="assistant"
                    selected={autonomyLevel === 'assistant'}
                    onSelect={() => setAutonomyLevel('assistant')}
                  />
                  <AutonomyCard
                    icon="⚡"
                    title="Autonomous"
                    description="Acts independently within budget limits."
                    value="autonomous"
                    selected={autonomyLevel === 'autonomous'}
                    onSelect={() => setAutonomyLevel('autonomous')}
                  />
                  
                  {autonomyLevel === 'autonomous' && (
                    <div className="mt-4 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                      <h4 className="font-semibold text-yellow-400 mb-3 flex items-center gap-2">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
                          <line x1="12" y1="9" x2="12" y2="13"/>
                          <line x1="12" y1="17" x2="12.01" y2="17"/>
                        </svg>
                        Spending Limits
                      </h4>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm text-zinc-400 mb-2">Per-action limit (USD)</label>
                          <input
                            type="number"
                            value={perActionLimit}
                            onChange={(e) => setPerActionLimit(e.target.value)}
                            min="0"
                            step="0.01"
                            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg backdrop-blur-sm focus:outline-none focus:border-zinc-600"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-zinc-400 mb-2">Daily limit (USD)</label>
                          <input
                            type="number"
                            value={dailyLimit}
                            onChange={(e) => setDailyLimit(e.target.value)}
                            min="0"
                            step="1"
                            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg backdrop-blur-sm focus:outline-none focus:border-zinc-600"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Model */}
              <div className="p-6 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl">
                <h3 className="text-lg font-semibold mb-4">Model</h3>
                <div className="space-y-3">
                  <button
                    onClick={() => setModelTier('fast')}
                    className={`
                      w-full p-4 bg-white/5 backdrop-blur-md border rounded-lg text-left transition
                      hover:border-zinc-600/80 hover:bg-zinc-900/40
                      ${modelTier === 'fast' ? 'border-white/40 bg-zinc-800/50' : 'border-white/10'}
                    `}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold flex items-center gap-2">
                          ⚡ Fast
                          <span className="text-xs text-zinc-500">1x credits</span>
                        </h4>
                        <p className="text-sm text-zinc-400">Quick responses, lower cost</p>
                      </div>
                      {modelTier === 'fast' && (
                        <svg className="text-white" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                      )}
                    </div>
                  </button>
                  
                  <button
                    onClick={() => setModelTier('balanced')}
                    className={`
                      w-full p-4 bg-white/5 backdrop-blur-md border rounded-lg text-left transition
                      hover:border-zinc-600/80 hover:bg-zinc-900/40
                      ${modelTier === 'balanced' ? 'border-white/40 bg-zinc-800/50' : 'border-white/10'}
                    `}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold flex items-center gap-2">
                          🧠 Balanced
                          <span className="text-xs text-zinc-500">2x credits</span>
                        </h4>
                        <p className="text-sm text-zinc-400">Good reasoning, moderate cost</p>
                      </div>
                      {modelTier === 'balanced' && (
                        <svg className="text-white" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                      )}
                    </div>
                  </button>
                  
                  <button
                    onClick={() => setModelTier('premium')}
                    className={`
                      w-full p-4 bg-white/5 backdrop-blur-md border rounded-lg text-left transition
                      hover:border-zinc-600/80 hover:bg-zinc-900/40
                      ${modelTier === 'premium' ? 'border-white/40 bg-zinc-800/50' : 'border-white/10'}
                    `}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold flex items-center gap-2">
                          🚀 Premium
                          <span className="text-xs text-zinc-500">5x credits</span>
                        </h4>
                        <p className="text-sm text-zinc-400">Best intelligence, highest cost</p>
                      </div>
                      {modelTier === 'premium' && (
                        <svg className="text-white" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                      )}
                    </div>
                  </button>
                </div>
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
                  disabled={!canContinueStep2}
                  className="px-8 py-3 bg-white text-black rounded-lg font-semibold hover:bg-zinc-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continue →
                </button>
              </div>
            </div>
          )}
          
          {/* Step 3: Choose Plan */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="flex justify-center mb-6">
                <div className="inline-flex items-center gap-3 p-1 bg-white/5 rounded-lg">
                  <button
                    onClick={() => setAnnualBilling(false)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition ${!annualBilling ? 'bg-white text-black' : 'text-zinc-400 hover:text-white'}`}
                  >
                    Monthly
                  </button>
                  <button
                    onClick={() => setAnnualBilling(true)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition ${annualBilling ? 'bg-white text-black' : 'text-zinc-400 hover:text-white'}`}
                  >
                    Annual
                    <span className="ml-2 text-xs text-green-400">20% off</span>
                  </button>
                </div>
              </div>
              
              <div className="grid md:grid-cols-3 gap-6">
                <PlanCard
                  name="Starter"
                  price={annualBilling ? '$31' : '$39'}
                  period="mo"
                  features={[
                    'Fast model only',
                    '$5 USDC credits/mo',
                    'SAID identity',
                    'Web chat interface',
                    'Email support',
                  ]}
                  onSelect={() => handlePlanSelect('starter')}
                />
                <PlanCard
                  name="Pro"
                  price={annualBilling ? '$79' : '$99'}
                  period="mo"
                  highlighted
                  features={[
                    'All models',
                    '$25 USDC credits/mo',
                    'SAID + ERC-8004',
                    'Web + Telegram',
                    'Priority support',
                  ]}
                  onSelect={() => handlePlanSelect('pro')}
                />
                <PlanCard
                  name="Power"
                  price={annualBilling ? '$199' : '$249'}
                  period="mo"
                  features={[
                    'Premium priority',
                    '$100 USDC credits/mo',
                    'Full identity suite',
                    'All channels + API',
                    'Dedicated support',
                  ]}
                  onSelect={() => handlePlanSelect('power')}
                />
              </div>
              
              <div className="flex justify-between pt-4">
                <button
                  onClick={() => setCurrentStep(2)}
                  className="px-8 py-3 border border-zinc-700 rounded-lg font-semibold hover:border-zinc-500 transition"
                >
                  ← Back
                </button>
              </div>
            </div>
          )}
          
          {/* Step 4: Success */}
          {currentStep === 4 && (
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-8">
                <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-green-400">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </div>
                <h2 className="text-3xl font-bold mb-2">Your Agent is Live! 🎉</h2>
                <p className="text-zinc-400">
                  {agentName} is now running on SAID infrastructure.
                </p>
              </div>
              
              <div className="p-6 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl mb-6">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-zinc-700 to-zinc-800 flex items-center justify-center text-2xl flex-shrink-0">
                    {TEMPLATES.find(t => t.id === selectedTemplate)?.icon || '🤖'}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-1">{agentName}</h3>
                    <p className="text-zinc-400 text-sm mb-3">{agentTagline}</p>
                    <div className="flex flex-wrap gap-2">
                      <div className="px-3 py-1 bg-zinc-800 rounded-full text-xs">
                        <span className="text-zinc-500">Wallet:</span> <code className="font-mono">So1ana...abc123</code>
                      </div>
                      <div className="px-3 py-1 bg-green-500/20 border border-green-500/30 rounded-full text-xs text-green-400">
                        ✓ Verified
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-6 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl mb-6">
                <h3 className="font-semibold mb-4">Chat with your agent</h3>
                <div className="space-y-3 mb-4">
                  <div className="p-3 bg-zinc-900/50 rounded-lg">
                    <p className="text-sm text-zinc-300">
                      👋 Hi! I'm {agentName}. {agentTagline}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Type a message..."
                    className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-lg backdrop-blur-sm focus:outline-none focus:border-zinc-600"
                  />
                  <button className="px-6 py-3 bg-white text-black rounded-lg font-semibold hover:bg-zinc-200 transition">
                    Send
                  </button>
                </div>
              </div>
              
              <div className="grid sm:grid-cols-3 gap-3">
                <button className="px-4 py-3 border border-zinc-700 rounded-lg text-sm hover:border-zinc-500 transition">
                  Connect Telegram
                </button>
                <button className="px-4 py-3 border border-zinc-700 rounded-lg text-sm hover:border-zinc-500 transition">
                  Customize Further
                </button>
                <button className="px-4 py-3 border border-zinc-700 rounded-lg text-sm hover:border-zinc-500 transition">
                  View in Directory
                </button>
              </div>
            </div>
          )}
        </main>

        <Footer />
      </div>
    </div>
  );
}
