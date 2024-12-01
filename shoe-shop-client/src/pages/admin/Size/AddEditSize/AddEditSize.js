import {
  Button,
  TextField,
  Typography,
  CircularProgress,
} from "@material-ui/core";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import Modal from "@material-ui/core/Modal";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import { addSize, updateSize } from "../../../../redux/slices/sizeSlice";
import { useStyles } from "./styles";

const AddEditSize = ({ open, handleClose, size, handleData }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { register, handleSubmit, reset } = useForm();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const sizes = useSelector((state) => state.size.sizes);

  const checkSizeNameExists = (name, excludeId = null) => {
    return sizes.some(
      (s) => s.name.toLowerCase() === name.toLowerCase() && s.id !== excludeId
    );
  };

  const handleAddSize = (data) => {
    const trimmedName = data.name.trim();
    if (trimmedName !== data.name) {
      setError("Tên kích thước không được chứa khoảng trắng ở đầu hoặc cuối");
      return;
    }

    if (trimmedName === "") {
      setError("Tên kích thước không được để trống");
      return;
    }

    if (checkSizeNameExists(trimmedName)) {
      setError("Tên kích thước đã tồn tại");
      return;
    }

    setLoading(true);
    const action = addSize({ ...data, name: trimmedName });
    dispatch(action)
      .unwrap()
      .then((res) => {
        handleClose();
        setError("");
        reset();
        const newSize = {
          id: res.id,
          name: res.name,
          created_at: res.created_at || new Date().toISOString(),
          updated_at: res.updated_at || new Date().toISOString(),
        };
        handleData({ type: "Add", data: newSize });
        toast.success("Thêm kích thước thành công!", {
          position: "bottom-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      })
      .catch((error) => {
        setError("Có lỗi xảy ra khi thêm kích thước");
        toast.error("Có lỗi xảy ra khi thêm kích thước!", {
          position: "bottom-center",
          autoClose: 3000,
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleEditSize = (data) => {
    const trimmedName = data.name.trim();
    if (trimmedName !== data.name) {
      setError("Tên kích thước không được chứa khoảng trắng ở đầu hoặc cuối");
      return;
    }

    if (trimmedName === "") {
      setError("Tên kích thước không được để trống");
      return;
    }

    if (checkSizeNameExists(trimmedName, data.id)) {
      setError("Tên kích thước đã tồn tại");
      return;
    }

    setLoading(true);
    const action = updateSize({ ...data, name: trimmedName });
    dispatch(action)
      .unwrap()
      .then((res) => {
        handleClose();
        setError("");
        reset();
        const updatedSize = {
          ...data,
          updated_at: res.updated_at || new Date().toISOString(),
        };
        handleData({ type: "Edit", data: updatedSize });
        toast.success("Cập nhật kích thước thành công!", {
          position: "bottom-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      })
      .catch((error) => {
        setError("Có lỗi xảy ra khi cập nhật kích thước");
        toast.error("Có lỗi xảy ra khi cập nhật kích thước!", {
          position: "bottom-center",
          autoClose: 3000,
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    reset(size);
  }, [size, reset]);
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
            <Button type="submit" className={classes.save} disabled={loading}>
              {loading ? (
                <CircularProgress size={24} style={{ color: "white" }} />
              ) : size ? (
                "Cập nhật"
              ) : (
                "Thêm mới"
              )}
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
