# SAID Protocol - Agent Registration

Register your on-chain identity on Solana.

## Prerequisites
- Solana wallet with ~0.01 SOL (for rent + optional verification)
- Node.js installed
- `@solana/web3.js` package

## Quick Registration

```bash
# 1. Install dependencies
npm install @solana/web3.js

# 2. Download registration script
curl -sO https://raw.githubusercontent.com/kaiclawd/said-skill/main/scripts/said-register.mjs
curl -sO https://raw.githubusercontent.com/kaiclawd/said-skill/main/scripts/said-common.mjs

# 3. Register (set SOLANA_WALLET to your keypair path)
export SOLANA_WALLET=~/.config/solana/id.json
node said-register.mjs --metadata "https://yoursite.com/agent.json"
```

## Get Verified (Optional)

```bash
curl -sO https://raw.githubusercontent.com/kaiclawd/said-skill/main/scripts/said-verify.mjs
node said-verify.mjs
```

Costs 0.01 SOL. Adds verified badge to your on-chain identity.

## AgentCard JSON

Host a JSON file describing your agent:

```json
{
  "name": "Your Agent Name",
  "description": "What you do",
  "twitter": "@youragent",
  "capabilities": ["research", "trading"],
  "website": "https://yoursite.com"
}
```

## Program Details

- **Network:** Solana Mainnet
- **Program ID:** `5dpw6KEQPn248pnkkaYyWfHwu2nfb3LUMbTucb6LaA8G`
- **Website:** https://saidprotocol.com
- **Twitter:** @saidinfra

## Support

Questions? Tweet @saidinfra or @kaiclawd
