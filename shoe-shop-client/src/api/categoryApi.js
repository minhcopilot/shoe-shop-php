import axiosClient from "./axiosClient";

const categoryAPI = {
  getAllCategory: async (params) => {
    const url = "/categories";
    try {
      const response = await axiosClient.get(url, { params });
      return response.data;
    } catch (error) {
      console.error("Error fetching categories:", error);
      throw error;
    }
  },

  addCategory: async (data) => {
    const url = "/categories";
    const response = await axiosClient.post(url, data);
    return response.data;
  },

  updateCategory: async (data) => {
    const url = `/categories/${data.id}`;
    const response = await axiosClient.put(url, data);
    return response.data;
  },

  getCategory: async (id) => {
    const url = `/categories/${id}`;
    const response = await axiosClient.get(url);
    return response.data;
  },

  deleteCategory: async (id) => {
    const url = `/categories/${id}`;
    const response = await axiosClient.delete(url);
    return response.data;
  },
};

export default categoryAPI;
