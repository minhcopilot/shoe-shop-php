import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Grid,
  Typography,
} from "@material-ui/core";
import Rating from "@material-ui/lab/Rating";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { getAllProduct } from "../../../redux/slices/productSlice";
import { useStyles } from "./styles";

const LatestProducts = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();
  const products = useSelector((state) => {
    return state.product.products;
  });
  useEffect(() => {
    const fetchProducts = () => {
      const params = "";
      const action = getAllProduct(params);
      dispatch(action);
    };

    fetchProducts();
  }, [dispatch]);

  const handleNavigate = (id) => {
    history.push(`/product/${id}`);
  };

  return (
    <Grid
      container
      direction="column"
      alignItems="center"
      className={classes.lastestProducts}
    >
      <Typography component="h3" className={classes.heading}>
        Sản phẩm mới
      </Typography>
      <Grid item container className={classes.list}>
        {products?.map((product, index) => (
          <Grid
            key={index}
            item
            xl={3}
            lg={4}
            md={6}
            sm={12}
            className={classes.gridItem}
          >
            <Card
              className={classes.root}
              onClick={() => {
                handleNavigate(product.id);
              }}
            >
              <CardActionArea className={classes.cardArea}>
                <CardMedia
                  className={classes.media}
                  image={product.images[0]}
                  title={product.name}
                />
                <CardContent className={classes.content}>
                  <Box className={classes.topTitle}>
                    <Typography
                      gutterBottom
                      variant="h5"
                      component="h2"
                      className={classes.name}
                    >
                      {product.name}
                    </Typography>
                  </Box>
                  <Box className={classes.bottomTitle}>
                    <Typography variant="body2" component="p">
                      {new Intl.NumberFormat("vi-VN").format(product.price)} VND
                    </Typography>
                    <Rating
                      readOnly
                      size="small"
                      name="size-medium"
                      defaultValue={2}
                    />
                  </Box>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Grid>
  );
};

export default LatestProducts;
