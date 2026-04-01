// import pdfParse from 'pdf-parse'
// import { createWorker } from 'tesseract.js'
// import sharp from 'sharp'

// export interface ChartData {
//     chart_type: string
//     title: string
//     data_points: Array<Record<string, any>>
//     metadata: {
//         processed_at: string
//         data_points_count: number
//         chart_age_range?: string
//         unit_weight?: string
//         unit_height?: string
//         [key: string]: unknown
//     }
// }

// export interface ParsedTextResult {
//     chartData: ChartData
//     confidence: number
// }

// type Point = { x: number; y: number }

// type AxisRange = {
//     xMin: number
//     xMax: number
//     yMin: number
//     yMax: number
// }

// export function parseChartData(csvData: string, chartType: string): ChartData {
//     const lines = csvData.trim().split('\n').filter(line => line.trim())

//     if (lines.length < 2) {
//         throw new Error('CSV must contain at least headers and one data row')
//     }

//     const headers = lines[0].split(',').map(header => header.trim().toLowerCase())
//     const dataPoints: Array<Record<string, any>> = []

//     for (let index = 1; index < lines.length; index++) {
//         const values = lines[index].split(',').map(value => value.trim())
//         const row: Record<string, any> = {}

//         headers.forEach((header, headerIndex) => {
//             const value = values[headerIndex]
//             row[header] = isNaN(Number(value)) ? value : Number(value)
//         })

//         dataPoints.push(row)
//     }

//     return {
//         chart_type: chartType,
//         title: getChartTitle(chartType),
//         data_points: dataPoints,
//         metadata: {
//             processed_at: new Date().toISOString(),
//             data_points_count: dataPoints.length,
//             ...getChartMetadata(chartType),
//         },
//     }
// }

// export async function extractTextFromPdfBase64(base64: string): Promise<string> {
//     const buffer = Buffer.from(base64, 'base64')
//     const parsed = await pdfParse(buffer)
//     return (parsed.text || '').trim()
// }

// export async function extractTextFromImageBase64(base64: string): Promise<string> {
//     const imageBuffer = Buffer.from(base64, 'base64')
//     const worker = await createWorker('eng')

//     try {
//         const result = await worker.recognize(imageBuffer)
//         return (result.data.text || '').trim()
//     } finally {
//         await worker.terminate()
//     }
// }

// export async function parseExtractedChartText(
//     rawText: string,
//     chartType: string,
//     imageBase64?: string
// ): Promise<ParsedTextResult> {
//     const text = rawText.replace(/\r/g, '\n').trim()

//     if (imageBase64) {
//         try {
//             const visualChartData = await extractChartDataFromImage(imageBase64, chartType, text)
//             if (visualChartData.data_points.length >= 2) {
//                 return { chartData: visualChartData, confidence: 0.82 }
//             }
//         } catch (error) {
//             console.warn(
//                 `[Chart Extraction] Visual detection failed: ${error instanceof Error ? error.message : String(error)}`
//             )
//         }
//     }

//     if (text && /,|;|\t/.test(text)) {
//         try {
//             return { chartData: parseChartData(normalizeToCsv(text), chartType), confidence: 0.8 }
//         } catch {
//             // Fall through to numeric extraction.
//         }
//     }

//     if (!text) {
//         throw new Error('No readable text was found in the uploaded file. Please ensure the chart image is clear and readable.')
//     }

//     const points = extractNumericPairs(text, chartType)
//     if (points.length < 2) {
//         const textPreview = text.substring(0, 300)
//         console.error(`[OCR Extraction Failed] Insufficient data points. Extracted text: "${textPreview}"`)
//         throw new Error(
//             `Could not detect enough chart points from uploaded file. ` +
//             `Extracted only ${points.length} point(s). Please ensure: ` +
//             `(1) The chart image is clear and high-quality, ` +
//             `(2) Chart contains visible numeric labels/values, ` +
//             `(3) Or upload a CSV file instead. ` +
//             `(Debug: Extracted text length: ${text.length} chars)`
//         )
//     }

//     return {
//         chartData: {
//             chart_type: chartType,
//             title: getChartTitle(chartType),
//             data_points: points,
//             metadata: {
//                 processed_at: new Date().toISOString(),
//                 data_points_count: points.length,
//                 extraction_mode: 'ocr_heuristic',
//                 ...getChartMetadata(chartType),
//             },
//         },
//         confidence: 0.6,
//     }
// }

