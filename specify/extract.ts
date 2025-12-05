import { config } from "dotenv";
import { createSpecifyClient, updaters, parsers } from "@specifyapp/sdk";

// Load Personal Access Token from .env file
const { parsed } = config({ path: ".env" });

// Initialize Specify Client
const specifyClient = createSpecifyClient();

// Authenticate with Specify
await specifyClient.authenticate(parsed?.SPECIFY_PERSONAL_ACCESS_TOKEN || "");

console.log(`User authenticated: ${specifyClient.whoAmI()?.email}`);

// Example: List all repositories
// Uncomment the following lines to list your repositories
/*
const repositories = await specifyClient.listRepositories();
console.log("Available repositories:", repositories);
*/

// Add your design token extraction logic here
// Example:
/*
const repository = await specifyClient.getRepository("your-repository-id");
const tokens = await repository.getTokens();
console.log("Design tokens:", tokens);
*/
