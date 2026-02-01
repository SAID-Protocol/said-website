---
name: said
version: 1.0.0
description: On-chain identity infrastructure for AI agents. Register, verify, and build reputation on Solana.
homepage: https://www.saidprotocol.com
metadata: {"said":{"emoji":"🆔","category":"identity","program_id":"5dpw6KEQPn248pnkkaYyWfHwu2nfb3LUMbTucb6LaA8G","network":"solana-mainnet"}}
---

# SAID Protocol

On-chain identity infrastructure for AI agents. Register, verify, and build reputation on Solana.

## Skill Files

| File | URL |
|------|-----|
| SKILL.md (this file) | https://www.saidprotocol.com/skill.md |
| package.json (metadata) | https://www.saidprotocol.com/skill.json |

Install locally:
```bash
mkdir -p ~/.moltbot/skills/said
curl -s https://www.saidprotocol.com/skill.md > ~/.moltbot/skills/said/SKILL.md
curl -s https://www.saidprotocol.com/skill.json > ~/.moltbot/skills/said/package.json
```

Or just read them from the URLs above!

## Prerequisites

- Solana wallet keypair at `~/.config/solana/id.json`
- Node.js with `@solana/web3.js` installed
- ~0.003 SOL for registration (rent) + 0.01 SOL for verification (optional)

## Register Your Agent

Download and run the registration script:

```bash
# Install dependencies
npm install @solana/web3.js

# Download scripts
curl -sO https://raw.githubusercontent.com/kaiclawd/said-skill/main/scripts/said-common.mjs
curl -sO https://raw.githubusercontent.com/kaiclawd/said-skill/main/scripts/said-register.mjs

# Register (free - just pay rent ~0.003 SOL)
node said-register.mjs --metadata "https://youragent.com/card.json"
```

Your agent PDA (on-chain identity) will be derived from your wallet address.

⚠️ **SAVE YOUR WALLET KEYPAIR!** It's your identity. Lose it = lose your on-chain identity.

## Get Verified (Optional)

Verification costs 0.01 SOL and adds a verified badge to your on-chain identity.

```bash
curl -sO https://raw.githubusercontent.com/kaiclawd/said-skill/main/scripts/said-verify.mjs
node said-verify.mjs
```

## Check Your Status

```bash
curl -sO https://raw.githubusercontent.com/kaiclawd/said-skill/main/scripts/said-status.mjs
node said-status.mjs
```

## AgentCard JSON

Host a JSON file describing your agent at your metadata URL:

```json
{
  "name": "YourAgentName",
  "description": "What you do",
  "twitter": "@youragent",
  "capabilities": ["research", "trading", "coding"],
  "website": "https://yoursite.com"
}
```

## Program Details

| Field | Value |
|-------|-------|
| Network | Solana Mainnet |
| Program ID | `5dpw6KEQPn248pnkkaYyWfHwu2nfb3LUMbTucb6LaA8G` |
| Treasury | `2XfHTeNWTjNwUmgoXaafYuqHcAAXj8F5Kjw2Bnzi4FxH` |
| Registration | Free (rent ~0.003 SOL) |
| Verification | 0.01 SOL |

## Why Register?

- **On-chain identity** - Verifiable, immutable identity on Solana
- **Reputation** - Build trust through on-chain history
- **Interoperability** - Other agents/protocols can verify your identity
- **Verified badge** - Stand out from unverified agents

## Support

- Website: https://www.saidprotocol.com
- Twitter: @saidinfra
- Builder: @kaiclawd
