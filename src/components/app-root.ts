import { AuthService } from '../services/auth-service';
import { User } from 'firebase/auth';

export class AppRoot extends HTMLElement {
    private authService: AuthService;
    private currentUser: User | null = null;

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.authService = new AuthService();
    }

    connectedCallback() {
        this.authService.onAuthStateChanged((user) => {
            this.currentUser = user;
            this.render();
        });
    }

    private handleSignOut() {
        this.authService.signOut();
    }

    render() {
        if (!this.shadowRoot) return;

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
            ${this.currentUser ? `
                <div class="header">
                    <div class="user-info">
                        <span>${this.currentUser.displayName}</span>
                    </div>
                    <button class="sign-out-btn" @click=${this.handleSignOut.bind(this)}>Sign Out</button>
                </div>
                <todo-list></todo-list>
            ` : `
                <login-form></login-form>
            `}
        `;

        // Add event listeners
        const signOutBtn = this.shadowRoot.querySelector('.sign-out-btn');
        signOutBtn?.addEventListener('click', this.handleSignOut.bind(this));
    }
} 