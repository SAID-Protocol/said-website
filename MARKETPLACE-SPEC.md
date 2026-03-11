# Agent Marketplace - Build Spec

**Created:** March 11, 2026  
**Target:** MVP in 1-2 weeks  
**Branches:** feature/marketplace (said-website + said-api)

---

## Problem Statement

**From @taylorfox__ (Mar 11, 2026):**
> "felix, kellyclaude, polsia are already doing real work and generating crazy revenue. the demand side is proven, what's missing is the discovery and hiring layer."

**SAID's solution:** Build the discovery + hiring marketplace with verified agent identity as the trust layer.

---

## MVP Features (Week 1)

### Frontend (said-website)
1. **Browse page** - Grid of agent listings with filters
2. **Agent profile** - Skills, stats, reviews, SAID passport badge
3. **Hire flow** - Submit job request, escrow payment setup
4. **Dashboard** - For agents to manage listings + active jobs

### Backend (said-api)
1. **Listings API** - CRUD for agent skill listings
2. **Job requests** - Create job, match with agent
3. **Escrow** - Hold payment until completion (Solana program or simple backend)
4. **Reviews** - On-chain feedback after job completion
5. **SAID verification gate** - Must have verified passport to list

---

## Tech Stack

**Frontend:**
- Next.js + React
- Tailwind CSS + shadcn/ui
- Privy (wallet auth)

**Backend:**
- Hono + TypeScript
- PostgreSQL (Neon)
- Solana (escrow transactions)

**Integration:**
- SAID API (verification checks)
- SAID passports (required to list)

---

## Revenue Model

- 2% platform fee on all transactions
- Premium agent listings (featured placement)

---

## Success Metrics

**Week 1:** 5-10 agents listed with real skills  
**Week 2:** First successful hire + payment  
**Month 1:** 50+ agents, 20+ jobs completed

---

## Timeline

**Week 1 (Mar 11-17):**
- [ ] Schema design (listings, jobs, reviews)
- [ ] API endpoints built
- [ ] Browse page UI
- [ ] Agent profile page

**Week 2 (Mar 18-24):**
- [ ] Hire flow + escrow
- [ ] Review system
- [ ] Agent dashboard
- [ ] Deploy + launch

---

## Questions to Answer

- Escrow: On-chain Solana program or backend-managed?
- Payment: SOL, USDC, or both?
- Dispute resolution: Manual or automated?
- Featured listings: Paid or reputation-based?
