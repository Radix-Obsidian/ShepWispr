# ShepWispr

A design system project powered by Specify for design token management.

## About Specify

Specify is a design token management platform that helps you centralize, transform, and distribute design tokens from design tools like Figma to your codebase. It supports over 50 token types and provides a collaborative space for design and development teams.

## Project Structure

```
ShepWispr/
├── specify/              # Specify design token extraction
│   ├── extract.ts       # Token extraction script
│   ├── package.json     # Specify module configuration
│   ├── tsconfig.json    # TypeScript configuration
│   └── .env            # Environment variables (not tracked)
├── package.json         # Main project configuration
└── README.md           # This file
```

## Installation

The project has been set up with:
- **@specifyapp/cli** - Specify CLI for CI/CD workflows
- **@specifyapp/sdk** - Specify SDK for programmatic access
- **TypeScript** - For type-safe development
- **dotenv** - For environment variable management

## Getting Started

### 1. Set Up Your Specify Account

1. Create a Specify account at [specifyapp.com](https://specifyapp.com/)
2. Create a repository in Specify for your design tokens
3. Generate a Personal Access Token from [your user settings](https://specifyapp.com/user/personal-access-tokens)

### 2. Configure Environment Variables

1. Navigate to the `specify` directory
2. Copy `.env.example` to `.env`:
   ```bash
   cd specify
   cp .env.example .env
   ```
3. Add your Personal Access Token to `.env`:
   ```
   SPECIFY_PERSONAL_ACCESS_TOKEN=your-actual-token-here
   ```

### 3. Extract Design Tokens

Run the extraction script:

```bash
cd specify
npm run extract
```

This will authenticate with Specify and allow you to extract design tokens from your repositories.

## Using Specify CLI

The Specify CLI is installed as a dev dependency. You can use it for:

- **Automated token extraction** in CI/CD pipelines
- **Command-line token management**
- **Integration with build processes**

Example CLI usage:
```bash
npx @specifyapp/cli pull --repository <repository-id>
```

## Using Specify SDK

The SDK provides programmatic access to your design tokens. Edit `specify/extract.ts` to customize your token extraction logic:

```typescript
// List all repositories
const repositories = await specifyClient.listRepositories();

// Get specific repository
const repository = await specifyClient.getRepository("repository-id");

// Extract tokens
const tokens = await repository.getTokens();
```

## Integration Options

### GitHub Integration

Specify can automatically sync design tokens to your GitHub repository via Pull Requests:

1. Go to your Specify repository
2. Navigate to "Destinations"
3. Click "Create Pipeline"
4. Select "GitHub application"
5. Follow the setup wizard

This creates a `.specifyrc.json` configuration file in your repository root.

### CI/CD Integration

The Specify CLI is built for CI/CD environments. You can:

- Run token extraction in GitHub Actions
- Automate token updates on design changes
- Generate platform-specific token files (CSS, SCSS, JSON, etc.)

## Official Documentation

- [Specify Documentation](https://docs.specifyapp.com/)
- [Specify CLI Usage](https://docs.specifyapp.com/guides/specify-cli-usage-101)
- [Specify SDK Usage](https://docs.specifyapp.com/guides/specify-sdk-usage-101)
- [GitHub Integration](https://docs.specifyapp.com/distribute/available-destinations/github)

## Support

- [Specify Discord](https://discord.gg/yRgTDgUp)
- [Official Documentation](https://docs.specifyapp.com/)

## License

ISC
