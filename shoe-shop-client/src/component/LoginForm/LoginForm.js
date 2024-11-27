import {
  Box,
  Button,
  Hidden,
  InputAdornment,
  TextField,
  Typography,
} from "@material-ui/core";
import React, { useState } from "react";
import { useStyles } from "./styles";
import bgLogin from "../../assets/images/login1.png";
import bgLogin2 from "../../assets/images/login-2.png";
import { BiMailSend, BiLockAlt, BiRightArrowAlt, BiLogoGoogle } from "react-icons/bi"; // Biểu tượng Google
import { Link, useHistory } from "react-router-dom";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { login } from "../../redux/slices/authSlice";
import { useDispatch } from "react-redux";
import { unwrapResult } from "@reduxjs/toolkit";

const schema = yup.object().shape({
  email: yup.string().required().email(),
  password: yup.string().required(),
});

const LoginForm = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();
  const { register, handleSubmit } = useForm({
    resolver: yupResolver(schema),
  });
  const [error, setError] = useState("");

  const handleLogin = (data) => {
    const action = login(data); // Action login từ Redux
    dispatch(action)
      .then(unwrapResult) // Xử lý kết quả từ Redux
      .then((res) => {
        // In ra message khi đăng nhập thành công
        console.log(res.message);

        localStorage.setItem("token", res.data.token);

        if (res.data.user.is_admin) {
          history.push("/admin/home");
        } else {
          history.push("/");
        }
      })
      .catch((error) => {
        // In ra message khi đăng nhập thất bại
        setError(error.data?.message || "Email or password is incorrect");
      });
  };

  const handleGoogleLogin = async () => {
    // Chuyển hướng đến Google Login API
    window.location.href = "http://127.0.0.1:8000/auth/google/redirect";
  };

  return (
    <Box className={classes.login}>
      <Hidden mdDown implementation="js">
        <img src={bgLogin2} alt="login" className={classes.img1} />
      </Hidden>
      <Box className={classes.container}>
        <Hidden mdDown implementation="js">
          <Box className={classes.img2Container}>
            <img src={bgLogin} alt="login1" className={classes.img2} />
          </Box>
        </Hidden>
        <form className={classes.form} onSubmit={handleSubmit(handleLogin)}>
          <Typography component="h2" className={classes.heading}>
            Đăng nhập
          </Typography>
          {error !== "" && (
            <Typography component="p" className={classes.error}>
              {error}
            </Typography>
          )}
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
            }}
          />
          <Button className={classes.action} type="submit">
            Đăng nhập
          </Button>
          
          {/* Nút đăng nhập với Google */}
          <Button
            className={classes.actionGoogle}
            onClick={handleGoogleLogin}
            startIcon={<BiLogoGoogle />} // Biểu tượng Google
          >
            Đăng nhập với Google
          </Button>
          
          <Link to="/forgot-password" className={classes.redirect}>
            Quên mật khẩu?
          </Link>
          <Link to="/register" className={classes.redirect}>
            Tạo tài khoản
            <BiRightArrowAlt className={classes.redirectIcon} />
          </Link>
        </form>
      </Box>
    </Box>
  );
};

export default LoginForm;
