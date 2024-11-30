// import React, { useEffect, useRef, useState } from "react";
// import {
//   Box,
//   IconButton,
//   Paper,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   TextField,
//   Typography,
// } from "@material-ui/core";
// import { BiPencil, BiSearchAlt2, BiX } from "react-icons/bi";
// import { Helmet } from "react-helmet-async";
// import AdminLayout from "../../../component/admin/AdminLayout/AdminLayout";
// import AddEditOrder from "./AddEditOrder/AddEditOrder";
// import orderAPI from "../../../api/orderApi";
// import { useStyles } from "./styles";

// const Order = () => {
//   const classes = useStyles();
//   const [orders, setOrders] = useState([]);
//   const [filteredOrders, setFilteredOrders] = useState([]);
//   const [open2, setOpen2] = useState(false);
//   const [updateOrder, setUpdateOrder] = useState(null);
//   const searchRef = useRef("");

//   // Fetch all orders on initial load
//   useEffect(() => {
//     const fetchOrders = async () => {
//       try {
//         const ordersFromAPI = await orderAPI.getAllOrders();
//         setOrders(ordersFromAPI);
//         setFilteredOrders(ordersFromAPI);
//       } catch (error) {
//         console.error("Lỗi khi lấy danh sách đơn hàng:", error);
//       }
//     };
//     fetchOrders();
//   }, []);

//   // Open modal to edit order
//   const handleOpen2 = (order) => {
//     setUpdateOrder(order);
//     setOpen2(true);
//   };

//   const handleClose2 = () => {
//     setOpen2(false);
//   };

//   // Handle search input change and debounce
//  // Handle search input change and debounce
// const handleChangeSearch = async (e) => {
//   const value = e.target.value;

//   // Clear any previous timeout and set a new one for debounce
//   if (searchRef.current) {
//     clearTimeout(searchRef.current);
//   }

//   searchRef.current = setTimeout(async () => {
//     if (!value) {
//       // If no search query, show all orders
//       setFilteredOrders(orders);
//     } else {
//       // Filter orders based on the status matching the substring
//       const filtered = orders.filter((order) =>
//         order.status.toLowerCase().includes(value.toLowerCase())
//       );
//       setFilteredOrders(filtered); // Set filtered orders
//     }
//   }, 400); // Debounce with 400ms delay
// };

//   // Update orders when successfully editing
//   const handleUpdateSuccess = (data) => {
//     const updatedOrders = orders.map((order) =>
//       order.id === data.id ? { ...order, ...data } : order
//     );
//     setOrders(updatedOrders);
//     setFilteredOrders(updatedOrders);
//   };

//   // Get status color based on order status
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

//   return (
//     <AdminLayout>
//       <Box className={classes.home}>
//         <Box className={classes.searchBar}>
//           <TextField
//             placeholder="Tìm kiếm theo trạng thái"
//             variant="outlined"
//             className={classes.searchField}
//             onChange={handleChangeSearch}
//           />
//           <IconButton className={classes.searchBtn}>
//             <BiSearchAlt2 />
//           </IconButton>
//         </Box>

//         <TableContainer component={Paper}>
//           <Table>
//             <TableHead>
//               <TableRow>
//                 <TableCell align="center">ID đơn hàng</TableCell>
//                 <TableCell align="center">Ngày tạo</TableCell>
//                 <TableCell align="center">Giá giao hàng</TableCell>
//                 <TableCell align="center">Trạng thái</TableCell>
//                 <TableCell align="center">Thao tác</TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {filteredOrders.map((order) => (
//                 <TableRow key={order.id}>
//                   <TableCell align="center">{order.id}</TableCell>
//                   <TableCell align="center">
//                     {new Date(order.created_at).toLocaleDateString()}
//                   </TableCell>
//                   <TableCell align="center">
//                     {new Intl.NumberFormat("vi-VN").format(order.total_price)} VND
//                   </TableCell>
//                   <TableCell align="center">
//                     <Typography
//                       style={{
//                         color: getStatusColor(order.status),
//                         fontWeight: "bold",
//                       }}
//                     >
//                       {order.status}
//                     </Typography>
//                   </TableCell>
//                   <TableCell align="center">
//                     {/* Disable edit button if the order is cancelled */}
//                     {order.status !== "Huỷ" && (
//                       <IconButton onClick={() => handleOpen2(order)}>
//                         <BiPencil />
//                       </IconButton>
//                     )}
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </TableContainer>

//         {updateOrder && (
//           <AddEditOrder
//             open={open2}
//             handleClose={handleClose2}
//             order={updateOrder}
//             updateSuccess={handleUpdateSuccess}
//           />
//         )}
//       </Box>
//     </AdminLayout>
//   );
// };

// export default Order;

import React, { useEffect, useRef, useState } from "react";
import {
  Box,
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
} from "@material-ui/core";
import { BiPencil, BiSearchAlt2 } from "react-icons/bi";
import AdminLayout from "../../../component/admin/AdminLayout/AdminLayout";
import AddEditOrder from "./AddEditOrder/AddEditOrder";
import orderAPI from "../../../api/orderApi";
import { useStyles } from "./styles";

const Order = () => {
  const classes = useStyles();
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [noResults, setNoResults] = useState(false); // Trạng thái để kiểm tra không có kết quả
  const [open2, setOpen2] = useState(false);
  const [updateOrder, setUpdateOrder] = useState(null);
  const searchRef = useRef("");

  // Fetch all orders on initial load
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const ordersFromAPI = await orderAPI.getAllOrders();
        setOrders(ordersFromAPI);
        setFilteredOrders(ordersFromAPI);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách đơn hàng:", error);
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

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="center">ID đơn hàng</TableCell>
                <TableCell align="center">Ngày tạo</TableCell>
                <TableCell align="center">Giá giao hàng</TableCell>
                <TableCell align="center">Trạng thái</TableCell>
                <TableCell align="center">Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell align="center">{order.id}</TableCell>
                  <TableCell align="center">
                    {new Date(order.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell align="center">
                    {new Intl.NumberFormat("vi-VN").format(order.total_price)}{" "}
                    VND
                  </TableCell>
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

        {updateOrder && (
          <AddEditOrder
            open={open2}
            handleClose={handleClose2}
            order={updateOrder}
            updateSuccess={handleUpdateSuccess}
          />
        )}
      </Box>
    </AdminLayout>
  );
};

export default Order;
