import { onRequest } from "firebase-functions/v2/https";
import { Request, Response } from "express";

import { BirthRegistrationDataRequest } from "./firestore/dtos/baby-data-request";
import { BabyRegisterLogic } from "./business-logics/baby-register-logic";
import { BabyRegisterService } from "./services/register-service";
import { verifyFirebaseToken } from "./auth";
import { UserService } from "./services/user-service";
import { firestoreInstance } from "./services/firebase";


export const registerBaby = onRequest(
    { cors: true },
    async (request: Request, response: Response<any>) => {
        console.log("Received request to register baby data:", request.body);
        console.log("Authorization header:", request.headers.authorization);
        try {
            const decodedToken = await verifyFirebaseToken(request.headers.authorization);

            if (!decodedToken?.uid) {
                response.status(401).send({ message: "Unauthorized" });
                return;
            }

            const userService = new UserService();
            const userProfile = await userService.getUserByUid(decodedToken.uid);

            if (!userProfile || !userProfile.area) {
                response.status(403).send({
                    message: "Midwife profile with area is required to register baby data",
                });
                return;
            }

            const babyData = BirthRegistrationDataRequest.fromInterface(request.body);
            const babyRegisterService = new BabyRegisterService();
            const babyRegisterLogic = new BabyRegisterLogic(babyRegisterService);
            await babyRegisterLogic.saveBirthData(babyData, {
                createdByUid: decodedToken.uid,
                createdByName: userProfile.name,
                midwifeArea: userProfile.area,
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

export const getMyAreaBirthData = onRequest(
    { cors: true },
    async (request: Request, response: Response<any>) => {
        try {
            const decodedToken = await verifyFirebaseToken(request.headers.authorization);

            const userService = new UserService();
            const userProfile = await userService.getUserByUid(decodedToken.uid);

            if (!userProfile || !userProfile.area) {
                response.status(403).send({ message: "Midwife area not configured" });
                return;
            }

            const babyRegisterService = new BabyRegisterService();
            const babies = await babyRegisterService.getBirthDataByArea(userProfile.area);

            response.status(200).send({
                area: userProfile.area,
                count: babies.length,
                babies,
            });
            return;
        } catch (error) {
            console.error(error);
            response.status(500).send({ message: "Internal Server Error" });
            return;
        }
    }
);

export const getChildData = onRequest(
    { cors: true },
    async (request: Request, response: Response<any>) => {
        try {
            const decodedToken = await verifyFirebaseToken(request.headers.authorization);
            const childId = request.query.childId as string;

            if (!childId) {
                response.status(400).send({ message: "childId is required" });
                return;
            }

            const userService = new UserService();
            const userProfile = await userService.getUserByUid(decodedToken.uid);

            if (!userProfile || !userProfile.area) {
                response.status(403).send({ message: "Midwife area not configured" });
                return;
            }

            // Fetch child data
            const childDoc = await firestoreInstance
                .collection("birthData")
                .doc(childId)
                .get();

            if (!childDoc.exists) {
                response.status(404).send({ message: "Child not found" });
                return;
            }

            const childData = childDoc.data();

            // Verify midwife has access to this child (same area)
            if (childData?.midwifeArea !== userProfile.area && childData?.midwifeArea !== undefined) {
                response.status(403).send({ message: "Access denied to this child's data" });
                return;
            }

            response.status(200).send({
                id: childId,
                ...childData,
            });
            return;
        } catch (error) {
            console.error(error);
            response.status(500).send({ message: "Internal Server Error" });
            return;
        }
    }
);




