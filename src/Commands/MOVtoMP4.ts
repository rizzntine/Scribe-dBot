import * as path from 'path';
import { config } from 'dotenv';
const ffmpeg = require('fluent-ffmpeg');

// Load environment variables from .env file
config();

// Set the path to the ffmpeg and ffprobe binaries from environment variables
const ffmpegPath = path.resolve(__dirname, process.env.FFMPEG_PATH || '');
const ffprobePath = path.resolve(__dirname, process.env.FFPROBE_PATH || '');
ffmpeg.setFfmpegPath(ffmpegPath);
ffmpeg.setFfprobePath(ffprobePath);

export async function convertMOVtoMP4(fileName: string): Promise<string> {
    const movPath = path.join(__dirname, '..', '..', 'attachments', 'mov');
    const mp4Path = path.join(__dirname, '..', '..', 'attachments', 'mp4');
    const outputFile = fileName.slice(0, -4);

    const inputPath = path.join(movPath, fileName);
    const outputPath = path.join(mp4Path, `${outputFile}.mp4`);

    return new Promise((resolve, reject) => {
        ffmpeg(inputPath)
            .output(outputPath)
            .on('end', () => {
                console.log(`Converted ${inputPath} to ${outputPath}`);
                resolve(outputPath);
            })
            .on('error', (err: any) => {
                console.error(`Failed to convert ${inputPath}: ${err}`);
                reject(err);
            })
            .run();
    });
}
