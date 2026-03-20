# Privy Session Signer Policy Setup

## Critical Security Fix
**Issue:** Session signer currently has unrestricted access to user wallets (`policyIds: []`)  
**Fix:** Create a scoped policy that restricts signer to USDC billing transfers only

---

## Steps to Configure Policy in Privy Dashboard

### 1. Login to Privy Dashboard
https://dashboard.privy.io

### 2. Navigate to Session Signers
- Go to **Session Signers** section
- Click **Policies**
- Click **Create New Policy**

### 3. Configure Billing Policy
Create a policy with these settings:

**Policy Name:** `SAID Billing Policy`

**Restrictions:**
- **Allowed Tokens:** 
  - USDC SPL Token: `EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v`
  
- **Transfer Limits:**
  - Max per transaction: $100 USD
  - Max per day: $1,000 USD
  - Max per month: $10,000 USD

- **Allowed Recipients:** 
  - SAID billing wallet address (get from backend config)
  
- **Allowed Actions:**
  - Transfer tokens ONLY
  - No NFT transfers
  - No arbitrary contract calls

### 4. Get Policy ID
After creating the policy:
1. Copy the Policy ID (format: `pol_xxxxxxxxxxxxx`)
2. Add to environment variables

### 5. Add to Environment Variables

**Production (.env.production):**
```bash
NEXT_PUBLIC_SIGNER_POLICY_ID=pol_xxxxxxxxxxxxx
```

**Development (.env.local):**
```bash
NEXT_PUBLIC_SIGNER_POLICY_ID=pol_xxxxxxxxxxxxx
```

### 6. Redeploy Application
```bash
# Build with new env var
npm run build

# Deploy to production
railway up
```

---

## Verification

After deployment, test that:
1. ✅ New users see signer consent modal with restricted permissions
2. ✅ Backend can successfully charge billing fees via signer
3. ✅ Signer CANNOT make non-USDC transfers
4. ✅ Signer CANNOT exceed daily/monthly limits

**Test user creation:** Create a fresh account, complete onboarding, verify signer consent shows policy restrictions

---

## Rollback Plan
If issues occur:
1. Remove policy ID from env vars (reverts to full permission temporarily)
2. Debug policy configuration in Privy dashboard
3. Re-deploy with corrected policy ID

---

## Security Notes
- Policy CANNOT be changed after signer consent without re-requesting user consent
- Always test policy changes on staging first
- Monitor for any failed billing transactions due to policy restrictions
- Review policy limits quarterly as platform scales

---

**Current Status:** ⚠️ Policy not yet created (code updated, waiting for Privy configuration)  
**Priority:** CRITICAL (blocks production security audit approval)
