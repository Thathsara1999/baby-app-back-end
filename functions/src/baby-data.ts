// eslint-disable-next-line import/no-unresolved
import { onRequest } from "firebase-functions/v2/https";
import { Request, Response } from "express";

import { BirthRegistrationDataRequest } from "./firestore/dtos/baby-data-request";
import { BabyRegisterLogic } from "./business-logics/baby-register-logic";
import { BabyRegisterService } from "./services/register-service";


export const registerBaby = onRequest(
    { cors: true },
    async (request: Request, response: Response<any>) => {

        try {

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




