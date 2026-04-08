import { onRequest } from "firebase-functions/v2/https";
import { Request, Response } from "express";
// import { verifyFirebaseToken } from "./auth";
// import { UserService } from "./services/user-service";
import { firestoreInstance } from "./services/firebase";

export const ChildData = onRequest(
    { cors: true },
    async (request: Request, response: Response) => {
        try {
            console.log("Received request to get child data with query:", request.query);

            const childId = request.query.childId as string;
            console.log("Extracted childId from query:", childId);
            if (!childId) {
                response.status(400).send({ message: "childId is required" });
                return;
            }

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