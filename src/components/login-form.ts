import { AuthService } from '../services/auth-service';

export class LoginForm extends HTMLElement {
    private authService: AuthService;
    private isLogin = true;
    private failedAttempts = 0;
    private lastAttemptTime = 0;

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.authService = new AuthService();
    }

    connectedCallback() {
        this.render();
    }

    private async handleSubmit(event: Event) {
        event.preventDefault();
        const form = event.target as HTMLFormElement;
        const emailInput = form.querySelector('#email') as HTMLInputElement;
        const passwordInput = form.querySelector('#password') as HTMLInputElement;
        const usernameInput = form.querySelector('#username') as HTMLInputElement;
        const submitButton = form.querySelector('button[type="submit"]') as HTMLButtonElement;
        const errorElement = form.querySelector('.error-message') as HTMLDivElement;
        const now = Date.now();

        const email = emailInput.value.trim();
        const password = passwordInput.value;
        const username = usernameInput?.value.trim();

        // Rate limiting
        if (this.failedAttempts >= 3 && now - this.lastAttemptTime < 30000) {
            const timeLeft = Math.ceil((30000 - (now - this.lastAttemptTime)) / 1000);
            if (errorElement) {
                errorElement.textContent = `Too many attempts. Please try again in ${timeLeft} seconds.`;
                errorElement.style.display = 'block';
            }
            return;
        }

        try {
            submitButton.disabled = true;
            submitButton.innerHTML = `
                <svg class="spinner" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="3"/>
                </svg>
                ${this.isLogin ? 'Signing in...' : 'Creating account...'}
            `;

            if (this.isLogin) {
                await this.authService.signIn(email, password);
                this.failedAttempts = 0;
            } else {
                if (!username) {
                    throw new Error('Username is required');
                }
                await this.authService.signUp(email, password, username);
            }
            this.dispatchEvent(new CustomEvent('auth-success'));
        } catch (error: any) {
            this.lastAttemptTime = now;
            this.failedAttempts++;

            if (errorElement) {
                let errorMessage = error.message;
                
                if (error.message.includes('user-not-found')) {
                    errorMessage = 'No account found with this email. Would you like to create one?';
                    emailInput.classList.add('error');
                    emailInput.focus();
                } else if (error.message.includes('wrong-password')) {
                    errorMessage = `Incorrect password. ${3 - this.failedAttempts} attempts remaining.`;
                    passwordInput.classList.add('error');
                    passwordInput.focus();
                    passwordInput.value = '';
                } else if (error.message.includes('email-already-in-use')) {
                    errorMessage = 'This email is already registered. Please sign in instead.';
                    emailInput.classList.add('error');
                    emailInput.focus();
                } else if (error.message.includes('invalid-email')) {
                    errorMessage = 'Please enter a valid email address (e.g., user@example.com)';
                    emailInput.classList.add('error');
                    emailInput.focus();
                } else if (error.message.includes('weak-password')) {
                    errorMessage = 'Password must be at least 6 characters and include both letters and numbers';
                    passwordInput.classList.add('error');
                    passwordInput.focus();
                } else if (error.message.includes('Username is required')) {
                    errorMessage = 'Please enter a username';
                    usernameInput?.classList.add('error');
                    usernameInput?.focus();
                }

                errorElement.textContent = errorMessage;
                errorElement.style.display = 'block';
                errorElement.classList.add('shake');
                setTimeout(() => {
                    errorElement.classList.remove('shake');
                }, 500);
            }
        } finally {
            submitButton.disabled = false;
            submitButton.innerHTML = this.isLogin ? 'Sign In' : 'Sign Up';
        }
    }

    private toggleMode() {
        this.isLogin = !this.isLogin;
        this.render();
    }

    render() {
        if (!this.shadowRoot) return;

        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    max-width: 420px;
                    margin: 0 auto;
                    padding: 1.5rem;
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .auth-container {
                    background: #181818;
                    padding: 2.5rem;
                    border-radius: 8px;
                    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
                    width: 100%;
                    transition: background-color 0.3s ease;
                }
                .auth-container:hover {
                    background: #282828;
                }
                h2 {
                    text-align: center;
                    color: #FFFFFF;
                    margin: 0 0 0.75rem;
                    font-size: 1.75rem;
                    font-weight: 700;
                    letter-spacing: -0.025em;
                }
                .form-group {
                    margin-bottom: 1.5rem;
                }
                label {
                    display: block;
                    margin-bottom: 0.5rem;
                    color: #FFFFFF;
                    font-size: 0.875rem;
                    font-weight: 600;
                }
                input {
                    width: 100%;
                    padding: 0.75rem 1rem;
                    border: none;
                    border-radius: 500px;
                    font-size: 0.9375rem;
                    transition: all 0.2s ease;
                    background: #3E3E3E;
                    color: #FFFFFF;
                    box-sizing: border-box;
                }
                input::placeholder {
                    color: #B3B3B3;
                }
                input:focus {
                    outline: none;
                    background: #404040;
                    box-shadow: 0 0 0 2px #1DB954;
                }
                button[type="submit"] {
                    width: 100%;
                    padding: 0.875rem 1.5rem;
                    background: #1DB954;
                    color: #000000;
                    border: none;
                    border-radius: 500px;
                    cursor: pointer;
                    font-size: 0.875rem;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    transition: all 0.2s ease;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.5rem;
                    margin-top: 0.5rem;
                    box-sizing: border-box;
                }
                button[type="submit"]:hover:not(:disabled) {
                    background: #1ed760;
                    transform: scale(1.04);
                }
                button[type="submit"]:active:not(:disabled) {
                    transform: scale(0.98);
                }
                button[type="submit"]:disabled {
                    opacity: 0.7;
                    cursor: not-allowed;
                    transform: none;
                }
                .toggle-btn {
                    width: 100%;
                    padding: 0.875rem 1.5rem;
                    background: transparent;
                    color: #B3B3B3;
                    border: 1px solid #404040;
                    border-radius: 500px;
                    cursor: pointer;
                    font-size: 0.875rem;
                    font-weight: 500;
                    transition: all 0.2s ease;
                    margin-top: 1rem;
                    box-sizing: border-box;
                }
                .toggle-btn:hover {
                    background: #282828;
                    border-color: #B3B3B3;
                    color: #FFFFFF;
                }
                .error-message {
                    color: #FFFFFF;
                    text-align: center;
                    margin-top: 1rem;
                    padding: 0.75rem;
                    background: #E91429;
                    border-radius: 500px;
                    font-size: 0.875rem;
                    font-weight: 500;
                    display: none;
                    animation: fadeIn 0.3s ease;
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .spinner {
                    width: 18px;
                    height: 18px;
                    animation: spin 1s linear infinite;
                    border: 2px solid #FFFFFF;
                    border-top-color: transparent;
                    border-radius: 50%;
                }
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .welcome-text {
                    text-align: center;
                    color: #B3B3B3;
                    margin: 0 0 2rem;
                    font-size: 0.9375rem;
                    line-height: 1.5;
                }
                .divider {
                    display: flex;
                    align-items: center;
                    text-align: center;
                    margin: 1.5rem 0;
                    color: #B3B3B3;
                    font-size: 0.875rem;
                }
                .divider::before,
                .divider::after {
                    content: '';
                    flex: 1;
                    border-bottom: 1px solid #404040;
                }
                .divider::before {
                    margin-right: 1rem;
                }
                .divider::after {
                    margin-left: 1rem;
                }
                form {
                    margin: 0;
                    padding: 0;
                }
                @media (max-width: 480px) {
                    :host {
                        padding: 1rem;
                    }
                    .auth-container {
                        padding: 1.5rem;
                    }
                }
                input.error {
                    border: none;
                    background: #E91429;
                    animation: shake 0.5s ease;
                }
                input.error:focus {
                    box-shadow: 0 0 0 2px #E91429;
                }
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-5px); }
                    75% { transform: translateX(5px); }
                }
                .shake {
                    animation: shake 0.5s ease;
                }
            </style>
            <div class="auth-container">
                <h2>${this.isLogin ? 'Sign In' : 'Sign Up'}</h2>
                <p class="welcome-text">
                    ${this.isLogin 
                        ? 'Sign in to manage your tasks and stay organized'
                        : 'Create an account to start managing your tasks'}
                </p>
                <form @submit=${this.handleSubmit.bind(this)}>
                    <div class="form-group">
                        <label for="email">Email Address</label>
                        <input 
                            type="email" 
                            id="email" 
                            name="email" 
                            placeholder="Enter your email"
                            required
                            autocomplete="email">
                    </div>
                    ${!this.isLogin ? `
                        <div class="form-group">
                            <label for="username">Username</label>
                            <input 
                                type="text" 
                                id="username" 
                                name="username" 
                                placeholder="Choose a username"
                                required
                                autocomplete="username">
                        </div>
                    ` : ''}
                    <div class="form-group">
                        <label for="password">Password</label>
                        <input 
                            type="password" 
                            id="password" 
                            name="password" 
                            placeholder="Enter your password"
                            required
                            autocomplete="current-password">
                    </div>
                    <button type="submit">${this.isLogin ? 'Sign In' : 'Sign Up'}</button>
                    <div class="error-message"></div>
                </form>
                <div class="divider">or</div>
                <button class="toggle-btn" @click=${this.toggleMode.bind(this)}>
                    ${this.isLogin ? 'Need an account? Sign Up' : 'Already have an account? Sign In'}
                </button>
            </div>
        `;

        // Add event listeners
        const form = this.shadowRoot.querySelector('form');
        const toggleBtn = this.shadowRoot.querySelector('.toggle-btn');

        form?.addEventListener('submit', this.handleSubmit.bind(this));
        toggleBtn?.addEventListener('click', this.toggleMode.bind(this));
    }
}

customElements.define('login-form', LoginForm); 