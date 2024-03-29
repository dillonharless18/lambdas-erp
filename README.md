# erp-lambda-functions

This repository contains the Lambda functions for the erp application. Each Lambda function is responsible for a specific API endpoint or background task. The functions are automatically discovered and integrated into the erp API by the `erp-infrastructure` repository.

## Tracked Branches

The development and main branches are tracked by pipelines. Anything you merge to these branches will trigger the pipeline. Always create your own branch and submit a PR to the development branch.

## Directory Structure

Each Lambda function should have its own directory inside the `endpoints` folder of this repository. The directory must contain:

- `index.js` The entry point of the Lambda function
- `metadata.json`: A JSON file containing metadata that describes the function's purpose and how it should be integrated into the erp API

Example of the repository structure after adding some lambdas:

```md
.
├── endpoints/
│ ├── getAllUsers/
│ │ ├── metadata.json
│ │ └── index.ts
│ └── getPoLineItemComments/
│ ├── metadata.json
│ └── index.ts
├── someOtherFolder/
│ └── someFile.ts
└── anotherFile.ts
```

## Breakdown of `metadata.json` file

Here is an examples of a `metadata.json` file:

```json
{
  "apiPath": "purchase-order-request-items/{purchase-order-request-item-id}/comments",
  "httpMethod": "GET",
  "name": "getPurchaseOrderRequestItemComments",
  "allowedGroups": [
    "admin",
    "basic_user",
    "logistics",
    "project_manager",
    "driver"
  ],
  "requestParameters": {
    "after": false
  }
}
```

`apiPath`: _Required._ String: This is used to create all the necessary nested resources in API Gateway. If a path doesn't exist, it will be created. To enable a path parameter, simply enclose it in `{}` as in the example above.

`httpMethod`: _Required._ String: The method associated with the api endpoint.

`name`: _Required._ String: This is the name the Lambda function will assume. Must match the folder name, and if it doesn't, the pipeline will fail. NOTE: We may enable automatic parsing of the folder name to give the Lambda function its name, though that's currently not supported.

`allowedGroups`: _Defaults to ["admin", "basic_user", "logistics", "project_manager", "driver"] (all roles)_ Array of strings: Will be used to restrict the API endpoint to various roles within the application's ecosystem. The authorization doesn't assume that permissions are purely heirachical, and therefore requires a group to be explicitly stated for the API to allow user in that group to access it. This means that even if every group should be able to access an endpoint, you must specify each group. For example, just putting `basic-user` in the `allowedGroups` is not enough to allow an `admin` to execute the endpoint.

`requestParameters`: _Defaults to undefined_ Object with keys representing the various queryStringParameters that an endpoint should support and values representing whether a queryStringParameter is required to execute the endpoint or not. NOTE: We may change the name of this object to queryStringParameters as currently that is all it supports; path paramters are handled by `apiPath`, and currently header parameters are not in use.

## Adding API Endpoints

To add a new API endpoint, follow these steps:

1. Create a new directory inside the `endpoints/` folder in the erp-Lambdas repository.
2. Inside the new directory, create a `metadata.json` file with the following properties:
   - `apiPath`: The API path for the function (e.g., `purchase-orders/{purchaseOrderId}/line-items/{lineItemId}/comments`)
   - `httpMethod`: The HTTP method for the function (e.g., `GET`)
   - `name`: The name of the function (e.g., `getPoLineItemComments`)
   - `allowedGroups`: The erp roles that will be allowed to access the API Endpoint. Options are: [basic_user, driver, logistics, project_manager, admin]
   - `requestParameters`: The queryStringParameters that an endpoints should support. An object with keys representing queryStringParams and `boolean` values representing if they are required to execute the endpoint.
3. Create the Lambda function's code file (e.g., `index.js`) inside the new directory
   _NOTE_: Dependencies are handled by Lambda Layers in the infrastructure repository. Please keep all large dependencies in `devDependencies` in `package.json` to avoid large bundles. See the Infrastructure Repository for the list of Lambda Layers available.
   _NOTE_: The Lambdas are created in NODE*JS_18 Execution Environment. Please ensure you account for this and use the AWS SDK V3. The imports have changed from V2 and it is the only version of the AWS SDK available by default for NODE_JS_18.
   \_NOTE*: CORS Headers _must_ be added to the response of each Lambda function since the lambdas are a proxy integration in the API gateway and handling of the request is forwarded to them.
4. The `ApiStack` will automatically create the Lambda function, integration, and API Gateway resource based on the `metadata.json` file. It will associate it with the proper Cognito User Pools according to the allowedGroups property in the metadata.json file.
