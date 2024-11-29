import axiosClient from './axiosClient'

const categoryAPI = {
	getAllCategory: async (params) => {
		const url = '/categories'
		const response = await axiosClient.get(url, { params })
		
		return response.data
	},

	addCategory: async (data) => {
		const url = '/categories'
		const response = await axiosClient.post(url, data)
		console.log(response.data)
		return response.data
	},

	updateCategory: async (data) => {
		const url = `/categories/${data.id}`
		const response = await axiosClient.put(url, data)
		console.log(response.data)
		return response.data
	},

	getCategory: async (id) => {
		const url = `/categories/${id}`
		const response =  await axiosClient.get(url)
		console.log(response.data)
		return response.data
	},

	deleteCategory: async (id) => {
		const url = `/categories/${id}`
		const response =  await axiosClient.delete(url)
		console.log(response.data)
		return response.data
	},
}

export default categoryAPI
