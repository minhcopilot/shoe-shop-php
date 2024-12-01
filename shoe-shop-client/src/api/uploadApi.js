import axiosClient from "./axiosClient";

const uploadAPI = {
  upload: async (files) => {
    let formData = new FormData();
    files.forEach((file) => {
      formData.append("images", file);
    });

    try {
      const response = await axiosClient.post("/products/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data; // Trả về danh sách các URL hình ảnh đã upload
    } catch (error) {
      console.error("Error uploading images:", error);
      throw error;
    }
  },
};

export default uploadAPI;
