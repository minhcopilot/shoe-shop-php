
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
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { BiMinus, BiPlus, BiRightArrowAlt, BiX } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import StripeCheckout from "react-stripe-checkout";
import bgCart from "../../../assets/images/cart.svg";
import { payment, updateUser } from "../../../redux/slices/authSlice";
import { addOrder } from "../../../redux/slices/orderSlice";
import CustomerLayout from "../CustomerLayout/CustomerLayout";
import { useStyles } from "./styles";
import cartAPI from "../../../api/cart"; // import the cart API
import sizeAPI from "../../../api/sizeApi";

const KEY = process.env.REACT_APP_STRIPE_KEY;

const Cart = () => {
  const classes = useStyles();
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const history = useHistory();
  const [cart, setCart] = useState(user?.cart || []);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!user?.cart) {
      cartAPI.getCart().then((response) => {
        setCart(response.data); // Set the cart state after fetching from the API
      });
    }
    console.log('Giỏ hàng hiện tại:', cart);
  }, [user]);

  const handleIncreaseQuantity = async (product) => {
    const updatedCart = cart.map((item) => {
      if (item.product_id === product.product_id && item.cart_id === product.cart_id) {
        return {
          ...item,
          quantity: item.quantity + 1,
        };
      }
      return item;
    });

    try {
      // Call API to update the cart with the correct cart_id and product_id
      await cartAPI.updateCart(product.cart_id, { quantity: product.quantity + 1 });
      setCart(updatedCart);
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
};

const handleDecreaseQuantity = async (product) => {
  if (product.quantity > 1) {
    const updatedCart = cart.map((item) => {
      if (item.product_id === product.product_id && item.cart_id === product.cart_id) {
        return {
          ...item,
          quantity: item.quantity - 1,
        };
      }
      return item;
    });

    try {
      // Call API to update the cart with the correct cart_id and product_id
      await cartAPI.updateCart(product.cart_id, { quantity: product.quantity - 1 });
      setCart(updatedCart);
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  }
};


const handleDeleteProduct = async (product) => {
  const filteredProducts = cart.filter((productInCart) => {
    return productInCart.product_id !== product.product_id || productInCart.cart_id !== product.cart_id;
  });

  try {
    await cartAPI.removeFromCart(product.cart_id); // Remove product from the cart via API
    setCart(filteredProducts); // Update local state
  } catch (error) {
    console.error("Error removing product from cart:", error);
  }
};

  const total = cart?.reduce((sum, product) => {
    const price = parseFloat(product.product_price);
    const quantity = product.quantity;

    if (!isNaN(price) && quantity > 0) {
      return sum + price * quantity;
    }
    return sum;
  }, 0);

  const onToken = (token) => {
    console.log(token);
    const action = payment({
      tokenId: token.id,
      amount: total * 100, // Multiply by 100 for Stripe (which uses cents)
    });
    dispatch(action)
      .then(unwrapResult)
      .then(() => {
        const action = addOrder({
          userId: user._id,
          orderItems: cart,
          paymentMethod: "Card",
          totalPrice: total,
          address: token.card.name, // Assuming this is the address
        });
        dispatch(action);
        const action2 = updateUser({
          _id: user._id,
          cart: [], // Clear the cart after successful payment
        });
        dispatch(action2)
          .then(unwrapResult)
          .then(() => {
            history.push("/order");
          });
      })
      .catch((error) => console.log(error));
  };

  return (
    <>
    <Helmet>
      <title>Reno - Cart</title>
      <meta name="description" content="Helmet application" />
    </Helmet>
    <CustomerLayout>
      {cart?.length > 0 ? (
        <Box className={classes.list}>
          <Typography component="h3" className={classes.headingCart}>
            Giỏ hàng
          </Typography>
          <TableContainer
            component={Paper}
            elevation={3}
            style={{ marginBottom: 25, borderRadius: "8px" }}
          >
            <Table className={classes.table} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell className={classes.tableHead}>Sản phẩm</TableCell>
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
                {cart.map((product) => (
                  <TableRow key={product.product_id}>
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        <img
                          src={product.product_img || "default-image-url"}
                          alt={product.product_name || "Tên sản phẩm không có sẵn"}
                          className={classes.imgProduct}
                        />
                        <Typography component="span" className={classes.productName}>
                          {product.product_name || "Tên sản phẩm không có sẵn"}
                        </Typography>
                      </Box>
                    </TableCell>

                    <TableCell align="center">{product.size_name || "Kích thước không có sẵn"}</TableCell>

                    <TableCell align="center">
                      {new Intl.NumberFormat("vi-VN").format(product.product_price)} VND
                    </TableCell>

                    <TableCell align="center">
                      <Box className={classes.quantity}>
                        <BiMinus
                          onClick={() => handleDecreaseQuantity(product)}
                          style={{ cursor: "pointer" }}
                        />
                        <Typography component="span">{product.quantity}</Typography>
                        <BiPlus
                          onClick={() => handleIncreaseQuantity(product)}
                          style={{ cursor: "pointer" }}
                        />
                      </Box>
                    </TableCell>

                    <TableCell align="center">
                      {new Intl.NumberFormat("vi-VN").format(product.quantity * product.product_price)} VND
                    </TableCell>

                    <TableCell align="center">
                      <BiX onClick={() => handleDeleteProduct(product)} style={{ cursor: "pointer" }} />
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
              <Typography>Tổng: {new Intl.NumberFormat("vi-VN").format(total)} VND</Typography>

              <Button className={classes.checkoutBtn}>Thanh toán trả sau</Button>
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
