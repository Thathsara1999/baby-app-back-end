import { onRequest } from "firebase-functions/v2/https";
import { Request, Response } from "express";

import { verifyFirebaseToken } from "./auth";
import { UserService } from "./services/user-service";

export const getMyProfile = onRequest(
    { cors: true },
    async (request: Request, response: Response<any>) => {
        try {
            const decodedToken = await verifyFirebaseToken(request.headers.authorization);
            const userService = new UserService();
            const userProfile = await userService.getUserByUid(decodedToken.uid);

            if (!userProfile) {
                response.status(404).send({ message: "User profile not found" });
                return;
            }

            response.status(200).send({ profile: userProfile });
            return;
        } catch (error) {
            console.error(error);
            response.status(500).send({ message: "Internal Server Error" });
            return;
        }
    }
);
