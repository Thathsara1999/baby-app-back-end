import { BirthRegistrationDataRequest } from "../firestore/dtos/baby-data-request";

import { BirthRegistrationDataModel } from "../firestore/models/baby-register-data-model";

import { BabyRegisterService } from "../services/register-service";

export class BabyRegisterLogic {
    private _babyRegisterService: BabyRegisterService

    constructor(babyRegisterService: BabyRegisterService) {
        this._babyRegisterService = babyRegisterService;
    }

    async saveBirthData(data: BirthRegistrationDataRequest): Promise<void> {
        try {
            const model = BirthRegistrationDataModel.modelForDatabase(data);
            await this._babyRegisterService.registerBaby(model);
        } catch (error) {
            console.error("Error saving birth data:", error);
            throw new Error("Failed to save birth data");
        }
    }
}