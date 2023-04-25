# oneXerp-lambda-functions

This repository contains the Lambda functions for the oneXerp application. Each Lambda function is responsible for a specific API endpoint or background task. The functions are automatically discovered and integrated into the oneXerp API by the `oneXerp-infrastructure` repository.

## Tracked Branches

The development and main branches are tracked by pipelines. Anything you merge to these branches will trigger the pipeline. Always create your own branch and submit a PR to the development branch.

## Directory Structure

Each Lambda function should have its own directory inside the `endpoints` folder of this repository. The directory must contain:

- `index.js` The entry point of the Lambda function
- `metadata.json`: A JSON file containing metadata that describes the function's purpose and how it should be integrated into the oneXerp API

Example of the repository structure after adding some lambdas:

```md
.
├── endpoints/
│   ├── getAllUsers/
│   │   ├── metadata.json
│   │   └── index.ts
│   └── getPoLineItemComments/
│       ├── metadata.json
│       └── index.ts
├── someOtherFolder/
│   └── someFile.ts
└── anotherFile.ts
```

## metadata.json

The `metadata.json` file is a crucial component for each Lambda function. It provides necessary information for the automatic integration of the function into the oneXerp API. The file should contain the following fields:

- `apiPath`: *Required.* String: This is used to create all the necessary nested resources in API Gateway. If a path doesn't exist, it will be created.
- `httpMethod`: *Required.* String: The method associated with the api endpoint.
- `name`: *Required.* String: Must match the folder name.
- `allowedGroups`: *Defaults to ["admin", "basic_user", "logistics", "project_manager", "driver"] (all roles)* Array of strings: Will be used to restrict the API endpoint to various roles within oneXerp's ecosystem.

Example `metadata.json` files:

```json
{
    "apiPath"    :  "users",
    "httpMethod" :  "GET",
    "name"       :  "getUsers",
    "allowedGroups": ["logistics", "project_manager", "admin"]
}
```

```json
{
  "apiPath": "purchase-orders/{purchaseOrderId}/line-items/{lineItemId}/comments",
  "httpMethod": "GET",
  "name": "getPoLineItemComments",
  "allowedGroups": ["basic_user","logistics", "project_manager", "admin"]
}
```

```json
{
  "apiPath": "user",
  "httpMethod": "PUT",
  "name": "putUser",
  "allowedGroups": ["admin"]
}
```
