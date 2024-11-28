import axiosClient from './axiosClient';

const orderAPI = {
	getAllOrders: async () => {
	  const url = '/orders';
	  try {
		const response = await axiosClient.get(url);
		console.log("API Response:", response); // Log để kiểm tra
  
		// Kiểm tra phản hồi hợp lệ
		if (!response.orders || !Array.isArray(response.orders)) {
		  throw new Error("No orders found in the response");
		}
  
		return response.orders; // Trả về mảng orders
	  } catch (error) {
		console.error("Error fetching orders:", error.message);
		throw error;
	  }
	},
  

  // Thêm đơn hàng mới
  addOrder: async (data) => {
    const url = '/order/add'; // Đảm bảo URL chính xác với controller
    try {
      const response = await axiosClient.post(url, data);
      return response.data;
    } catch (error) {
      console.error('Error adding order:', error);
      throw error;
    }
  },

  // Cập nhật trạng thái đơn hàng
  updateOrder: async (id, data) => {
    const url = `/order/update/${id}`;
    try {
      const response = await axiosClient.put(url, data);
      return response.data;
    } catch (error) {
      console.error('Error updating order:', error);
      throw error;
    }
  },

  getOrderDetail: async (id) => {
    const url = `/order/detail/${id}`; // Cập nhật URL với chi tiết đơn hàng
    try {
      const response = await axiosClient.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching order details:', error);
      throw error;
    }
  },

  // Xóa đơn hàng
  deleteOrder: async (id) => {
    const url = `/order/delete/${id}`;
    try {
      const response = await axiosClient.delete(url);
      return response.data;
    } catch (error) {
      console.error('Error deleting order:', error);
      throw error;
    }
  },

  // Tìm kiếm đơn hàng theo trạng thái
  searchOrders: async (status) => {
    const url = '/orders/search';
    try {
      const response = await axiosClient.get(url, { params: { status } });
      return response.data;
    } catch (error) {
      console.error('Error searching orders:', error);
      throw error;
    }
  }
}

export default orderAPI;
