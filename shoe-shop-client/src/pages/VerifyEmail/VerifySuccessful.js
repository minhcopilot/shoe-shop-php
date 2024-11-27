// src/pages/VerifyEmail/VerifySuccessful.js

import React from "react";
import { Box, Typography, Button } from "@material-ui/core";
import { useHistory } from "react-router-dom";

const VerifySuccessful = () => {
  const history = useHistory();

  // Chức năng để chuyển hướng về trang chủ sau khi xác thực
  const handleGoToHome = () => {
    history.push("/");
  };

  return (
    <Box style={{ textAlign: "center", marginTop: "50px" }}>
      <Typography variant="h4" gutterBottom>
        Xác thực email thành công!
      </Typography>
      <Typography variant="body1" gutterBottom>
        Bạn đã xác thực email thành công. Bây giờ bạn có thể bắt đầu sử dụng tài khoản của mình.
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={handleGoToHome}
        style={{ marginTop: "20px" }}
      >
        Quay lại trang chủ
      </Button>
    </Box>
  );
};

export default VerifySuccessful;
