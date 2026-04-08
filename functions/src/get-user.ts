import { onRequest } from "firebase-functions/v2/https";
import { Request, Response } from "express";
import { verifyFirebaseToken } from "./auth";
import { UserService } from "./services/user-service";

export const getMyProfile = onRequest(
    { cors: true },
    async (request: Request, response: Response) => {
        try {
            // 🔐 Get Authorization header
            const authHeader = request.headers.authorization;

            if (!authHeader) {
                response.status(401).send({ message: "Unauthorized" });
                return;
            }

            // ✅ Verify Firebase token
            const decodedToken = await verifyFirebaseToken(authHeader);

            // 👤 Fetch user profile using UID
            const userService = new UserService();
            const userProfile = await userService.getUserByUid(decodedToken.uid);

            if (!userProfile) {
                response.status(404).send({ message: "User profile not found" });
                return;
            }

            // ✅ Success response
            response.status(200).send({
                profile: userProfile,
            });
        } catch (error) {
            console.error("Error in getMyProfile:", error);
            response.status(500).send({
                message: "Internal Server Error",
            });
        }
    }
);