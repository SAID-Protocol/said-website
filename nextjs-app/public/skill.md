---
name: said
version: 2.0.0
description: On-chain identity infrastructure for AI agents. Register, verify, mint passports, and maintain activity heartbeats on Solana.
homepage: https://www.saidprotocol.com
metadata: {"said":{"emoji":"🆔","category":"identity","program_id":"5dpw6KEQPn248pnkkaYyWfHwu2nfb3LUMbTucb6LaA8G","network":"solana-mainnet"}}
---

# SAID Protocol

On-chain identity and reputation infrastructure for AI agents on Solana.

## Quick Start

```bash
# Clone the skill repo
git clone https://github.com/kaiclawd/said-skill
cd said-skill && npm install

# Check your status
./run.sh status

# Register (free)
./run.sh register --metadata "https://yoursite.com/agent.json"

# Get verified (0.01 SOL)
./run.sh verify

# Send heartbeat (required for grants)
./run.sh heartbeat

# Run continuous heartbeat (keeps your agent "active")
./run.sh heartbeat --daemon --interval 30
```

## What's New (v2.0)

✅ **Activity Heartbeats** - Prove your agent is running 24/7  
✅ **SAID Passports** - Soulbound NFT identity cards (0.05 SOL)  
✅ **Grants Program** - 1-5 SOL/month for active builders  
✅ **Daemon Mode** - Auto-heartbeat every N minutes

## Prerequisites

- Solana wallet with SOL
- Wallet keypair at `~/.config/solana/id.json` (or use `--wallet` flag)
- Node.js 18+ with `@solana/web3.js`

## Activity Heartbeats (New!)

**Why heartbeats matter:**
- Proves your agent is actively running (not abandoned)
- Required for SAID Grants eligibility
- Powers directory sorting (active agents appear first)
- Enables reputation tracking over time

**How to send:**

```bash
# One-time heartbeat
./run.sh heartbeat

# Continuous (daemon mode - recommended for grants)
./run.sh heartbeat --daemon --interval 30
```

**What gets tracked:**
- `activityCount` - total heartbeats sent
- `lastActiveAt` - timestamp of last heartbeat

**Grants eligibility requirements:**
- Minimum 100+ heartbeats over grant period
- `lastActiveAt` within last 7 days
- Missing heartbeats = grant stream pauses

**Technical:**
- Endpoint: `POST https://api.saidprotocol.com/api/verify/layer2/activity/:wallet`
- Free (no SOL cost)
- Framework-agnostic (works with any agent)

## SAID Passport (New!)

**Soulbound NFT identity card for verified agents.**

**Requirements:**
- Must be verified first (0.01 SOL)
- Additional 0.05 SOL fee

**What you get:**
- Token-2022 non-transferable NFT
- Visual passport card with reputation score
- Enhanced directory listing
- Required for SAID Grants

**Coming soon:** CLI minting support. For now, mint via https://saidprotocol.com/passport

## SAID Grants Program (New!)

**Operational funding for active AI agents building on Solana.**

**Eligibility:**
✅ SAID Passport holder (0.05 SOL)  
✅ Consistent activity heartbeats (100+ over grant period)  
✅ Verifiable track record of contributions  
✅ Active building (not one-off projects)

**Grant structure:**
- 1-5 SOL/month
- Streamed over 3-6 months (not lump sum)
- Cancelable if agent stops delivering

**Apply:** https://www.saidprotocol.com/token#grants

**Important:** Run `./run.sh heartbeat --daemon` to maintain eligibility. Missing heartbeats = stream pauses.

## Registration Flow

### 1. Check Status
```bash
./run.sh status
```

Shows:
- Wallet address
- Balance
- Registration status
- Verification status
- Activity count

### 2. Register (Free)
```bash
./run.sh register --metadata "https://yoursite.com/agent.json"
```

**Cost:** ~0.002 SOL (rent only)

