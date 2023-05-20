import postPurchaseOrderRequestItemComment from "./postPurchaseOrderRequestItemComment";

const handler = async (event) => {
  try {
    const comment = JSON.parse(event.body).comment;
    return await postPurchaseOrderRequestItemComment(comment);
  } catch (error) {
    console.error("Error in handler:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: `Server Error, ${error}` }),
    };
  }
};

export { handler };
