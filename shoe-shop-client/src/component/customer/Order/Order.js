
import React, { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Button,
  Modal,
  TextField,
  IconButton,
} from "@material-ui/core";
import { Helmet } from "react-helmet-async";
import CustomerLayout from "../CustomerLayout/CustomerLayout";
import { useStyles } from "./styles";
import orderAPI from "../../../api/orderApi";
import CloseIcon from '@material-ui/icons/Close';


const Order = () => {
  const classes = useStyles();
  const [orders, setOrders] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [openDetailModal, setOpenDetailModal] = useState(false); // Separate modal for details
  const [currentOrder, setCurrentOrder] = useState(null);
  const [formData, setFormData] = useState({
    address: "",
    total_price: "",
    payment_method: "",
    status: "",
    sdt: "",
  });

  // Fetch orders
  const fetchOrders = async () => {
    try {
      const data = await orderAPI.getAllOrders();
      setOrders(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  // Cancel order
  const handleCancelOrder = async (orderId) => {
    if (!window.confirm("Bạn có chắc chắn muốn huỷ đơn hàng này không?")) return;
    try {
      await orderAPI.deleteOrder(orderId); // Assuming you have a cancelOrder API
      setOrders(orders.filter((order) => order.id !== orderId));
      alert("Huỷ đơn hàng thành công!");
    } catch (error) {
      console.error("Error cancelling order:", error);
      alert("Không thể huỷ đơn hàng.");
    }
  };

  const handleOrderDetailClick = async (orderId) => {
    console.log("orderId:", orderId); // Log để kiểm tra giá trị orderId
    try {
      const response = await orderAPI.getOrderDetail(orderId); // Gọi API


      // Kiểm tra phản hồi hợp lệ và trả về chi tiết đơn hàng
      if (!response || !response.order) {
        console.error("Không có dữ liệu đơn hàng");
        return;
      }

      const order = response.order;
      setCurrentOrder(order); // Lưu thông tin chi tiết đơn hàng vào state
      setOpenDetailModal(true); // Mở modal hiển thị chi tiết đơn hàng

    } catch (error) {
      console.error("Lỗi khi lấy chi tiết đơn hàng:", error.message);
    }
  };

  // Open modal for editing order
  const openModalHandler = (order) => {
    setCurrentOrder(order);
    setFormData({
      address: order.address,
      total_price: order.total_price,
      payment_method: order.payment_method,
      status: order.status,
      sdt: order.sdt
    });
    setOpenModal(true);
  };

  // Handle form submission for updating order
  const handleSubmit = async () => {
    try {
      if (currentOrder) {
        // Cập nhật cả địa chỉ và số điện thoại
        await orderAPI.updateOrder(currentOrder.id, {
          address: formData.address,
          sdt: formData.sdt,  // Thêm sdt vào payload
        });

        alert("Cập nhật thành công!");
        setOpenModal(false);
        fetchOrders(); // Refresh danh sách đơn hàng
      }
    } catch (error) {
      console.error("Error submitting order:", error);
      alert("Có lỗi xảy ra.");
    }
  };


  // Get color based on order status
  const getStatusColor = (status) => {
    switch (status) {
      case "Chờ xác nhận":
        return "blue";
      case "Đã xác nhận":
        return "green";
      case "Đang giao hàng":
        return "yellow";
      case "Huỷ":
        return "red";
      default:
        return "grey"; // Default color for other statuses
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <>
      <Helmet>
        <title>Reno - Chi tiết đơn hàng</title>
        <meta name="description" content="Helmet application" />
      </Helmet>
      <CustomerLayout>
        <Box className={classes.profile}>
          <Typography variant="h3" className={classes.heading}>
            Chi tiết đơn hàng
          </Typography>

          <TableContainer component={Paper} elevation="0">
            <Table className={classes.table} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell align="center" className={classes.tableHead}>
                    Mã đơn hàng
                  </TableCell>
                  <TableCell align="center" className={classes.tableHead}>
                    Địa chỉ
                  </TableCell>
                  <TableCell align="center" className={classes.tableHead}>
                    Sdt
                  </TableCell>
                  <TableCell align="center" className={classes.tableHead}>
                    Tổng tiền
                  </TableCell>
                  <TableCell align="center" className={classes.tableHead}>
                    Thanh toán
                  </TableCell>
                  <TableCell align="center" className={classes.tableHead}>
                    Trạng thái
                  </TableCell>
                  <TableCell align="center" className={classes.tableHead}>
                    Hành động
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell
                      align="center"
                      onClick={() => handleOrderDetailClick(order.id)}
                      style={{
                        cursor: "pointer",
                        textDecoration: "none", // Default, no underline
                        color: "blue",
                        transition: "text-decoration 0.3s ease",

                      }}
                      onMouseEnter={(e) => {
                        e.target.style.textDecoration = "underline";
                        e.target.style.textDecorationColor = "blue";
                        e.target.style.textDecorationThickness = "2px"; // Optional: Adjust thickness
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.textDecoration = "none"; // Remove underline on hover out
                      }}
                    >
                      {order.id}
                    </TableCell>

                    <TableCell align="center">{order.address}</TableCell>
                    <TableCell align="center">{order.sdt}</TableCell>
                    <TableCell align="center">{new Intl.NumberFormat('vi-VN').format(order.total_price)} VND</TableCell>
                    <TableCell align="center">{order.payment_method}</TableCell>
                    <TableCell align="center">
                      <Typography
                        style={{
                          color: getStatusColor(order.status),
                          fontWeight: "bold",
                        }}
                      >
                        {order.status}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      {order.status === "Chờ xác nhận" && (
                        <>
                          <Button
                            variant="contained"
                            color="secondary"
                            onClick={() => openModalHandler(order)}
                            style={{ marginRight: "10px" }}
                          >
                            Sửa
                          </Button>
                          <Button
                            variant="contained"
                            style={{
                              backgroundColor: "red",
                              color: "#fff",
                            }}
                            onClick={() => handleCancelOrder(order.id)}
                          >
                            Huỷ
                          </Button>
                        </>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        <Modal open={openModal} onClose={() => setOpenModal(false)}>
          <Box
            className={classes.modal}
            style={{
              backgroundColor: "#fff", // Set background color to white for readability
              padding: "20px", // Add padding for better spacing
              borderRadius: "8px", // Add border radius for rounded corners
              boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)", // Add subtle shadow for depth
            }}
          >
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h4">Cập nhật đơn hàng</Typography>
              <IconButton onClick={() => setOpenModal(false)}>
                <CloseIcon />
              </IconButton>
            </Box>
            <TextField
              label="Địa chỉ"
              fullWidth
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
              margin="normal"
            />
            <TextField
              label="Sdt"
              fullWidth
              value={formData.sdt}
              onChange={(e) =>
                setFormData({ ...formData, sdt: e.target.value })
              }
              margin="normal"
            />
            {/* Disable other fields when updating */}
            <TextField
              label="Giá giao hàng"
              fullWidth
              value={new Intl.NumberFormat('vi-VN').format(currentOrder?.total_price)}
              disabled
              margin="normal"
            />
            <TextField
              label="Phương thức thanh toán"
              fullWidth
              value={formData.payment_method}
              disabled
              margin="normal"
            />
            <TextField
              label="Trạng thái"
              fullWidth
              value={formData.status}
              disabled
              margin="normal"
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              style={{
                marginTop: "20px",
                backgroundColor: "#4caf50", // Green button for better visibility
                color: "#fff",
              }}
            >
              Cập nhật
            </Button>
          </Box>
        </Modal>

        {/* Modal for order details */}


        <Modal open={openDetailModal} onClose={() => setOpenDetailModal(false)}>
          <Box
            style={{
              backgroundColor: "#fff",
              padding: "20px",
              borderRadius: "8px",
              boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
              maxWidth: "900px",
              margin: "auto",
              marginTop: "50px",
            }}
          >
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              marginBottom="20px"
            >
              {/* Tiêu đề modal */}
              <Typography variant="h4">Chi tiết đơn hàng</Typography>

              {/* Nút đóng modal */}
              <IconButton onClick={() => setOpenDetailModal(false)}>
                <CloseIcon />
              </IconButton>
            </Box>

            {/* Thông tin đơn hàng */}
            <Box
              display="flex"
              flexDirection="column"
              justifyContent="flex-start"
              alignItems="flex-start"
              marginBottom="20px"
              padding="10px"
              style={{
                borderBottom: "1px solid #ddd",
                marginBottom: "20px",
              }}
            >
              {/* Mã đơn hàng */}
              <Typography
                variant="body1"
                style={{
                  fontWeight: "bold",
                  marginBottom: "8px",
                  color: "#555",
                }}
              >
                <span style={{ fontWeight: "normal" }}>Mã đơn hàng: </span>
                {currentOrder?.id}
              </Typography>

              {/* Địa chỉ */}
              <Typography
                variant="body1"
                style={{
                  fontWeight: "bold",
                  marginBottom: "8px",
                  color: "#555",
                }}
              >
                <span style={{ fontWeight: "normal" }}>Địa chỉ: </span>
                {currentOrder?.address}
              </Typography>

              {/* Tổng tiền */}
              <Typography
                variant="body1"
                style={{
                  fontWeight: "bold",
                  marginBottom: "8px",
                  color: "#555",
                }}
              >
                <span style={{ fontWeight: "normal" }}>Sdt: </span>
                {currentOrder?.sdt}
              </Typography>

              {/* Tổng tiền */}
              <Typography
                variant="body1"
                style={{
                  fontWeight: "bold",
                  marginBottom: "8px",
                  color: "#555",
                }}
              >
                <span style={{ fontWeight: "normal" }}>Tổng tiền: </span>
                {new Intl.NumberFormat('vi-VN').format(currentOrder?.total_price)} VND
              </Typography>

              {/* Phương thức thanh toán */}
              <Typography
                variant="body1"
                style={{
                  fontWeight: "bold",
                  marginBottom: "8px",
                  color: "#555",
                }}
              >
                <span style={{ fontWeight: "normal" }}>Phương thức thanh toán: </span>
                {currentOrder?.payment_method}
              </Typography>

              {/* Trạng thái */}
              <Typography
                variant="body1"
                style={{
                  fontWeight: "bold",
                  color: "#555", // Keep the default color for the label
                }}
              >
                <span style={{ fontWeight: "normal" }}>Trạng thái: </span>
                <span style={{ color: getStatusColor(currentOrder?.status) }}>
                  {currentOrder?.status}
                </span>
              </Typography>
            </Box>

            <Box marginTop="20px">
              <Typography variant="h6">Sản phẩm trong đơn hàng:</Typography>

              <Box marginTop="20px" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                {currentOrder?.order_items?.map((item) => (
                  <Box
                    key={item.id}
                    style={{
                      border: "1px solid #ddd",
                      borderRadius: "8px",
                      padding: "15px",
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "10px",
                    }}
                  >
                    {/* Tên sản phẩm */}
                    <Box style={{ flex: 2 }}>
                      <Typography variant="body1" style={{ fontWeight: "bold" }}>
                        {item.product_name}
                      </Typography>
                    </Box>

                    {/* Ảnh sản phẩm */}
                    <Box style={{ flex: 1, display: "flex", justifyContent: "center" }}>
                      <img
                        src={item.image} // Giả sử đây là đường dẫn ảnh
                        alt={item.product_name}
                        style={{
                          width: "80px", // Giới hạn kích thước ảnh
                          height: "auto",
                          objectFit: "contain",
                          borderRadius: "8px",
                        }}
                      />
                    </Box>

                    {/* Size */}
                    <Box style={{ flex: 1 }}>
                      <Typography variant="body2">Size: {item.size_name}</Typography>
                    </Box>

                    {/* Số lượng */}
                    <Box style={{ flex: 1 }}>
                      <Typography variant="body2">Số lượng: {item.quantity}</Typography>
                    </Box>

                    {/* Giá */}
                    <Box style={{ flex: 1 }}>
                      <Typography variant="body2">
                        Giá: {new Intl.NumberFormat("vi-VN").format(item.price)} VND
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
        </Modal>

      </CustomerLayout>
    </>
  );
};

export default Order;
