// import {
//   Box,
//   Button,
//   Hidden,
//   Paper,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Typography,
// } from "@material-ui/core";
// import { unwrapResult } from "@reduxjs/toolkit";
// import { nanoid } from "nanoid";
// import React, { useEffect } from "react";
// import { Helmet } from "react-helmet-async";
// import { BiMinus, BiPlus, BiRightArrowAlt, BiX } from "react-icons/bi";
// import { useDispatch, useSelector } from "react-redux";
// import { Link, useHistory } from "react-router-dom";
// import StripeCheckout from "react-stripe-checkout";
// import bgCart from "../../../assets/images/cart.svg";
// import { payment, updateUser } from "../../../redux/slices/authSlice";
// import { addOrder } from "../../../redux/slices/orderSlice";
// import CustomerLayout from "../CustomerLayout/CustomerLayout";
// import { useStyles } from "./styles";

// const KEY = process.env.REACT_APP_STRIPE_KEY;

// const Cart = () => {
//   const classes = useStyles();
//   const user = useSelector((state) => state.auth.user);
//   const dispatch = useDispatch();
//   const history = useHistory();

//   useEffect(() => {
//     window.scrollTo(0, 0);
//   }, []);

//   const handleIncreaseQuantity = (product) => {
//     const thisProductInCart = user.cart.find((productInCart) => {
//       return productInCart.product.id === product._id;
//     });
//     const newProduct = {
//       ...thisProductInCart,
//       quantity: thisProductInCart.quantity + 1,
//     };

//     const filteredProducts = user.cart.filter((productInCart) => {
//       return (
//         productInCart.product.id !== product._id ||
//         (productInCart.product.id === product._id &&
//           productInCart.chooseSize !== product.chooseSize)
//       );
//     });

//     const action = updateUser({
//       _id: user._id,
//       cart: [...filteredProducts, newProduct],
//     });
//     dispatch(action);
//   };

//   const handleDecreaseQuantity = (product) => {
//     if (product.quantity - 1 === 0) {
//       const filteredProducts = user.cart.filter((productInCart) => {
//         return (
//           productInCart.product.id !== product._id ||
//           (productInCart.product.id === product._id &&
//             productInCart.chooseSize !== product.chooseSize)
//         );
//       });

//       const action = updateUser({
//         _id: user._id,
//         cart: filteredProducts,
//       });
//       dispatch(action);
//     } else {
//       const thisProductInCart = user.cart.find((productInCart) => {
//         return productInCart.product.id === product._id;
//       });

//       const newProduct = {
//         ...thisProductInCart,
//         quantity: thisProductInCart.quantity - 1,
//       };

//       const filteredProducts = user.cart.filter((productInCart) => {
//         return (
//           productInCart.product.id !== product._id ||
//           (productInCart.product.id === product._id &&
//             productInCart.chooseSize !== product.chooseSize)
//         );
//       });

//       const cloneProducts = user.cart;
//       // cloneProducts.splice()

//       const action = updateUser({
//         _id: user._id,
//         cart: [...filteredProducts, newProduct],
//       });
//       dispatch(action);
//     }
//   };

//   const handleDeleteProduct = (product) => {
//     const filteredProducts = user.cart.filter((productInCart) => {
//       return (
//         productInCart.product._id !== product.product._id ||
//         (productInCart.chooseSize._id !== product.chooseSize._id &&
//           productInCart.product._id === product.product._id)
//       );
//     });

//     console.log(filteredProducts);

//     const action = updateUser({
//       _id: user._id,
//       cart: filteredProducts,
//     });
//     dispatch(action);
//   };

//   const total = user?.cart?.reduce((sum, price) => {
//     return sum + price.product.price * price.quantity;
//   }, 0);

