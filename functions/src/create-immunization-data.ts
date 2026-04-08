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
            if (request.method !== "POST") {
                response.status(405).send({ message: "Method Not Allowed" });
                return;
            }

            const immunizationData = ImmunizationRequest.fromInterface(request.body);

            if (!immunizationData.childId?.trim()) {
                response.status(400).send({ message: "childId is required" });
                return;
            }

            const immunizationService = new ImmunizationService();
            const immunizationLogic = new ImmunizationLogic(immunizationService);

            const savedRecord = await immunizationLogic.saveImmunizationRecord(
                immunizationData,
                immunizationData.childId,
            );

            response.status(200).send({
                message: "Immunization record saved successfully",
                record: savedRecord,
            });
            return;
        }
        catch (error) {
            console.log(error);
            response.status(500).send({ message: "Internal Server Error" });

            return;
        }
    });




