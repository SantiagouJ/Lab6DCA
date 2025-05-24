import { collection, doc, setDoc, getDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db } from '../Firebase/firebase-config';

export interface User {
    email: string;
    username: string;
}

export class UserService {
    private collection = collection(db, 'users');

    private getCurrentUserId(): string {
        const auth = getAuth();
        const user = auth.currentUser;
        if (!user) {
            throw new Error('User must be authenticated');
        }
        return user.uid;
    }

    async createUser(email: string, username: string): Promise<void> {
        const userId = this.getCurrentUserId();
        const userRef = doc(this.collection, userId);
        
        const userData: User = {
            email,
            username
        };

        await setDoc(userRef, userData);
    }

    async getUser(): Promise<User | null> {
        const userId = this.getCurrentUserId();
        const userRef = doc(this.collection, userId);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
            return userDoc.data() as User;
        }
        return null;
    }
} 