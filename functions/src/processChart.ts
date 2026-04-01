
// // Type definition for request body
// interface ChartRequest {
//     chartType: string
//     csvData?: string
//     fileBase64?: string
//     fileName?: string
//     fileMimeType?: string
// }

// // Cloud Function: Process Chart
// export const processChart = functions.https.onRequest(async (req, res) => {
//     return corsHandler(req, res, async () => {
//         try {
//             if (req.method !== 'POST') {
//                 res.status(405).json({ error: 'Method not allowed' })
//                 return
//             }

//             const { chartType, csvData, fileBase64, fileName, fileMimeType } = req.body as ChartRequest

//             // Validate input
//             if (!chartType) {
//                 res.status(400).json({ error: 'chartType is required' })
//                 return
//             }

//             let jsonData = {}

//             // Process CSV data when provided
//             if (csvData && csvData.trim()) {
//                 console.log(`Processing CSV data for chart type: ${chartType}`)
//                 jsonData = parseChartData(csvData, chartType)
//             } else if (fileBase64 && fileBase64.trim()) {
//                 const uploadedSizeBytes = Math.floor((fileBase64.length * 3) / 4)
//                 const mime = (fileMimeType || '').toLowerCase()

//                 console.log(`Processing uploaded file for chart type: ${chartType} (${mime || 'unknown'})`)

//                 let extractedText = ''
//                 let imageBase64 = undefined

//                 if (mime === 'application/pdf' || (fileName || '').toLowerCase().endsWith('.pdf')) {
//                     extractedText = await extractTextFromPdfBase64(fileBase64)
//                 } else if (mime.startsWith('image/')) {
//                     extractedText = await extractTextFromImageBase64(fileBase64)
//                     imageBase64 = fileBase64 // Pass image for visual detection
//                 } else {
//                     throw new Error('Unsupported file type. Please upload CSV, PNG, JPG, or PDF')
//                 }

//                 const { chartData, confidence } = await parseExtractedChartText(extractedText, chartType, imageBase64)
//                 jsonData = {
//                     ...chartData,
//                     metadata: {
//                         ...chartData.metadata,
//                         source_type: mime === 'application/pdf' ? 'pdf' : 'image',
//                         file_name: fileName || 'uploaded-file',
//                         file_size_bytes: uploadedSizeBytes,
//                         extracted_text_length: extractedText.length,
//                         extraction_confidence: confidence,
//                     },
//                 }
//             } else {
//                 // Generate sample/template data if no CSV provided
//                 console.log(`Generating sample data for chart type: ${chartType}`)
//                 jsonData = generateSampleData(chartType)
//             }
//             res.status(200).json(jsonData)
//         } catch (error) {
//             console.error('Error processing chart:', error)
//             res.status(500).json({
//                 error: 'Failed to process chart',
//                 message: error instanceof Error ? error.message : 'Unknown error',
//             })
//         }