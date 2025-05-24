import { collection, doc, setDoc, getDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db } from '../Firebase/firebase-config';

export interface Task {
    title: string;
    completed: boolean;
}

export interface TaskList {
    userId: string;
    tasklist: Task[];
}

export class TaskService {
    private collection = collection(db, 'tasks');

    private getCurrentUserId(): string {
        const auth = getAuth();
        const user = auth.currentUser;
        if (!user) {
            throw new Error('User must be authenticated to manage tasks');
        }
        return user.uid;
    }

    async addTask(title: string): Promise<void> {
        const userId = this.getCurrentUserId();
        const taskRef = doc(this.collection, userId);
        const taskDoc = await getDoc(taskRef);

        const newTask: Task = {
            title,
            completed: false
        };

        if (!taskDoc.exists()) {
            // Si no existe el documento, crear uno nuevo
            await setDoc(taskRef, {
                userId,
                tasklist: [newTask]
            });
        } else {
            // Si existe, agregar la tarea a la lista existente
            await updateDoc(taskRef, {
                tasklist: arrayUnion(newTask)
            });
        }
    }

    async getTasks(): Promise<Task[]> {
        const userId = this.getCurrentUserId();
        const taskRef = doc(this.collection, userId);
        const taskDoc = await getDoc(taskRef);

        if (taskDoc.exists()) {
            const data = taskDoc.data() as TaskList;
            return data.tasklist;
        }
        return [];
    }

    async toggleTask(taskIndex: number, completed: boolean): Promise<void> {
        const userId = this.getCurrentUserId();
        const taskRef = doc(this.collection, userId);
        const taskDoc = await getDoc(taskRef);

        if (!taskDoc.exists()) {
            throw new Error('Task list not found');
        }

        const data = taskDoc.data() as TaskList;
        const updatedTasklist = [...data.tasklist];
        updatedTasklist[taskIndex] = {
            ...updatedTasklist[taskIndex],
            completed
        };

        await updateDoc(taskRef, {
            tasklist: updatedTasklist
        });
    }

    async deleteTask(taskIndex: number): Promise<void> {
        const userId = this.getCurrentUserId();
        const taskRef = doc(this.collection, userId);
        const taskDoc = await getDoc(taskRef);

        if (!taskDoc.exists()) {
            throw new Error('Task list not found');
        }

        const data = taskDoc.data() as TaskList;
        const updatedTasklist = data.tasklist.filter((_, index) => index !== taskIndex);

        await updateDoc(taskRef, {
            tasklist: updatedTasklist
        });
    }
} 