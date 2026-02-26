import {
    IsNotEmpty,
    IsOptional,
    IsString,
} from "class-validator";
import { QueryDocumentSnapshot, Timestamp } from "firebase-admin/firestore";
import { ImmunizationRequest } from "../dtos/immunization-request";

export class ImmunizationModel {
    @IsOptional()
    id?: string;

    @IsString()
    @IsNotEmpty()
    age!: string;

    @IsString()
    @IsNotEmpty()
    vaccineType!: string;

    @IsString()
    @IsNotEmpty()
    date!: string;

    @IsString()
    @IsOptional()
    batchNo?: string;

    @IsString()
    @IsOptional()
    givenBy?: string;

    @IsString()
    @IsOptional()
    nextDue?: string;

    createdAt?: Timestamp;
    updatedAt?: Timestamp;

    // ---------- Firestore save ----------
    static modelForDatabase(
        json: ImmunizationRequest
    ): ImmunizationRequest {
        const model = new ImmunizationModel();

        model.age = json.age;
        model.vaccineType = json.vaccineType;
        model.date = json.date;
        model.batchNo = json.batchNo;
        model.givenBy = json.givenBy;
        model.nextDue = json.nextDue;
        model.createdAt = Timestamp.now();
        model.updatedAt = Timestamp.now();

        const filteredEntries = Object.entries(model).filter(
            ([_, value]) => value !== undefined && value !== ""
        );

        return Object.fromEntries(filteredEntries) as ImmunizationRequest;
    }

    // ---------- Firestore read ----------
    static fromDocumentSnapshot(
        snap: QueryDocumentSnapshot<FirebaseFirestore.DocumentData>
    ): ImmunizationRequest {
        const model = new ImmunizationRequest();

        model.id = snap.id;
        model.age = snap.get("age");
        model.vaccineType = snap.get("vaccineType");
        model.date = snap.get("date");
        model.batchNo = snap.get("batchNo");
        model.givenBy = snap.get("givenBy");
        model.nextDue = snap.get("nextDue");
        model.createdAt = snap.get("createdAt");
        model.updatedAt = snap.get("updatedAt");

        const filteredEntries = Object.entries(model).filter(
            ([_, value]) => value !== undefined && value !== ""
        );

        return Object.fromEntries(filteredEntries) as ImmunizationRequest;
    }
}