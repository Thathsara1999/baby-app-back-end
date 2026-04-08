import { firestoreInstance } from "./firebase";
import { ImmunizationModel } from "../firestore/models/immunization-model";

export class ImmunizationService {
    async saveRecord(childId: string, data: ImmunizationModel): Promise<string> {
        try {
            const docRef = await firestoreInstance.collection("children").
                doc(childId).collection("immunizationRecords").

                add({
                    ...data,
                });

            return docRef.id;
        } catch (error) {
            console.error("Error saving immunization record:", error);
            throw new Error("Failed to save immunization record");
        }
    }

    async getRecords(childId: string): Promise<ImmunizationModel[]> {
        try {
            const snapshot = await firestoreInstance.collection("children").doc(childId).collection("immunizationRecords").get();
            const records: ImmunizationModel[] = [];
            snapshot.forEach((doc) => {
                records.push({ id: doc.id, ...doc.data() } as ImmunizationModel);
            });
            return records;
        } catch (error) {
            console.error("Error fetching records:", error);
            throw new Error("Failed to fetch records");
        }
    }

    async deleteRecord(childId: string, id: string): Promise<void> {
        try {
            await firestoreInstance.collection("children").doc(childId).collection("immunizationRecords").doc(id).delete();
        } catch (error) {
            console.error("Error deleting record:", error);
            throw new Error("Failed to delete record");
        }
    }
}