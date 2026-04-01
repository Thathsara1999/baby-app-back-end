
import { UserDataRequest } from "../firestore/dtos/user-data-request";
import { firestoreInstance } from "./firebase";

export class UserService {
  

  async saveUser(user: UserDataRequest) {
    await firestoreInstance.collection("users").doc(user.uid).set({
      name: user.name,
      email: user.email,
      createdAt: new Date(),
    });
  }
}