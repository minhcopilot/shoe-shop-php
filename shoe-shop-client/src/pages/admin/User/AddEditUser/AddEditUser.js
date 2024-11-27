import { yupResolver } from "@hookform/resolvers/yup";
import {
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@material-ui/core";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import Modal from "@material-ui/core/Modal";
import { unwrapResult } from "@reduxjs/toolkit";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import * as yup from "yup";
import { signUp } from "../../../../redux/slices/authSlice";
import { updateUser, getAllUser } from "../../../../redux/slices/userSlice";
import { useStyles } from "./styles";

const schema = yup.object().shape({
  fullName: yup.string().required(),
  email: yup.string().required().email(),
  password: yup.string().required().min(8, "Password is 8 characters long"),
});

const AddEditUser = ({ open, handleClose, user, handleData }) => {
  const classes = useStyles();

  const [value, setValue] = useState("false");

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
    setError,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const handleAddUser = (data) => {
    const user = {
      email: data.email,
      fullName: data.fullName,
      isAdmin: value,
      password: data.password,
    };

    const action = signUp(user);
    dispatch(action)
      .then(unwrapResult)
      .then((res) => {
        handleClose();
        reset();
        setValue("false");
        const action2 = getAllUser();
        dispatch(action2);

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
      })
      .catch((error) => {
        setError(error.message);
      });
  };

  const handleUpdateUser = (data) => {
    const newUser = {
      fullName: data.fullName,
      email: data.email,
      isAdmin: value,
      _id: user._id,
    };

    const action = updateUser(newUser);
    dispatch(action)
      .then(unwrapResult)
      .then((res) => {
        handleClose();
        reset();
        setValue("false");
        const action2 = getAllUser();
        dispatch(action2);

        toast("Cập nhật người dùng thành công!", {
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
        setError(error.message);
      });
  };

  useEffect(() => {
    if (user) {
      reset({
        fullName: user.fullName,
        email: user.email,
        password: "123123123",
      });
      setValue(user.isAdmin.toString());
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
          reset();
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
            onSubmit={handleSubmit(user ? handleUpdateUser : handleAddUser)}
          >
            <TextField
              label="Họ tên"
              variant="outlined"
              required
              className={classes.input}
              {...register("fullName")}
            />
            {!user && (
              <TextField
                label="Mật khẩu"
                {...register("password")}
                type="password"
                variant="outlined"
                required
                className={classes.input}
              />
            )}
            <TextField
              label="Email"
              type="email"
              {...register("email")}
              variant="outlined"
              required
              className={classes.input}
            />
            <FormControl component="fieldset" className={classes.formControl}>
              <FormLabel component="legend" className={classes.radioHeading}>
                Quyền
              </FormLabel>
              <Controller
                name="role"
                rules={{ required: true }}
                control={control}
                // defaultValue="business"
                render={({ field }) => (
                  <RadioGroup
                    {...field}
                    value={value}
                    onChange={handleChange}
                    className={classes.radioContainer}
                  >
                    <FormControlLabel
                      value="true"
                      control={
                        <Radio
                          style={{
                            color: "#1a202c",
                            "&$checked": {
                              color: "#1a202c",
                            },
                          }}
                        />
                      }
                      label="Admin"
                    />
                    <FormControlLabel
                      value="false"
                      control={
                        <Radio
                          style={{
                            color: "#1a202c",
                            "&$checked": {
                              color: "#1a202c",
                            },
                          }}
                        />
                      }
                      label="Khách hàng"
                    />
                  </RadioGroup>
                )}
              />
            </FormControl>
            {errors.password && (
              <Typography component="p" className={classes.error}>
                {errors.password.message}
              </Typography>
            )}
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
