import React, { useState } from "react";
import {
  Box,
  Button,
  Hidden,
  InputAdornment,
  TextField,
  Typography,
  CircularProgress,
} from "@material-ui/core";
import { BiMailSend } from "react-icons/bi";
import { Link } from "react-router-dom";
import axios from "axios";
import bgForgotPasword from "../../../assets/images/forgot-password.png";
import bgWave from "../../../assets/images/login-2.png";
import { useStyles } from "./styles";

const ForgotPasswordForm = () => {
  const classes = useStyles();

  // State để lưu email, loading và message
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Hàm xử lý submit form
  const handleSubmit = async (e) => {
    e.preventDefault(); // Ngăn hành động reload mặc định của form
    setLoading(true); // Hiển thị trạng thái loading
    setMessage(""); // Xóa message cũ

    try {
      // Gửi POST request
      await axios.post("http://127.0.0.1:8000/api/forgot-password", {
        email: email,
      });

      // Cập nhật thông báo thành công
      setMessage("Yêu cầu đặt lại mật khẩu đã được gửi!");
    } catch (error) {
      // Cập nhật thông báo lỗi
      setMessage("Không thể gửi yêu cầu đặt lại mật khẩu!");
    } finally {
      setLoading(false); // Tắt trạng thái loading
    }
  };

  return (
    <Box className={classes.login}>
      <Hidden mdDown implementation="js">
        <img src={bgWave} alt="login" className={classes.img1} />
      </Hidden>
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
        <form className={classes.form} onSubmit={handleSubmit}>
          <Typography component="h2" className={classes.heading}>
            Forgot password?
          </Typography>
          <Typography component="h2" className={classes.subHeading}>
            Enter the email address associated with your account
          </Typography>
          <TextField
            className={classes.input}
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)} // Cập nhật state email
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

          {/* Hiển thị thông báo */}
          {message && (
            <Typography
              variant="body2"
              style={{
                color: message.includes("thành công") ? "green" : "red",
                marginTop: "10px",
              }}
            >
              {message}
            </Typography>
          )}

          {/* Nút submit với loading */}
          <Button
            type="submit"
            className={classes.action}
            disabled={loading} // Disable khi loading
            style={{ marginTop: "20px" }}
          >
            {loading ? <CircularProgress size={24} /> : "Submit"}
          </Button>

          <Link to="/login" className={classes.redirect}>
            Back to login
          </Link>
        </form>
      </Box>
    </Box>
  );
};

export default ForgotPasswordForm;
