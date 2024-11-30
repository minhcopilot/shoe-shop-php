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
} from "@material-ui/core";
import { unwrapResult } from "@reduxjs/toolkit";
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrder } from "../../../redux/slices/orderSlice";
import CustomerLayout from "../CustomerLayout/CustomerLayout";
import { useStyles } from "./styles";

const Order = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrder = () => {
      const action = getAllOrder(user.id);
      dispatch(action)
        .then(unwrapResult)
        .then((res) => {
          setOrders(res.orders);
        });
    };
    fetchOrder();
  }, [dispatch, user.id]);
  return (
    <>
      <Helmet>
        <title>Reno - Shop</title>
        <meta name="description" content="Helmet application" />
      </Helmet>
      <CustomerLayout>
        <Box className={classes.profile}>
          <Typography variant="h3" className={classes.heading}>
            Chi tiết đơn hàng
          </Typography>
          {/* <Box className={classes.searchBar}>
						<TextField
							placeholder="Search for order ID"
							variant="outlined"
							className={classes.searchField}
						/>
						<IconButton className={classes.searchBtn}>
							<BiSearchAlt2 />
						</IconButton>
					</Box> */}
          <TableContainer
            component={Paper}
            elevation="0"
            style={{ marginBottom: 25 }}
          >
            <Table className={classes.table} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell align="center" className={classes.tableHead}>
                    Mã đơn hàng
                  </TableCell>
                  <TableCell align="center" className={classes.tableHead}>
                    Ngày tạo
                  </TableCell>
                  <TableCell align="center" className={classes.tableHead}>
                    Giá giao hàng
                  </TableCell>
                  <TableCell align="center" className={classes.tableHead}>
                    Trạng thái giao hàng
                  </TableCell>
                  <TableCell align="center" className={classes.tableHead}>
                    Phương thức thanh toán
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.length > 0 &&
                  orders.map((order) => (
                    <TableRow>
                      <TableCell
                        component="th"
                        scope="row"
                        className={classes.cellProduct}
                        align="center"
                      >
                        <Typography component="body2">{order.id}</Typography>
                      </TableCell>
                      <TableCell align="center">
                        {new Date(order.createdAt).toLocaleString()}
                      </TableCell>
                      <TableCell align="center">${order.totalPrice}</TableCell>
                      <TableCell align="center">{order.status}</TableCell>
                      <TableCell align="center">
                        {order.paymentMethod.toString()}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </CustomerLayout>
    </>
  );
};

export default Order;
