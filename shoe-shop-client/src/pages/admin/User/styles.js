import { makeStyles } from '@material-ui/styles'

const useStyles = makeStyles((theme) => ({
	home: {
		position: 'relative',
		// marginTop: 80,
		marginLeft: 300,
		padding: 40,
		backgroundColor: '#f5f6fa',
	},
	tableHead: {
		fontSize: 15,
		fontWeight: 500,
		backgroundColor: '#b7b7b7',
	},
	cellProduct: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
	},
	heading: {
		marginBottom: 20,
	},
	searchBar: {
		width: '100%',
		display: 'flex',
		alignItems: 'center',
		marginBottom: 40,
	},
	searchField: {
		flex: 1,

		'& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
			borderTopLeftRadius: 0,
			borderBottomLeftRadius: 0,
			borderRadius: '0',
		},
		'&:hover .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
			borderTopLeftRadius: 0,
			borderBottomLeftRadius: 0,
			borderRadius: '0',
		},
		'& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
			borderTopLeftRadius: 0,
			borderBottomLeftRadius: 0,
			borderRadius: '0',
		},
	},
	searchBtn: {
		height: 56,
		width: 100,
		backgroundColor: theme.palette.primary.main,
		color: theme.palette.text.secondary,
		borderRadius: 0,

		'&:hover': {
			backgroundColor: theme.palette.primary.main,
			color: theme.palette.text.secondary,
		},
	},
	add: {
		height: 56,
		width: 120,
		backgroundColor: theme.palette.primary.main,
		color: theme.palette.text.secondary,
		borderRadius: 0,
		marginLeft: 40,
		'&:hover': {
			backgroundColor: theme.palette.primary.main,
			color: theme.palette.text.secondary,
		},
	},
	emptyImg: {
		width: 150,
		height: 150,
		marginBottom: 10,
	},
	emptyTitle: {
		fontSize: 24,
	},
	emptyContainer: {
		width: '100%',
		height: '100%',
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
	},


	// Modal confirm delete
	confirmDeleteModal: {
		position: 'fixed',  // Để modal xuất hiện cố định trên màn hình
		top: '15%',         // Căn giữa theo chiều dọc
		left: '55%',        // Căn giữa theo chiều ngang
		transform: 'translate(-50%, -50%)',  // Điều chỉnh modal cho chính xác căn giữa
		backgroundColor: '#ccc', // Màu nền của modal
		padding: '20px 40px', // Padding xung quanh nội dung modal
		boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',  // Shadow nhẹ cho modal
		borderRadius: '8px', // Bo tròn các góc
		border: '1px solid #999', // Viền modal
		boxShadow: '0 4px 10px rgba(0, 0, 0, 2)', // Shadow manh cho modal
		zIndex: 1000, // Đảm bảo modal nằm trên các phần tử khác
		display: 'flex', // Sử dụng Flexbox để căn chỉnh các phần tử con
		flexDirection: 'column', // Căn chỉnh các phần tử theo cột
		alignItems: 'center',  // Căn giữa các phần tử theo chiều ngang
		justifyContent: 'center', // Căn giữa các phần tử theo chiều dọc
		width: '300px', // Chiều rộng của modal
		textAlign: 'center', // Căn giữa văn bản
	  },
	  confirmDeleteModalButtonContainer: {
		marginTop: '20px', // Khoảng cách giữa các nút và văn bản
		display: 'flex', // Sử dụng Flexbox để căn chỉnh các nút
		justifyContent: 'space-around', // Phân chia đều các nút
		width: '100%', // Chiều rộng của container các nút
	  },
	  confirmDeleteModalButton: {
		padding: '8px 16px', // Padding cho các nút
		fontSize: '14px', // Kích thước chữ của nút
		fontWeight: 'bold', // Làm đậm chữ trên nút
		borderRadius: '4px', // Bo tròn góc của nút
		transition: 'all 0.3s ease', // Hiệu ứng khi hover vào nút
	  },
	  confirmDeleteModalButtonYes: {
		backgroundColor: '#e74c3c', // Màu nền cho nút Yes
		color: '#fff', // Màu chữ trắng
		'&:hover': {
		  backgroundColor: '#c0392b', // Màu nền khi hover vào nút Yes
		},
	  },
	  confirmDeleteModalButtonNo: {
		backgroundColor: '#3498db', // Màu nền cho nút No
		color: '#fff', // Màu chữ trắng
		'&:hover': {
		  backgroundColor: '#2980b9', // Màu nền khi hover vào nút No
		},
	  },
}))

export { useStyles }
