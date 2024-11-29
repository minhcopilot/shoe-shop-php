import {
	Box,
	Button,
	Hidden,
	InputAdornment,
	TextField,
	Typography,
} from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import { BiLockAlt } from 'react-icons/bi'
import { useLocation } from 'react-router-dom'
import axios from 'axios'
import bgForgotPasword from '../../../assets/images/forgot-password.png'
import { useStyles } from './styles'

const ResetPasswordForm = () => {
	const classes = useStyles()
	const location = useLocation()

	// State quản lý token và form
	const [token, setToken] = useState("")
	const [email, setEmail] = useState("") // Thêm state email
	const [password, setPassword] = useState("")
	const [confirmPassword, setConfirmPassword] = useState("")
	const [loading, setLoading] = useState(false)
	const [message, setMessage] = useState("")

	// Lấy token từ URL và xóa `?token` khỏi đường dẫn
	useEffect(() => {
		const searchParams = new URLSearchParams(location.search);
		const tokenFromUrl = searchParams.get("token");
	  
		if (tokenFromUrl) {
		  setToken(tokenFromUrl); // Lưu token vào state
		//   window.history.replaceState({}, document.title, '/reset-password');
		} else {
		  console.log("Không tìm thấy token trong URL!");
		}
	  
		console.log("location.search:", location.search);
		console.log("Token từ URL:", tokenFromUrl);
	}, [location.search]);

	// Xử lý nút Reset Password
	const handleResetPassword = async () => {
		if (password !== confirmPassword) {
			setMessage("Mật khẩu xác nhận không khớp.")
			return
		}

		setLoading(true)
		setMessage("")
		try {
			const response = await axios.post("http://127.0.0.1:8000/api/reset-password", {
				email: email,  // Gửi email từ form
				token: token,
				password: password,
				password_confirmation: confirmPassword,
			})
			setMessage(response.data.message || "Đặt lại mật khẩu thành công!")
		} catch (error) {
			setMessage(
				error.response?.data?.message || "Đặt lại mật khẩu thất bại!"
			)
		} finally {
			setLoading(false)
		}
	}

	return (
		<Box className={classes.login}>
			<Box className={classes.container}>
				<Hidden mdDown implementation="js">
					<Box className={classes.imgContainer}>
						<img
							src={bgForgotPasword}
							alt="not-found"
							className={classes.img}
						/>
					</Box>
				</Hidden>
				<form className={classes.form} onSubmit={(e) => e.preventDefault()}>
					<Typography component="h2" className={classes.heading}>
						Create new password
					</Typography>

					{/* Email input field */}
					<TextField
						className={classes.input}
						placeholder="Email"
						type="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						InputProps={{
							startAdornment: (
								<InputAdornment position="start">
									<BiLockAlt className={classes.inputIcon} />
								</InputAdornment>
							),
							classes: {
								input: classes.input,
							},
						}}
					/>

					<TextField
						className={classes.input}
						placeholder="Password"
						type="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						InputProps={{
							startAdornment: (
								<InputAdornment position="start">
									<BiLockAlt className={classes.inputIcon} />
								</InputAdornment>
							),
							classes: {
								input: classes.input,
							},
						}}
					/>

					<TextField
						className={classes.input}
						placeholder="Confirm password"
						type="password"
						value={confirmPassword}
						onChange={(e) => setConfirmPassword(e.target.value)}
						InputProps={{
							startAdornment: (
								<InputAdornment position="start">
									<BiLockAlt className={classes.inputIcon} />
								</InputAdornment>
							),
							classes: {
								input: classes.input,
							},
						}}
					/>
					{message && (
						<Typography
							variant="body2"
							style={{ color: message.includes("thành công") ? "green" : "red" }}
						>
							{message}
						</Typography>
					)}
					<Button
						className={classes.action}
						onClick={handleResetPassword}
						disabled={loading}
					>
						{loading ? "Đang xử lý..." : "Reset password"}
					</Button>
				</form>
			</Box>
		</Box>
	)
}

export default ResetPasswordForm
