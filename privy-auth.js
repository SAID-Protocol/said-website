// Privy Auth - Shared across all pages
import Privy, { LocalStorage } from 'https://esm.sh/@privy-io/js-sdk-core@0.60.0';

const PRIVY_APP_ID = 'cmlbxd3qu00jqi80c4pibohzv';
let privy;
let currentUser = null;

// Initialize Privy
async function initPrivyAuth() {
    try {
        privy = new Privy({
            appId: PRIVY_APP_ID,
            storage: new LocalStorage(),
        });

        // Check if already logged in
        const user = await privy.getUser();
        if (user) {
            currentUser = {
                id: user.id,
                walletAddress: user.wallet?.address,
                email: user.email?.address,
            };
            localStorage.setItem('said-privy-user', JSON.stringify(currentUser));
        } else {
            // Check localStorage in case we have cached user
            const cached = localStorage.getItem('said-privy-user');
            if (cached) {
                currentUser = JSON.parse(cached);
            }
        }
        
        updateNavUI();
    } catch (err) {
        console.error('Privy init error:', err);
    }
}

// Update navbar UI across all pages
function updateNavUI() {
    const loggedOutEl = document.getElementById('auth-logged-out');
    const loggedInEl = document.getElementById('auth-logged-in');
    const userEmailEl = document.getElementById('user-email');
    const userAvatarEl = document.getElementById('user-avatar');
    const createAgentBtn = document.getElementById('create-agent-btn');
    
    if (currentUser) {
        // Show logged in state
        if (loggedOutEl) loggedOutEl.style.display = 'none';
        if (loggedInEl) loggedInEl.style.display = 'flex';
        
        // Display user info
        const displayText = currentUser.email || 
                          (currentUser.walletAddress ? currentUser.walletAddress.substring(0, 8) + '...' : 'User');
        
        if (userEmailEl) userEmailEl.textContent = displayText;
        if (userAvatarEl) {
            userAvatarEl.textContent = currentUser.email ? currentUser.email[0].toUpperCase() : 'U';
        }
        
        // Show Create Agent button
        if (createAgentBtn) createAgentBtn.style.display = 'inline-flex';
    } else {
        // Show logged out state
        if (loggedOutEl) loggedOutEl.style.display = 'block';
        if (loggedInEl) loggedInEl.style.display = 'none';
        if (createAgentBtn) createAgentBtn.style.display = 'none';
    }
}

// Login function - opens existing modal if available, otherwise uses prompt
async function privyLogin() {
    try {
        const modal = document.getElementById('login-modal');
        
        // If modal exists on page, use it
        if (modal) {
            modal.classList.remove('hidden');
            return;
        }
        
        // Fallback to simple email prompt
        const email = prompt('Enter your email to log in:');
        if (!email) return;
        
        await privy.login.email({ email });
        
        // Get user after login
        const user = await privy.getUser();
        currentUser = {
            id: user.id,
            walletAddress: user.wallet?.address,
            email: user.email?.address,
        };
        
        localStorage.setItem('said-privy-user', JSON.stringify(currentUser));
        updateNavUI();
        
        // Refresh page to show logged-in state everywhere
        window.location.reload();
    } catch (err) {
        console.error('Login error:', err);
        alert('Login failed: ' + err.message);
    }
}

// Logout function
async function privyLogout() {
    try {
        await privy.logout();
        currentUser = null;
        localStorage.removeItem('said-privy-user');
        updateNavUI();
        window.location.reload();
    } catch (err) {
        console.error('Logout error:', err);
    }
}

// Get current user (for other scripts)
function getCurrentUser() {
    return currentUser;
}

// Initialize on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPrivyAuth);
} else {
    initPrivyAuth();
}

// Export to window for inline onclick handlers
window.privyLogin = privyLogin;
window.privyLogout = privyLogout;
window.getCurrentUser = getCurrentUser;
window.privyInstance = privy;
