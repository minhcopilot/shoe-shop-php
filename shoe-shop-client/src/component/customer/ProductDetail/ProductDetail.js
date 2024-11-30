import { css } from "@emotion/react";
import { Box, Button, Divider, Typography } from "@material-ui/core";
import Rating from "@material-ui/lab/Rating";
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { BiMinus, BiPlus } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { useParams } from "react-router-dom";
import RingLoader from "react-spinners/RingLoader";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getProduct } from "../../../redux/slices/productSlice";
import CustomerLayout from "../CustomerLayout/CustomerLayout";
import { useStyles } from "./styles";
import { addToCart } from "../../../redux/slices/cartSlice";

const override = css`
  display: block;
  margin: 0 auto;
`;

const ProductDetail = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { id } = useParams();
  const user = useSelector((state) => state.auth.user);
  const product = useSelector((state) => state.product.product);
  const productLoading = useSelector((state) => state.product.productLoading);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const fetchProduct = () => {
      const action = getProduct(id?.toString());
      dispatch(action);
    };
    fetchProduct();
  }, [dispatch, id]);

  const [quantity, setQuantity] = useState(1);
  const handleIncreaseQuantity = () => {
    if (product.stock === 0) return;

    if (quantity > product.quantity) return;
    else setQuantity(quantity + 1);
  };

  const handleDecreaseQuantity = () => {
    if (product.stock === 0) return;

    if (quantity <= 1) return;
    else setQuantity(quantity - 1);
  };

  const [indexSize, setIndexSize] = useState();
  const [size, setSize] = useState();
  const handleChangeSize = (index, size) => {
    if (product.stock === 0) return;
    setIndexSize(index);
    setSize(size);
  };

  const handleAddToCart = () => {
    // Sold out
    if (product.stock === 0) return;

    // Empty size
    if (indexSize === undefined) {
      toast("Vui lòng chọn size", {
        position: "bottom-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        type: "error",
      });
      return;
    }

    // Unauthenticated
    if (!user || Object.keys(user).length === 0) {
      toast("Vui lòng đăng nhập để tiếp tục", {
        position: "bottom-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        type: "error",
      });
      return;
    }

    const productData = { product, quantity, chooseSize: size };

    // Dispatch action để thêm vào cart trong Redux store
    dispatch(addToCart(productData));

    toast("Thêm vào giỏ hàng thành công!", {
      position: "bottom-center",
      type: "success",
    });
  };
  return (
    <>
      <Helmet>
        <title>Reno - Sản phẩm</title>
        <meta name="description" content="Helmet application" />
      </Helmet>
      <CustomerLayout>
        <Box className={classes.detail}>
          <>
            {!productLoading ? (
              <>
                <Box className={classes.imgContainer}>
                  <Carousel
                    showIndicators={false}
                    showArrows={false}
                    showStatus={false}
                  >
                    {product?.images?.map((image) => (
                      <Box style={{ position: "relative" }}>
                        <img src={image} alt="product" />
                        {product.stock === 0 && (
                          <Typography
                            component="p"
                            className={classes.watermark}
                          >
                            Sold out
                          </Typography>
                        )}
                      </Box>
                    ))}
                  </Carousel>
                </Box>
                <Box className={classes.content}>
                  <Typography component="h3" className={classes.heading}>
                    {product.name}
                  </Typography>
                  <Typography component="subtitle1" className={classes.price}>
                    {new Intl.NumberFormat("vi-VN").format(product.price)} VND
                  </Typography>
                  <Rating
                    readOnly
                    size="small"
                    name="size-medium"
                    defaultValue={2}
                  />
                  <Divider style={{ margin: "20px 0" }} />
                  <Typography component="p" className={classes.desc}>
                    {product.desc}
                  </Typography>
                  <Box className={classes.sizeContainer}>
                    <Typography component="p" style={{ marginRight: 20 }}>
                      Size
                    </Typography>
                    {product?.sizes?.map((size, index) => (
                      <Box
                        className={`${
                          product.stock ? classes.size : classes.sizeDisabled
                        }
												${indexSize === index && classes.activeSize}
												`}
                        onClick={() => handleChangeSize(index, size)}
                      >
                        {size.name}
                      </Box>
                    ))}
                  </Box>
                  <Box className={classes.actions}>
                    <Typography component="p" style={{ marginRight: 20 }}>
                      Số lượng
                    </Typography>
                    <Box className={classes.quantity}>
                      <BiMinus
                        style={{ cursor: "pointer" }}
                        onClick={handleDecreaseQuantity}
                      />
                      <Typography
                        component="p"
                        style={{
                          userSelect: "none",
                        }}
                      >
                        {quantity}
                      </Typography>
                      <BiPlus
                        style={{ cursor: "pointer" }}
                        onClick={handleIncreaseQuantity}
                      />
                    </Box>
                    <Button
                      disableRipple={product.stock !== 0 && true}
                      className={
                        product.stock !== 0 ? classes.add : classes.addDisabled
                      }
                      onClick={handleAddToCart}
                    >
                      Thêm vào giỏ hàng
                    </Button>
                  </Box>
                </Box>
              </>
            ) : (
              <Box className={classes.loadingContainer}>
                <RingLoader css={override} size={140} />
              </Box>
            )}
          </>
        </Box>
        <ToastContainer
          position="bottom-center"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
          type="default"
        />
      </CustomerLayout>
    </>
  );
};

export default ProductDetail;
