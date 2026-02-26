import {
    IsNotEmpty,
    IsOptional,
    IsString,
    IsIn,
} from "class-validator";
import { QueryDocumentSnapshot, Timestamp } from "firebase-admin/firestore";
import { BirthRegistrationDataRequest } from "../dtos/baby-data-request";

export class BirthRegistrationDataModel {
    @IsOptional()
    id?: string;

    @IsNotEmpty()
    babyName?: string;

    @IsString()
    @IsNotEmpty()
    registrationNumber?: string;

    @IsString()
    @IsNotEmpty()
    dateOfBirth?: string;

    @IsString()
    @IsOptional()
    timeOfBirth?: string;

    @IsString()
    @IsOptional()
    placeOfBirth?: string;

    @IsIn(["male", "female", ""])
    @IsOptional()
    sex?: "male" | "female" | "";

    @IsIn(["normal", "cesarean", ""])
    @IsOptional()
    deliveryType?: "normal" | "cesarean" | "";

    @IsString()
    @IsOptional()
    gestationalAge?: string;

    @IsString()
    @IsOptional()
    birthWeight?: string;

    @IsString()
    @IsOptional()
    birthLength?: string;

    @IsString()
    @IsOptional()
    headCircumference?: string;

    @IsString()
    @IsOptional()
    hospital?: string;

    @IsString()
    @IsOptional()
    ward?: string;

    @IsString()
    @IsOptional()
    bedNumber?: string;

    @IsString()
    @IsOptional()
    motherName?: string;

    @IsString()
    @IsOptional()
    motherAge?: string;

    @IsString()
    @IsOptional()
    fatherName?: string;

    @IsString()
    @IsOptional()
    fatherAge?: string;

    @IsString()
    @IsOptional()
    address?: string;

    @IsString()
    @IsOptional()
    contactNumber?: string;

    @IsString()
    @IsOptional()
    medicalOfficer?: string;

    @IsString()
    @IsOptional()
    nurseInCharge?: string;

    @IsString()
    @IsOptional()
    complications?: string;

    @IsString()
    @IsOptional()
    remarks?: string;

    createdAt?: Timestamp;
    updatedAt?: Timestamp;

    // ---------- Firestore save ----------
    static modelForDatabase(
        json: BirthRegistrationDataRequest
    ): BirthRegistrationDataModel {
        const model = new BirthRegistrationDataModel();

        model.babyName = json.babyName;
        model.registrationNumber = json.registrationNumber;
        model.dateOfBirth = json.dateOfBirth;
        model.timeOfBirth = json.timeOfBirth;
        model.placeOfBirth = json.placeOfBirth;
        model.sex = json.sex;
        model.deliveryType = json.deliveryType;
        model.gestationalAge = json.gestationalAge;
        model.birthWeight = json.birthWeight;
        model.birthLength = json.birthLength;
        model.headCircumference = json.headCircumference;
        model.hospital = json.hospital;
        model.ward = json.ward;
        model.bedNumber = json.bedNumber;
        model.motherName = json.motherName;
        model.motherAge = json.motherAge;
        model.fatherName = json.fatherName;
        model.fatherAge = json.fatherAge;
        model.address = json.address;
        model.contactNumber = json.contactNumber;
        model.medicalOfficer = json.medicalOfficer;
        model.nurseInCharge = json.nurseInCharge;
        model.complications = json.complications;
        model.remarks = json.remarks;
        model.createdAt = Timestamp.now();
        model.updatedAt = Timestamp.now();


        const filteredEntries = Object.entries(model).filter(
            ([_, value]) => value !== undefined && value !== ""
        );

        return Object.fromEntries(filteredEntries) as BirthRegistrationDataRequest;
    }

    // ---------- Firestore read ----------
    static fromDocumentSnapshot(
        snap: QueryDocumentSnapshot<FirebaseFirestore.DocumentData>
    ): BirthRegistrationDataRequest {
        const model = new BirthRegistrationDataRequest();


        model.babyName = snap.get("babyName");
        model.registrationNumber = snap.get("registrationNumber");
        model.dateOfBirth = snap.get("dateOfBirth");
        model.timeOfBirth = snap.get("timeOfBirth");
        model.placeOfBirth = snap.get("placeOfBirth");
        model.sex = snap.get("sex");
        model.deliveryType = snap.get("deliveryType");
        model.gestationalAge = snap.get("gestationalAge");
        model.birthWeight = snap.get("birthWeight");
        model.birthLength = snap.get("birthLength");
        model.headCircumference = snap.get("headCircumference");
        model.hospital = snap.get("hospital");
        model.ward = snap.get("ward");
        model.bedNumber = snap.get("bedNumber");
        model.motherName = snap.get("motherName");
        model.motherAge = snap.get("motherAge");
        model.fatherName = snap.get("fatherName");
        model.fatherAge = snap.get("fatherAge");
        model.address = snap.get("address");
        model.contactNumber = snap.get("contactNumber");
        model.medicalOfficer = snap.get("medicalOfficer");
        model.nurseInCharge = snap.get("nurseInCharge");
        model.complications = snap.get("complications");
        model.remarks = snap.get("remarks");
        model.createdAt = snap.get("createdAt");
        model.updatedAt = snap.get("updatedAt");

        const filteredEntries = Object.entries(model).filter(
            ([_, value]) => value !== undefined && value !== ""
        );

        return Object.fromEntries(filteredEntries) as BirthRegistrationDataRequest;
    }
}