import { env } from "../config/env";

const serverUrl = `http://localhost:${env.port}`;

export const openApiSpec = {
  openapi: "3.0.3",
  info: {
    title: "PRS API Documentation",
    version: "1.0.0",
    description:
      "API documentation for the Express + TypeScript + MongoDB server. OAuth bearer token support is available for future use and is disabled unless AUTH_ENABLED=true.",
  },
  servers: [
    {
      url: serverUrl,
      description: "Local development server",
    },
  ],
  tags: [
    { name: "Health", description: "Health and status endpoints" },
    { name: "Users", description: "Sample user module endpoints" },
    { name: "Reports", description: "Report upload and fetch endpoints" },
  ],
  paths: {
    "/": {
      get: {
        tags: ["Health"],
        summary: "Check if the server is running",
        description:
          "Use this endpoint for a quick uptime check. It is helpful for confirming that the Express server process is running before testing versioned API routes.",
        responses: {
          "200": {
            description: "Server is running",
          },
        },
      },
    },
    [`${env.apiPrefix}/health`]: {
      get: {
        tags: ["Health"],
        summary: "Check API health",
        description:
          "Use this endpoint to verify that the API base path is mounted and reachable. This is the best lightweight check for deployment monitoring and API availability tests.",
        responses: {
          "200": {
            description: "API is healthy",
          },
        },
      },
    },
    [`${env.apiPrefix}/users`]: {
      get: {
        tags: ["Users"],
        summary: "Get all users",
        description:
          "Use this endpoint to list all stored users. It is useful for admin views, development checks, and verifying that user creation worked as expected.",
        responses: {
          "200": {
            description: "List of users",
          },
        },
      },
      post: {
        tags: ["Users"],
        summary: "Create a new user",
        description:
          "Use this endpoint to add a new user record to the system. It validates the payload, enforces unique email addresses, and returns the created user in a public-safe format.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/CreateUserRequest",
              },
            },
          },
        },
        responses: {
          "201": {
            description: "User created successfully",
          },
          "400": {
            description: "Validation failed",
          },
          "409": {
            description: "User already exists",
          },
        },
      },
    },
    [`${env.apiPrefix}/users/{userId}`]: {
      get: {
        tags: ["Users"],
        summary: "Get a user by MongoDB id",
        description:
          "Use this endpoint when you already have a user id and need the details for one specific user. It is commonly used after listing users or after creating a new user.",
        parameters: [
          {
            name: "userId",
            in: "path",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],
        responses: {
          "200": {
            description: "User fetched successfully",
          },
          "400": {
            description: "Invalid id",
          },
          "404": {
            description: "User not found",
          },
        },
      },
    },
    [`${env.apiPrefix}/reports/upload`]: {
      post: {
        tags: ["Reports"],
        summary: "Upload a JSON report file",
        description:
          "Use this endpoint to import a PRS report JSON file into the system. Upload the file with multipart/form-data using the field name 'file'. The API stores the file using sample.id as the MongoDB primary key. Re-uploading the same sample.id updates the existing record and keeps existing phenotypes while adding or replacing uploaded phenotype IDs.",
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                required: ["file"],
                properties: {
                  file: {
                    type: "string",
                    format: "binary",
                  },
                },
              },
            },
          },
        },
        responses: {
          "201": {
            description: "Report created",
          },
          "200": {
            description: "Existing report updated with merged phenotypes",
          },
          "400": {
            description: "Invalid file or JSON",
          },
        },
      },
    },
    [`${env.apiPrefix}/reports/{reportId}`]: {
      get: {
        tags: ["Reports"],
        summary: "Get a stored report by sample.id",
        description:
          "Use this endpoint to fetch one stored PRS report by its sample.id. It is helpful when you need the saved report payload, sample details, timestamps, or total phenotype count for one report.",
        parameters: [
          {
            name: "reportId",
            in: "path",
            required: true,
            schema: {
              type: "string",
            },
            description: "The sample.id value from the uploaded JSON file",
          },
        ],
        responses: {
          "200": {
            description: "Report fetched successfully",
          },
          "404": {
            description: "Report not found",
          },
        },
      },
    },
    [`${env.apiPrefix}/reports/{reportId}/categories`]: {
      get: {
        tags: ["Reports"],
        summary: "Get categories with trait counts and risk-level counts",
        description:
          "Use this endpoint to build category overview screens or dashboard summaries for one report. It groups phenotypes by each category_en array value and returns trait counts plus risk-level counts. If a phenotype has category_en: [\"Health\", \"Immunological markers\"], it is counted under both categories.",
        parameters: [
          {
            name: "reportId",
            in: "path",
            required: true,
            schema: {
              type: "string",
            },
            description: "The sample.id value from the uploaded JSON file",
          },
        ],
        responses: {
          "200": {
            description: "Report categories fetched successfully",
          },
          "404": {
            description: "Report not found",
          },
        },
      },
    },
    [`${env.apiPrefix}/reports/{reportId}/categories/{categoryName}/phenotypes`]: {
      get: {
        tags: ["Reports"],
        summary: "Get all phenotypes for a specific category",
        description:
          "Use this endpoint when a user selects one category and needs the matching phenotype list for that section. It returns phenotypes where the category_en array contains the requested category name.",
        parameters: [
          {
            name: "reportId",
            in: "path",
            required: true,
            schema: {
              type: "string",
            },
            description: "The sample.id value from the uploaded JSON file",
          },
          {
            name: "categoryName",
            in: "path",
            required: true,
            schema: {
              type: "string",
            },
            description:
              "The category name from a phenotype category_en array, for example Health, Nutrition, or Immunological markers",
          },
        ],
        responses: {
          "200": {
            description: "Category phenotypes fetched successfully",
          },
          "404": {
            description: "Report or category not found",
          },
        },
      },
    },
    [`${env.apiPrefix}/reports/{reportId}/phenotypes/{phenotypeId}`]: {
      get: {
        tags: ["Reports"],
        summary: "Get full phenotype data by phenotype id",
        description:
          "Use this endpoint for phenotype detail views. It returns the full stored phenotype object for one phenotype id inside a specific report.",
        parameters: [
          {
            name: "reportId",
            in: "path",
            required: true,
            schema: {
              type: "string",
            },
            description: "The sample.id value from the uploaded JSON file",
          },
          {
            name: "phenotypeId",
            in: "path",
            required: true,
            schema: {
              type: "string",
            },
            description: "The phenotype id inside the report, for example GWAS0000021",
          },
        ],
        responses: {
          "200": {
            description: "Phenotype fetched successfully",
          },
          "404": {
            description: "Report or phenotype not found",
          },
        },
      },
    },
  },
  components: {
    securitySchemes: {
      OAuthBearer: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "OAuth access token",
        description:
          "Future-use OAuth bearer token support. Current local usage does not require a token while AUTH_ENABLED=false.",
      },
    },
    schemas: {
      CreateUserRequest: {
        type: "object",
        required: ["firstName", "lastName", "email", "password"],
        properties: {
          firstName: {
            type: "string",
            example: "Adriana",
          },
          lastName: {
            type: "string",
            example: "Garcia",
          },
          email: {
            type: "string",
            format: "email",
            example: "adriana@example.com",
          },
          password: {
            type: "string",
            example: "secret123",
          },
        },
      },
      ErrorResponse: {
        type: "object",
        properties: {
          success: {
            type: "boolean",
            example: false,
          },
          message: {
            type: "string",
            example: "Validation failed",
          },
          details: {
            nullable: true,
          },
        },
      },
    },
  },
} as const;
