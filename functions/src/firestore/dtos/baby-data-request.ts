import { Timestamp } from "firebase-admin/firestore";

export class BirthRegistrationDataRequest {
    babyName!: string;
    registrationNumber!: string;
    dateOfBirth!: string;
    timeOfBirth?: string;
    placeOfBirth?: string;
    sex?: "male" | "female" | "";
    deliveryType?: "normal" | "cesarean" | "";
    gestationalAge?: string;
    birthWeight?: string;
    birthLength?: string;
    headCircumference?: string;
    hospital?: string;
    ward?: string;
    bedNumber?: string;
    motherName?: string;
    motherAge?: string;
    fatherName?: string;
    fatherAge?: string;
    address?: string;
    contactNumber?: string;
    medicalOfficer?: string;
    nurseInCharge?: string;
    complications?: string;
    remarks?: string;
    createdAt?: Timestamp;
    updatedAt?: Timestamp;



    static fromInterface(json: Partial<BirthRegistrationDataRequest>): BirthRegistrationDataRequest {
        const model = new BirthRegistrationDataRequest();
        model.babyName = json.babyName || "";
        model.registrationNumber = json.registrationNumber || "";
        model.dateOfBirth = json.dateOfBirth || "";
        model.timeOfBirth = json.timeOfBirth || "";
        model.placeOfBirth = json.placeOfBirth || "";
        model.sex = json.sex
        model.deliveryType = json.deliveryType || "";
        model.gestationalAge = json.gestationalAge || "";
        model.birthWeight = json.birthWeight || "";
        model.birthLength = json.birthLength || "";
        model.headCircumference = json.headCircumference || "";
        model.hospital = json.hospital || "";
        model.ward = json.ward || "";
        model.bedNumber = json.bedNumber || "";
        model.motherName = json.motherName || "";
        model.motherAge = json.motherAge || "";
        model.fatherName = json.fatherName || "";
        model.fatherAge = json.fatherAge || "";
        model.address = json.address || "";
        model.contactNumber = json.contactNumber || "";
        model.medicalOfficer = json.medicalOfficer || "";
        model.nurseInCharge = json.nurseInCharge || "";
        model.complications = json.complications || "";
        model.remarks = json.remarks || "";

        return model
    }


}