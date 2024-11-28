// import React, { useEffect, useState } from "react";
// import {
//   Box,
//   Paper,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Typography,
//   Button,
//   Modal,
//   TextField,
//   IconButton
// } from "@material-ui/core";
// import { Helmet } from "react-helmet-async";
// import { useDispatch, useSelector } from "react-redux";
// import CustomerLayout from "../CustomerLayout/CustomerLayout";
// import { useStyles } from "./styles";
// import orderAPI from "../../../api/orderApi";
// import CloseIcon from '@material-ui/icons/Close';

// const Order = () => {
//   const classes = useStyles();
//   const [orders, setOrders] = useState([]);
//   const [openModal, setOpenModal] = useState(false);
//   const [currentOrder, setCurrentOrder] = useState(null);
//   const [formData, setFormData] = useState({
//     address: "",
//     total_price: "",
//     payment_method: "",
//     status: "",
//   });

//   // Fetch orders
//   const fetchOrders = async () => {
//     try {
//       const data = await orderAPI.getAllOrders();
//       setOrders(data);
//     } catch (error) {
//       console.error("Error fetching orders:", error);
//     }
//   };

//   // Delete order
//   const handleDeleteOrder = async (orderId) => {
//     if (!window.confirm("Bạn có chắc chắn muốn xóa đơn hàng này không?")) return;
//     try {
//       await orderAPI.deleteOrder(orderId);
//       setOrders(orders.filter((order) => order.id !== orderId));
//       alert("Xóa đơn hàng thành công!");
//     } catch (error) {
//       console.error("Error deleting order:", error);
//       alert("Không thể xóa đơn hàng.");
//     }
//   };

//   // Open modal for editing order
//   const openModalHandler = (order) => {
//     setCurrentOrder(order);
//     setFormData({
//       address: order.address,
//       total_price: order.total_price,
//       payment_method: order.payment_method,
//       status: order.status,
//     });
//     setOpenModal(true);
//   };

//   // Handle form submission for updating order
//   const handleSubmit = async () => {
//     try {
//       if (currentOrder) {
//         // Update only address
//         await orderAPI.updateOrder(currentOrder.id, { address: formData.address });
//         alert("Cập nhật địa chỉ thành công!");
//         setOpenModal(false);
//         fetchOrders(); // Refresh order list
//       }
//     } catch (error) {
//       console.error("Error submitting order:", error);
//       alert("Có lỗi xảy ra.");
//     }
//   };

//   // Get color based on order status
//   const getStatusColor = (status) => {
//     switch (status) {
//       case "Chờ xác nhận":
//         return "blue";
//       case "Đã xác nhận":
//         return "green";
//       case "Đang giao hàng":
//         return "yellow";
//       case "Huỷ":
//         return "red";
//       default:
//         return "grey"; // Default color for other statuses
//     }
//   };

//   useEffect(() => {
//     fetchOrders();
//   }, []);

//   return (
//     <>
//       <Helmet>
//         <title>Reno - Chi tiết đơn hàng</title>
//         <meta name="description" content="Helmet application" />
//       </Helmet>
//       <CustomerLayout>
//         <Box className={classes.profile}>
//           <Typography variant="h3" className={classes.heading}>
//             Chi tiết đơn hàng
//           </Typography>

