import {
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  TextField,
} from "@material-ui/core";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import Modal from "@material-ui/core/Modal";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import { getAllUser } from "../../../../redux/slices/userSlice";
import { useStyles } from "./styles";
import userAPI from "../../../../api/userApi";

const AddEditUser = ({ open, handleClose, user, handleData }) => {
  const classes = useStyles();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [value, setValue] = useState("false");

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  const dispatch = useDispatch();

  const handleAddUser = async () => {
    const user = {
      name,
      email,
      password,
      is_admin: value === "true" ? 1 : 0, // Chuyển từ "true"/"false" thành 1/0
    };

    try {
      // Gọi API để tạo người dùng mới
       await userAPI.addUser(user);

      // Sau khi thành công, đóng modal, reset form và thông báo cho người dùng
      handleClose();
      setName("");
      setEmail("");
      setPassword("");
      setValue("false");
      toast("Thêm người dùng thành công!", {
        position: "bottom-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        type: "success",
      });

      // Lấy lại danh sách người dùng mới
      dispatch(getAllUser());
    } catch (error) {
      toast.error("Đã xảy ra lỗi khi thêm người dùng", {
        position: "bottom-center",
        autoClose: 3000,
      });
    }
  };

  const handleUpdateUser = async () => {
    const newUser = {
      is_admin: value === "true" ? 1 : 0, // Chuyển từ "true"/"false" thành 1/0
      id: user.id, // Thêm id người dùng để xác định bản ghi cần cập nhật
    };

    try {
       await userAPI.updateUser(newUser);

      handleClose();
      setValue("false"); // Reset lại trạng thái của radio button

      toast("Cập nhật quyền thành công!", {
        position: "bottom-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        type: "success",
      });

      dispatch(getAllUser()); // Cập nhật lại danh sách người dùng

    } catch (error) {
      toast.error("Đã xảy ra lỗi khi cập nhật quyền", {
        position: "bottom-center",
        autoClose: 3000,
      });
    }
  };

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setValue(user.is_admin.toString());
    }
  }, [user]);
  return (
    <>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={open}
        onClose={() => {
          handleClose();
          setName("");
          setEmail("");
          setPassword("");
          setValue("false");
        }}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 300,
        }}
      >
        <Fade in={open}>
          <form
            className={classes.paper}
            onSubmit={(e) => {
              e.preventDefault();
              if (user) {
                handleUpdateUser();
              } else {
                handleAddUser();
              }
            }}
          >
            <TextField
              label="Họ tên"
              variant="outlined"
              required
              className={classes.input}
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={!!user} // Disable field khi update
            />
            <TextField
              label="Email"
              type="email"
              variant="outlined"
              required
              className={classes.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={!!user} // Disable field khi update
            />
            {!user && (
              <TextField
                label="Mật khẩu"
                variant="outlined"
                required
                type="password"
                className={classes.input}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            )}
            <FormControl component="fieldset" className={classes.formControl}>
              <FormLabel component="legend" className={classes.radioHeading}>
                Quyền
              </FormLabel>
              <RadioGroup
                value={value}
                onChange={handleChange}
                className={classes.radioContainer}
              >
                <FormControlLabel
                  value="true"
                  control={<Radio style={{ color: "#1a202c" }} />}
                  label="Admin"
                />
                <FormControlLabel
                  value="false"
                  control={<Radio style={{ color: "#1a202c" }} />}
                  label="User"
                />
              </RadioGroup>
            </FormControl>
            <Button className={classes.save} type="submit">
              Lưu
            </Button>
          </form>
        </Fade>
      </Modal>
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
    </>
  );
};

export default AddEditUser;
