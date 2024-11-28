import axiosClient from './axiosClient'

const cartAPI = {
  // Lấy giỏ hàng của người dùng
  getCart: async () => {
    const url = '/cart'
    return await axiosClient.get(url)
  },

  // Thêm sản phẩm vào giỏ hàng
  addToCart: async (data) => {
    const url = '/cart'
    return await axiosClient.post(url, data)
  },

  // Cập nhật giỏ hàng (tăng, giảm số lượng sản phẩm)
  updateCart: async (cartId, data) => {
    const url = `/cart/update/${cartId}` // Update cart with the cartId in the URL
    return await axiosClient.put(url, data)
  },

  // Xóa sản phẩm khỏi giỏ hàng
  removeFromCart: async (cartId) => {
    const url = `/cart/remove/${cartId}` // Remove cart item with the cartId in the URL
    return await axiosClient.delete(url)
  },

  // Xóa toàn bộ giỏ hàng
  clearCart: async () => {
    const url = `/cart/clear`
    return await axiosClient.delete(url)
  }
}

export default cartAPI
