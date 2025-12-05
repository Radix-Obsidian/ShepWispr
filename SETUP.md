# ShepWispr Setup Guide

## What is Specify?

Specify is a design token management platform that bridges the gap between design and development. It allows you to:

- **Centralize design tokens** from Figma, Tokens Studio, or JSON files
- **Transform tokens** into any format (CSS, SCSS, JavaScript, JSON, etc.)
- **Distribute tokens** automatically via GitHub, CI/CD, or manual extraction
- **Maintain consistency** across all your digital products

## Installation Complete ✅

The following has been installed and configured:

1. **@specifyapp/cli** (v1.2.0) - Command-line interface for CI/CD workflows
2. **@specifyapp/sdk** (v1.2.1) - JavaScript SDK for programmatic access
3. **TypeScript** - For type-safe development
4. **dotenv** - For secure environment variable management

## Next Steps

### Step 1: Create a Specify Account

1. Go to [specifyapp.com](https://specifyapp.com/)
2. Sign up for a free account
3. Create your first repository

### Step 2: Get Your Personal Access Token

1. Navigate to [Personal Access Tokens](https://specifyapp.com/user/personal-access-tokens)
2. Click "Generate New Token"
3. Give it a descriptive name (e.g., "ShepWispr Development")
4. Copy the token (you won't be able to see it again!)

### Step 3: Configure Your Environment

```bash
# Navigate to the specify directory
cd specify

# Copy the example environment file
cp .env.example .env

# Edit .env and add your token
# SPECIFY_PERSONAL_ACCESS_TOKEN=your-token-here
```

### Step 4: Test the Connection

```bash
# From the project root
npm run specify:extract

# Or from the specify directory
cd specify
npm run extract
```

You should see: `User authenticated: your-email@example.com`

## Usage Examples

### Extract Design Tokens via SDK

The SDK approach gives you full programmatic control:

```bash
npm run specify:extract
```

Edit `specify/extract.ts` to customize token extraction and transformation.

### Use Specify CLI

The CLI is perfect for CI/CD pipelines:

```bash
# Pull tokens from a repository
npx @specifyapp/cli pull --repository <repository-id>

# Use with configuration file
npx @specifyapp/cli pull --config .specifyrc.json
```

### GitHub Integration (Recommended)

For automatic token syncing:

1. Go to your Specify repository dashboard
2. Click "Destinations" → "Create Pipeline"
3. Select "GitHub application"
4. Connect your GitHub account
5. Select this repository
6. Specify will create a `.specifyrc.json` config file via PR
7. Merge the PR
8. Tokens will auto-sync on every design change! 🎉

## Project Structure

```
ShepWispr/
├── specify/                    # Specify configuration
│   ├── extract.ts             # Token extraction script (customize this!)
│   ├── package.json           # Specify module config
│   ├── tsconfig.json          # TypeScript config
│   ├── .env                   # Your secrets (not in git)
│   └── .env.example           # Template for .env
├── package.json               # Main project config
├── README.md                  # Project documentation
├── SETUP.md                   # This file
└── .gitignore                # Git ignore rules
```

## Available Commands

From the project root:

- `npm run specify:extract` - Extract design tokens
- `npm run specify:build` - Compile TypeScript

From the `specify/` directory:

- `npm run extract` - Build and run extraction
- `npm run build` - Compile TypeScript only

## Customizing Token Extraction

Edit `specify/extract.ts` to add your custom logic:

```typescript
// List all repositories
const repositories = await specifyClient.listRepositories();

// Get specific repository
const repository = await specifyClient.getRepository("repo-id");

// Extract tokens
const tokens = await repository.getTokens();

// Transform to CSS variables
// Transform to SCSS variables
// Save to JSON files
// Generate TypeScript types
// etc.
```

## Token Types Supported

Specify supports 50+ token types:

- **Colors** - Solid colors, gradients
- **Typography** - Font families, sizes, weights, line heights
- **Spacing** - Margins, paddings, gaps
- **Sizing** - Widths, heights, dimensions
- **Borders** - Widths, styles, radii
- **Shadows** - Box shadows, text shadows
- **Opacity** - Transparency values
- **Duration** - Animation timings
- **And many more...**

## Resources

### Official Documentation
- [Specify Docs](https://docs.specifyapp.com/)
- [CLI Usage Guide](https://docs.specifyapp.com/guides/specify-cli-usage-101)
- [SDK Usage Guide](https://docs.specifyapp.com/guides/specify-sdk-usage-101)
- [GitHub Integration](https://docs.specifyapp.com/distribute/available-destinations/github)

### Community
- [Discord Community](https://discord.gg/yRgTDgUp)
- [Blog & Tutorials](https://specifyapp.com/blog)

### Examples
- [GitHub Actions with Style Dictionary](https://specifyapp.com/blog/github-actions-style-dictionary)
- [Monorepo Token Sync](https://help.specifyapp.com/en/articles/8672436-how-to-sync-design-tokens-in-a-github-monorepo)

## Troubleshooting

### Authentication Issues

If you get authentication errors:
1. Verify your token in `.env` is correct
2. Check token hasn't expired
3. Ensure no extra spaces in the `.env` file

### Module Not Found

If you get module errors:
```bash
cd specify
npm install
```

### TypeScript Errors

Rebuild the TypeScript:
```bash
cd specify
npm run build
```

## Security Notes

⚠️ **Important**: Never commit your `.env` file or expose your Personal Access Token!

The `.gitignore` file is configured to exclude:
- `.env` files
- `node_modules/`
- Compiled JavaScript files
- Source maps

## Need Help?

- Check the [official documentation](https://docs.specifyapp.com/)
- Join the [Discord community](https://discord.gg/yRgTDgUp)
- Review the `README.md` files in this project

---

**Happy token managing! 🎨✨**
