// import pdfParse from 'pdf-parse'
// import { createWorker } from 'tesseract.js'
// import sharp from 'sharp'

// // Chart processing utilities - IMPROVED VERSION for handwritten charts

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

// /**
//  * Detect data points using multiple strategies
//  * 1. Blue circles (printed charts)
//  * 2. Dark marks (handwritten/pencil charts)
//  * 3. Line tracing (continuous line charts)
//  */
// export async function detectChartPointsFromImage(base64: string): Promise<Array<{ x: number; y: number }>> {
//     const imageBuffer = Buffer.from(base64, 'base64')
//     const metadata = await sharp(imageBuffer).metadata()

//     if (!metadata.width || !metadata.height) {
//         throw new Error('Could not read image dimensions')
//     }

//     const raw = await sharp(imageBuffer)
//         .resize(metadata.width, metadata.height, { fit: 'fill' })
//         .raw()
//         .toBuffer({ resolveWithObject: true })

//     const { data: pixels, info } = raw
//     const width = info.width
//     const height = info.height
//     const channels = info.channels

//     // Create brightness map
//     const brightnessMap: number[][] = []
//     for (let y = 0; y < height; y++) {
//         brightnessMap[y] = []
//         for (let x = 0; x < width; x++) {
//             const idx = (y * width + x) * channels
//             const r = pixels[idx]
//             const g = pixels[idx + 1]
//             const b = pixels[idx + 2]
//             brightnessMap[y][x] = (r + g + b) / 3
//         }
//     }

//     // Strategy 1: Find dark regions (pencil marks, ink)
//     console.info('[Point Detection] Scanning for dark marks...')
//     const darkPoints = findDarkRegions(brightnessMap, width, height)

//     if (darkPoints.length >= 2) {
//         const clustered = clusterPoints(darkPoints, 25)
//         if (clustered.length >= 2) {
//             console.info(`[Point Detection] Found ${clustered.length} data points`)
//             return clustered
//         }
//     }

//     // Strategy 2: Sample along likely data paths
//     console.info('[Point Detection] Trying point sampling strategy...')
//     const sampledPoints = sampleChartData(brightnessMap, width, height)

//     if (sampledPoints.length >= 2) {
//         console.info(`[Point Detection] Sampled ${sampledPoints.length} points`)
//         return sampledPoints
//     }

//     console.warn(`[Point Detection] Low confidence - only ${darkPoints.length} marks found`)
//     return darkPoints
// }

// /**
//  * Find dark regions (pencil marks, drawn lines)
//  */
// function findDarkRegions(brightnessMap: number[][], width: number, height: number): Array<{ x: number; y: number }> {
//     const darkThreshold = 120 // Pixels darker than this
//     const points: Array<{ x: number; y: number }> = []
//     const sampleStep = Math.max(Math.floor(Math.min(width, height) / 60), 3)

//     for (let y = 0; y < height; y += sampleStep) {
//         for (let x = 0; x < width; x += sampleStep) {
//             if (brightnessMap[y] && brightnessMap[y][x] < darkThreshold) {
//                 points.push({ x, y })
//             }
//         }
//     }

//     return points
// }

// /**
//  * Sample points along likely chart data regions
//  */
// function sampleChartData(brightnessMap: number[][], width: number, height: number): Array<{ x: number; y: number }> {
//     const points: Array<{ x: number; y: number }> = []

//     // Divide chart into columns and find darkest point in each column
//     const numSegments = Math.min(15, Math.floor(width / 40))
//     const colWidth = width / numSegments

//     for (let col = 0; col < numSegments; col++) {
//         const startX = Math.floor(col * colWidth)
//         const endX = Math.floor((col + 1) * colWidth)

//         let minBrightness = 255
//         let bestY = height / 2
//         let foundDark = false

//         for (let y = Math.floor(height * 0.2); y < Math.floor(height * 0.8); y += 2) {
//             for (let x = startX; x < endX; x++) {
//                 if (brightnessMap[y] && brightnessMap[y][x] < 150) {
//                     if (brightnessMap[y][x] < minBrightness) {
//                         minBrightness = brightnessMap[y][x]
//                         bestY = y
//                         foundDark = true
//                     }
//                 }
//             }
//         }

//         if (foundDark && minBrightness < 150) {
//             points.push({ x: (startX + endX) / 2, y: bestY })
//         }
//     }

//     return points
// }

// /**
//  * Cluster nearby points
//  */
// function clusterPoints(points: Array<{ x: number; y: number }>, threshold: number): Array<{ x: number; y: number }> {
//     if (points.length === 0) return []

//     const clusters: Array<Array<{ x: number; y: number }>> = []
//     const used = new Set<number>()

//     for (let i = 0; i < points.length; i++) {
//         if (used.has(i)) continue

//         const cluster = [points[i]]
//         used.add(i)

//         for (let j = i + 1; j < points.length; j++) {
//             if (used.has(j)) continue

