import { ImmunizationRequest } from "../firestore/dtos/immunization-request";
import { ImmunizationModel } from "../firestore/models/immunization-model";
import { ImmunizationService } from "../services/immunaization-service";

export class ImmunizationLogic {
    private _immunizationService: ImmunizationService;

    constructor(immunizationService: ImmunizationService) {
        this._immunizationService = immunizationService;
    }

    async saveImmunizationRecord(data: ImmunizationRequest): Promise<void> {
        try {
            const model = ImmunizationModel.modelForDatabase(data);
            await this._immunizationService.saveRecord(model);
        } catch (error) {
            console.error("Error saving immunization record:", error);
            throw new Error("Failed to save immunization record");
        }
    }
}