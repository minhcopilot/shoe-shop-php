import { Box, List, ListItem, ListItemText } from "@material-ui/core";
import React from "react";
import {
  BiBox,
  BiCategory,
  BiDetail,
  BiDoughnutChart,
  BiHomeAlt,
  BiLogOut,
  BiMessageRoundedDots,
  BiUser,
} from "react-icons/bi";
import { useDispatch } from "react-redux";
import { NavLink, useHistory } from "react-router-dom";
import { clearUser } from "../../../redux/slices/authSlice";
import { useStyles } from "./styles";

const Sidebar = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();

  const handleLogout = () => {
    localStorage.clear();
    history.push("/login");
    const action = clearUser();
    dispatch(action);
  };

  return (
    <Box className={classes.sidebar}>
      <Box className={classes.sidebarWrapper}>
        <Box className={classes.sidebarMenu}>
          <List className={classes.sidebarList}>
            <NavLink className={classes.link} to="/admin/home">
              <ListItem disableGutters>
                <BiHomeAlt className={classes.sidebardIcon} />
                <ListItemText disableTypography primary={`Trang chủ`} />
              </ListItem>
            </NavLink>
            <NavLink className={classes.link} to="/admin/user">
              <ListItem disableGutters>
                <BiUser className={classes.sidebardIcon} />
                <ListItemText disableTypography primary={`Người dùng`} />
              </ListItem>
            </NavLink>
            <NavLink className={classes.link} to="/admin/product">
              <ListItem disableGutters>
                <BiBox className={classes.sidebardIcon} />
                <ListItemText disableTypography primary={`Sản phẩm`} />
              </ListItem>
            </NavLink>
            <NavLink className={classes.link} to="/admin/order">
              <ListItem disableGutters>
                <BiDetail className={classes.sidebardIcon} />
                <ListItemText disableTypography primary={`Đơn hàng`} />
              </ListItem>
            </NavLink>
            <NavLink className={classes.link} to="/admin/category">
              <ListItem disableGutters>
                <BiCategory className={classes.sidebardIcon} />
                <ListItemText disableTypography primary={`Danh mục`} />
              </ListItem>
            </NavLink>
            <NavLink className={classes.link} to="/admin/size">
              <ListItem disableGutters>
                <BiDoughnutChart className={classes.sidebardIcon} />
                <ListItemText disableTypography primary={`Kích thước`} />
              </ListItem>
            </NavLink>
            <NavLink className={classes.link} to="/admin/chat">
              <ListItem disableGutters>
                <BiMessageRoundedDots className={classes.sidebardIcon} />
                <ListItemText disableTypography primary={`Chat`} />
              </ListItem>
            </NavLink>
            <Box className={classes.link} onClick={handleLogout}>
              <ListItem disableGutters>
                <BiLogOut className={classes.sidebardIcon} />
                <ListItemText disableTypography primary={`Đăng xuất`} />
              </ListItem>
            </Box>
          </List>
        </Box>
      </Box>
    </Box>
  );
};

export default Sidebar;
