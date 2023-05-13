const { SecretsManagerClient, GetSecretValueCommand } = require("@aws-sdk/client-secrets-manager");
const { fromIni } = require("@aws-sdk/credential-provider-ini");

const getSecrets = async () => {
  const secretsManager = new SecretsManagerClient({
    region: "us-east-1",
    credentials: fromIni(),
  });

  const secretId = "arn:aws:secretsmanager:us-east-1:136559125535:secret:database-credentials-GeMfwW";

  try {
    const command = new GetSecretValueCommand({ SecretId: secretId });
    const response = await secretsManager.send(command);
    const secrets = JSON.parse(response.SecretString);

    return {
      client: "pg",
      connection: {
        host: secrets.host,
        user: secrets.username,
        password: secrets.password,
        database: secrets.dbname,
        port: secrets.port,
      },
    };
  } catch (error) {
    console.error("Error fetching secrets:", error);
    throw error;
  }
};

module.exports = getSecrets;
