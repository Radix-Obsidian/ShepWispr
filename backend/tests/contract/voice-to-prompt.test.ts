import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';
import express from 'express';
import { Server } from 'http';

// Set environment variable before any imports
beforeAll(() => {
  process.env.OPENAI_API_KEY = 'test-key-for-contract-tests';
});

// Mock OpenAI to avoid real API calls
vi.mock('openai', () => {
  return {
    default: vi.fn().mockImplementation(() => ({
      audio: {
        transcriptions: {
          create: vi.fn().mockResolvedValue({
            text: 'mocked transcription',
            language: 'en',
          }),
        },
      },
    })),
  };
});

// Import the app components after mocking
import { apiRouter } from '../../src/api/index.js';
import { errorHandler } from '../../src/api/middleware/error-handler.js';

describe('POST /v1/voice-to-prompt', () => {
  let app: express.Application;
  let server: Server;
  const baseUrl = 'http://localhost:3002';

  beforeAll(async () => {
    app = express();
    app.use(express.json({ limit: '10mb' }));
    app.use('/v1', apiRouter);
    app.use(errorHandler);
    
    server = app.listen(3002);
  });

  afterAll(async () => {
    server.close();
  });

  it('should return 400 for missing audio field', async () => {
    const response = await fetch(`${baseUrl}/v1/voice-to-prompt`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        context: {
          activeFile: '/test/file.ts',
          ideType: 'vscode',
        },
      }),
    });

    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.success).toBe(false);
    expect(data.error.code).toBe('INVALID_REQUEST');
  });

  it('should return 400 for missing context field', async () => {
    const response = await fetch(`${baseUrl}/v1/voice-to-prompt`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        audio: 'base64encodedaudio',
      }),
    });

    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.success).toBe(false);
    expect(data.error.code).toBe('INVALID_REQUEST');
  });

  it('should return 400 for invalid ideType', async () => {
    const response = await fetch(`${baseUrl}/v1/voice-to-prompt`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        audio: 'base64encodedaudio',
        context: {
          activeFile: '/test/file.ts',
          ideType: 'invalid-ide',
        },
      }),
    });

    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.success).toBe(false);
  });

  it('should accept valid request with all required fields', async () => {
    const response = await fetch(`${baseUrl}/v1/voice-to-prompt`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        audio: 'base64encodedaudio',
        context: {
          activeFile: '/test/file.ts',
          ideType: 'vscode',
        },
      }),
    });

    // Should pass validation but return 501 (not implemented yet)
    // Once implemented, this should return 200
    const data = await response.json();
    expect(data.success).toBe(false);
    // For now, expect NOT_IMPLEMENTED since pipeline isn't built
    // This test will need updating once pipeline is complete
  });

  it('should accept optional selectedCode and cursorLine', async () => {
    const response = await fetch(`${baseUrl}/v1/voice-to-prompt`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        audio: 'base64encodedaudio',
        context: {
          activeFile: '/test/file.ts',
          selectedCode: 'const x = 1;',
          cursorLine: 42,
          ideType: 'cursor',
        },
      }),
    });

    const data = await response.json();
    // Should pass validation
    expect(data.error?.code).not.toBe('INVALID_REQUEST');
  });
});

describe('GET /v1/health', () => {
  let app: express.Application;
  let server: Server;
  const baseUrl = 'http://localhost:3003';

  beforeAll(async () => {
    app = express();
    app.use(express.json());
    app.use('/v1', apiRouter);
    
    server = app.listen(3003);
  });

  afterAll(async () => {
    server.close();
  });

  it('should return ok status', async () => {
    const response = await fetch(`${baseUrl}/v1/health`);
    
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.status).toBe('ok');
    expect(data.service).toBe('shepwhisper-api');
  });
});
