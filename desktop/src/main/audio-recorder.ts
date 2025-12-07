/**
 * Audio Recorder Module
 * Handles recording audio from the system microphone using sox
 */

import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { EventEmitter } from 'events';
import { spawn } from 'child_process';

export interface AudioRecorderOptions {
  sampleRate?: number;
  channels?: number;
  bitDepth?: number;
}

export class AudioRecorder extends EventEmitter {
  private process: any = null;
  private isRecording = false;
  private sampleRate: number;
  private channels: number;
  private bitDepth: number;
  private tempFile: string = '';

  constructor(options: AudioRecorderOptions = {}) {
    super();
    this.sampleRate = options.sampleRate || 16000;
    this.channels = options.channels || 1;
    this.bitDepth = options.bitDepth || 16;
  }

  /**
   * Start recording audio using sox with proper WAV format for Whisper
   */
  start(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        if (this.isRecording) {
          reject(new Error('Already recording'));
          return;
        }

        this.isRecording = true;
        this.tempFile = path.join(os.tmpdir(), `audio-${Date.now()}.wav`);

        // Use sox rec command with proper WAV format for Whisper API
        // rec = sox recording mode, outputs proper WAV with headers
        this.process = spawn('rec', [
          '-r', '16000',      // 16kHz sample rate (Whisper prefers this)
          '-c', '1',          // Mono
          '-b', '16',         // 16-bit
          '-e', 'signed-integer',
          '-t', 'wav',        // WAV format with proper headers
          this.tempFile,
        ]);

        this.process.stderr.on('data', (data: Buffer) => {
          // Sox outputs progress to stderr, ignore it
        });

        this.process.on('error', (error: Error) => {
          this.isRecording = false;
          console.error('rec process error:', error);
          this.emit('error', error);
          reject(error);
        });

        this.process.on('exit', (code: number) => {
          if (code !== 0 && code !== null && code !== 143 && code !== 15) {
            console.error('rec exited with code:', code);
          }
        });

        console.log('Audio recording started');
        this.emit('start');
        resolve();
      } catch (error) {
        this.isRecording = false;
        reject(error);
      }
    });
  }

  /**
   * Stop recording and return audio as WAV buffer
   */
  stop(): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      try {
        if (!this.isRecording) {
          reject(new Error('Not currently recording'));
          return;
        }

        this.isRecording = false;

        // Kill the sox process
        if (this.process) {
          this.process.kill('SIGTERM');
        }

        // Wait a bit for sox to finish writing the file
        setTimeout(() => {
          try {
            if (fs.existsSync(this.tempFile)) {
              const wavBuffer = fs.readFileSync(this.tempFile);
              
              // Clean up temp file
              fs.unlink(this.tempFile, (err) => {
                if (err) console.error('Failed to delete temp file:', err);
              });

              console.log('Audio recording stopped, WAV size:', wavBuffer.length);
              this.emit('stop');
              resolve(wavBuffer);
            } else {
              reject(new Error('Audio file not created'));
            }
          } catch (error) {
            reject(error);
          }
        }, 100);
      } catch (error) {
        this.isRecording = false;
        reject(error);
      }
    });
  }

  /**
   * Get current recording status
   */
  getIsRecording(): boolean {
    return this.isRecording;
  }

  /**
   * Cancel recording without saving
   */
  cancel(): void {
    if (this.process) {
      this.process.kill('SIGTERM');
    }
    this.isRecording = false;
    
    // Clean up temp file
    if (this.tempFile && fs.existsSync(this.tempFile)) {
      fs.unlink(this.tempFile, (err) => {
        if (err) console.error('Failed to delete temp file:', err);
      });
    }
    
    this.emit('cancel');
  }
}

export default AudioRecorder;
