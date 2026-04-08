// eslint-disable-next-line import/no-unresolved
import { onRequest } from "firebase-functions/v2/https";
import { Request, Response } from "express";
import { Timestamp } from "firebase-admin/firestore";

import { firestoreInstance } from "./services/firebase";

export const createNeonatalExamData = onRequest(
  { cors: true },
  async (request: Request, response: Response<any>) => {
    try {
      if (request.method !== "POST") {
        response.status(405).send({ message: "Method Not Allowed" });
        return;
      }

      const payload = (request.body ?? {}) as Record<string, unknown>;
      const childId = String(payload.childId ?? "").trim();

      if (!childId) {
        response.status(400).send({ message: "childId is required" });
        return;
      }

      const docRef = await firestoreInstance
        .collection("children")
        .doc(childId)
        .collection("neonatalExamination")
        .add({
          ...payload,
          childId,
          updatedAt: Timestamp.now(),
          createdAt: Timestamp.now(),
        });

      response.status(200).send({
        message: "Neonatal examination saved successfully",
        record: {
          id: docRef.id,
          ...payload,
          childId,
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
