import { Button, TextField, Typography } from "@material-ui/core";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import Modal from "@material-ui/core/Modal";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import {
  addSize,
  updateSize,
} from "../../../../redux/slices/sizeSlice";
import { useStyles } from "./styles";
import { unwrapResult } from "@reduxjs/toolkit";
const AddEditSize = ({ open, handleClose, size, handleData }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { register, handleSubmit, reset } = useForm();
  const [error, setError] = useState("");

  const handleAddSize = (data) => {
    const action = addSize(data);
    dispatch(action)
      .then(unwrapResult)
      .then((res) => {
        handleClose();
        reset();
        handleData({ type: "Add", data: res });
        toast("Thêm kích thước thành công!", {
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

  const handleEditSize = (data) => {
    const action = updateSize(data);
    dispatch(action)
      .unwrap()
      .then((res) => {
        handleClose();
        setError("");
        reset();
        handleData({ type: "Edit", data: res });
        toast("Cập nhật kích thước thành công!", {
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
        setError("Tên đã tồn tại");
      });
  };

  useEffect(() => {
    reset(size);
  }, [size,reset]);
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
          setError("");
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
            onSubmit={handleSubmit(size ? handleEditSize : handleAddSize)}
          >
            <TextField
              label="Kích thước"
              variant="outlined"
              required
              className={classes.input}
              defaultValue={size?.name}
              {...register("name")}
            />
            {error !== "" && (
              <Typography component="p" className={classes.error}>
                {error}
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

export default AddEditSize;
