// eslint-disable-next-line import/no-unresolved
import { onRequest } from "firebase-functions/v2/https";
import { Request, Response } from "express";
import { Timestamp } from "firebase-admin/firestore";

import { firestoreInstance } from "./services/firebase";

export const createGrowthRecordData = onRequest(
    { cors: true },
    async (request: Request, response: Response<any>) => {
        try {
            if (request.method !== "POST") {
                response.status(405).send({ message: "Method Not Allowed" });
                return;
            }

            const payload = (request.body ?? {}) as Record<string, unknown>;
            const childId = String(payload.childId ?? "").trim();
            const date = String(payload.date ?? "").trim();
            const weight = Number(payload.weight);
            const height = Number(payload.height);

            if (!childId) {
                response.status(400).send({ message: "childId is required" });
                return;
            }

            if (!date || Number.isNaN(weight) || Number.isNaN(height)) {
                response
                    .status(400)
                    .send({ message: "date, weight, and height are required" });
                return;
            }

            const docRef = await firestoreInstance
                .collection("children")
                .doc(childId)
                .collection("growthRecords")
                .add({
                    childId,
                    date,
                    weight,
                    height,
                    createdAt: Timestamp.now(),
                    updatedAt: Timestamp.now(),
                });

            response.status(200).send({
                message: "Growth record saved successfully",
                record: {
                    id: docRef.id,
                    childId,
                    date,
                    weight,
                    height,
                },
            });
            return;
        } catch (error) {
            console.log(error);
            response.status(500).send({ message: "Internal Server Error" });
            return;
        }
    },
);
