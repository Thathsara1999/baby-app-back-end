import { onRequest } from "firebase-functions/v2/https";
import { Request, Response } from "express";
import { BabyRegisterService } from "./services/register-service";
import { verifyFirebaseToken } from "./auth";
import { UserService } from "./services/user-service";


export const getMyAreaBirthData = onRequest(
    { cors: true },
    async (request: Request, response: Response<any>) => {
        try {
            const decodedToken = await verifyFirebaseToken(request.headers.authorization);

            const userService = new UserService();
            const userProfile = await userService.getUserByUid(decodedToken.uid);

            if (!userProfile || !userProfile.area) {
                response.status(403).send({ message: "Midwife area not configu" });
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