export interface BabyInput {
    babyName: string;
    babyBday: string;
    motherName: string;
    hospital: string;
    notes?: string;
}

export interface BirthRegistrationInput {
    babyName: string;
    registrationNumber: string;
    dateOfBirth: string;
    [key: string]: unknown;
}

export interface NeonatalExamInput {
    date: string;
    maturityWeeks?: string;
    babyGrowth?: string;
    [key: string]: unknown;
}

export interface ImmunizationRecordInput {
    childId: string;
    age: string;
    vaccineType: string;
    date: string;
    batchNo?: string;
    givenBy?: string;
    nextDue?: string;
}

export interface GrowthAnalysisInput {
    childId: string;
    sex: "male" | "female";
    birthDate: string;
    measurementDate: string;
    heightCm?: number;
    weightKg?: number;
    heightPercentile?: number;
    weightPercentile?: number;
    notes?: string;
    imageUrl?: string;
}

export interface MedicalReportInput {
    childId: string;
    name: string;
    type: string;
    storagePath?: string;
}

export interface ChatInput {
    childId?: string;
    message: string;
}

export interface NotificationItem {
    id: string;
    title: string;
    dueDate?: string;
    severity: "info" | "warning" | "critical";
}

export interface DashboardData {
    upcomingVaccinations: number;
    upcomingAppointments: number;
    vaccinesCompleted: number;
    medicalRecords: number;
}
