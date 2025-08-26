"use server";

import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, where } from "firebase/firestore";
import { db } from "./firebase";
import type { Activity } from "./types";
import { auth } from "@/lib/firebase";
import { revalidatePath } from "next/cache";

// Note: This is a simplified version. In a real app, you'd handle users properly.
const getUserId = () => {
    const user = auth.currentUser;
    if (!user) throw new Error("User not authenticated");
    return user.uid;
}

const activitiesCollection = collection(db, "activities");

export const addActivity = async (activity: Omit<Activity, 'id' | 'userId'>) => {
    const userId = getUserId();
    const docRef = await addDoc(activitiesCollection, { ...activity, userId });
    revalidatePath("/dashboard");
    return docRef.id;
};

export const getActivities = async (): Promise<Activity[]> => {
    const userId = getUserId();
    if (!userId) return [];
    
    const q = query(activitiesCollection, where("userId", "==", userId));
    const snapshot = await getDocs(q);
    
    const activities = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    } as Activity));
    return activities;
};

export const updateActivity = async (id: string, activity: Partial<Omit<Activity, 'id' | 'userId'>>) => {
    const docRef = doc(db, "activities", id);
    await updateDoc(docRef, activity);
    revalidatePath("/dashboard");
};

export const deleteActivity = async (id: string) => {
    const docRef = doc(db, "activities", id);
    await deleteDoc(docRef);
    revalidatePath("/dashboard");
};
