import axiosClient from './axiosClient'
import axiosimageClient from './axiosClient'

const productAPI = {
	getAllProduct: async (params) => {
		const url = '/products'
		return await axiosClient.get(url, { params })
	},

	addProduct: async (data) => {
		const url = '/products'
		console.log(data)
		return await axiosimageClient.post(url, data)
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
