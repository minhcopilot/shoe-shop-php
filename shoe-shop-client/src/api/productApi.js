import axiosClient from './axiosClient'
import axiosimageClient from './axiosClient'

const productAPI = {
	getAllProduct: async (params) => {
		const url = '/products'
		return await axiosClient.get(url, { params })
	},

	addProduct: async (data) => {
		const url = '/products';
		console.log('data', data);
		// Khởi tạo FormData
		const formData = new FormData();
	  
		// Thêm các dữ liệu vào FormData (chuyển các giá trị từ data vào FormData)
		formData.append("name", data.name);
		formData.append("description", data.description);
		formData.append("price", data.price);
		formData.append("stock", data.stock);
		formData.append("category_id", data.category_id);
		
	  
		// Thêm các file ảnh vào FormData
		if (data.images && data.images.length > 0) {
		  data.images.forEach((image) => {
			formData.append("images[]", image); // Thêm từng file ảnh
		  });
		}
	  
		// Thêm các kích thước vào FormData
		if (data.size && data.size.length > 0) {
		  data.size.forEach((size) => {
			formData.append("sizes[]", size); // Thêm từng kích thước
		  });
		}
		console.log("FormData being sent:");
formData.forEach((value, key) => {
  console.log(key, value);
});

		// Gửi yêu cầu POST với FormData
		try {
		  const response = await axiosimageClient.post(url, formData);
		  console.log("Data sent to backend:", response); // Debug
		  return response; // Trả về phản hồi nếu thành công
		} catch (error) {
		  console.error("Failed to add product:", error); // Xử lý lỗi
		  throw error;
		}
	  },
	  

	updateProduct: async (data) => {
		const url = `/products/${data.id}`
		return await axiosClient.put(url, data)
	},

	getProduct: async (id) => {
		const url = `/products/${id}`
		return await axiosClient.get(url)
	},

	deleteProduct: async (id) => {
		const url = `/products/${id}`
		return await axiosClient.delete(url)
	},
}

export default productAPI
