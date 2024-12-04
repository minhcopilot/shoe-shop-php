
import {
  Box,
  Button,
  Hidden,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  CircularProgress,
} from "@material-ui/core";
import { unwrapResult } from "@reduxjs/toolkit";
import { nanoid } from "nanoid";
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { BiMinus, BiPlus, BiRightArrowAlt, BiX } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import bgCart from "../../../assets/images/cart.svg";


import orderAPI from "../../../api/orderApi";

import {
  removeFromCart,
  updateQuantity,
} from "../../../redux/slices/cartSlice";
import CustomerLayout from "../CustomerLayout/CustomerLayout";
import { useStyles } from "./styles";
import axiosClient from "../../../api/axiosClient";


const Cart = () => {
  const classes = useStyles();
  const user = useSelector((state) => state.auth.user);
  const cartItems = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();
  const history = useHistory();

  const [paymentMethod, setPaymentMethod] = useState("Tiền mặt");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const [phoneError, setPhoneError] = useState('');
  const [addressError, setAddressError] = useState('');

  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleIncreaseQuantity = (product) => {
    dispatch(
      updateQuantity({
        productId: product.product.id,
        sizeId: product.chooseSize.id,
        quantity: product.quantity + 1,
      })
    );
  };

  const handleDecreaseQuantity = (product) => {
    if (product.quantity - 1 === 0) {
      dispatch(
        removeFromCart({
          productId: product.product.id,
          sizeId: product.chooseSize.id,
        })
      );
    } else {
      dispatch(
        updateQuantity({
          productId: product.product.id,
          sizeId: product.chooseSize.id,
          quantity: product.quantity - 1,
        })
      );
    }
  };

  const handleDeleteProduct = (product) => {
    dispatch(
      removeFromCart({
        productId: product.product.id,
        sizeId: product.chooseSize.id,
      })
    );
  };

  const total = cartItems?.reduce((sum, item) => {
    return sum + item.product.price * item.quantity;
  }, 0);


  const handleOrder = async () => {
    validatePhone();
    validateAddress();

    if (!phoneError && !addressError) {
      setIsProcessing(true); // Bắt đầu hiệu ứng loading
      try {
        const cartItemsData = cartItems.map((item) => ({
          product_id: item.product.id,
          quantity: item.quantity,
          size_id: item.chooseSize.id || null,
        }));

        const orderData = {
          payment_method: paymentMethod,
          address,
          sdt: phone,
          cart_items: cartItemsData,
        };

        const newOrder = await orderAPI.addOrder(orderData);

        const orderId = newOrder.id;
        const orderTotalPrice = newOrder.total_price;

        if (paymentMethod === "VNPAY") {
          try {
            const vnpayUrl = await orderAPI.vnpayPayment({
              id: orderId,
              amount: orderTotalPrice,
            });

            if (vnpayUrl) {
              setIsProcessing(false); // Tắt loading trước khi chuyển hướng
              window.location.href = vnpayUrl;
            }
          } catch (paymentError) {
            console.error("Error during VNPAY payment:", paymentError.message);
          }
        } else {
          setIsProcessing(false); // Tắt loading trước khi điều hướng
          history.push("/order");
        }
      } catch (error) {
        setIsProcessing(false); // Tắt loading khi có lỗi
        console.error("Error creating order:", error);
      }
    }
  };


  const validatePhone = () => {
    if (!phone.trim()) {
      setPhoneError('Vui lòng điền số điện thoại.');
    } else if (phone.length !== 10 || !/^\d{10}$/.test(phone)) {
      setPhoneError('Số điện thoại phải có đúng 10 chữ số.');
    } else {
      setPhoneError('');
    }
  };

  const validateAddress = () => {
    if (!address.trim()) {
      setAddressError('Vui lòng điền địa chỉ.');
    } else {
      setAddressError('');
    }
  };
  const handlePhoneChange = (e) => {
    setPhone(e.target.value);
    if (phoneError) validatePhone(); // Kiểm tra ngay khi có lỗi trước đó
  };

  const handleAddressChange = (e) => {
    setAddress(e.target.value);
    if (addressError) validateAddress(); // Kiểm tra ngay khi có lỗi trước đó
  };


  return (
    <>
      <Helmet>
        <title>Reno - Cart</title>
        <meta name="description" content="Helmet application" />
      </Helmet>
      <CustomerLayout>
        {cartItems?.length > 0 ? (
          <Box className={classes.list}>
            <Typography component="h3" className={classes.headingCart}>
              Giỏ hàng
            </Typography>
            <TableContainer
              component={Paper}
              elevation={0}
              style={{ marginBottom: 25 }}
            >
              <Table className={classes.table} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell className={classes.tableHead}>
                      Sản phẩm
                    </TableCell>
                    <TableCell align="center" className={classes.tableHead}>
                      Kích thước
                    </TableCell>
                    <TableCell align="center" className={classes.tableHead}>
                      Giá
                    </TableCell>
                    <TableCell align="center" className={classes.tableHead}>
                      Số lượng
                    </TableCell>
                    <TableCell align="center" className={classes.tableHead}>
                      Tổng
                    </TableCell>
                    <TableCell align="center" className={classes.tableHead}>
                      Xóa
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {cartItems.map((product) => (
                    <TableRow key={nanoid()} className={classes.tableROw}>
                      <TableCell
                        component="th"
                        scope="row"
                        className={classes.cellProduct}
                        style={{ justifyContent: "flex-start" }}
                      >
                        <img
                          src={product.product.images[0]}
                          alt="product"
                          className={classes.imgProduct}
                        />
                        <Typography component="span">
                          {product.product.name}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        {product.chooseSize.name}
                      </TableCell>
                      <TableCell align="center">
                        {new Intl.NumberFormat("vi-VN").format(
                          product.product.price
                        )}{" "}
                        VND
                      </TableCell>
                      <TableCell align="center">
                        <Box className={classes.quantity}>
                          <BiMinus
                            onClick={() => handleDecreaseQuantity(product)}
                            style={{ cursor: "pointer" }}
                          />
                          <Typography component="span">
                            {product.quantity}
                          </Typography>
                          <BiPlus
                            onClick={() => handleIncreaseQuantity(product)}
                            style={{
                              cursor: "pointer",
                            }}
                          />
                        </Box>
                      </TableCell>
                      <TableCell align="center">
                        {new Intl.NumberFormat("vi-VN").format(
                          product.quantity * product.product.price
                        )}{" "}
                        VND
                      </TableCell>
                      <TableCell align="center">
                        <BiX
                          onClick={() => handleDeleteProduct(product)}
                          style={{ cursor: "pointer", fontSize: 20 }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Box className={classes.proceed}>
              <Button component={Link} to="/" className={classes.continue}>
                Tiếp tục mua sắm
              </Button>
              <Box className={classes.checkout}>
                <Typography>
                  Tổng: {new Intl.NumberFormat("vi-VN").format(total)} VND
                </Typography>           
                <Button
                  onClick={handleOrder}
                  className={classes.checkoutBtn}
                  name ="redirect"
                  disabled={isProcessing} // Vô hiệu hóa nút khi đang xử lý
                >
                  {isProcessing ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    "Thanh toán"
                  )}
                </Button>
              </Box>
            </Box>
            {/* Right side: Payment method */}
            <Box className={classes.container}>
              {/* Left section: Phone and Address */}
              <Box className={classes.leftSection}>
                <Box className={classes.formGroup}>
                  <Typography className={classes.formLabel}>Số điện thoại</Typography>
                  <input
                    type="text"
                    placeholder="Nhập số điện thoại"
                    className={classes.inputField}
                    value={phone}
                    onChange={handlePhoneChange}
                    onBlur={validatePhone} // Kiểm tra khi người dùng rời khỏi trường
                  />
                  {phoneError && <Typography className={classes.errorText}>{phoneError}</Typography>}
                </Box>

                <Box className={classes.formGroup}>
                  <Typography className={classes.formLabel}>Địa chỉ giao hàng</Typography>
                  <input
                    type="text"
                    placeholder="Nhập địa chỉ giao hàng"
                    className={classes.inputField}
                    value={address}
                    onChange={handleAddressChange}
                    onBlur={validateAddress} // Kiểm tra khi người dùng rời khỏi trường
                  />
                  {addressError && <Typography className={classes.errorText}>{addressError}</Typography>}
                </Box>
              </Box>

              {/* Center section: Payment method and actions */}

              <Box className={classes.centerSection}>
                <Box className={classes.formGroup}>
                  <Typography className={classes.formLabel}>Phương thức thanh toán</Typography>
                  <Box className={classes.paymentMethods}>
                    <Box
                      className={`${classes.paymentMethod} ${paymentMethod === 'Tiền mặt' ? classes.selected : ''}`}
                      onClick={() => setPaymentMethod('Tiền mặt')}
                    >
                      <img
                        src="https://luathongbang.com.vn/wp-content/uploads/2021/12/thanh-toan-tien-mat-e1573618010533.jpg"
                        alt="Thanh toán khi nhận hàng"
                        className={classes.paymentImage}
                      />
                      <Typography>Tiền mặt</Typography>
                    </Box>
                    <Box
                      className={`${classes.paymentMethod} ${paymentMethod === 'VNPAY' ? classes.selected : ''}`}
                      onClick={() => setPaymentMethod('VNPAY')}

                    >
                      <img
                        src="https://stcd02206177151.cloud.edgevnpay.vn/assets/images/logo-icon/logo-primary.svg"
                        alt="VNPAY"
                        className={classes.paymentImage}
                      />

                      <Typography>VNPAY</Typography>
                    </Box>
                    <Box
                      className={`${classes.paymentMethod} ${paymentMethod === 'Thẻ ngân hàng' ? classes.selected : ''}`}
                      onClick={() => setPaymentMethod('Thẻ ngân hàng')}
                    >
                      <img
                        src="https://cdn-gop.garenanow.com/webmain/static/payment_center/vn/menu/vn_new_atm_140x87.png"
                        alt="Thẻ ngân hàng"
                        className={classes.paymentImage}
                      />
                      <Typography>Ngân hàng</Typography>
                    </Box>
                  </Box>
                </Box>

              </Box>
            </Box>

          </Box>
        ) : (
          <Box className={classes.notFound}>
            <Hidden mdDown implementation="js">
              <Box className={classes.imgContainer}>
                <img src={bgCart} alt="not-found" className={classes.img} />
              </Box>
            </Hidden>
            <Box className={classes.content}>
              <Typography className={classes.heading} component="h2">
                Không có sản phẩm nào trong giỏ hàng
              </Typography>
              <Button component={Link} to="/" className={classes.action}>
                Đi mua sắm
                <BiRightArrowAlt className={classes.redirectIcon} />
              </Button>
            </Box>
          </Box>
        )}
      </CustomerLayout>
    </>
  );
};

export default Cart;
