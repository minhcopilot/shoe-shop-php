import React, { useState } from "react";
import { Box, Typography, Button, CircularProgress } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import axios from "axios";

const VerifyEmail = () => {
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleGoToHome = () => {
    history.push("/");
  };

  const handleResendVerificationEmail = async () => {
    setLoading(true);
    setMessage("");
    try {
      const token = localStorage.getItem("authToken"); // Lấy token từ localStorage
      const response = await axios.get("http://localhost:8000/api/email/verify/send", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMessage(response.data.message || "Đã gửi email xác thực!");
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Không thể gửi lại email xác thực!"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box style={{ textAlign: "center", marginTop: "50px" }}>
      <Typography variant="h4" gutterBottom>
        Vui lòng kiểm tra email của bạn!
      </Typography>
      <Typography variant="body1" gutterBottom>
        Một email xác minh đã được gửi đến địa chỉ email của bạn. 
        Hãy kiểm tra hộp thư và nhấp vào liên kết xác minh để hoàn tất đăng ký.
      </Typography>
      {message && (
        <Typography
          variant="body2"
          style={{ color: "green", marginTop: "10px" }}
        >
          {message}
        </Typography>
      )}
      <Button
        variant="contained"
        color="primary"
        onClick={handleResendVerificationEmail}
        disabled={loading}
        style={{ marginTop: "20px", marginRight: "10px" }}
      >
        {loading ? <CircularProgress size={24} /> : "Gửi lại email xác thực"}
      </Button>
      <Button
        variant="contained"
        color="secondary"
        onClick={handleGoToHome}
        style={{ marginTop: "20px" }}
      >
        Quay lại trang chủ
      </Button>
    </Box>
  );
};

export default VerifyEmail;