//           <TableContainer component={Paper} elevation="0">
//             <Table className={classes.table} aria-label="simple table">
//               <TableHead>
//                 <TableRow>
//                   <TableCell align="center" className={classes.tableHead}>
//                     Mã đơn hàng
//                   </TableCell>
//                   <TableCell align="center" className={classes.tableHead}>
//                     Địa chỉ
//                   </TableCell>
//                   <TableCell align="center" className={classes.tableHead}>
//                     Tổng tiền
//                   </TableCell>
//                   <TableCell align="center" className={classes.tableHead}>
//                     Thanh toán
//                   </TableCell>
//                   <TableCell align="center" className={classes.tableHead}>
//                     Trạng thái
//                   </TableCell>
//                   <TableCell align="center" className={classes.tableHead}>
//                     Hành động
//                   </TableCell>
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {orders.map((order) => (
//                   <TableRow key={order.id}>
//                     <TableCell align="center">{order.id}</TableCell>
//                     <TableCell align="center">{order.address}</TableCell>
//                     <TableCell align="center">{order.total_price}</TableCell>
//                     <TableCell align="center">{order.payment_method}</TableCell>
//                     <TableCell align="center">
//                       <Typography
//                         style={{
//                           color: getStatusColor(order.status),
//                           fontWeight: 'bold',
//                         }}
//                       >
//                         {order.status}
//                       </Typography>
//                     </TableCell>
//                     <TableCell align="center">
//                       {order.status === "Chờ xác nhận" && (
//                         <>
//                           <Button
//                             variant="contained"
//                             color="secondary"
//                             onClick={() => openModalHandler(order)}
//                             style={{ marginRight: "10px" }}
//                           >
//                             Sửa
//                           </Button>
//                           <Button
//                             variant="contained"
//                             color="default"
//                             onClick={() => handleDeleteOrder(order.id)}
//                           >
//                             Xóa
//                           </Button>
//                         </>
//                       )}
//                     </TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </TableContainer>
//         </Box>
//       </CustomerLayout>

//       {/* Modal for Editing Order */}
//       <Modal open={openModal} onClose={() => setOpenModal(false)}>
//         <Box
//           className={classes.modal}
//           style={{
//             backgroundColor: "#fff", // Set background color to white for readability
//             padding: "20px", // Add padding for better spacing
//             borderRadius: "8px", // Add border radius for rounded corners
//             boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)", // Add subtle shadow for depth
//           }}
//         >
//           <Box display="flex" justifyContent="space-between" alignItems="center">
//             <Typography variant="h4">Cập nhật địa chỉ</Typography>
//             <IconButton onClick={() => setOpenModal(false)}>
//               <CloseIcon />
//             </IconButton>
//           </Box>
//           <TextField
//             label="Địa chỉ"
//             fullWidth
//             value={formData.address}
//             onChange={(e) =>
//               setFormData({ ...formData, address: e.target.value })
//             }
//             margin="normal"
//           />
//           {/* Disable other fields when updating */}
//           <TextField
//             label="Giá giao hàng"
//             fullWidth
//             value={formData.total_price}
//             disabled
//             margin="normal"
//           />
//           <TextField
//             label="Phương thức thanh toán"
//             fullWidth
//             value={formData.payment_method}
//             disabled
//             margin="normal"
//           />
//           <TextField
//             label="Trạng thái"
//             fullWidth
//             value={formData.status}
//             disabled
//             margin="normal"
//           />
//           <Button
//             variant="contained"
//             color="primary"
//             onClick={handleSubmit}
//             style={{
//               marginTop: "20px",
//               backgroundColor: "#4caf50", // Green button for better visibility
//               color: "#fff",
//             }}
//           >
//             Cập nhật
//           </Button>
//         </Box>
//       </Modal>
//     </>
//   );
// };

// export default Order;

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
  IconButton
} from "@material-ui/core";
import { Helmet } from "react-helmet-async";
import { useDispatch, useSelector } from "react-redux";
import CustomerLayout from "../CustomerLayout/CustomerLayout";
import { useStyles } from "./styles";
import orderAPI from "../../../api/orderApi";
import CloseIcon from '@material-ui/icons/Close';

const Order = () => {
  const classes = useStyles();
  const [orders, setOrders] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [formData, setFormData] = useState({
    address: "",
    total_price: "",
    payment_method: "",
    status: "",
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

  // Cancel order (instead of delete)
  const handleCancelOrder = async (orderId) => {
    if (!window.confirm("Bạn có chắc chắn muốn huỷ đơn hàng này không?")) return;
    try {
      await orderAPI.cancelOrder(orderId); // Assuming you have a cancelOrder API
      setOrders(orders.filter((order) => order.id !== orderId));
      alert("Huỷ đơn hàng thành công!");
    } catch (error) {
      console.error("Error cancelling order:", error);
      alert("Không thể huỷ đơn hàng.");
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
    });
    setOpenModal(true);
  };

  // Handle form submission for updating order
  const handleSubmit = async () => {
    try {
      if (currentOrder) {
        // Update only address
        await orderAPI.updateOrder(currentOrder.id, { address: formData.address });
        alert("Cập nhật địa chỉ thành công!");
        setOpenModal(false);
        fetchOrders(); // Refresh order list
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
                    <TableCell align="center">{order.id}</TableCell>
                    <TableCell align="center">{order.address}</TableCell>
                    <TableCell align="center">{order.total_price}</TableCell>
                    <TableCell align="center">{order.payment_method}</TableCell>
                    <TableCell align="center">
                      <Typography
                        style={{
                          color: getStatusColor(order.status),
                          fontWeight: 'bold',
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
                              backgroundColor: "red", // Red background for Cancel button
                              color: "#fff", // White text color
                            }} 
                            onClick={() => handleCancelOrder(order.id)} // Renamed function to handle cancellation
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
      </CustomerLayout>

      {/* Modal for Editing Order */}
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
            <Typography variant="h4">Cập nhật địa chỉ</Typography>
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
          {/* Disable other fields when updating */}
          <TextField
            label="Giá giao hàng"
            fullWidth
            value={formData.total_price}
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
    </>
  );
};

export default Order;
