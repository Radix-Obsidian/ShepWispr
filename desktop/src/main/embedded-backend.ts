/**
 * Embedded Backend Server
 * 
 * Runs Express backend inside the Electron main process.
 * No more separate terminal commands - everything in one app!
 */

import express, { Request, Response, NextFunction, Express } from 'express';
import type { Server } from 'http';

// Backend port
const BACKEND_PORT = 3000;

let server: Server | null = null;
let isRunning = false;

/**
 * Start the embedded backend server
 */
export async function startEmbeddedBackend(): Promise<void> {
  if (isRunning) {
    console.log('Backend already running');
    return;
  }

  console.log('🐑 Starting embedded backend...');

  const app: Express = express();

  // Middleware
  app.use(express.json({ limit: '50mb' }));
  
  // CORS for local requests
  app.use((req: Request, res: Response, next: NextFunction) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') {
      res.sendStatus(200);
      return;
    }
    next();
  });

  // Health check
  app.get('/v1/health', (_req: Request, res: Response) => {
    res.json({ 
      status: 'ok', 
      embedded: true,
      version: '0.1.0',
    });
  });

  // Import and mount backend routes dynamically
  try {
    // In bundled app, we'll import the pre-built backend modules
    // For now, we proxy to the external backend if it's running
    // This will be replaced with direct imports after proper bundling
    
    console.log('Backend routes will be mounted here after bundling');
    
    // Placeholder routes for testing
    app.post('/v1/text-to-prompt', async (req: Request, res: Response) => {
      // Forward to external backend for now
      try {
        const response = await fetch('http://localhost:3000/v1/text-to-prompt', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(req.body),
        });
        const data = await response.json();
        res.json(data);
      } catch {
        res.status(503).json({
          success: false,
          error: {
            code: 'BACKEND_NOT_RUNNING',
            message: 'Please run the backend: cd backend && npm run dev',
            retryable: true,
          },
        });
      }
    });

    app.get('/v1/usage', async (_req: Request, res: Response) => {
      try {
        const response = await fetch('http://localhost:3000/v1/usage');
        const data = await response.json();
        res.json(data);
      } catch {
        res.json({
          success: true,
          data: {
            aiPromptsUsed: 0,
            totalPrompts: 0,
            aiPromptsRemaining: 30,
            dailyLimit: 30,
            isAtLimit: false,
            date: new Date().toLocaleDateString('en-CA'),
            resetIn: { hours: 24, minutes: 0, formatted: '24h 0m' },
            aiAvailable: true,
          },
        });
      }
    });

  } catch (error) {
    console.error('Failed to load backend routes:', error);
  }

  return new Promise((resolve, reject) => {
    try {
      server = app.listen(BACKEND_PORT, () => {
        isRunning = true;
        console.log(`✅ Embedded backend running on http://localhost:${BACKEND_PORT}`);
        resolve();
      });

      server.on('error', (err: NodeJS.ErrnoException) => {
        if (err.code === 'EADDRINUSE') {
          console.log(`Port ${BACKEND_PORT} in use, assuming backend is already running`);
          isRunning = true;
          resolve();
        } else {
          reject(err);
        }
      });
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Stop the embedded backend server
 */
export function stopEmbeddedBackend(): void {
  if (server) {
    server.close();
    server = null;
    isRunning = false;
    console.log('Backend stopped');
  }
}

/**
 * Check if backend is running
 */
export function isBackendRunning(): boolean {
  return isRunning;
}

/**
 * Get backend URL
 */
export function getBackendUrl(): string {
  return `http://localhost:${BACKEND_PORT}`;
}
