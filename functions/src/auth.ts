import { Request, Response } from "express";
import * as admin from "firebase-admin";
import { onRequest } from "firebase-functions/v2/https";

if (!admin.apps.length) {
    admin.initializeApp();
}
export const verifyToken = onRequest(
    { cors: true },
    async (req: Request, res: Response) => {
        try {
            const authHeader = req.headers.authorization;

            if (!authHeader || !authHeader.startsWith("Bearer ")) {
                res.status(401).json({
                    valid: false,
                    message: "No token provided",
                });
                return;
            }

            const token = authHeader.split("Bearer ")[1];

            const decodedToken = await admin.auth().verifyIdToken(token);

            res.json({
                valid: true,
                uid: decodedToken.uid,
                email: decodedToken.email,
            });
        } catch (error) {
            console.error("Token verification failed:", error);

            res.status(401).json({
                valid: false,
                message: "Invalid token",
            });
        }
    }
);



import { DecodedIdToken } from "firebase-admin/auth";

export const verifyFirebaseToken = async (
    authHeader?: string
): Promise<DecodedIdToken> => {
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new Error("No token provided");
    }

    const token = authHeader.split("Bearer ")[1];

    const decodedToken = await admin.auth().verifyIdToken(token);

    return decodedToken;
};


export const verifyBearerToken = async function (
    request: Request
): Promise<boolean> {
    try {
        //const reqData = request.body;
        //console.log("Request data: ", reqData);

        //console.log("Request header :", request.rawHeaders);
        // Filter the array to get elements containing the Bearer
        const bearer: string[] = request.rawHeaders.filter((element: string) =>
            element.includes("Bearer")
        );
        const authToken = bearer[0].split("Bearer ")[1];

        //console.log("Id token: ", authToken);

        const decodedToken: DecodedIdToken = await admin
            .auth()
            .verifyIdToken(authToken);
        console.log("Decoded token: ", decodedToken);

        // Check if user is anonymous
        if (decodedToken.provider_id || decodedToken.provider_id === "anonymous") {
            console.log("Anonymous user login");
        }

        //console.log('Decoded token: ', decodedToken);

        // If verification succeeds, the token is valid
        return !!decodedToken;
    } catch (error) {
        // If verification fails, the token is invalid
        console.error("Error verifying token:", error);
        return false;
    }
};