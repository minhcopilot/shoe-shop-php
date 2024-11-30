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
} from "@material-ui/core";
import { unwrapResult } from "@reduxjs/toolkit";
import { nanoid } from "nanoid";
import React, { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { BiMinus, BiPlus, BiRightArrowAlt, BiX } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import bgCart from "../../../assets/images/cart.svg";
import { updateUser } from "../../../redux/slices/authSlice";
import { addOrder } from "../../../redux/slices/orderSlice";
import {
  removeFromCart,
  updateQuantity,
} from "../../../redux/slices/cartSlice";
import CustomerLayout from "../CustomerLayout/CustomerLayout";
import { useStyles } from "./styles";

// const KEY = process.env.REACT_APP_STRIPE_KEY;

const Cart = () => {
  const classes = useStyles();
  const user = useSelector((state) => state.auth.user);
  const cartItems = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();
  const history = useHistory();

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

  // const onToken = (token) => {
  //   console.log(token);
  //   const action = payment({
  //     tokenId: token.id,
  //     amount: total * 100,
  //   });
  //   dispatch(action)
  //     .then(unwrapResult)
  //     .then((res) => {
  //       const action = addOrder({
  //         userId: user.id,
  //         orderItems: cartItems,
  //         paymentMethod: "Card",
  //         totalPrice: total,
  //         address: token.card.name,
  //       });
  //       dispatch(action);
  //       const action2 = updateUser({
  //         id: user.id,
  //         cart: [],
  //       });
  //       dispatch(action2)
  //         .then(unwrapResult)
  //         .then((res) => {
  //           history.push("/order");
  //         });
  //     })
  //     .catch((error) => console.log(error));
  // };
  const handleOder = () => {
    const action = addOrder({
      userId: user.id,
      orderItems: cartItems,
      paymentMethod: "Card",
      totalPrice: total,
      address: "hsadsdasdasd",
    });
    dispatch(action);
    const action2 = updateUser({
      id: user.id,
      cart: [],
    });
    dispatch(action2)
      .then(unwrapResult)
      .then((res) => {
        history.push("/order");
      });
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

                {/* <StripeCheckout
                  token={onToken}
                  stripeKey={KEY}
                  name="Reno shop"
                  amount={total * 100} // cents
                  currency="USD"
                  email={user?.email}
                  shippingAddress
                  billingAddress
                ></StripeCheckout> */}
                <Button
                  // component={Link}
                  // to="/"
                  onClick={handleOder}
                  className={classes.checkoutBtn}
                >
                  Thanh toán trả sau
                </Button>
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