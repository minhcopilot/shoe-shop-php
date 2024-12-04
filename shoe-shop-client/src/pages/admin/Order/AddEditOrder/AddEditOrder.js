import { Button, MenuItem, TextField, Typography } from "@material-ui/core";
import Modal from "@material-ui/core/Modal";
import Fade from "@material-ui/core/Fade";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import orderAPI from "../../../../api/orderApi";  // Đảm bảo đường dẫn đúng
import { useStyles } from "./styles";
import { CircularProgress } from "@material-ui/core";

const AddEditOrder = ({ open, handleClose, order = {}, updateSuccess }) => {
  const classes = useStyles();
  const { reset } = useForm();
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    status: order?.status || "", // Khởi tạo trạng thái
  });
  const [modalOpen, setModalOpen] = useState(open);
  const [isProcessing, setIsProcessing] = useState(false);  // Trạng thái mở modal

  // Hàm để cập nhật trạng thái đơn hàng
  const handleEditOrder = async (data) => {
    setIsProcessing(true);
    try {
      // Gọi API updateOrder với id đơn hàng và status mới
      const updatedOrder = await orderAPI.updateOrderStatus(order.id, {
        status: formData.status, // Sử dụng status từ formData thay vì từ data
      });

      // Kiểm tra nếu updatedOrder hợp lệ
      if (updatedOrder && updatedOrder.id) {
        // Cập nhật lại UI sau khi thành công
        updateSuccess(updatedOrder); // Giả sử bạn cần cập nhật lại danh sách đơn hàng hoặc làm mới UI
      } else {
        setError("Cập nhật không thành công, không có dữ liệu trả về.");
       
      }


      // Đóng modal và reset 
      setModalOpen(false);  // Đóng modal
      setError("");  // Reset lỗi
      setFormData({
        status: updatedOrder.status, // Cập nhật lại formData sau khi cập nhật
      });

      // Thông báo thành công
      toast.success("Cập nhật đơn hàng thành công", {
        position: "bottom-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        
      });
      

      // Reset form khi đóng modal
      reset();

    } catch (error) {
      console.error("Error during update:", error);
      setError(error?.response?.data?.message || "Cập nhật không thành công");
      
    }
  };


  // Hàm xử lý khi người dùng thay đổi trạng thái
  const handleStatusChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      status: e.target.value, // Cập nhật trạng thái
    }));
  };

  // Reset form khi có sự thay đổi order
  useEffect(() => {
    if (order?.id) {
      setFormData({ status: order.status || "" }); // Khởi tạo lại trạng thái của đơn hàng
      reset({ status: order.status.toString() }); // Reset form với giá trị status
    }
  }, [order, reset]);

  return (
    <>
      <Modal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          handleClose();  // Đóng modal khi đóng
          reset();  // Reset form khi đóng modal
          setError("");  // Clear any errors
        }}
        closeAfterTransition
        className={classes.modal}
      >
        <Fade in={modalOpen}>
          <form className={classes.paper} onSubmit={(e) => { e.preventDefault(); handleEditOrder(); }}>
            <TextField
              id="select"
              select
              variant="outlined"
              className={classes.input}
              label="Trạng thái đơn hàng"
              value={formData.status}  // Sử dụng giá trị trong formData
              onChange={handleStatusChange}  // Khi thay đổi trạng thái
            >
              <MenuItem value="Đã xác nhận">Đã xác nhận</MenuItem>
              <MenuItem value="Đang giao hàng">Đang giao hàng</MenuItem>
              <MenuItem value="Huỷ">Huỷ</MenuItem>
              <MenuItem value="Thành công">Thành công</MenuItem>
            </TextField>
            {error && <Typography className={classes.error}>{error}</Typography>}
            <Button className={classes.save} type="submit"
              disabled={isProcessing}
            >
              {isProcessing ? (
                <CircularProgress size={24} style={{ color: "white" }} />
              ) : (
                "Lưu"
              )}
            </Button>
          </form>
        </Fade>
      </Modal>
      <ToastContainer />
    </>
  );
};

export default AddEditOrder;
