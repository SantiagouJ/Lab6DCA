import { 
    getAuth, 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    User
} from 'firebase/auth';
import { UserService } from './user-service';

export class AuthService {
    private auth;
    private userService: UserService;

    constructor() {
        this.auth = getAuth();
        this.userService = new UserService();
    }

    async signIn(email: string, password: string): Promise<User> {
        try {
            // Validate email format
            if (!this.isValidEmail(email)) {
                throw new Error('Please enter a valid email address');
            }

            // Validate password
            if (!password || password.length < 6) {
                throw new Error('Password must be at least 6 characters long');
            }

            const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
            return userCredential.user;
        } catch (error: any) {
            throw new Error(this.getErrorMessage(error.code));
        }
    }

    async signUp(email: string, password: string, username: string): Promise<User> {
        try {
            console.log("Starting sign up process...");
            // Validate email format
            if (!this.isValidEmail(email)) {
                console.log("Invalid email format");
                throw new Error('Please enter a valid email address');
            }

            // Validate password strength
            if (!this.isStrongPassword(password)) {
                console.log("Password too weak");
                throw new Error('Password must be at least 6 characters long and contain a mix of letters, numbers, and special characters');
            }

            console.log("Attempting to create user with Firebase...");
            const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
            console.log("User created successfully:", userCredential.user);

            // Create user document in users collection
            await this.userService.createUser(email, username);

            return userCredential.user;
        } catch (error: any) {
            console.error("Sign up error:", error);
            console.error("Error code:", error.code);
            throw new Error(this.getErrorMessage(error.code));
        }
    }

    async signOut(): Promise<void> {
        try {
            await signOut(this.auth);
        } catch (error: any) {
            throw new Error('Failed to sign out. Please try again.');
        }
    }

    onAuthStateChanged(callback: (user: User | null) => void): () => void {
        return onAuthStateChanged(this.auth, callback);
    }

    getCurrentUser(): User | null {
        return this.auth.currentUser;
    }

    private isValidEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    private isStrongPassword(password: string): boolean {
        // At least 6 characters, contains letters and numbers
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{6,}$/;
        if (!passwordRegex.test(password)) {
            console.log("Password validation failed. Requirements:");
            console.log("- At least 6 characters long");
            console.log("- Must contain at least one letter");
            console.log("- Must contain at least one number");
            console.log("- Can include special characters: @$!%*#?&");
            return false;
        }
        return true;
    }

    private getErrorMessage(errorCode: string): string {
        switch (errorCode) {
            case 'auth/invalid-email':
                return 'Please enter a valid email address';
            case 'auth/user-disabled':
                return 'This account has been disabled. Please contact support.';
            case 'auth/user-not-found':
                return 'No account found with this email. Please check your email or sign up.';
            case 'auth/wrong-password':
                return 'Incorrect password. Please try again.';
            case 'auth/email-already-in-use':
                return 'An account already exists with this email. Please sign in instead.';
            case 'auth/weak-password':
                return 'La contraseña debe tener al menos 6 caracteres, incluir al menos una letra y un número. También puede usar caracteres especiales: @$!%*#?&';
            case 'auth/too-many-requests':
                return 'Too many failed attempts. Please try again later.';
            case 'auth/network-request-failed':
                return 'Network error. Please check your internet connection.';
            case 'auth/operation-not-allowed':
                return 'This operation is not allowed. Please contact support.';
            case 'auth/account-exists-with-different-credential':
                return 'An account already exists with the same email address but different sign-in credentials.';
            case 'auth/configuration-not-found':
                return 'Error de configuración: El servicio de autenticación no está habilitado en Firebase. Por favor, verifica que el método de autenticación por email/contraseña esté habilitado en la consola de Firebase.';
            default:
                return 'An error occurred during authentication. Please try again.';
        }
    }
} 