// async function extractChartDataFromImage(
//     base64: string,
//     chartType: string,
//     ocrText: string
// ): Promise<ChartData> {
//     const imageBuffer = Buffer.from(base64, 'base64')
//     const { data, info } = await sharp(imageBuffer)
//         .greyscale()
//         .normalise()
//         .raw()
//         .toBuffer({ resolveWithObject: true })

//     const points = detectLinePoints(data, info.width, info.height)
//     const filteredPoints = simplifyPoints(points)
//     const axisRange = inferAxisRange(chartType, ocrText)
//     const dataPoints = mapVisualPointsToChartData(filteredPoints, axisRange, chartType)

//     return {
//         chart_type: chartType,
//         title: getChartTitle(chartType),
//         data_points: dataPoints,
//         metadata: {
//             processed_at: new Date().toISOString(),
//             data_points_count: dataPoints.length,
//             extraction_mode: 'visual_detection',
//             ...getChartMetadata(chartType),
//         },
//     }
// }

// function detectLinePoints(pixels: Buffer, width: number, height: number): Point[] {
//     const xStart = Math.floor(width * 0.12)
//     const xEnd = Math.floor(width * 0.88)
//     const yStart = Math.floor(height * 0.1)
//     const yEnd = Math.floor(height * 0.9)
//     const bucketCount = 12
//     const bucketWidth = Math.max(Math.floor((xEnd - xStart) / bucketCount), 1)
//     const points: Point[] = []

//     for (let bucket = 0; bucket < bucketCount; bucket++) {
//         const startX = xStart + bucket * bucketWidth
//         const endX = Math.min(startX + bucketWidth, xEnd)
//         let darkestValue = 255
//         let darkestPoint: Point | null = null

//         for (let x = startX; x < endX; x++) {
//             for (let y = yStart; y < yEnd; y++) {
//                 const pixel = pixels[y * width + x]
//                 if (pixel < darkestValue) {
//                     darkestValue = pixel
//                     darkestPoint = { x, y }
//                 }
//             }
//         }

//         if (darkestPoint && darkestValue < 170) {
//             points.push(darkestPoint)
//         }
//     }

//     return points
// }

// function simplifyPoints(points: Point[]): Point[] {
//     const deduped: Point[] = []

//     for (const point of points) {
//         const isNearExisting = deduped.some(existing => Math.abs(existing.x - point.x) < 18 && Math.abs(existing.y - point.y) < 18)
//         if (!isNearExisting) {
//             deduped.push(point)
//         }
//     }

//     return deduped.sort((left, right) => left.x - right.x)
// }

// function inferAxisRange(chartType: string, ocrText: string): AxisRange {
//     const defaults: Record<string, AxisRange> = {
//         who_baby_weight: { xMin: 0, xMax: 24, yMin: 2, yMax: 14 },
//         who_baby_height: { xMin: 0, xMax: 24, yMin: 20, yMax: 100 },
//         baby_bmi: { xMin: 0, xMax: 60, yMin: 12, yMax: 20 },
//         custom: { xMin: 0, xMax: 10, yMin: 0, yMax: 100 },
//     }

//     const fallback = defaults[chartType] || defaults.custom
//     const numbers = (ocrText.match(/-?\d+(?:\.\d+)?/g) || [])
//         .map(Number)
//         .filter(value => Number.isFinite(value))

//     if (numbers.length < 4) {
//         return fallback
//     }

//     const sorted = [...numbers].sort((left, right) => left - right)
//     const smallNumbers = sorted.filter(value => value >= 0 && value <= 36)
//     const largeNumbers = sorted.filter(value => value >= 20)

//     const xMax = smallNumbers.length >= 2 ? Math.max(...smallNumbers) : fallback.xMax
//     const yMin = largeNumbers.length >= 2 ? Math.min(...largeNumbers) : fallback.yMin
//     const yMax = largeNumbers.length >= 2 ? Math.max(...largeNumbers) : fallback.yMax

//     if (yMax <= yMin || xMax <= 0) {
//         return fallback
//     }

//     if (chartType === 'who_baby_height') {
//         const clampedMin = Math.max(20, Math.min(yMin, 70))
//         const clampedMax = Math.max(clampedMin + 20, Math.min(yMax, 120))

//         return {
//             xMin: 0,
//             xMax: Math.min(Math.max(xMax, 12), 36),
//             yMin: clampedMin,
//             yMax: clampedMax,
//         }
//     }

//     return {
//         xMin: 0,
//         xMax,
//         yMin,
//         yMax,
//     }
// }

