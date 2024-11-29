import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  MenuItem,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { unwrapResult } from "@reduxjs/toolkit";
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Controller, useForm } from "react-hook-form";
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
  upload,
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
  const { register, handleSubmit, reset, control } = useForm();
  const [error, setError] = useState("");

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
      reset({
        name: state.name,
        desc: state.desc,
        price: state.price,
        images: state.images,
        category_id: state.category.id, // sửa 'category' thành 'category_id'
        stock: state.stock,
        inStock: state.inStock ? state.inStock.toString() : "true",
      });
      setImagesDisplay(state.images || []);
      setValue(state.size || []);
    }
  }, [location.state, reset]);

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
      setError(!imagesUpload.length ? "Images are required" : "Sizes are required");
      return;
    }
  
    // Chuyển đổi dữ liệu về đúng kiểu trước khi gửi
    const productData = {
      ...data,
      price: Number(data.price), // Đảm bảo giá trị là số
      stock: Number(data.stock), // Đảm bảo số lượng là số
      category_id: data.category_id, // Đảm bảo category_id đúng
      size: value.map((size) => size.id), // Chỉ gửi id của size
      images: imagesUpload.map((image) => image.url || image), // Chỉ gửi URL của ảnh đã upload
    };
  
    console.log(productData); // Kiểm tra dữ liệu
  
    dispatch(addProduct(productData))
      .then(unwrapResult)
      .then(() => {
        reset();
        setImagesUpload([]);
        setImagesDisplay([]);
        setError("");
        setValue([]);
        toast.success("Add product successfully!");
      })
      .catch((error) => {
        console.error(error); // Kiểm tra lỗi trả về từ server
        setError("Failed to add product");
      });
  };

  const handleEditProduct = (data) => {
    const product = {
      ...data,
      size: value.map((size) => size.id), // lấy id từ value của kích thước
      id: location.state.state.id,
    };

    const uploadImages = imagesUpload.length
      ? dispatch(upload(imagesUpload)).then(unwrapResult)
      : Promise.resolve(location.state.state.images);

    uploadImages
      .then((images) => {
        product.images = images; // 'images' là mảng URL đã upload
        dispatch(updateProduct(product))
          .then(unwrapResult)
          .then(() => toast.success("Update product successfully!"))
          .catch(() => setError("Failed to update product"));
      })
      .catch(() => setError("Failed to upload images. Please try again."));
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
                  <Button variant="raised" component="span" className={classes.uploadBtn}>
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
                {...register("category_id")} // sửa 'category' thành 'category_id'
                defaultValue={location?.state?.state?.category?.id || ""}
                required
              >
                {categories?.map((category) => (
                  <MenuItem value={category.id} key={category.id}>
                    {category.name} {/* Hiển thị tên danh mục */}
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
                  <TextField {...params} label="Kích thước" variant="outlined"  {...register("size")} fullWidth />
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
              <Button type="submit" className={classes.saveBtn}>
                Lưu
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
                  <img src={image.preview} alt={`image-${index}`} />
                </div>
              ))}
            </Carousel>
          </Box>
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
