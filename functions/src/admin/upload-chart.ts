import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { ImageAnnotatorClient } from "@google-cloud/vision";

admin.initializeApp();

const visionClient = new ImageAnnotatorClient();

export const extractChartData = functions.https.onRequest(
    async (req, res) => {
        try {
            // Allow only POST
            if (req.method !== "POST") {
                res.status(405).json({ error: "Method Not Allowed" });
                return;
            }

            const { imageUrl, childId } = req.body;

            if (!imageUrl || !childId) {
                res.status(400).json({
                    error: "imageUrl and childId are required",
                });
                return;
            }

            // 🔍 Send image to Google Vision
            const [result] = await visionClient.textDetection(imageUrl);
            const detections = result.textAnnotations;

            if (!detections || detections.length === 0) {
                res.status(404).json({
                    error: "No text detected",
                });
                return;
            }

            const rawText = detections[0].description || "";

            // 🧠 Parse extracted text
            const structuredData = parseChartText(rawText);

            // 💾 Save to Firestore
            const docRef = await admin
                .firestore()
                .collection("children")
                .doc(childId)
                .collection("charts")
                .add({
                    ...structuredData,
                    createdAt: admin.firestore.FieldValue.serverTimestamp(),
                });

            res.status(200).json({
                success: true,
                chartId: docRef.id,
                data: structuredData,
            });

        } catch (error: any) {
            console.error(error);
            res.status(500).json({
                error: error.message,
            });
        }
    }
);


// 🔎 Custom Parsing Algorithm
function parseChartText(text: string) {
    const lines = text.split("\n");
    const records: any[] = [];

    for (let line of lines) {
        const match = line.match(
            /(\d+)\s*m?\s+([\d.]+)\s*kg\s+(\d+)\s*cm/i
        );

        if (match) {
            records.push({
                ageMonths: Number(match[1]),
                weight: Number(match[2]),
                height: Number(match[3]),
            });
        }
    }

    return { records };
}