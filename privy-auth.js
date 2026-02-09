// Privy Auth - Shared across all pages
import Privy, { LocalStorage } from 'https://esm.sh/@privy-io/js-sdk-core@0.60.0';

const PRIVY_APP_ID = 'cmlbxd3qu00jqi80c4pibohzv';
let privy;
let currentUser = null;
let currentEmail = '';

// Initialize Privy
async function initPrivyAuth() {
    try {
        privy = new Privy({
            appId: PRIVY_APP_ID,
            storage: new LocalStorage(),
        });

        // Check localStorage for cached user
        const cached = localStorage.getItem('said-privy-user');
        if (cached) {
            currentUser = JSON.parse(cached);
            updateNavUI();
        }
    } catch (err) {
        console.error('Privy init error:', err);
    }
}

// Update navbar UI across all pages
function updateNavUI() {
    const loggedOutEl = document.getElementById('auth-logged-out');
    const loggedInEl = document.getElementById('auth-logged-in');
    const userAvatarEl = document.getElementById('user-avatar');
    
    if (currentUser) {
        // Hide login, show profile avatar
        if (loggedOutEl) loggedOutEl.style.display = 'none';
        if (loggedInEl) loggedInEl.style.display = 'block';
        
        // Update avatar with first letter of email or wallet
        if (userAvatarEl) {
            const displayText = currentUser.email || 
                              (currentUser.walletAddress ? currentUser.walletAddress : 'User');
            userAvatarEl.textContent = displayText[0].toUpperCase();
        }
    } else {
        // Show login, hide profile
        if (loggedOutEl) loggedOutEl.style.display = 'block';
        if (loggedInEl) loggedInEl.style.display = 'none';
    }
}

// Send email verification code
async function privySendEmailCode(email) {
    try {
        currentEmail = email;
        await privy.auth.email.sendCode(email);
        
        // Show code input step
        if (window.showPrivyCodeStep) {
            window.showPrivyCodeStep();
        }
    } catch (err) {
        console.error('Send code error:', err);
        alert('Failed to send code: ' + err.message);
    }
}

// Verify email code and login
async function privyVerifyEmailCode(code) {
    try {
        const session = await privy.auth.email.loginWithCode(currentEmail, code);
        
        // Session object contains user info
        currentUser = {
            id: session.user?.id || 'user-' + Date.now(),
            email: currentEmail,
            session: session,
        };
        
        localStorage.setItem('said-privy-user', JSON.stringify(currentUser));
        updateNavUI();
        
        // Close modal
        if (window.closePrivyModal) {
            window.closePrivyModal();
        }
        
        // Reload to show logged-in state
        window.location.reload();
    } catch (err) {
        console.error('Verify code error:', err);
        alert('Invalid code: ' + err.message);
    }
}

// Login with Solana wallet
async function privyLoginWithWallet(walletType) {
    try {
        let wallet;
        
        if (walletType === 'phantom') {
            if (!window.solana?.isPhantom) {
                alert('Phantom wallet not installed. Get it at phantom.app');
                return;
            }
            wallet = window.solana;
        } else if (walletType === 'solflare') {
            if (!window.solflare) {
                alert('Solflare wallet not installed.');
                return;
            }
            wallet = window.solflare;
        }
        
        await wallet.connect();
        const walletAddress = wallet.publicKey.toString();
        
        // Store wallet user session
        currentUser = {
            id: 'wallet-' + walletAddress,
            walletAddress: walletAddress,
        };
        
        localStorage.setItem('said-privy-user', JSON.stringify(currentUser));
        updateNavUI();
        
        if (window.closePrivyModal) {
            window.closePrivyModal();
        }
        
        window.location.reload();
    } catch (err) {
        console.error('Wallet login error:', err);
        alert('Failed to connect wallet: ' + err.message);
    }
}

// Logout
async function privyLogout() {
    try {
        if (privy && privy.logout) {
            await privy.logout();
        }
        currentUser = null;
        localStorage.removeItem('said-privy-user');
        updateNavUI();
        window.location.reload();
    } catch (err) {
        console.error('Logout error:', err);
    }
}

// Get current user
function getCurrentUser() {
    return currentUser;
}

// Initialize on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPrivyAuth);
} else {
    initPrivyAuth();
}

// Export to window
window.privyLogout = privyLogout;
window.getCurrentUser = getCurrentUser;
window.privySendEmailCode = privySendEmailCode;
window.privyVerifyEmailCode = privyVerifyEmailCode;
window.privyLoginWithWallet = privyLoginWithWallet;
window.privyInstance = privy;
