import axios from "axios";

// Tạo một instance của axios với base URL và các header mặc định
const axiosimageClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL, // Đặt base URL từ biến môi trường
  withCredentials: true, // Đảm bảo cookies được gửi cùng với yêu cầu
});

// Interceptor để thêm token vào header Authorization trước khi gửi request
axiosimageClient.interceptors.request.use(async (config) => {
  const token = localStorage.getItem("token"); // Lấy token từ localStorage
  const auth = token ? `Bearer ${token}` : ""; // Nếu có token, thêm "Bearer" vào header
  config.headers.common["Authorization"] = auth; // Thêm header Authorization

  // Nếu data có chứa FormData, sẽ tự động điều chỉnh header Content-Type
  if (config.data instanceof FormData) {
    delete config.headers["Content-Type"]; // Xóa Content-Type gốc (axios sẽ tự động set khi dùng FormData)
  }

  return config; // Trả về config đã được sửa đổi
});

// Interceptor để xử lý phản hồi từ API
axiosimageClient.interceptors.response.use(
  (response) => {
    if (response && response.data) {
      return response.data; // Trả về dữ liệu trong response nếu có
    }
    return response; // Trả về response nếu không có dữ liệu
  },
  (error) => {
    // Nếu lỗi là 401 Unauthorized, có thể token hết hạn
    if (error.response && error.response.status === 401) {
      // Bạn có thể xử lý lại ở đây, ví dụ: chuyển hướng đến trang đăng nhập
      window.location.href = "/login"; // Chuyển hướng tới trang đăng nhập
    }
    // Ném lỗi nếu không phải lỗi 401
    throw error;
  }
);

export default axiosimageClient;