//   const onToken = (token) => {
//     console.log(token);
//     const action = payment({
//       tokenId: token.id,
//       amount: total * 100,
//     });
//     dispatch(action)
//       .then(unwrapResult)
//       .then((res) => {
//         const action = addOrder({
//           userId: user._id,
//           orderItems: user.cart,
//           paymentMethod: "Card",
//           totalPrice: total,
//           address: token.card.name,
//         });
//         dispatch(action);
//         const action2 = updateUser({
//           _id: user._id,
//           cart: [],
//         });
//         dispatch(action2)
//           .then(unwrapResult)
//           .then((res) => {
//             history.push("/order");
//           });
//       })
//       .catch((error) => console.log(error));
//   };
//   const handleOder = () => {
//     const action = addOrder({
//       userId: user._id,
//       orderItems: user.cart,
//       paymentMethod: "Card",
//       totalPrice: total,
//       address: "hsadsdasdasd",
//     });
//     dispatch(action);
//     const action2 = updateUser({
//       _id: user._id,
//       cart: [],
//     });
//     dispatch(action2)
//       .then(unwrapResult)
//       .then((res) => {
//         history.push("/order");
//       });
//   };
//   return (
//     <>
//       <Helmet>
//         <title>Reno - Cart</title>
//         <meta name="description" content="Helmet application" />
//       </Helmet>
//       <CustomerLayout>
//         {user?.cart?.length > 0 ? (
//           <Box className={classes.list}>
//             <Typography component="h3" className={classes.headingCart}>
//               Giỏ hàng
//             </Typography>
//             <TableContainer
//               component={Paper}
//               elevation={0}
//               style={{ marginBottom: 25 }}
//             >
//               <Table className={classes.table} aria-label="simple table">
//                 <TableHead>
//                   <TableRow>
//                     <TableCell className={classes.tableHead}>
//                       Sản phẩm
//                     </TableCell>
//                     <TableCell align="center" className={classes.tableHead}>
//                       Kích thước
//                     </TableCell>
//                     <TableCell align="center" className={classes.tableHead}>
//                       Giá
//                     </TableCell>
//                     <TableCell align="center" className={classes.tableHead}>
//                       Số lượng
//                     </TableCell>
//                     <TableCell align="center" className={classes.tableHead}>
//                       Tổng
//                     </TableCell>
//                     <TableCell align="center" className={classes.tableHead}>
//                       Xóa
//                     </TableCell>
//                   </TableRow>
//                 </TableHead>
//                 <TableBody>
//                   {user.cart.map((product) => (
//                     <TableRow key={nanoid()} className={classes.tableROw}>
//                       <TableCell
//                         component="th"
//                         scope="row"
//                         className={classes.cellProduct}
//                         style={{ justifyContent: "flex-start" }}
//                       >
//                         <img
//                           src={product.product.images[0].preview}
//                           alt="product"
//                           className={classes.imgProduct}
//                         />
//                         <Typography component="span">
//                           {product.product.name}
//                         </Typography>
//                       </TableCell>
//                       <TableCell align="center">
//                         {product.chooseSize.name}
//                       </TableCell>
//                       <TableCell align="center">
//                         {new Intl.NumberFormat('vi-VN').format(product.product.price)} VND
//                       </TableCell>
//                       <TableCell align="center">
//                         <Box className={classes.quantity}>
//                           <BiMinus
//                             onClick={() => handleDecreaseQuantity(product)}
//                             style={{ cursor: "pointer" }}
//                           />
//                           <Typography component="span">
//                             {product.quantity}
//                           </Typography>
//                           <BiPlus
//                             onClick={() => handleIncreaseQuantity(product)}
//                             style={{
//                               cursor: "pointer",
//                             }}
//                           />
//                         </Box>
//                       </TableCell>
//                       <TableCell align="center">
//                         {new Intl.NumberFormat('vi-VN').format(product.quantity * product.product.price)} VND
//                       </TableCell>
//                       <TableCell align="center">
//                         <BiX
//                           onClick={() => handleDeleteProduct(product)}
//                           style={{ cursor: "pointer", fontSize: 20 }}
//                         />
//                       </TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             </TableContainer>
//             <Box className={classes.proceed}>
//               <Button component={Link} to="/" className={classes.continue}>
//                 Tiếp tục mua sắm
//               </Button>
//               <Box className={classes.checkout}>
//                 <Typography>Tổng: {new Intl.NumberFormat('vi-VN').format(total)} VND</Typography>

