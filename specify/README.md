# Specify Design Token Extraction

This directory contains the Specify SDK setup for extracting and managing design tokens.

## Quick Start

1. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Add your Specify Personal Access Token to `.env`

2. **Run the extraction script**
   ```bash
   npm run extract
   ```

## Files

- **extract.ts** - Main extraction script using Specify SDK
- **package.json** - Module configuration with extraction scripts
- **tsconfig.json** - TypeScript compiler configuration
- **.env** - Environment variables (not tracked in git)
- **.env.example** - Template for environment variables

## Customizing Token Extraction

Edit `extract.ts` to customize how tokens are extracted and processed:

```typescript
// List all available repositories
const repositories = await specifyClient.listRepositories();
console.log("Available repositories:", repositories);

// Get a specific repository
const repository = await specifyClient.getRepository("your-repository-id");

// Extract tokens
const tokens = await repository.getTokens();

// Process and save tokens as needed
// You can transform tokens to different formats (CSS, SCSS, JSON, etc.)
```

## Available Scripts

- `npm run build` - Compile TypeScript to JavaScript
- `npm run extract` - Build and run the extraction script

## Token Types Supported

Specify supports over 50 token types including:
- Colors
- Typography
- Spacing
- Borders
- Shadows
- Gradients
- And more...

## Further Reading

- [Specify SDK Documentation](https://docs.specifyapp.com/guides/specify-sdk-usage-101)
- [Design Token Format (SDTF)](https://docs.specifyapp.com/)
