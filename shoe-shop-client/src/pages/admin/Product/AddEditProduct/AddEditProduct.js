import {
  Box,
  Button,
  Checkbox,
  MenuItem,
  Typography,
  TextField,
  CircularProgress,
} from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { unwrapResult } from "@reduxjs/toolkit";
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { BiCheckbox, BiCheckboxChecked } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { useLocation } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { toast, ToastContainer } from "react-toastify";
import AdminLayout from "../../../../component/admin/AdminLayout/AdminLayout";
import { getAllCategory } from "../../../../redux/slices/categorySlice";
import {
  addProduct,
  updateProduct,
  getProduct,
  getAllProducts,
} from "../../../../redux/slices/productSlice";
import { getAllSize } from "../../../../redux/slices/sizeSlice";
import { useStyles } from "./styles";

const icon = <BiCheckbox />;
const checkedIcon = <BiCheckboxChecked />;

const AddEditProduct = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const location = useLocation();
  const categories = useSelector((state) => state.category.categories);
  const sizes = useSelector((state) => state.size.sizes);
  const { register, handleSubmit, reset } = useForm();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const productLoading = useSelector((state) => state.product.productLoading);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = () => {
      dispatch(getAllCategory());
      dispatch(getAllSize());
    };
    fetchData();
  }, [dispatch]);

  const [value, setValue] = useState([]);
  const [imagesDisplay, setImagesDisplay] = useState([]);
  const [imagesUpload, setImagesUpload] = useState([]);

  useEffect(() => {
    if (location.state) {
      const { state } = location.state;
      setLoading(true);
      dispatch(getProduct(state.id))
        .then(unwrapResult)
        .then((detailProduct) => {
          reset({
            name: detailProduct.name,
            description: detailProduct.description,
            price: detailProduct.price,
            images: detailProduct.images,
            category_id: detailProduct.category.id,
            stock: detailProduct.stock,
            inStock: detailProduct.inStock
              ? detailProduct.inStock.toString()
              : "true",
          });
          setImagesDisplay(detailProduct.images || []);
          setValue(detailProduct.sizes || []);
        })
        .catch((error) => {
          console.error("Failed to fetch product detail:", error);
          toast.error("Failed to load product details");
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [location.state, dispatch, reset]);

  const handleOnChangePictures = (e) => {
    const files = Array.from(e.target.files);
    const previewImages = files.map((file) => ({
      preview: URL.createObjectURL(file),
    }));
    setImagesDisplay(previewImages);
    setImagesUpload(files);
  };

  useEffect(() => {
    return () => {
      imagesDisplay.forEach((image) => URL.revokeObjectURL(image.preview));
    };
  }, [imagesDisplay]);

  const handleAddProduct = (data) => {
    if (!imagesUpload.length || !value.length) {
      setError(
        !imagesUpload.length ? "Images are required" : "Sizes are required"
      );
      return;
    }

    setIsSubmitting(true);

    const productData = {
      ...data,
      price: Number(data.price),
      stock: Number(data.stock),
      category_id: data.category_id,
      size: value.map((size) => size.id),
      images: imagesUpload.map((image) => image.url || image),
    };

    dispatch(addProduct(productData))
      .then(unwrapResult)
      .then(() => {
        reset();
        setImagesUpload([]);
        setImagesDisplay([]);
        setError("");
        setValue([]);
        toast.success("Add product successfully!");
        dispatch(getAllProducts());
      })
      .catch((error) => {
        console.error(error);
        setError("Failed to add product");
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  const handleEditProduct = (data) => {
    setIsSubmitting(true);

    if (imagesUpload.length > 0 && imagesUpload[0] instanceof File) {
      const formData = new FormData();

      formData.append("_method", "PUT");
      formData.append("name", data.name);
      formData.append("description", data.description);
      formData.append("price", data.price);
      formData.append("stock", data.stock);
      formData.append("category_id", data.category_id);
      formData.append("inStock", data.inStock || "true");

      value.forEach((size) => {
        formData.append("sizes[]", size.id);
      });

      imagesUpload.forEach((file) => {
        formData.append("images[]", file);
      });

      for (let pair of formData.entries()) {
        console.log(pair[0] + ": " + pair[1]);
      }

      dispatch(
        updateProduct({
          id: location.state.state.id,
          formData: formData,
        })
      )
        .then(unwrapResult)
        .then(() => {
          toast.success("Update product successfully!");
          dispatch(getAllProducts());
        })
        .catch((error) => {
          console.error(error);
          setError("Failed to update product");
        })
        .finally(() => {
          setIsSubmitting(false);
        });
    } else {
      const product = {
        ...data,
        size: value.map((size) => size.id),
        id: location.state.state.id,
        images: imagesDisplay,
      };
      dispatch(updateProduct(product))
        .then(unwrapResult)
        .then(() => {
          toast.success("Update product successfully!");
          dispatch(getAllProducts());
        })
        .catch((error) => {
          console.error(error);
          setError("Failed to update product");
        })
        .finally(() => {
          setIsSubmitting(false);
        });
    }
  };

  return (
    <>
      <Helmet>
        <title>Reno - Admin</title>
        <meta name="description" content="Helmet application" />
      </Helmet>
      <AdminLayout>
        <Box className={classes.container}>
          <Typography component="h3" className={classes.heading}>
            {location.state ? "Update" : "New"} sản phẩm
          </Typography>
          {loading || productLoading ? (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              minHeight="200px"
            >
              <CircularProgress />
            </Box>
          ) : (
            <Box className={classes.content}>
              <form
                className={classes.form}
                onSubmit={handleSubmit(
                  location.state ? handleEditProduct : handleAddProduct
                )}
              >
                <Box className={classes.uploadContainer}>
                  <input
                    accept="image/*"
                    className={classes.input}
                    style={{ display: "none" }}
                    id="raised-button-file"
                    multiple
                    type="file"
                    onChange={handleOnChangePictures}
                  />
                  <label htmlFor="raised-button-file">
                    Hình ảnh
                    <Button
                      variant="raised"
                      component="span"
                      className={classes.uploadBtn}
                    >
                      Tải lên
                    </Button>
                  </label>
                </Box>
                <TextField
                  label="Tên"
                  variant="outlined"
                  className={classes.inputGroup}
                  {...register("name")}
                  required
                />
                <TextField
                  label="Mô tả"
                  variant="outlined"
                  className={classes.inputGroup}
                  {...register("description")}
                  required
                />
                <TextField
                  label="Giá"
                  type="number"
                  variant="outlined"
                  className={classes.inputGroup}
                  {...register("price")}
                  required
                />
                <TextField
                  label="Stock"
                  type="number"
                  variant="outlined"
                  className={classes.inputGroup}
                  {...register("stock")}
                  required
                />
                <TextField
                  className={classes.inputGroup}
                  label="Danh mục"
                  select
                  variant="outlined"
                  {...register("category_id")}
                  defaultValue={location?.state?.state?.category?.id || ""}
                  required
                >
                  {categories?.map((category) => (
                    <MenuItem value={category.id} key={category.id}>
                      {category.name}
                    </MenuItem>
                  ))}
                </TextField>
                <Autocomplete
                  className={classes.inputGroup}
                  multiple
                  disableCloseOnSelect
                  value={value}
                  options={sizes}
                  getOptionLabel={(option) => option.name}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Kích thước"
                      variant="outlined"
                      {...register("size")}
                      fullWidth
                    />
                  )}
                  renderOption={(option, { selected }) => (
                    <>
                      <Checkbox
                        icon={icon}
                        checkedIcon={checkedIcon}
                        checked={selected}
                        style={{ marginRight: 8 }}
                      />
                      {option.name}
                    </>
                  )}
                  onChange={(_, selectedOptions) => setValue(selectedOptions)}
                />
                {error && (
                  <Typography component="p" className={classes.error}>
                    {error}
                  </Typography>
                )}
                <Button
                  type="submit"
                  className={classes.saveBtn}
                  disabled={isSubmitting}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "10px",
                  }}
                >
                  {isSubmitting ? (
                    <>
                      <CircularProgress size={24} style={{ color: "white" }} />
                      Đang lưu...
                    </>
                  ) : (
                    "Lưu"
                  )}
                </Button>
              </form>

              <Carousel
                showIndicators={false}
                showArrows={false}
                showStatus={false}
                className={classes.carousel}
              >
                {imagesDisplay.map((image, index) => (
                  <div key={index}>
                    <img src={image.preview || image} alt={`image-${index}`} />
                  </div>
                ))}
              </Carousel>
            </Box>
          )}
        </Box>
        <ToastContainer
          position="bottom-center"
          autoClose={3000}
          hideProgressBar={false}
          closeOnClick
          pauseOnHover
        />
      </AdminLayout>
    </>
  );
};

export default AddEditProduct;