//                 {/* <StripeCheckout
//                   token={onToken}
//                   stripeKey={KEY}
//                   name="Reno shop"
//                   amount={total * 100} // cents
//                   currency="USD"
//                   email={user?.email}
//                   shippingAddress
//                   billingAddress
//                 ></StripeCheckout> */}
//                 <Button
//                   // component={Link}
//                   // to="/"
//                   onClick={handleOder}
//                   className={classes.checkoutBtn}
//                 >
//                   Thanh toán trả sau
//                 </Button>
//               </Box>
//             </Box>
//           </Box>
//         ) : (
//           <Box className={classes.notFound}>
//             <Hidden mdDown implementation="js">
//               <Box className={classes.imgContainer}>
//                 <img src={bgCart} alt="not-found" className={classes.img} />
//               </Box>
//             </Hidden>
//             <Box className={classes.content}>
//               <Typography className={classes.heading} component="h2">
//                 Không có sản phẩm nào trong giỏ hàng
//               </Typography>
//               <Button component={Link} to="/" className={classes.action}>
//                 Đi mua sắm
//                 <BiRightArrowAlt className={classes.redirectIcon} />
//               </Button>
//             </Box>
//           </Box>
//         )}
//       </CustomerLayout>
//     </>
//   );
// };

// export default Cart;
// src/components/Cart/Cart.js

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
import StripeCheckout from "react-stripe-checkout";
import bgCart from "../../../assets/images/cart.svg";
import { payment, updateUser } from "../../../redux/slices/authSlice";
import { addOrder } from "../../../redux/slices/orderSlice";
import CustomerLayout from "../CustomerLayout/CustomerLayout";
import { useStyles } from "./styles";

const KEY = process.env.REACT_APP_STRIPE_KEY;

