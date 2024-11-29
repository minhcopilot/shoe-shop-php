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
  Modal,
} from "@material-ui/core";
import { BiMinus, BiPlus, BiRightArrowAlt, BiX } from "react-icons/bi";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import { unwrapResult } from "@reduxjs/toolkit";
import { addOrder } from "../../../redux/slices/orderSlice";
import { payment, updateUser } from "../../../redux/slices/authSlice";
import cartAPI from "../../../api/cart";
import { useStyles } from "./styles";
import CustomerLayout from "../CustomerLayout/CustomerLayout";

const Cart = () => {
  const classes = useStyles();
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const history = useHistory();
  const [cart, setCart] = useState(user?.cart || []);
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [address, setAddress] = useState("");
  const [sdt, setSdt] = useState("");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!user?.cart) {
      cartAPI.getCart().then((response) => {
        setCart(response.data);
      });
    }
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

  const handleCheckout = async () => {
    if (!cart || cart.length === 0) {
      alert("Giỏ hàng của bạn đang trống!");
      return;
    }

    if (!address || !sdt) {
      alert("Vui lòng nhập đầy đủ thông tin giao hàng!");
      return;
    }

    const orderData = {
      payment_method: paymentMethod,
      address: address,
      sdt: sdt,
      status: "Chờ xác nhận",
      orderItems: cart,
    };

    try {
      const action = addOrder(orderData);
      const result = await dispatch(action);
      unwrapResult(result);
      setCart([]);
      alert("Đơn hàng đã được tạo thành công!");
      history.push("/order");
    } catch (error) {
      console.error("Error during checkout:", error);
      alert("Có lỗi xảy ra trong quá trình thanh toán.");
    }
  };

  return (
    <>
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
                    <TableCell align="center" className={classes.tableHead}>Kích thước</TableCell>
                    <TableCell align="center" className={classes.tableHead}>Giá</TableCell>
                    <TableCell align="center" className={classes.tableHead}>Số lượng</TableCell>
                    <TableCell align="center" className={classes.tableHead}>Tổng</TableCell>
                    <TableCell align="center" className={classes.tableHead}>Xóa</TableCell>
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
                      <TableCell align="center">{new Intl.NumberFormat("vi-VN").format(product.product_price)} VND</TableCell>
                      <TableCell align="center">
                        <Box className={classes.quantity}>
                          <BiMinus onClick={() => handleDecreaseQuantity(product)} style={{ cursor: "pointer" }} />
                          <Typography component="span">{product.quantity}</Typography>
                          <BiPlus onClick={() => handleIncreaseQuantity(product)} style={{ cursor: "pointer" }} />
                        </Box>
                      </TableCell>
                      <TableCell align="center">{new Intl.NumberFormat("vi-VN").format(product.quantity * product.product_price)} VND</TableCell>
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
                <Typography>Tổng: {new Intl.NumberFormat("vi-VN").format(total)} VND

                </Typography>

                <Button className={classes.checkoutBtn} onClick={() => setShowModal(true)}>
                  Thanh toán
                </Button>
              </Box>
            </Box>
          </Box>
        ) : (
          <Box className={classes.notFound}>
            <Hidden mdDown implementation="js">
              <Box className={classes.imgContainer}>
                <img src="path/to/empty-cart-image" alt="not-found" className={classes.img} />
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

        <Modal open={showModal} onClose={() => setShowModal(false)} className={classes.modal}>
          <Box className={classes.modalContent}>
            <Box className={classes.modalCard}>
              <Typography variant="h5" align="center" className={classes.modalTitle}>
                Thanh toán
              </Typography>

              {/* Hiển thị chi tiết giỏ hàng */}
              <Box className={classes.modalBody}>
                {cart?.map((product) => (
                  <Box key={product.product_id} className={classes.productItem}>
                    <Box display="flex" alignItems="center" className={classes.productInfo}>
                      <img
                        src={product.product_img || "default-image-url"}
                        alt={product.product_name || "Tên sản phẩm không có sẵn"}
                        className={classes.productImg}
                      />
                      <Typography component="span" className={classes.productName}>
                        {product.product_name || "Tên sản phẩm không có sẵn"}
                      </Typography>
                      <Typography component="span" className={classes.productSize}>
                        Kích thước: {product.size_name || "Kích thước không có sẵn"}
                      </Typography>
                    </Box>

                    {/* Số lượng và giá tiền nằm ngang */}
                    <Box display="flex" justifyContent="space-between" className={classes.productDetails}>
                      <Typography>
                        Số lượng: {product.quantity}
                      </Typography>
                      <Typography>
                        Giá: {new Intl.NumberFormat("vi-VN").format(product.product_price)} VND
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>

              {/* Phần thông tin thanh toán */}
              <Box className={classes.paymentForm}>
                <Box className={classes.formGroup}>
                  <label htmlFor="paymentMethod" style={{ marginBottom: 5 }}>Phương thức thanh toán:</label>
                  <select
                    id="paymentMethod"
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className={classes.selectInput}
                  >
                    <option value="COD">COD (Thanh toán khi nhận hàng)</option>
                    <option value="Card">Card</option>
                    <option value="MOMO">MOMO</option>
                  </select>
                </Box>

                <Box className={classes.formGroup}>
                  <label htmlFor="address" style={{ marginBottom: 5 }}>Địa chỉ giao hàng:</label>
                  <input
                    type="text"
                    id="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Nhập địa chỉ của bạn"
                    className={classes.textInput}
                  />
                </Box>

                <Box className={classes.formGroup}>
                  <label htmlFor="sdt" style={{ marginBottom: 5 }}>Số điện thoại:</label>
                  <input
                    type="text"
                    id="sdt"
                    value={sdt}
                    onChange={(e) => setSdt(e.target.value)}
                    placeholder="Nhập số điện thoại của bạn"
                    className={classes.textInput}
                  />
                </Box>
              </Box>

              {/* Tổng tiền giỏ hàng */}
              <Box display="flex" justifyContent="space-between" className={classes.totalAmount}>
                <Typography variant="h6">
                  Tổng : {new Intl.NumberFormat("vi-VN").format(total)} VND
                </Typography>

                <Box display="flex" justifyContent="center" className={classes.modalFooter}>
                  <Button onClick={handleCheckout} className={classes.checkoutBtn}>
                    Xác nhận
                  </Button>
                </Box>
              </Box>
            </Box>
          </Box>
        </Modal>


      </CustomerLayout>
    </>
  );
};

export default Cart;