// function mapVisualPointsToChartData(points: Point[], axisRange: AxisRange, chartType: string): Array<Record<string, number>> {
//     if (points.length === 0) {
//         return []
//     }

//     const minX = Math.min(...points.map(point => point.x))
//     const maxX = Math.max(...points.map(point => point.x))
//     const minY = Math.min(...points.map(point => point.y))
//     const maxY = Math.max(...points.map(point => point.y))
//     const width = Math.max(maxX - minX, 1)
//     const height = Math.max(maxY - minY, 1)

//     const mapped = points.map(point => {
//         const normalizedX = (point.x - minX) / width
//         const normalizedY = (maxY - point.y) / height
//         const xValue = axisRange.xMin + normalizedX * (axisRange.xMax - axisRange.xMin)
//         const yValue = axisRange.yMin + normalizedY * (axisRange.yMax - axisRange.yMin)
//         return mapPairToChartPoint(xValue, yValue, chartType)
//     })

//     return sanitizeVisualPoints(mapped, chartType)
// }

// function sanitizeVisualPoints(points: Array<Record<string, number>>, chartType: string): Array<Record<string, number>> {
//     if (chartType !== 'who_baby_height') {
//         return sortChartPoints(points)
//     }

//     const bounded = points.filter(point => {
//         const ageValue = point.age_months as number | undefined
//         const heightValue = point.height_cm as number | undefined

//         if (!Number.isFinite(ageValue) || !Number.isFinite(heightValue)) {
//             return false
//         }

//         const age = ageValue as number
//         const height = heightValue as number

//         return age >= 0 && age <= 36 && height >= 20 && height <= 120
//     })

//     if (bounded.length === 0) {
//         return []
//     }

//     const byAge = new Map<number, number[]>()
//     for (const point of bounded) {
//         const age = point.age_months as number
//         const height = point.height_cm as number
//         const existing = byAge.get(age) || []
//         existing.push(height)
//         byAge.set(age, existing)
//     }

//     const deduped = Array.from(byAge.entries())
//         .map(([age, heights]) => {
//             const average = heights.reduce((sum, value) => sum + value, 0) / heights.length
//             return { age_months: age, height_cm: roundToOneDecimal(average) }
//         })
//         .sort((left, right) => left.age_months - right.age_months)

//     const smoothed: Array<{ age_months: number; height_cm: number }> = []
//     for (const point of deduped) {
//         if (smoothed.length === 0) {
//             smoothed.push(point)
//             continue
//         }

//         const prev = smoothed[smoothed.length - 1]
//         const monthDiff = Math.max(point.age_months - prev.age_months, 1)
//         const growthPerMonth = (point.height_cm - prev.height_cm) / monthDiff

//         if (growthPerMonth < -1.5 || growthPerMonth > 6) {
//             continue
//         }

//         smoothed.push(point)
//     }

//     return smoothed
// }

// function normalizeToCsv(text: string): string {
//     return text
//         .split('\n')
//         .map(line => line.trim())
//         .filter(Boolean)
//         .map(line => line.replace(/\s+/g, ','))
//         .join('\n')
// }

// function extractNumericPairs(text: string, chartType: string): Array<Record<string, number>> {
//     const lines = text
//         .split('\n')
//         .map(line => line.trim())
//         .filter(Boolean)

//     const points: Array<Record<string, number>> = []
//     const seen = new Set<string>()

//     for (const line of lines) {
//         const matches = line.match(/-?\d+(?:\.\d+)?/g)
//         if (!matches || matches.length < 2) {
//             continue
//         }

//         const x = Number(matches[0])
//         const y = Number(matches[1])
//         if (!Number.isFinite(x) || !Number.isFinite(y)) {
//             continue
//         }

//         const key = `${x}:${y}`
//         if (seen.has(key)) {
//             continue
//         }

//         seen.add(key)
//         points.push(mapPairToChartPoint(x, y, chartType))
//     }

//     if (points.length >= 2) {
//         return sortChartPoints(points)
//     }

//     const allNumbers = (text.match(/-?\d+(?:\.\d+)?/g) || [])
//         .map(Number)
//         .filter(value => Number.isFinite(value))

//     for (let index = 0; index < allNumbers.length - 1; index += 2) {
//         const x = allNumbers[index]
//         const y = allNumbers[index + 1]
//         const key = `${x}:${y}`

//         if (!seen.has(key)) {
//             seen.add(key)
//             points.push(mapPairToChartPoint(x, y, chartType))
//         }
//     }

//     return sortChartPoints(points)
// }

