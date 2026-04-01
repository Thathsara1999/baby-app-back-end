// eslint-disable-next-line import/no-unresolved
import { onRequest } from "firebase-functions/v2/https";
import { Request, Response } from "express";

import { BirthRegistrationDataRequest } from "./firestore/dtos/baby-data-request";
import { BabyRegisterLogic } from "./business-logics/baby-register-logic";
import { BabyRegisterService } from "./services/register-service";
import { verifyFirebaseToken } from "./auth";


export const registerBaby = onRequest(
    { cors: true },
    async (request: Request, response: Response<any>) => {
        console.log("Received request to register baby data:", request.body);
        console.log("Authorization header:", request.headers.authorization);
        try {
            const isValidToken = await verifyFirebaseToken(request.headers.authorization);

            if (!isValidToken) {
                response.status(401).send({ message: "Unauthorized" });
                return;
            }

            const babyData = BirthRegistrationDataRequest.fromInterface(request.body);
            const babyRegisterService = new BabyRegisterService();
            const babyRegisterLogic = new BabyRegisterLogic(babyRegisterService);
            await babyRegisterLogic.saveBirthData(babyData);
            response.status(200).send({ message: "Birth data registered successfully" });
            return;
        }
        catch (error) {
            console.log(error);
            response.status(500).send({ message: "Internal Server Error" });

            return;
        }


    });




