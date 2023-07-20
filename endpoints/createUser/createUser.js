import User from './DTO/User.js';
import initializeKnex from '/opt/nodejs/db/index.js';
import { CognitoIdentityProviderClient, AdminCreateUserCommand, AdminAddUserToGroupCommand } from "@aws-sdk/client-cognito-identity-provider";

const client = new CognitoIdentityProviderClient({ region: process.env.AWS_REGION });
const allowedGroups = {
  admin: "admin",
  basic_user: "basic_user",
  driver: "driver",
  logistics: "logistics",
  project_manager: "project_manager",
}

async function createUserAndAddToGroup(cognitoUserGroupName, userName, userEmail, userPhoneNumber) {
  const params = {
    UserPoolId: process.env.USER_POOL_ID,
    Username: userName,
    TemporaryPassword: "oneXerp123",
    UserAttributes: [
      {
        Name: "email",
        Value: userEmail
      },
      {
        Name: "phone_number",
        Value: userPhoneNumber
      }
    ]
  };

  try {
    const createUserCommand = new AdminCreateUserCommand(params);
    const createUserResult = await client.send(createUserCommand);
    userSub = createUserResult.User.UserSub

    console.log("User created successfully");

    const groupName = allowedGroups.get(cognitoUserGroupName)

    if (!groupName) {
      throw new Error(`The provide groupName is invalid: ${cognitoUserGroupName}`)
    }
    const addToGroupParams = {
      UserPoolId: params.UserPoolId, // use the same UserPool ID
      Username: params.Username, // use the same username
      GroupName: groupName // replace with your group name
    };

    const addUserToGroupCommand = new AdminAddUserToGroupCommand(addToGroupParams);
    await client.send(addUserToGroupCommand);
    console.log("User added to group successfully");

    return userSub;
  } catch (err) {
    console.error(err);
  }
}

let knexInstance;

const initializeDb = async () => {
  try {
    if (!knexInstance) {
      knexInstance = await initializeKnex();
    }
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
};

const createUser = async (userData) => {
  await initializeDb();

  if (typeof userData !== 'object' || userData === null) {
    console.error('Error: The userData parameter must be an object');
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: 'Invalid input format: The userData parameter must be an object',
      }),
    };
  }

  const user = new User(userData);
  const sub = createUserAndAddToGroup(
    user.user_role,
    `${user.first_name} ${user.last_name}`,
    user.user_email,
    user.phone_number
  );

  let dataToInsert = {
    last_updated_by: '4566a3j7-92a8-40f8-8f00-f8fc355bbk7g',
    last_updated_at: knexInstance.raw('NOW()'),
    created_by: '4566a3j7-92a8-40f8-8f00-f8fc355bbk7g',
    created_at: knexInstance.raw('NOW()'),
    cognito_sub: sub,
    ...user
  };

  await knexInstance('user')
    .update(dataToInsert);

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'user updated successfully!',
    }),
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  };
};

export default createUser;