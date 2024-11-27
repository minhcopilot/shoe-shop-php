import axiosClient from './axiosClient'

const cartAPI = {
  // Lấy giỏ hàng của người dùng
  getCart: async (userId) => {
    const url = '/cart'

    if (userId) {
      return await axiosClient.get(url, { params: { userId } })
    } else {
      return await axiosClient.get(url)
    }
  },

  // Thêm sản phẩm vào giỏ hàng
  addToCart: async (data) => {
    const url = '/cart/add'
    return await axiosClient.post(url, { data })
  },

  // Cập nhật giỏ hàng (tăng, giảm số lượng sản phẩm)
  updateCart: async (data) => {
    const url = `/cart/update/${data.id}`
    return await axiosClient.put(url, { data })
  },

  // Xóa sản phẩm khỏi giỏ hàng
  removeFromCart: async (productId) => {
    const url = `/cart/remove/${productId}`
    return await axiosClient.delete(url)
  },

  // Xóa toàn bộ giỏ hàng
  clearCart: async (userId) => {
    const url = `/cart/clear/${userId}`
    return await axiosClient.delete(url)
  }
}

export default cartAPI
