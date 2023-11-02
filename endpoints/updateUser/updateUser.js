import User from "./DTO/User.js";
import initializeKnex from "/opt/nodejs/db/index.js";
import pkg from "@aws-sdk/client-cognito-identity-provider";
const {
    CognitoIdentityProviderClient,
    ListUsersCommand,
    AdminUpdateUserAttributesCommand,
    AdminRemoveUserFromGroupCommand,
    AdminAddUserToGroupCommand
} = pkg;

let knexInstance;

const allowedGroups = {
    admin: "admin",
    basic_user: "basic_user",
    driver: "driver",
    logistics: "logistics",
    project_manager: "project_manager",
};

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

async function getCognitoUsernameBySub(userPoolId, sub) {
    try {
        const client = new CognitoIdentityProviderClient({
            region: process.env.AWS_REGION,
        });
        console.log(`UserPoolId: ${userPoolId}, sub: ${sub}`);
        const command = new ListUsersCommand({
            UserPoolId: userPoolId,
            Filter: `sub = "${sub}"`,
        });

        const response = await client.send(command);
        console.log("ListUserCommand response", response);
        if (response.Users && response.Users.length > 0) {
            return response.Users[0].Username;
        } else {
            throw new Error("User not found");
        }
    } catch (error) {
        console.error("Error fetching username:", error);
        throw error;
    }
}

async function updateUserInCognito(userPoolId, username, phoneNumber, email, userRole, previousUserRole) {
    console.log("updateUserInCognito");
    console.log(
        `UserPoolId ${userPoolId}`,
        `username: ${username}`,
        `phoneNumber: ${phoneNumber}`,
        `email: ${email}`
    );
    const userAttributesToUpdate = [];
    if (isValidString(phoneNumber)) {
        userAttributesToUpdate.push({
            Name: "phone_number",
            Value: phoneNumber,
        });
    }
    if (isValidString(email)) {
        userAttributesToUpdate.push({
            Name: "email",
            Value: email,
        });
    }
    if (userAttributesToUpdate.length === 0) {
        return;
    }

    try {
        const client = new CognitoIdentityProviderClient({
            region: process.env.AWS_REGION,
        });
        const command = new AdminUpdateUserAttributesCommand({
            UserPoolId: userPoolId,
            Username: username,
            UserAttributes: userAttributesToUpdate,
        });

        const response = await client.send(command);
        console.log("User phone number updated successfully:", response);

        if(userRole !== previousUserRole){
            const groupName = allowedGroups[userRole];
            if (!groupName) {
                throw new Error(
                    `The provide groupName is invalid: ${userRole}`
                );
            }
            const removeUserFromGroupCommand = new AdminRemoveUserFromGroupCommand({
                GroupName: previousUserRole,
                UserPoolId: userPoolId,
                Username: username
            })
            const userRomovedFromGroupRes = await client.send(removeUserFromGroupCommand);
            console.log("User removed from group successfully:", userRomovedFromGroupRes);

            const addUserToGroupCommand = new AdminAddUserToGroupCommand({ 
                UserPoolId: userPoolId, 
                Username: username, 
                GroupName: groupName
            });
            const userAddedToGroupRes = await client.send(addUserToGroupCommand);
            console.log("User added to group successfully:", userAddedToGroupRes);
        }
        
    } catch (error) {
        console.error("Error updating user phone number:", error);
        throw error;
    }
}

const updateUserInDb = async (userData, userId, userSub) => {
    await initializeDb();

    if (!userId) {
        throw new Error("The user_id field must not be null");
    }
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

    let updatedUser = {
        last_updated_by: loggedInUser[0],
        last_updated_at: knexInstance.raw("NOW()"),
        ...user,
    };

    updatedUser = Object.fromEntries(
        Object.entries(updatedUser).filter(
            ([_, val]) => val !== null && val !== undefined && val !== ""
        )
    ); // remove null or empty values

    await knexInstance("user").where("user_id", userId).update(updatedUser);

    return user;
};

const getTargetUserSubForUpdateRequest = async (userID) => {
    console.log("getTargetUserSubForUpdateRequest");
    console.log(`userID: ${userID}`);

    try {
        await initializeDb();
        const targetUserSub = await knexInstance("user")
            .where("user_id", userID)
            .pluck("cognito_sub");

        if (targetUserSub.length <= 0) {
            throw new Error(`No cognito_sub found for userId: ${userID}`);
        }

        return targetUserSub[0];
    } catch (error) {
        console.error("Error in getTargetUserSubForUpdateRequest", error);
        throw error;
    }
};

const isValidString = (stringToValidate) => {
    return (
        typeof stringToValidate === "string" && stringToValidate.trim() !== ""
    );
};

export {
    getCognitoUsernameBySub,
    updateUserInCognito,
    updateUserInDb,
    getTargetUserSubForUpdateRequest,
};
