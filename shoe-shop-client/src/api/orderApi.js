import axiosClient from './axiosClient';

const orderAPI = {

  getAllOrders: async () => {
    const url = '/orders'; // Endpoint để lấy danh sách đơn hàng
    try {
      const response = await axiosClient.get(url);
      
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
      console.error('Error adding order:', error.response?.data || error.message);
      throw error;
    }
  },

  // Cập nhật trạng thái đơn hàng
  updateOrder: async (id, data) => {
    const url = `/order/update/${id}`;
    try {
      const response = await axiosClient.put(url, data);
      return response.data;  // Trả về dữ liệu sau khi cập nhật thành công
    } catch (error) {
      console.error('Error updating order:', error);
      throw error;  // Ném lỗi để có thể bắt lại ở nơi gọi API
    }
  },

   getOrderDetail : async (orderId) => {
    const url = `/order/detail/${orderId}`; // Cập nhật URL với chi tiết đơn hàng
    try {
      const response = await axiosClient.get(url);

      
      // Kiểm tra phản hồi hợp lệ và trả về chi tiết đơn hàng
      if (!response || !response.order) {
        throw new Error("Không có dữ liệu đơn hàng");
      }
  
      // Nếu dữ liệu hợp lệ, trả về thông tin chi tiết đơn hàng
      return response; // Trả về toàn bộ response để xử lý bên ngoài
    } catch (error) {
      console.error("Error fetching order details:", error.message);
      throw error; // Ném lỗi để thông báo cho component gọi API
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

  searchOrders: async (status) => {
    const url = '/orders/search'; // Đảm bảo URL đúng với backend API
  
    try {
      // Gửi yêu cầu POST với status
      const response = await axiosClient.post(url, { status });  // Gửi status trong body của yêu cầu POST
  
      // Trả về kết quả tìm kiếm từ response
      return response.data;
    } catch (error) {
      console.error('Lỗi khi tìm kiếm đơn hàng:', error);
      throw error; // Ném lỗi để xử lý ở nơi khác nếu cần
    }
  }
}

export default orderAPI;
