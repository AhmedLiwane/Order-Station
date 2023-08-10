const axios = require("axios");

// This array will hold the fetched orders to avoid duplicates
let fetchedOrders = [];

// Fetch new orders and emit to Socket.IO
const fetchAndEmitOrders = async () => {
  try {
    const allOrdersResponse = await axios.get("URL_TO_GET_ALL_ORDERS_API");
    const recentOrdersResponse = await axios.get(
      "URL_TO_GET_RECENT_ORDERS_API"
    );

    const allOrders = allOrdersResponse.data;
    const recentOrders = recentOrdersResponse.data.filter(
      (order) => !fetchedOrders.includes(order.id)
    );

    if (recentOrders.length > 0) {
      fetchedOrders = fetchedOrders.concat(
        recentOrders.map((order) => order.id)
      );
      io.to("order-channel").emit("new-orders", recentOrders);
    }
  } catch (error) {
    console.error("Error fetching orders:", error);
  }
};

// Emit new orders every 2 seconds
setInterval(fetchAndEmitOrders, 2000);
