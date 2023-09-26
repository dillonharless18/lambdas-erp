import User from "./DTO/User.js";
import initializeKnex from "/opt/nodejs/db/index.js";
import {
    CognitoIdentityProviderClient,
    AdminCreateUserCommand,
    AdminAddUserToGroupCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import { v4 as uuidv4 } from "uuid";

const client = new CognitoIdentityProviderClient({
    region: process.env.AWS_REGION,
});
const allowedGroups = {
    admin: "admin",
    basic_user: "basic_user",
    driver: "driver",
    logistics: "logistics",
    project_manager: "project_manager",
};

async function createUserAndAddToGroup(
    cognitoUserGroupName,
    userName,
    userEmail,
    userPhoneNumber
) {
    const params = {
        UserPoolId: process.env.USER_POOL_ID,
        Username: userName,
        TemporaryPassword: "oneXerp123!",
        UserAttributes: [
            {
                Name: "email",
                Value: userEmail,
            },
            {
                Name: "phone_number",
                Value: userPhoneNumber,
            },
        ],
        DesiredDeliveryMediums: ["EMAIL"],
        MessageAction: "SUPPRESS" // TODO Determine if this is desired and if not, update it.
    };

    try {
        const createUserCommand = new AdminCreateUserCommand(params);
        const createUserResult = await client.send(createUserCommand);
        const userAttributes = createUserResult.User.Attributes;
        const userSub = userAttributes.find(attr => attr.Name === 'sub').Value;


        console.log("User created successfully");

        const groupName = allowedGroups[cognitoUserGroupName];

        if (!groupName) {
            throw new Error(
                `The provide groupName is invalid: ${cognitoUserGroupName}`
            );
        }
        const addToGroupParams = {
            UserPoolId: params.UserPoolId, // use the same UserPool ID
            Username: params.Username, // use the same username
            GroupName: groupName, // replace with your group name
        };

        const addUserToGroupCommand = new AdminAddUserToGroupCommand(
            addToGroupParams
        );
        await client.send(addUserToGroupCommand);
        console.log("User added to group successfully");

        return { error: null, sub: userSub }
    } catch (err) {
        console.error(err);
        return { error: err, sub: null }
    }
}

let knexInstance;

const initializeDb = async () => {
    try {
        if (!knexInstance) {
            knexInstance = await initializeKnex();
        }
    } catch (error) {
        console.error("Error initializing database:", error);
        throw error;
    }
};

const getFirstInitial = (name) => {
    if (name && typeof name === "string") {
        return name[0];
    }

    console.error(`The following name is null or not a string: ${name}`);
    throw new Error(`The following name is null or not a string: ${name}`);
};

const createUser = async (userData, userSub) => {
    await initializeDb();

    if (typeof userData !== "object" || userData === null) {
        console.error("Error: The userData parameter must be an object");
        return {
            statusCode: 400,
            body: JSON.stringify({
                error: "Invalid input format: The userData parameter must be an object",
            }),
        };
    }

    const loggedInUser = await knexInstance("user")
        .where("cognito_sub", userSub)
        .pluck("user_id");

    const user = new User(userData);
    const firstInitial = getFirstInitial(user.first_name);
    const { error, sub } = await createUserAndAddToGroup(
        user.user_role,
        `${firstInitial.toLowerCase()}.${user.last_name.toLowerCase()}`,
        user.user_email,
        user.phone_number
    );
    if (error) {
        throw error;
    }

    console.log(
        `createUserAndAddToGroup response sub: ${JSON.stringify(sub, null, 2)}`
    );

    let dataToInsert = {
        user_id: uuidv4(),
        last_updated_by: loggedInUser[0],
        last_updated_at: knexInstance.raw("NOW()"),
        created_by: loggedInUser[0],
        created_at: knexInstance.raw("NOW()"),
        cognito_sub: sub,
        is_active: true,
        ...user,
    };

    await knexInstance("user").insert(dataToInsert);

    return {
        statusCode: 200,
        body: JSON.stringify({
            message: "user created successfully!",
        }),
        headers: {
            "Access-Control-Allow-Origin": "*",
        },
    };
};

export default createUser;
