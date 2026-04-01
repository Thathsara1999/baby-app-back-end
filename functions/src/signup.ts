import { onRequest } from "firebase-functions/v2/https";
import { Request, Response } from "express";
import { UserDataRequest } from "./firestore/dtos/user-data-request";
import { UserService } from "./services/user-service";
import { UserRegisterLogic } from "./business-logics/user-register-logic";
import { verifyFirebaseToken } from "./auth";


export const registerUser = onRequest(
    { cors: true },
    async (request: Request, response: Response<any>) => {
        try {
            const decodedToken = await verifyFirebaseToken(request.headers.authorization);
            const userData = UserDataRequest.fromInterface(request.body);

            if (decodedToken.uid !== userData.uid) {
                response.status(403).send({ message: "Token/user mismatch" });
                return;
            }

            const userService = new UserService();
            const userLogic = new UserRegisterLogic(userService);

            await userLogic.saveUserData(userData);

            response.status(200).send({
                message: "User registered successfully",
            });

            return;
        } catch (error) {
            console.error(error);
            response.status(500).send({
                message: "Internal Server Error",
            });
            return;
        }
    }
);