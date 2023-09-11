import {
    getCognitoUsernameBySub,
    updateUserInCognito,
    updateUserInDb,
    getTargetUserSubForUpdateRequest,
} from "./updateUser.js";

const handler = async (event) => {
    try {
        const body = JSON.parse(event.body).userData;
        const userIdToUpdate = event.pathParameters?.user_id;
        const clientUserSub = event.requestContext.authorizer.sub;
        const userPoolId = process.env.USER_POOL_ID;
        const userSubToUpdate = await getTargetUserSubForUpdateRequest(
            userIdToUpdate
        );
        const cognitoUsername = await getCognitoUsernameBySub(
            userPoolId,
            userSubToUpdate
        );

        const user = await updateUserInDb(body, userIdToUpdate, clientUserSub);
        await updateUserInCognito(
            userPoolId,
            cognitoUsername,
            user.phone_number,
            user.user_email
        );

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: "user updated successfully!",
            }),
            headers: {
                "Access-Control-Allow-Origin": "*",
            },
        };
    } catch (error) {
        console.error("Error in handler:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: `Server Error, ${error}` }),
            headers: {
                "Access-Control-Allow-Origin": "*",
            },
        };
    }
};

export { handler };
