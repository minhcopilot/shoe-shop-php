import {
  Button,
  TextField,
  Typography,
  CircularProgress,
} from "@material-ui/core";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import Modal from "@material-ui/core/Modal";
import "react-toastify/dist/ReactToastify.css";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import {
  addCategory,
  updateCategory,
} from "../../../../redux/slices/categorySlice";
import { useStyles } from "./styles";
import { toast, ToastContainer } from "react-toastify";

const AddEditCategory = ({ open, handleClose, category, handleData }) => {
  const classes = useStyles();

  const dispatch = useDispatch();
  const { register, handleSubmit, reset } = useForm();
  const [error, setError] = useState("");
  const { addCategoryLoading, categories } = useSelector(
    (state) => state.category
  );
  const [loading, setLoading] = useState(false);

  const checkCategoryNameExists = (name, excludeId = null) => {
    return categories.some(
      (cat) =>
        cat.name.toLowerCase() === name.toLowerCase() && cat.id !== excludeId
    );
  };

  const handleAddCategory = (data) => {
    const trimmedName = data.name.trim();
    if (trimmedName !== data.name) {
      setError("Tên danh mục không được chứa khoảng trắng ở đầu hoặc cuối");
      return;
    }

    if (trimmedName === "") {
      setError("Tên danh mục không được để trống");
      return;
    }

    if (checkCategoryNameExists(trimmedName)) {
      setError("Tên danh mục đã tồn tại");
      return;
    }

    setLoading(true);
    const action = addCategory({ ...data, name: trimmedName });
    dispatch(action)
      .unwrap()
      .then((res) => {
        handleClose();
        setError("");
        reset();
        const newCategory = {
          id: res.id,
          name: res.name,
          created_at: res.created_at || new Date().toISOString(),
          updated_at: res.updated_at || new Date().toISOString(),
        };
        handleData({ type: "Add", data: newCategory });
        toast.success("Thêm danh mục thành công!", {
          position: "bottom-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      })
      .catch((error) => {
        setError("Có lỗi xảy ra khi thêm danh mục");
        toast.error("Có lỗi xảy ra khi thêm danh mục!", {
          position: "bottom-center",
          autoClose: 3000,
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleEditCategory = (data) => {
    const trimmedName = data.name.trim();
    if (trimmedName !== data.name) {
      setError("Tên danh mục không được chứa khoảng trắng ở đầu hoặc cuối");
      return;
    }

    if (trimmedName === "") {
      setError("Tên danh mục không được để trống");
      return;
    }

    if (checkCategoryNameExists(trimmedName, data.id)) {
      setError("Tên danh mục đã tồn tại");
      return;
    }

    setLoading(true);
    const action = updateCategory({ ...data, name: trimmedName });
    dispatch(action)
      .unwrap()
      .then((res) => {
        handleClose();
        setError("");
        const updatedCategory = {
          ...data,
          updated_at: res.updated_at || new Date().toISOString(),
        };
        handleData({ type: "Edit", data: updatedCategory });
        reset();
        toast.success("Cập nhật danh mục thành công!", {
          position: "bottom-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      })
      .catch((error) => {
        setError("Có lỗi xảy ra khi cập nhật danh mục");
        toast.error("Có lỗi xảy ra khi cập nhật danh mục!", {
          position: "bottom-center",
          autoClose: 3000,
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    reset(category);
  }, [category, reset]);

  return (
    <>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 300,
        }}
      >
        <Fade in={open}>
          <form
            className={classes.paper}
            onSubmit={handleSubmit(
              category ? handleEditCategory : handleAddCategory
            )}
          >
            <TextField
              label="Category"
              variant="outlined"
              required
              className={classes.input}
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
              ) : category ? (
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
      />
    </>
  );
};

export default AddEditCategory;
