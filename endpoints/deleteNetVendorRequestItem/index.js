import deleteNetVendorRequestItem from './deleteNetVendorRequestItem.js';

const handler = async (event) => {
  try {
    const netVendorRequestItemId =
      event.pathParameters?.net_vendor_request_item_id;

    if (!netVendorRequestItemId) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: 'Missing net_vendor_request_item_id path parameter',
        }),
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
      };
    }

    return await deleteNetVendorRequestItem(netVendorRequestItemId);
  } catch (error) {
    console.error('Error in handler:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: `Server Error, ${error}` }),
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    };
  }
};

export { handler };
