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
  CircularProgress,
} from "@material-ui/core";
import TablePagination from "@material-ui/core/TablePagination";
import { unwrapResult } from "@reduxjs/toolkit";
import React, { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { BiPencil, BiSearchAlt2, BiX } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AdminLayout from "../../../component/admin/AdminLayout/AdminLayout";
import { deleteSize, getAllSize } from "../../../redux/slices/sizeSlice";
import AddEditSize from "./AddEditSize/AddEditSize";
import { useStyles } from "./styles";
import dayjs from "dayjs";

const Size = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const sizes = useSelector((state) => state.size.sizes);

  // Modal
  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const [open2, setOpen2] = useState(false);
  const [updateSize, setUpdateSize] = useState();
  const handleOpen2 = (size) => {
    setUpdateSize(size);
    setOpen2(true);
  };
  const handleClose2 = () => {
    setOpen2(false);
  };

  useEffect(() => {
    const fetchSizes = () => {
      const action = getAllSize();
      dispatch(action)
        .then(unwrapResult)
        .then((res) => {
          console.log("Sizes fetched:", res);
          setFilteredSizes(res.data);
        })
        .catch((error) => {
          console.error("Failed to fetch sizes:", error);
        });
    };
    fetchSizes();
  }, [dispatch]);

  const [deletingId, setDeletingId] = useState(null);

  const handleDeleteSize = (id) => {
    setDeletingId(id);
    const action = deleteSize(id);
    dispatch(action)
      .unwrap()
      .then(() => {
        onHandleData({ type: "Delete", data: { id: id } });
        toast.success("Xóa kích thước thành công!", {
          position: "bottom-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      })
      .catch((error) => {
        toast.error("Có lỗi xảy ra khi xóa kích thước!", {
          position: "bottom-center",
          autoClose: 3000,
        });
      })
      .finally(() => {
        setDeletingId(null);
      });
  };

  // Search
  const [filteredSizes, setFilteredSizes] = useState(sizes || []);
  const searchRef = useRef("");
  const handleChangeSearch = (e) => {
    const value = e.target.value;
    console.log(value);
    if (searchRef.current) {
      clearTimeout(searchRef.current);
    }

    searchRef.current = setTimeout(() => {
      if (value === "") setFilteredSizes(sizes);

      const filtered = sizes.filter((size) => {
        return size.name.toLowerCase().includes(value.toLowerCase());
      });
      setFilteredSizes(filtered);
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

  const onHandleData = (data) => {
    switch (data.type) {
      case "Edit":
        setFilteredSizes((prev) =>
          prev.map((item) =>
            item.id === data.data.id ? { ...item, ...data.data } : item
          )
        );
        break;
      case "Delete":
        setFilteredSizes((prev) =>
          prev.filter((item) => item.id !== data.data.id)
        );
        break;
      case "Add":
        setFilteredSizes((prev) => [...prev, data.data]);
        break;
      default:
        setFilteredSizes(sizes);
    }
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
            <Button className={classes.add} onClick={handleOpen}>
              Thêm kích thước
            </Button>
            <AddEditSize
              open={open}
              handleClose={handleClose}
              handleData={onHandleData}
            />
          </Box>
          {filteredSizes.length > 0 ? (
            <>
              <TableContainer
                component={Paper}
                elevation="0"
                style={{ marginBottom: 25 }}
              >
                <Table className={classes.table} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell align="center" className={classes.tableHead}>
                        Tên
                      </TableCell>

                      <TableCell align="center" className={classes.tableHead}>
                        Ngày tạo
                      </TableCell>
                      <TableCell align="center" className={classes.tableHead}>
                        Ngày cập nhật
                      </TableCell>
                      <TableCell align="center" className={classes.tableHead}>
                        Hành động
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredSizes.length > 0 &&
                      filteredSizes.map((size) => {
                        return (
                          <TableRow key={size.id}>
                            <TableCell
                              component="th"
                              scope="row"
                              className={classes.cellProduct}
                              align="center"
                            >
                              <Typography component="body2">
                                {size.name}
                              </Typography>
                            </TableCell>
                            <TableCell align="center">
                              {dayjs(size.created_at).format(
                                "DD/MM/YYYY HH:mm:ss"
                              )}
                            </TableCell>
                            <TableCell align="center">
                              {dayjs(size.updated_at).format(
                                "DD/MM/YYYY HH:mm:ss"
                              )}
                            </TableCell>
                            <TableCell align="center">
                              <BiPencil
                                style={{
                                  cursor: "pointer",
                                  fontSize: 20,
                                  marginRight: 20,
                                }}
                                onClick={() => handleOpen2(size)}
                              />
                              {deletingId === size.id ? (
                                <CircularProgress size={20} />
                              ) : (
                                <BiX
                                  style={{ cursor: "pointer", fontSize: 20 }}
                                  onClick={() => {
                                    handleDeleteSize(size.id);
                                  }}
                                />
                              )}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    <AddEditSize
                      open={open2}
                      handleClose={handleClose2}
                      size={updateSize}
                      handleData={onHandleData}
                    />
                  </TableBody>
                </Table>
              </TableContainer>

              <TablePagination
                component="div"
                count={sizes.length}
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
      </AdminLayout>
      <ToastContainer />
    </>
  );
};

export default Size;
