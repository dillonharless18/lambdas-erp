# oneXerp-lambda-functions

This repository contains the Lambda functions for the oneXerp application. Each Lambda function is responsible for a specific API endpoint or background task. The functions are automatically discovered and integrated into the oneXerp API by the `oneXerp-infrastructure` repository.

## Directory Structure

Each Lambda function should have its own directory in the `functions` folder. The directory must contain:

- `index.js` The entry point of the Lambda function
- `metadata.json`: A JSON file containing metadata that describes the function's purpose and how it should be integrated into the oneXerp API

## metadata.json

The `metadata.json` file is a crucial component for each Lambda function. It provides necessary information for the automatic integration of the function into the oneXerp API. The file should contain the following fields:

- `name`: A unique name for the Lambda function (must match the name of the directory containing the function)
- `apiPath`: The API path that the Lambda function should be associated with (e.g., "requests" or "users")
- `httpMethod`: The HTTP method that the Lambda function should respond to (e.g., "GET", "POST", "PUT", "DELETE")
- `allowedRoles`: List of roles that can utilize this API endpoint (available roles in oneXerp: "BASIC_USER", "LOGISTICS", "DRIVER", "PROJECT_MANAGER", "ADMIN")

Example `metadata.json`:

```json
{
  "name": "getPosts",
  "apiPath": "posts",
  "httpMethod": "GET",
  "allowedRoles": ["BASIC_USER"]
}
