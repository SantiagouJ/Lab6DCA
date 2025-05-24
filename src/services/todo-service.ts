import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc, query, orderBy, where } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db } from '../Firebase/firebase-config';

export interface Todo {
    id?: string;
    text: string;
    completed: boolean;
    createdAt: Date;
    userId: string;
}

export class TodoService {
    private collection = collection(db, 'todos');

    private getCurrentUserId(): string {
        const auth = getAuth();
        const user = auth.currentUser;
        if (!user) {
            throw new Error('User must be authenticated to manage todos');
        }
        return user.uid;
    }

    async addTodo(text: string): Promise<void> {
        const userId = this.getCurrentUserId();
        const todo: Omit<Todo, 'id'> = {
            text,
            completed: false,
            createdAt: new Date(),
            userId
        };
        await addDoc(this.collection, todo);
    }

    async getTodos(): Promise<Todo[]> {
        try {
            const userId = this.getCurrentUserId();
            const q = query(
                this.collection,
                where('userId', '==', userId),
                orderBy('createdAt', 'desc')
            );
            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    ...data,
                    createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : data.createdAt
                } as Todo;
            });
        } catch (error: any) {
            if (error.message.includes('requires an index')) {
                console.error('Please create the required index in Firebase Console:', error.message);
                // Fallback to a simpler query while the index is being created
                const userId = this.getCurrentUserId();
                const q = query(
                    this.collection,
                    where('userId', '==', userId)
                );
                const querySnapshot = await getDocs(q);
                const todos = querySnapshot.docs.map(doc => {
                    const data = doc.data();
                    return {
                        id: doc.id,
                        ...data,
                        createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : data.createdAt
                    } as Todo;
                });
                // Sort in memory as a temporary solution
                return todos.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
            }
            throw error;
        }
    }

    async deleteTodo(id: string): Promise<void> {
        const userId = this.getCurrentUserId();
        const todoRef = doc(this.collection, id);
        const todoDoc = await getDocs(query(this.collection, where('__name__', '==', id)));
        
        if (todoDoc.empty) {
            throw new Error('Todo not found');
        }

        const todo = todoDoc.docs[0].data() as Todo;
        if (todo.userId !== userId) {
            throw new Error('Unauthorized to delete this todo');
        }

        await deleteDoc(todoRef);
    }

    async toggleTodo(id: string, completed: boolean): Promise<void> {
        const userId = this.getCurrentUserId();
        const todoRef = doc(this.collection, id);
        const todoDoc = await getDocs(query(this.collection, where('__name__', '==', id)));
        
        if (todoDoc.empty) {
            throw new Error('Todo not found');
        }

        const todo = todoDoc.docs[0].data() as Todo;
        if (todo.userId !== userId) {
            throw new Error('Unauthorized to modify this todo');
        }

        await updateDoc(todoRef, { completed });
    }
} 