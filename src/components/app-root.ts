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
                    background: #f0f2f5;
                    font-family: Arial, sans-serif;
                }
                .header {
                    background: white;
                    padding: 15px;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .user-info {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }
                .sign-out-btn {
                    padding: 8px 16px;
                    background: #ff4444;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                }
                .sign-out-btn:hover {
                    background: #cc0000;
                }
            </style>
            ${this.currentUser ? `
                <div class="header">
                    <div class="user-info">
                        <span>Welcome, ${this.currentUser.email}</span>
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