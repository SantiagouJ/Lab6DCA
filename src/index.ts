import './components/app-root';
import './components/todo-list';
import './components/todo-item';
import './components/login-form';
import { AuthService } from './services/auth-service';
import { app } from './Firebase/firebase-config';

// Register custom elements
customElements.define('app-root', class extends HTMLElement {
    private authService: AuthService;

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.authService = new AuthService();
    }

    connectedCallback() {
        this.render();
        this.setupAuthListener();
    }

    private setupAuthListener() {
        this.authService.onAuthStateChanged((user) => {
            this.render();
        });
    }

    private async handleSignOut() {
        try {
            await this.authService.signOut();
        } catch (error) {
            console.error('Error signing out:', error);
        }
    }

    render() {
        if (!this.shadowRoot) return;

        const user = this.authService.getCurrentUser();

        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    min-height: 100vh;
                    background: #121212;
                    font-family: 'Circular', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
                }
                .header {
                    background: #000000;
                    padding: 1rem 2rem;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    position: sticky;
                    top: 0;
                    z-index: 100;
                }
                .user-info {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    color: #FFFFFF;
                    font-weight: 500;
                }
                .sign-out-btn {
                    padding: 0.75rem 1.5rem;
                    background: #1DB954;
                    color: #000000;
                    border: none;
                    border-radius: 500px;
                    cursor: pointer;
                    font-weight: 700;
                    font-size: 0.875rem;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    transition: all 0.2s ease;
                }
                .sign-out-btn:hover {
                    background: #1ed760;
                    transform: scale(1.04);
                }
                .sign-out-btn:active {
                    transform: scale(0.98);
                }
            </style>
            ${user ? `
                <div class="header">
                    <div class="user-info">
                    </div>
                    <button class="sign-out-btn" id="signOutBtn">Sign Out</button>
                </div>
                <todo-list></todo-list>
            ` : `
                <login-form></login-form>
            `}
        `;

        // Add event listener for sign out button
        const signOutBtn = this.shadowRoot.getElementById('signOutBtn');
        if (signOutBtn) {
            signOutBtn.addEventListener('click', () => this.handleSignOut());
        }
    }
});