
import { BirthRegistrationDataModel } from "../firestore/models/baby-register-data-model";
import { firestoreInstance } from "./firebase";

export interface BirthRecordOwnership {
    createdByUid: string;
    createdByName: string;
    midwifeArea: string;
}


export class BabyRegisterService {


    async registerBaby(
        data: BirthRegistrationDataModel,
        ownership: BirthRecordOwnership
    ): Promise<void> {
        try {

            await firestoreInstance
                .collection("children")
                .add({
                    ...data,
                    ...ownership,
                });
        } catch (error) {
            console.error("Error creating birth data:", error);
            throw new Error("Failed to create birth data");
        }
    }

    async getBirthDataByArea(midwifeArea: string) {
        const snapshot = await firestoreInstance
            .collection("children")
            .where("midwifeArea", "==", midwifeArea)
            .orderBy("createdAt", "desc")
            .get();

        return snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));
    }
}   