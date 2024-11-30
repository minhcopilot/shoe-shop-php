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
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import AdminLayout from "../../../component/admin/AdminLayout/AdminLayout";
import { deleteUser, getAllUser } from "../../../redux/slices/userSlice";
import AddEditUser from "./AddEditUser/AddEditUser";
import { useStyles } from "./styles";

const User = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const users = useSelector((state) => state.user.users);

  useEffect(() => {
    const fetchUsers = () => {
      const action = getAllUser();
      dispatch(action);
    };
    fetchUsers();
  }, [dispatch]);

  // Modal
  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const [updateUser, setUpdateUser] = useState();
  const [open2, setOpen2] = useState(false);
  const handleOpen2 = (user) => {
    setUpdateUser(user);
    setOpen2(true);
  };
  const handleClose2 = () => {
    setOpen2(false);
  };

  // Search
  const [filteredUsers, setFilteredUsers] = useState(users);
  const searchRef = useRef("");
  const handleChangeSearch = (e) => {
    const value = e.target.value;

    if (searchRef.current) {
        clearTimeout(searchRef.current);
    }

    searchRef.current = setTimeout(() => {
        const searchParam = value.trim();

        // Gọi API với query string đúng định dạng
        const params = searchParam ? `?search=${encodeURIComponent(searchParam)}` : '';
        dispatch(getAllUser(params)); // Gọi API với chuỗi tìm kiếm
    }, 400); // Đặt timeout delay tìm kiếm
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
        setFilteredUsers((prev) =>
          prev.map((item) =>
            item.id === data.data.id ? { ...item, ...data.data } : item
          )
        );
        break;
      case "Delete":
        setFilteredUsers((prev) =>
          prev.filter((item) => item.id !== data.data.id)
        );
        break;
      case "Add":
        setFilteredUsers((prev) => [...prev, data.data]);
        break;
      default:
        setFilteredUsers(users);
    }
  };

  const handleDeleteUser = (id) => {
    const action = deleteUser(id);
    dispatch(action)
      .then(unwrapResult)
      .then(() => {
        const action2 = getAllUser();
        dispatch(action2);

        toast("Xóa người dùng thành công!", {
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
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    setFilteredUsers(users);
  }, [users]);

  return (
    <>
      <Helmet>
        <title>Reno - Admin</title>
        <meta name="description" content="Helmet application" />
      </Helmet>
      <AdminLayout>
        <form className={classes.home}>
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
              Thêm người dùng
            </Button>
            <AddEditUser
              open={open}
              handleClose={handleClose}
              handleData={onHandleData}
            />
          </Box>
          {filteredUsers?.length > 0 ? (
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
                        Họ tên
                      </TableCell>
                      <TableCell align="center" className={classes.tableHead}>
                        Email
                      </TableCell>
                      <TableCell align="center" className={classes.tableHead}>
                        Ngày tạo
                      </TableCell>
                      <TableCell align="center" className={classes.tableHead}>
                        Ngày cập nhật
                      </TableCell>
                      <TableCell align="center" className={classes.tableHead}>
                        Vai trò
                      </TableCell>
                      <TableCell align="center" className={classes.tableHead}>
                        Hành động
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredUsers.map((user) => {
                      return (
                        <TableRow>
                          <TableCell
                            component="th"
                            scope="row"
                            className={classes.cellProduct}
                            align="center"
                          >
                            {user.name}
                          </TableCell>
                          <TableCell align="center">{user.email}</TableCell>
                          <TableCell align="center">
                            {new Date(user.created_at).toLocaleString()}
                          </TableCell>
                          <TableCell align="center">
                            {new Date(user.updated_at).toLocaleString()}
                          </TableCell>
                          <TableCell align="center">{user.is_admin ? "Admin" : "User"}</TableCell>
                          <TableCell align="center">
                            <BiPencil
                              style={{
                                cursor: "pointer",
                                fontSize: 20,
                                marginRight: 20,
                              }}
                              onClick={() => {
                                handleOpen2(user);
                              }}
                            />
                            <BiX
                              style={{ cursor: "pointer", fontSize: 20 }}
                              onClick={() => {
                                handleDeleteUser(user.id);
                              }}
                            />
                          </TableCell>
                        </TableRow>
                      );
                    })}
                    <AddEditUser
                      open={open2}
                      handleClose={handleClose2}
                      user={updateUser}
                      handleData={onHandleData}
                    />
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                component="div"
                count={users.length}
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
        </form>
        {/* <ToastContainer
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
        /> */}
      </AdminLayout>
    </>
  );
};

export default User;
