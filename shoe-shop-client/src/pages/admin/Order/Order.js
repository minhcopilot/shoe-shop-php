

import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Modal,
} from "@material-ui/core";
import { BiPencil, BiSearchAlt2 } from "react-icons/bi";
import AdminLayout from "../../../component/admin/AdminLayout/AdminLayout";
import AddEditOrder from "./AddEditOrder/AddEditOrder";
import orderAPI from "../../../api/orderApi";
import { useStyles } from "./styles";
import CloseIcon from '@material-ui/icons/Close';

import { CircularProgress } from "@material-ui/core";

const Order = () => {
  const classes = useStyles();
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [noResults, setNoResults] = useState(false); // Trạng thái để kiểm tra không có kết quả
  const [open2, setOpen2] = useState(false);
  const [updateOrder, setUpdateOrder] = useState(null);
  const searchRef = useRef("");

  const [openDetailModal, setOpenDetailModal] = useState(false); // Separate modal for details
  const [currentOrder, setCurrentOrder] = useState(null);

  const [loading, setLoading] = useState(true); // Trạng thái loading

  // Fetch all orders on initial load
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true); // Bắt đầu tải
        const ordersFromAPI = await orderAPI.getAllOrders();
        setOrders(ordersFromAPI);
        setFilteredOrders(ordersFromAPI);
        setLoading(false); // Đã tải xong
      } catch (error) {
        console.error("Lỗi khi lấy danh sách đơn hàng:", error);
        setLoading(false); // Đã tải xong
      }
    };
    fetchOrders();
  }, [orders]);

  // Open modal to edit order
  const handleOpen2 = (order) => {
    setUpdateOrder(order);
    setOpen2(true);
  };

  const handleClose2 = () => {
    setOpen2(false);
  };

  // Handle search input change and debounce
  const handleChangeSearch = async (e) => {
    const value = e.target.value;

    // Clear any previous timeout and set a new one for debounce
    if (searchRef.current) {
      clearTimeout(searchRef.current);
    }

    searchRef.current = setTimeout(async () => {
      if (!value) {
        // If no search query, show all orders
        setFilteredOrders(orders);
        setNoResults(false); // Reset noResults if there's no search query
      } else {
        // Filter orders based on the status matching the substring
        const filtered = orders.filter((order) =>
          order.status.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredOrders(filtered);
        setNoResults(filtered.length === 0); // Set noResults if no orders match
      }
    }, 400); // Debounce with 400ms delay
  };

  // Update orders when successfully editing
  const handleUpdateSuccess = (data) => {
    const updatedOrders = orders.map((order) =>
      order.id === data.id ? { ...order, ...data } : order
    );
    setOrders(updatedOrders);
    setFilteredOrders(updatedOrders);
  };

  // Get status color based on order status
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

  const handleOrderDetailClick = async (orderId) => {
    setLoading(true);
    try {
      const response = await orderAPI.getOrderDetailForAdmin(orderId);
      if (!response || !response.order) {
        console.error("Không có dữ liệu đơn hàng");
        return;
      }
      setLoading(false);
      setCurrentOrder(response.order);
      setOpenDetailModal(true);
    } catch (error) {
      console.error("Lỗi khi lấy chi tiết đơn hàng:", error.message);
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <Box className={classes.home}>
        <Box className={classes.searchBar}>
          <TextField
            placeholder="Tìm kiếm theo trạng thái"
            variant="outlined"
            className={classes.searchField}
            onChange={handleChangeSearch}
          />
          <IconButton className={classes.searchBtn}>
            <BiSearchAlt2 />
          </IconButton>
        </Box>


        {noResults && (
          <Typography color="error" align="center">
            Không tìm thấy đơn hàng nào với trạng thái này.
          </Typography>
        )}
        <Button
          href="https://sandbox.vnpayment.vn/merchantv2/Transaction/PaymentSearch.htm"
          className={classes.checkoutBtn}
        >
          lịch sử thanh toán
        </Button>
        
        {loading ? (
            <Box display="flex" justifyContent="center" alignItems="center" height="200px">
              <CircularProgress />
              <Typography variant="h6" style={{ marginLeft: "20px" }}>
                Đang tải ...
              </Typography>
            </Box>
          ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="center">ID đơn hàng</TableCell>
                <TableCell align="center">Ngày tạo</TableCell>
                <TableCell align="center">Giá giao hàng</TableCell>
                <TableCell align="center">Phương thức thanh toán</TableCell>
                <TableCell align="center">Trạng thái</TableCell>
                <TableCell align="center">Thao tác</TableCell>
              </TableRow>
            </TableHead>
            
            <TableBody>         
              {filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell
                    align="center"
                    onClick={() => handleOrderDetailClick(order.id)}
                    style={{
                      cursor: "pointer",
                      color: "blue",
                      transition: "text-decoration 0.3s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.textDecoration = "underline";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.textDecoration = "none";
                    }}
                  >
                    {order.id}
                  </TableCell>
                  <TableCell align="center">
                    {new Date(order.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell align="center">
                    {new Intl.NumberFormat("vi-VN").format(order.total_price)}{" "}
                    VND
                  </TableCell>
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
                    {/* Disable edit button if the order is cancelled */}
                    {order.status !== "Huỷ" && (
                      <IconButton onClick={() => handleOpen2(order)}>
                        <BiPencil />
                      </IconButton>
                    )}
                  </TableCell>
                </TableRow>
                
              ))}
            </TableBody>
           
          </Table>
        </TableContainer>
      )}
          

        {updateOrder && (
          <AddEditOrder
            open={open2}
            handleClose={handleClose2}
            order={updateOrder}
            updateSuccess={handleUpdateSuccess}
          />
        )}
      </Box>
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

          {/* Chia thông tin thành 2 cột */}
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="flex-start"
            marginBottom="20px"
            padding="10px"
            style={{
              borderBottom: "1px solid #ddd",
              marginBottom: "20px",
            }}
          >
            {/* Cột bên trái */}
            <Box flex={1} marginRight="20px">
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
              <Typography
                variant="body1"
                style={{
                  fontWeight: "bold",
                  marginBottom: "8px",
                  color: "#555",
                }}
              >
                <span style={{ fontWeight: "normal" }}>Tên người đặt: </span>
                {currentOrder?.user.name}
              </Typography>
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
            </Box>

            {/* Cột bên phải */}
            <Box flex={1}>
              <Typography
                variant="body1"
                style={{
                  fontWeight: "bold",
                  marginBottom: "8px",
                  color: "#555",
                }}
              >
                <span style={{ fontWeight: "normal" }}>Email: </span>
                {currentOrder?.user.email}
              </Typography>
              <Typography
                variant="body1"
                style={{
                  fontWeight: "bold",
                  marginBottom: "8px",
                  color: "#555",
                }}
              >
                <span style={{ fontWeight: "normal" }}>Tổng tiền: </span>
                {new Intl.NumberFormat("vi-VN").format(currentOrder?.total_price)} VND
              </Typography>
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
              <Typography
                variant="body1"
                style={{
                  fontWeight: "bold",
                  color: "#555",
                }}
              >
                <span style={{ fontWeight: "normal" }}>Trạng thái: </span>
                <span style={{ color: getStatusColor(currentOrder?.status) }}>
                  {currentOrder?.status}
                </span>
              </Typography>
            </Box>
          </Box>

          {/* Danh sách sản phẩm */}
          <Box marginTop="20px">
            <Typography variant="h6">Sản phẩm trong đơn hàng:</Typography>

            <Box
              marginTop="20px"
              style={{ maxHeight: "300px", overflowY: "auto" }}
            >
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
                  <Box
                    style={{
                      flex: 1,
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <img
                      src={
                        item.image && item.image.length > 0
                          ? item.image[0]
                          : "default-image.jpg"
                      } // Fallback image if no image
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
                    <Typography variant="body2">
                      Số lượng: {item.quantity}
                    </Typography>
                  </Box>

                  {/* Giá */}
                  <Box style={{ flex: 1 }}>
                    <Typography variant="body2">
                      Giá:{" "}
                      {new Intl.NumberFormat("vi-VN").format(item.price)} VND
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      </Modal>
    </AdminLayout>
  );
};

export default Order;
