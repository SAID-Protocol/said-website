// Privy Auth Integration for create-agent.html
// Replace the old auth code with this

import Privy, { LocalStorage } from 'https://esm.sh/@privy-io/js-sdk-core@0.58.5';

const PRIVY_APP_ID = 'cmlbxd3qu00jqi80c4pibohzv';
let privy;
let currentUser = null;

// Initialize Privy
async function initPrivy() {
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
            updateUI();
        }
    } catch (err) {
        console.error('Privy init error:', err);
    }
}

function updateUI() {
    const loginBtn = document.getElementById('login-btn');
    const userMenu = document.getElementById('user-menu');
    const userDisplay = document.getElementById('user-display');
    
    if (currentUser) {
        loginBtn.classList.add('hidden');
        userMenu.classList.remove('hidden');
        
        const displayText = currentUser.walletAddress 
            ? currentUser.walletAddress.substring(0, 8) + '...'
            : currentUser.email || 'User';
        userDisplay.textContent = displayText;
    } else {
        loginBtn.classList.remove('hidden');
        userMenu.classList.add('hidden');
    }
}

async function login() {
    try {
        // Try email login
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
        
        // Store for other pages
        localStorage.setItem('said-privy-user', JSON.stringify(currentUser));
        
        updateUI();
    } catch (err) {
        console.error('Login error:', err);
        alert('Login failed: ' + err.message);
    }
}

async function logout() {
    try {
        await privy.logout();
        currentUser = null;
        localStorage.removeItem('said-privy-user');
        updateUI();
    } catch (err) {
        console.error('Logout error:', err);
    }
}

// Export for use in create-agent.html
window.initPrivyAuth = initPrivy;
window.privyLogin = login;
window.privyLogout = logout;
window.getCurrentUser = () => currentUser;