const Cart = () => {
  const classes = useStyles();
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  console.log(user.cart);


  const handleIncreaseQuantity = (product) => {
    const thisProductInCart = user.cart.find((productInCart) => {
      return productInCart.product.id === product.product.id;
    });

    const newProduct = {
      ...thisProductInCart,
      quantity: thisProductInCart.quantity + 1,
    };

    const filteredProducts = user.cart.filter((productInCart) => {
      return productInCart.product.id !== product.product.id || productInCart.size.id !== product.size.id;
    });

    const action = updateUser({
      _id: user._id,
      cart: [...filteredProducts, newProduct],
    });
    dispatch(action);
  };

  const handleDecreaseQuantity = (product) => {
    if (product.quantity - 1 === 0) {
      const filteredProducts = user.cart.filter((productInCart) => {
        return productInCart.product.id !== product.product.id || productInCart.size.id !== product.size.id;
      });

      const action = updateUser({
        _id: user._id,
        cart: filteredProducts,
      });
      dispatch(action);
    } else {
      const thisProductInCart = user.cart.find((productInCart) => {
        return productInCart.product.id === product.product.id;
      });

      const newProduct = {
        ...thisProductInCart,
        quantity: thisProductInCart.quantity - 1,
      };

      const filteredProducts = user.cart.filter((productInCart) => {
        return productInCart.product.id !== product.product.id || productInCart.size.id !== product.size.id;
      });

      const action = updateUser({
        _id: user._id,
        cart: [...filteredProducts, newProduct],
      });
      dispatch(action);
    }
  };

  const handleDeleteProduct = (product) => {
    const filteredProducts = user.cart.filter((productInCart) => {
      return productInCart.product.id !== product.product.id || productInCart.size.id !== product.size.id;
    });

    const action = updateUser({
      _id: user._id,
      cart: filteredProducts,
    });
    dispatch(action);
  };

  // Calculate total with correct reference to product price
  const total = user?.cart?.reduce((sum, item) => {
    const price = parseFloat(item.product?.price); // Make sure to check if product exists and has price
    if (!isNaN(price)) {
      return sum + price * item.quantity;
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
      .then((res) => {
        const action = addOrder({
          userId: user._id,
          orderItems: user.cart,
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
            history.push("/order"); // Redirect to the order page after payment
          });
      })
      .catch((error) => console.log(error));
  };

  const handleOrder = () => {
    const action = addOrder({
      userId: user._id,
      orderItems: user.cart,
      paymentMethod: "Card",
      totalPrice: total,
      address: "hsadsdasdasd", // Dummy address
    });
    dispatch(action);
    const action2 = updateUser({
      _id: user._id,
      cart: [], // Clear the cart after order
    });
    dispatch(action2)
      .then(unwrapResult)
      .then(() => {
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
        {user?.cart?.length > 0 ? (
          <Box className={classes.list}>
            <Typography component="h3" className={classes.headingCart}>
              Giỏ hàng
            </Typography>
            <TableContainer
              component={Paper}
              elevation={3}
              style={{ marginBottom: 25, borderRadius: '8px' }}
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
                  {user.cart.map((product) => (
                    <TableRow key={product.product_id} className={classes.tableRow}>
                      <TableCell component="th" scope="row" className={classes.cellProduct}>
                        <Box display="flex" alignItems="center">
                          <img
                            src={product.product_img || 'default-image-url'}
                            alt={product.product_name || 'Tên sản phẩm không có sẵn'}
                            className={classes.imgProduct}
                          />
                          <Typography component="span" className={classes.productName}>
                            {product.product_name || 'Tên sản phẩm không có sẵn'}
                          </Typography>
                        </Box>
                      </TableCell>
  
                      <TableCell align="center">{product.size_name || 'Kích thước không có sẵn'}</TableCell>
  
                      <TableCell align="center">
                        {new Intl.NumberFormat('vi-VN').format(product.product_price)} VND
                      </TableCell>
  
                      <TableCell align="center">
                        <Box className={classes.quantity}>
                          <BiMinus
                            onClick={() => handleDecreaseQuantity(product)}
                            style={{ cursor: 'pointer' }}
                          />
                          <Typography component="span">{product.quantity}</Typography>
                          <BiPlus
                            onClick={() => handleIncreaseQuantity(product)}
                            style={{ cursor: 'pointer' }}
                          />
                        </Box>
                      </TableCell>
  
                      <TableCell align="center">
                        {new Intl.NumberFormat('vi-VN').format(product.quantity * product.product_price)} VND
                      </TableCell>
  
                      <TableCell align="center">
                        <BiX
                          onClick={() => handleDeleteProduct(product)}
                          style={{ cursor: 'pointer', fontSize: 20 }}
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
                <Typography variant="h6">
                  Tổng: {new Intl.NumberFormat('vi-VN').format(total)} VND
                </Typography>
                <Button onClick={handleOrder} className={classes.checkoutBtn}>
                  Thanh toán trả sau
                </Button>
              </Box>
            </Box>
          </Box>
        ) : (
          <Box className={classes.notFound}>
            <Hidden mdDown implementation="js">
              <Box className={classes.imgContainer}>
                <img src={bgCart} alt="empty cart" className={classes.emptyCartImg} />
              </Box>
            </Hidden>
            <Typography component="h3" className={classes.emptyCartText}>
              Giỏ hàng của bạn đang trống
            </Typography>
            <Button component={Link} to="/" className={classes.continue}>
              Tiếp tục mua sắm
            </Button>
          </Box>
        )}
      </CustomerLayout>
    </>
  );
};  

export default Cart;
