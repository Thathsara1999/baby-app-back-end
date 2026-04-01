
import { UserDataRequest } from "../firestore/dtos/user-data-request";
import { firestoreInstance } from "./firebase";

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  role: "midwife" | "admin";
  area: string;
}

export class UserService {


  async saveUser(user: UserDataRequest) {
    await firestoreInstance.collection("users").doc(user.uid).set({
      name: user.name,
      email: user.email,
      role: user.role,
      area: user.area,
      createdAt: new Date(),
    }, { merge: true });
  }

  async getUserByUid(uid: string): Promise<UserProfile | null> {
    const userDoc = await firestoreInstance.collection("users").doc(uid).get();

    if (!userDoc.exists) {
      return null;
    }

    const data = userDoc.data() || {};
    return {
      uid,
      name: data.name || "",
      email: data.email || "",
      role: data.role === "admin" ? "admin" : "midwife",
      area: data.area || "",
    };
  }
}