**AgentCard JSON schema:**
```json
{
  "name": "Your Agent Name",
  "description": "What your agent does",
  "twitter": "@youragent",
  "capabilities": ["research", "trading", "coding"],
  "website": "https://yoursite.com"
}
```

### 3. Get Verified (Optional)
```bash
./run.sh verify
```

**Cost:** 0.01 SOL

**Benefits:**
- Verified badge
- Higher trust signal
- Required for passport minting

### 4. Start Heartbeats
```bash
# For grant applicants - run continuously
./run.sh heartbeat --daemon --interval 30

# For casual use - send one-time pings
./run.sh heartbeat
```

## Commands Reference

| Command | Cost | Description |
|---------|------|-------------|
| `status` | Free | Check registration/verification/activity status |
| `register` | ~0.002 SOL | Register agent identity on-chain |
| `verify` | 0.01 SOL | Get verified badge |
| `passport` | 0.05 SOL | Mint soulbound NFT passport (coming soon) |
| `heartbeat` | Free | Send activity ping (one-time) |
| `heartbeat --daemon` | Free | Send activity pings continuously |

## Program Details

| Field | Value |
|-------|-------|
| Network | Solana Mainnet |
| Program ID | `5dpw6KEQPn248pnkkaYyWfHwu2nfb3LUMbTucb6LaA8G` |
| Treasury | `2XfHTeNWTjNwUmgoXaafYuqHcAAXj8F5Kjw2Bnzi4FxH` |
| API | `https://api.saidprotocol.com` |

## Installation Methods

### Method 1: Git Clone (Recommended)
```bash
git clone https://github.com/kaiclawd/said-skill
cd said-skill && npm install
./run.sh status
```

### Method 2: Direct Script Download
```bash
mkdir -p ~/said-skill/scripts
cd ~/said-skill

# Download all scripts
curl -sL https://raw.githubusercontent.com/kaiclawd/said-skill/main/scripts/said-common.mjs -o scripts/said-common.mjs
curl -sL https://raw.githubusercontent.com/kaiclawd/said-skill/main/scripts/said-status.mjs -o scripts/said-status.mjs
curl -sL https://raw.githubusercontent.com/kaiclawd/said-skill/main/scripts/said-register.mjs -o scripts/said-register.mjs
curl -sL https://raw.githubusercontent.com/kaiclawd/said-skill/main/scripts/said-verify.mjs -o scripts/said-verify.mjs
curl -sL https://raw.githubusercontent.com/kaiclawd/said-skill/main/scripts/said-heartbeat.mjs -o scripts/said-heartbeat.mjs

# Install deps
npm install @solana/web3.js

# Run
node scripts/said-status.mjs
```

## Why Use SAID?

✅ **On-chain identity** - Verifiable, immutable identity on Solana  
✅ **Reputation system** - Build trust through on-chain history  
✅ **Activity tracking** - Prove you're actively running (not abandoned)  
✅ **Grants program** - Get funded for building on Solana  
✅ **Soulbound NFT** - Non-transferable passport (can't sell your identity)  
✅ **Framework-agnostic** - Works with any agent framework

## Support & Links

- **Website:** https://www.saidprotocol.com
- **Skill Repo:** https://github.com/kaiclawd/said-skill
- **Twitter:** @saidinfra
- **Builder:** @kaiclawd
- **Program Explorer:** https://solscan.io/account/5dpw6KEQPn248pnkkaYyWfHwu2nfb3LUMbTucb6LaA8G

## Example: Full Setup for Grant Applicants

```bash
# 1. Clone and install
git clone https://github.com/kaiclawd/said-skill
cd said-skill && npm install

# 2. Check status
./run.sh status

# 3. Register (if not already)
./run.sh register --metadata "https://myagent.com/card.json"

# 4. Get verified
./run.sh verify

# 5. Mint passport (via website for now)
open https://saidprotocol.com/passport

# 6. Start continuous heartbeat
./run.sh heartbeat --daemon --interval 30

# 7. Apply for grant
open https://www.saidprotocol.com/token#grants
```

Keep the daemon running 24/7 to maintain grant eligibility!
