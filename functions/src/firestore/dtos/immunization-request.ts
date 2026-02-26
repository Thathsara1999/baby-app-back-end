import { Timestamp } from "firebase-admin/firestore";

export class ImmunizationRequest {
    id?: string;

    age!: string;
    vaccineType!: string;
    date!: string;

    batchNo?: string;
    givenBy?: string;
    nextDue?: string;

    createdAt?: Timestamp;
    updatedAt?: Timestamp;

    static fromInterface(json: Partial<ImmunizationRequest>): ImmunizationRequest {
        const model = new ImmunizationRequest();
        model.id = json.id || "";
        model.age = json.age || "";
        model.vaccineType = json.vaccineType || "";
        model.date = json.date || "";
        model.batchNo = json.batchNo || "";
        model.givenBy = json.givenBy || "";
        model.nextDue = json.nextDue || "";
        return model;
    }
}