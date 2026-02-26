
import { BirthRegistrationDataModel } from "../firestore/models/baby-register-data-model";
import { firestoreInstance } from "./firebase";


export class BabyRegisterService {


    async registerBaby(data: BirthRegistrationDataModel): Promise<void> {
        try {

            await firestoreInstance
                .collection("birthData")
                .add({
                    ...data
                });
        } catch (error) {
            console.error("Error creating birth data:", error);
            throw new Error("Failed to create birth data");
        }
    }
}   