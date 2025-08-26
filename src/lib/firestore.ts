"use server";

import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, where, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";
import type { Activity, StudySession } from "./types";
import { revalidatePath } from "next/cache";

const activitiesCollection = collection(db, "activities");
const studySessionsCollection = collection(db, "studySessions");

export const addActivity = async (userId: string, activity: Omit<Activity, 'id' | 'userId'>) => {
    if (!userId) throw new Error("User not authenticated");
    const docRef = await addDoc(activitiesCollection, { ...activity, userId });
    revalidatePath("/dashboard");
    return docRef.id;
};

export const getActivities = async (userId: string): Promise<Activity[]> => {
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

export const addStudySession = async (userId: string, session: Omit<StudySession, 'id' | 'userId'>) => {
    if (!userId) throw new Error("User not authenticated");
    await addDoc(studySessionsCollection, { ...session, userId });
    revalidatePath("/dashboard/reports");
};
