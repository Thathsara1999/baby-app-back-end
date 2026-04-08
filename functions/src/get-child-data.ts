import { onRequest } from "firebase-functions/v2/https";
import { Request, Response } from "express";
// import { verifyFirebaseToken } from "./auth";
// import { UserService } from "./services/user-service";
import { firestoreInstance } from "./services/firebase";

export const getChildData = onRequest(
    { cors: true },
    async (request: Request, response: Response) => {
        try {
            console.log("Received request to get child data with query:", request.query);
            // 🔐 Get token safely
            // const authHeader = request.headers.authorization;
            // if (!authHeader) {
            //     response.status(401).send({ message: "Unauthorized" });
            //     return;
            // }

            // const decodedToken = await verifyFirebaseToken(authHeader);

            // 📥 Get query param
            const childId = request.query.childId as string;

            if (!childId) {
                response.status(400).send({ message: "childId is required" });
                return;
            }

            // 👤 Get user profile
            // const userService = new UserService();
            // const userProfile = await userService.getUserByUid(decodedToken.uid);

            // if (!userProfile || !userProfile.area) {
            //     response
            //         .status(403)
            //         .send({ message: "Midwife area not configured" });
            //     return;
            // }

            // 📦 Fetch child data
            const childDoc = await firestoreInstance
                .collection("children")
                .doc(childId)
                .get();

            if (!childDoc.exists) {
                response.status(404).send({ message: "Child not found" });
                return;
            }

            const childData = childDoc.data();

            console.log("Fetched child data:", childData);

            // // 🔒 Access check
            // if (
            //     childData?.midwifeArea &&
            //     childData.midwifeArea !== userProfile.area
            // ) {
            //     response
            //         .status(403)
            //         .send({ message: "Access denied to this child's data" });
            //     return;
            // }

            // ✅ Success response
            response.status(200).send({
                id: childId,
                ...childData,
            });
        } catch (error) {
            console.error("Error in getChildData:", error);
            response.status(500).send({
                message: "Internal Server Error",
            });
        }
    }
);