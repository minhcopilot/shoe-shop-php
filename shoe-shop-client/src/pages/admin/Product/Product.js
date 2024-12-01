import {
  Box,
  Button,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@material-ui/core";
import TablePagination from "@material-ui/core/TablePagination";
import { unwrapResult } from "@reduxjs/toolkit";
import React, { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { BiPencil, BiSearchAlt2, BiX } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AdminLayout from "../../../component/admin/AdminLayout/AdminLayout";
import {
  deleteProduct,
  getAllProduct,
} from "../../../redux/slices/productSlice";
import { useStyles } from "./styles";
import dayjs from "dayjs";
import { ClipLoader } from "react-spinners";

const Product = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();

  // Get products from the Redux store
  const products = useSelector((state) => state.product.products);
  const [prods, setProds] = useState(products);
  const [filteredProducts, setFilteredProducts] = useState(prods || []);

  // Fetch products when component mounts
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const action = await dispatch(getAllProduct());
        const result = unwrapResult(action);

        const sortedProducts = [...result.data].sort((a, b) => {
          const dateA = new Date(a.updated_at || a.created_at).getTime();
          const dateB = new Date(b.updated_at || b.created_at).getTime();
          return dateB - dateA;
        });

        setProds(sortedProducts);
        setFilteredProducts(sortedProducts);
      } catch (error) {
        console.log("Failed to fetch products:", error);
      }
    };
    fetchProducts();
  }, [dispatch]);

  // Handle editing a product
  const handleEditProduct = (product) => {
    history.push("/admin/product/new", { state: product });
  };

  // Thêm state để quản lý loading cho từng sản phẩm
  const [deletingProducts, setDeletingProducts] = useState({});

  // Handle deleting a product
  const handleDeleteProduct = (id) => {
    // Set loading state cho sản phẩm đang xóa
    setDeletingProducts((prev) => ({ ...prev, [id]: true }));

    const action = deleteProduct(id);
    dispatch(action)
      .then(unwrapResult)
      .then(() => {
        const newProds = filteredProducts.filter((prod) => prod.id !== id);
        setFilteredProducts(newProds);
        toast("Delete product successfully!", {
          position: "bottom-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          type: "success",
        });
      })
      .finally(() => {
        // Xóa trạng thái loading khi hoàn thành
        setDeletingProducts((prev) => ({ ...prev, [id]: false }));
      });
  };

  // Search functionality
  const searchRef = useRef("");
  const handleChangeSearch = (e) => {
    const value = e.target.value;

    if (searchRef.current) {
      clearTimeout(searchRef.current);
    }

    searchRef.current = setTimeout(() => {
      if (value === "") setFilteredProducts(prods);

      const filtered = prods.filter((product) =>
        product.name.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredProducts(filtered);
    }, 400);
  };

  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <>
      <Helmet>
        <title>Reno - Admin</title>
        <meta name="description" content="Helmet application" />
      </Helmet>
      <AdminLayout>
        <Box className={classes.home}>
          <Box className={classes.searchBar}>
            <TextField
              placeholder="Tìm kiếm"
              variant="outlined"
              className={classes.searchField}
              onChange={handleChangeSearch}
            />
            <IconButton className={classes.searchBtn}>
              <BiSearchAlt2 />
            </IconButton>
            <Button
              component={Link}
              to="/admin/product/new"
              className={classes.add}
            >
              Thêm sản phẩm
            </Button>
          </Box>
          {filteredProducts.length > 0 ? (
            <>
              <TableContainer
                component={Paper}
                elevation={0}
                style={{ marginBottom: 25 }}
              >
                <Table
                  className={classes.table}
                  stickyHeader
                  aria-label="sticky table"
                >
                  <TableHead>
                    <TableRow>
                      <TableCell align="center" className={classes.tableHead}>
                        Tên
                      </TableCell>
                      <TableCell align="center" className={classes.tableHead}>
                        Mô tả
                      </TableCell>
                      <TableCell align="center" className={classes.tableHead}>
                        Danh mục
                      </TableCell>
                      <TableCell align="center" className={classes.tableHead}>
                        Giá
                      </TableCell>
                      <TableCell align="center" className={classes.tableHead}>
                        Còn hàng
                      </TableCell>
                      <TableCell align="center" className={classes.tableHead}>
                        Thời gian
                      </TableCell>
                      <TableCell align="center" className={classes.tableHead}>
                        Hành động
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredProducts
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((product) => (
                        <TableRow key={product.id}>
                          <TableCell
                            component="th"
                            scope="row"
                            className={classes.productDesc}
                            align="center"
                          >
                            {product.name}
                          </TableCell>
                          <TableCell
                            align="center"
                            className={classes.productDesc}
                          >
                            {product.description}
                          </TableCell>
                          <TableCell align="center">
                            {product?.category?.name || "Chưa có danh mục"}
                          </TableCell>
                          <TableCell align="center">{product.price}</TableCell>
                          <TableCell align="center">{product.stock}</TableCell>
                          <TableCell align="center">
                            {dayjs(
                              product.updated_at || product.created_at
                            ).format("DD/MM/YYYY HH:mm")}
                          </TableCell>
                          <TableCell align="center">
                            <BiPencil
                              style={{
                                cursor: "pointer",
                                fontSize: 20,
                                marginRight: 20,
                              }}
                              onClick={() => {
                                handleEditProduct(product);
                              }}
                            />
                            {deletingProducts[product.id] ? (
                              <ClipLoader size={15} color="#000" />
                            ) : (
                              <BiX
                                style={{ cursor: "pointer", fontSize: 20 }}
                                onClick={() => {
                                  handleDeleteProduct(product.id);
                                }}
                              />
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                component="div"
                count={filteredProducts.length}
                rowsPerPageOptions={[10]}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </>
          ) : (
            <Box className={classes.emptyContainer}>
              <img
                src="https://cdn-icons-png.flaticon.com/512/4076/4076432.png"
                alt="No Products"
                className={classes.emptyImg}
              />
              <Typography component="p" className={classes.emptyTitle}>
                Trống
              </Typography>
            </Box>
          )}
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
      </AdminLayout>
    </>
  );
};

export default Product;
