import React, { useState } from "react";
import { useStyles } from "./styles";
import {
  Box,
  Button,
  Hidden,
  InputAdornment,
  TextField,
  Typography,
  CircularProgress,  // Import CircularProgress
  Backdrop,            // Import Backdrop để hiển thị hiệu ứng loading
} from "@material-ui/core";
import { BiMailSend, BiLockAlt, BiUser } from "react-icons/bi";
import { Link, useHistory } from "react-router-dom";

import bgRes2 from "../../assets/images/register-2.png";
import bgRes1 from "../../assets/images/register-1.svg";
import bgRes3 from "../../assets/images/register-3.svg";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch } from "react-redux";
import { unwrapResult } from "@reduxjs/toolkit";
import { signUp } from "../../redux/slices/authSlice";

// Định nghĩa schema validation với Yup
const schema = yup.object().shape({
  fullName: yup.string().required("Họ tên là bắt buộc"),
  email: yup.string().email("Email không hợp lệ").required("Email là bắt buộc"),
  password: yup
    .string()
    .min(8, "Mật khẩu phải ít nhất 8 ký tự")
    .required("Mật khẩu là bắt buộc"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Mật khẩu nhập lại không khớp")
    .required("Nhập lại mật khẩu là bắt buộc"),
});

const RegisterForm = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false); // Trạng thái loading

  const handleRegister = (data) => {
    setLoading(true); // Đặt loading là true khi bắt đầu gửi yêu cầu
    const action = signUp({
      name: data.fullName,
      email: data.email,
      password: data.password,
      password_confirmation: data.confirmPassword,
      is_admin: "0", // Nếu cần thiết
    });
    dispatch(action)
      .then(unwrapResult)
      .then((res) => {
        // Thành công -> chuyển hướng đến trang xác minh email
        localStorage.setItem("token", res.token); // Lưu token sau khi đăng ký thành công
        history.push("/verify-email");
      })
      .catch((error) => {
        const errorResponse = error.data;
            setError(errorResponse?.message || "Đăng ký thất bại!");
      })
    
      .finally(() => {
        setLoading(false); // Đặt loading là false khi API hoàn tất
      });
  };

  return (
    <Box className={classes.login}>
      <Hidden mdDown implementation="js">
        <img src={bgRes2} alt="login" className={classes.img1} />
      </Hidden>
      <Box className={classes.container}>
        <Hidden mdDown implementation="js">
          <Box className={classes.img2Container}>
            <img src={bgRes1} alt="login1" className={classes.img2} />
          </Box>
        </Hidden>
        <form className={classes.form} onSubmit={handleSubmit(handleRegister)}>
          <img src={bgRes3} alt="avatar" className={classes.avatar} />
          {/* Hiển thị lỗi */}
          {error && (
            <Typography component="p" className={classes.error}>
              {error}
            </Typography>
          )}
          {errors.confirmPassword && (
            <Typography component="p" className={classes.error}>
              {errors.confirmPassword.message}
            </Typography>
          )}
          {errors.password && (
            <Typography component="p" className={classes.error}>
              {errors.password.message}
            </Typography>
          )}
          <TextField
            className={classes.input}
            placeholder="Họ tên"
            {...register("fullName")}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <BiUser className={classes.inputIcon} />
                </InputAdornment>
              ),
              classes: {
                input: classes.input,
              },
            }}
          />
          <TextField
            className={classes.input}
            placeholder="Email"
            type="email"
            {...register("email")}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <BiMailSend className={classes.inputIcon} />
                </InputAdornment>
              ),
              classes: {
                input: classes.input,
              },
            }}
          />
          <TextField
            className={classes.input}
            placeholder="Mật khẩu"
            type="password"
            {...register("password")}
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
            placeholder="Nhập lại mật khẩu"
            type="password"
            {...register("confirmPassword")}
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
          <Button type="submit" className={classes.action} disabled={loading}>
            {loading ? (
              <CircularProgress size={24} color="inherit" /> // Hiển thị CircularProgress khi loading
            ) : (
              "Đăng ký"
            )}
          </Button>
          <Typography component="body2" className={classes.account}>
            Đã có tài khoản?
            <Link to="/login" className={classes.redirect}>
              Đăng nhập
            </Link>
          </Typography>
        </form>
      </Box>

      {/* Hiển thị Backdrop (overlay) khi đang tải */}
      <Backdrop
        open={loading}
        style={{
          zIndex: 1200, // Đảm bảo Backdrop hiển thị trên tất cả các phần tử khác
          color: '#fff',
        }}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </Box>
  );
};

export default RegisterForm;