//             const dist = Math.sqrt(
//                 Math.pow(points[j].x - points[i].x, 2) +
//                 Math.pow(points[j].y - points[i].y, 2)
//             )

//             if (dist < threshold) {
//                 cluster.push(points[j])
//                 used.add(j)
//             }
//         }

//         clusters.push(cluster)
//     }

//     return clusters.map(cluster => {
//         const avgX = cluster.reduce((sum, p) => sum + p.x, 0) / cluster.length
//         const avgY = cluster.reduce((sum, p) => sum + p.y, 0) / cluster.length
//         return { x: Math.round(avgX), y: Math.round(avgY) }
//     }).sort((a, b) => a.x - b.x)
// }

// /**
//  * intelligent axis range detection from OCR text
//  */
// export function extractAxisRanges(ocrText: string, chartType: string): { xRange: [number, number]; yRange: [number, number] } {
//     const numbers = ocrText.match(/-?\d+(?:\.\d+)?/g)?.map(Number).filter(n => Number.isFinite(n)) || []

//     // Default ranges based on chart type
//     const defaults: Record<string, { xRange: [number, number]; yRange: [number, number] }> = {
//         who_baby_height: { xRange: [0, 24], yRange: [45, 95] },
//         who_baby_weight: { xRange: [0, 24], yRange: [2, 14] },
//         baby_bmi: { xRange: [0, 60], yRange: [12, 18] },
//         custom: { xRange: [0, 10], yRange: [0, 100] },
//     }

//     if (numbers.length < 4) {
//         return defaults[chartType] || defaults.custom
//     }

//     const sorted = [...numbers].sort((a, b) => a - b)
//     const min = sorted[0]
//     const max = sorted[sorted.length - 1]
//     const range = max - min

//     // Try to estimate axes
//     if (range > 50) {
//         // Likely Y-axis contains both ranges
//         return {
//             xRange: [0, 10],
//             yRange: [Math.max(min - 5, 0), Math.ceil(max)]
//         }
//     }

//     return defaults[chartType] || { xRange: [min, max], yRange: [0, 100] }
// }

// /**
//  * Map pixel points to chart data with better axis handling
//  */
// export function mapPixelPointsToChartData(
//     pixelPoints: Array<{ x: number; y: number }>,
//     ocrText: string,
//     chartType: string,
//     imageWidth: number,
//     imageHeight: number
// ): ChartData {

//     const { xRange, yRange } = extractAxisRanges(ocrText, chartType)

//     // Estimate chart bounds (usually has margins)
//     const minX = Math.min(...pixelPoints.map(p => p.x))
//     const maxX = Math.max(...pixelPoints.map(p => p.x))
//     const minY = Math.min(...pixelPoints.map(p => p.y))
//     const maxY = Math.max(...pixelPoints.map(p => p.y))

//     // Add buffer for axis margins
//     const xBuffer = (maxX - minX) * 0.1
//     const yBuffer = (maxY - minY) * 0.1

//     const chartLeft = Math.max(minX - xBuffer, 0)
//     const chartRight = Math.min(maxX + xBuffer, imageWidth)
//     const chartTop = Math.max(minY - yBuffer, 0)
//     const chartBottom = Math.min(maxY + yBuffer, imageHeight)

//     const pixelWidth = chartRight - chartLeft || 1
//     const pixelHeight = chartBottom - chartTop || 1

//     // Convert pixels to chart values
//     const dataPoints = pixelPoints.map(p => {
//         const normX = (p.x - chartLeft) / pixelWidth
//         const normY = (chartBottom - p.y) / pixelHeight // Invert Y

//         const x = xRange[0] + normX * (xRange[1] - xRange[0])
//         const y = yRange[0] + normY * (yRange[1] - yRange[0])

//         return mapPairToChartPoint(x, y, chartType)
//     })

//     return {
//         chart_type: chartType,
//         title: getChartTitle(chartType),
//         data_points: dataPoints.sort((a, b) => {
//             const aX = (a.age_months as number | undefined) ?? (a.x as number)
//             const bX = (b.age_months as number | undefined) ?? (b.x as number)
//             return aX - bX
//         }),
//         metadata: {
//             processed_at: new Date().toISOString(),
//             data_points_count: dataPoints.length,
//             extraction_mode: 'visual_detection_improved',
//             detected_x_range: `${xRange[0]}-${xRange[1]}`,
//             detected_y_range: `${yRange[0]}-${yRange[1]}`,
//         },
//     }
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

// function mapPairToChartPoint(x: number, y: number, chartType: string): Record<string, number> {
//     switch (chartType) {
//         case 'who_baby_weight':
//             return { age_months: Math.round(x), weight_kg: Math.round(y * 10) / 10 }
//         case 'who_baby_height':
//             return { age_months: Math.round(x), height_cm: Math.round(y * 10) / 10 }
//         case 'baby_bmi':
//             return { age_months: Math.round(x), bmi: Math.round(y * 10) / 10 }
//         default:
//             return { x: Math.round(x * 10) / 10, y: Math.round(y * 10) / 10 }
//     }
// }