// function sortChartPoints(points: Array<Record<string, number>>): Array<Record<string, number>> {
//     return points.sort((left, right) => {
//         const leftX = (left.age_months as number | undefined) ?? (left.x as number)
//         const rightX = (right.age_months as number | undefined) ?? (right.x as number)
//         return leftX - rightX
//     })
// }

// function mapPairToChartPoint(x: number, y: number, chartType: string): Record<string, number> {
//     switch (chartType) {
//         case 'who_baby_weight':
//             return { age_months: Math.round(x), weight_kg: roundToOneDecimal(y) }
//         case 'who_baby_height':
//             return { age_months: Math.round(x), height_cm: roundToOneDecimal(y) }
//         case 'baby_bmi':
//             return { age_months: Math.round(x), bmi: roundToOneDecimal(y) }
//         default:
//             return { x: roundToOneDecimal(x), y: roundToOneDecimal(y) }
//     }
// }

// function roundToOneDecimal(value: number): number {
//     return Math.round(value * 10) / 10
// }

// function getChartTitle(chartType: string): string {
//     const titles: Record<string, string> = {
//         who_baby_weight: 'WHO Baby Weight Chart',
//         who_baby_height: 'WHO Baby Height Chart',
//         baby_bmi: 'Baby BMI Chart',
//         custom: 'Custom Chart Data',
//     }

//     return titles[chartType] || 'Chart Data'
// }

// function getChartMetadata(chartType: string): Record<string, any> {
//     switch (chartType) {
//         case 'who_baby_weight':
//             return {
//                 chart_age_range: '0-24 months',
//                 unit_weight: 'kg',
//                 growth_standard: 'WHO 2006',
//             }
//         case 'who_baby_height':
//             return {
//                 chart_age_range: '0-24 months',
//                 unit_height: 'cm',
//                 growth_standard: 'WHO 2006',
//             }
//         case 'baby_bmi':
//             return {
//                 chart_age_range: '0-5 years',
//                 unit_weight: 'kg',
//                 unit_height: 'cm',
//                 calculation: 'weight(kg) / (height(m)^2)',
//             }
//         default:
//             return {}
//     }
// }

// export function generateSampleData(chartType: string): ChartData {
//     let dataPoints: Array<Record<string, any>>

//     switch (chartType) {
//         case 'who_baby_weight':
//             dataPoints = [
//                 { age_months: 0, weight_kg: 3.5, percentile_50: 3.5 },
//                 { age_months: 1, weight_kg: 4.2, percentile_50: 4.2 },
//                 { age_months: 2, weight_kg: 5.1, percentile_50: 5.1 },
//                 { age_months: 3, weight_kg: 5.8, percentile_50: 5.8 },
//                 { age_months: 6, weight_kg: 7.3, percentile_50: 7.3 },
//                 { age_months: 12, weight_kg: 9.3, percentile_50: 9.3 },
//                 { age_months: 24, weight_kg: 12.2, percentile_50: 12.2 },
//             ]
//             break
//         case 'who_baby_height':
//             dataPoints = [
//                 { age_months: 0, height_cm: 50.0, percentile_50: 50.0 },
//                 { age_months: 1, height_cm: 54.7, percentile_50: 54.7 },
//                 { age_months: 3, height_cm: 61.4, percentile_50: 61.4 },
//                 { age_months: 6, height_cm: 67.6, percentile_50: 67.6 },
//                 { age_months: 12, height_cm: 75.7, percentile_50: 75.7 },
//                 { age_months: 24, height_cm: 87.6, percentile_50: 87.6 },
//             ]
//             break
//         case 'baby_bmi':
//             dataPoints = [
//                 { age_months: 0, bmi: 13.5, percentile_50: 13.5 },
//                 { age_months: 6, bmi: 16.2, percentile_50: 16.2 },
//                 { age_months: 12, bmi: 16.1, percentile_50: 16.1 },
//                 { age_months: 24, bmi: 15.9, percentile_50: 15.9 },
//             ]
//             break
//         default:
//             dataPoints = [
//                 { x: 1, y: 10 },
//                 { x: 2, y: 20 },
//                 { x: 3, y: 15 },
//             ]
//             break
//     }

//     return {
//         chart_type: chartType,
//         title: getChartTitle(chartType),
//         data_points: dataPoints,
//         metadata: {
//             processed_at: new Date().toISOString(),
//             data_points_count: dataPoints.length,
//             ...getChartMetadata(chartType),
//         },
//     }
// }

