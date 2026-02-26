import { firestoreInstance } from "./firebase";
import { ImmunizationModel } from "../firestore/models/immunization-model";

export class ImmunizationService {
    async saveRecord(data: ImmunizationModel): Promise<void> {
        try {
            await firestoreInstance.collection("immunizationRecords").add({
                ...data,
            });
        } catch (error) {
            console.error("Error saving immunization record:", error);
            throw new Error("Failed to save immunization record");
        }
    }

    async getRecords(): Promise<ImmunizationModel[]> {
        try {
            const snapshot = await firestoreInstance.collection("immunizationRecords").get();
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

    async deleteRecord(id: string): Promise<void> {
        try {
            await firestoreInstance.collection("immunizationRecords").doc(id).delete();
        } catch (error) {
            console.error("Error deleting record:", error);
            throw new Error("Failed to delete record");
        }
    }
}