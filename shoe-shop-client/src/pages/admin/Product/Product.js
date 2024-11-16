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

const Product = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();
  const products = useSelector((state) => state.product.products);
  const [prods, setProds] = useState(products);
  useEffect(() => {
    const fetchProducts = () => {
      const action = getAllProduct();
      dispatch(action);
    };
    fetchProducts();
  }, []);

  const handleEditProduct = (product) => {
    history.push("/admin/product/new", { state: product });
  };
  const [filteredProducts, setFilteredProducts] = useState(prods);
  const handleDeleteProduct = (id) => {
    const action = deleteProduct(id);
    dispatch(action)
      .then(unwrapResult)
      .then(() => {
        const newProds = filteredProducts.filter((prod) => prod._id !== id);
        setFilteredProducts(newProds);

        toast("Delete user successfully!", {
          position: "bottom-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          type: "success",
        });
      });
  };

  // Search

  const searchRef = useRef("");
  const handleChangeSearch = (e) => {
    const value = e.target.value;
    console.log(value);
    if (searchRef.current) {
      clearTimeout(searchRef.current);
    }

    searchRef.current = setTimeout(() => {
      if (value === "") setFilteredProducts(prods);

      const filtered = prods.filter((size) => {
        return size.name.toLowerCase().includes(value.toLowerCase());
      });
      setFilteredProducts(filtered);
    }, 400);
  };

  // Pagination
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
              ref={searchRef}
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
                elevation="0"
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
                      .map((product) => {
                        return (
                          <TableRow key={product._id}>
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
                              {product.desc}
                            </TableCell>
                            <TableCell align="center">
                              {product?.category?.name}
                            </TableCell>
                            <TableCell align="center">
                              {product.price}
                            </TableCell>
                            <TableCell align="center">
                              {product.inStock.toString() === "true"
                                ? "Có"
                                : "Không"}
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
                              <BiX
                                style={{ cursor: "pointer", fontSize: 20 }}
                                onClick={() => {
                                  handleDeleteProduct(product._id);
                                }}
                              />
                            </TableCell>
                          </TableRow>
                        );
                      })}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                component="div"
                count={prods.length}
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
                alt=""
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
