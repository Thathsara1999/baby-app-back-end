// eslint-disable-next-line import/no-unresolved
import { onRequest } from "firebase-functions/v2/https";
import { Request, Response } from "express";

import { ImmunizationService } from "./services/immunaization-service";
import { ImmunizationRequest } from "./firestore/dtos/immunization-request";
import { ImmunizationLogic } from "./business-logics/immunization-logic";


export const createImmunizationData = onRequest(
    { cors: true },
    async (request: Request, response: Response<any>) => {

        try {

            const immunizationData = ImmunizationRequest.fromInterface(request.body);
            const immunizationService = new ImmunizationService();
            const immunizationLogic = new ImmunizationLogic(immunizationService);

            await immunizationLogic.saveImmunizationRecord(immunizationData);
            response.status(200).send({ message: "Immunization record saved successfully" });
            return
        }
        catch (error) {
            console.log(error);
            response.status(500).send({ message: "Internal Server Error" });

            return;
        }
    });




