import { onRequest } from "firebase-functions/v2/https";
import { Request, Response } from "express";
import { BirthRegistrationDataRequest } from "./firestore/dtos/baby-data-request";
import { BabyRegisterLogic } from "./business-logics/baby-register-logic";
import { BabyRegisterService } from "./services/register-service";
//import { verifyFirebaseToken } from "./auth";
//import { UserService } from "./services/user-service";

export const registerBaby = onRequest(
    { cors: true },
    async (request: Request, response: Response<any>) => {
        console.log("Received request to register baby data:", request.body);
        console.log("Authorization header:", request.headers.authorization);
        try {
            // const decodedToken = await verifyFirebaseToken(request.headers.authorization);

            // if (!decodedToken?.uid) {
            //     response.status(401).send({ message: "Unauthorized" });
            //     return;
            // }

            //     const userService = new UserService();
            // const userProfile = await userService.getUserByUid(decodedToken.uid);

            // if (!userProfile || !userProfile.area) {
            //     response.status(403).send({
            //         message: "Midwife profile with area is required to register baby data",
            //     });
            //     return;
            // }

            const babyData = BirthRegistrationDataRequest.fromInterface(request.body);
            const babyRegisterService = new BabyRegisterService();
            const babyRegisterLogic = new BabyRegisterLogic(babyRegisterService);
            await babyRegisterLogic.saveBirthData(babyData, {
                createdByUid: "Not assigned",
                createdByName: "Midwife",
                midwifeArea: "Not assigned",
            });
            response.status(200).send({ message: "Birth data registered successfully" });
            return;
        }
        catch (error) {
            console.log(error);
            response.status(500).send({ message: "Internal Server Error" });

            return;
        }


    });
