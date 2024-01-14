import { doc, setDoc, updateDoc } from "firebase/firestore";
import { useContext, useState } from "react";
import { settingsCollection } from "../firebase/firebase.config";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  TextField,
} from "@mui/material";

import { v4 as uuid } from "uuid";
import CloseIcon from "@mui/icons-material/Close";
import {
  askingForDelete,
  deleteNotification,
  getFileUrl,
  successNotification,
} from "../utils/utils";
import DeleteButton from "./DeleteButton";
import { PartnerContext } from "../contextAPIs/PartnerProvider";

const CategoriesAndLogo = () => {
  const { logo, categories, setRefetch } = useContext(PartnerContext);
  const [openModal, setOpenModal] = useState(false);
  const [error, setError] = useState({ for: "", text: "" });
  const [category, setCategory] = useState({
    title: "",
    image: "",
    id: "",
    chatScreen: "",
  });

  const handleOpenModal = () => {
    setCategory({});
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setCategory({});
  };

  const handleAddCategory = async () => {
    if (!category.id) category.id = uuid();
    if (category.id) {
      await setDoc(doc(settingsCollection, "Service_Categories"), {
        id: "Service_Categories",
        categories: [...categories, category],
      }).then(() => {
        setCategory({
          title: "",
          image: "",
          id: "",
        });
        setOpenModal(false);
        setRefetch((p) => !p);
        successNotification("The category is added successfully.");
      });
    }
  };

  const handleDeleteCategory = async (id) => {
    const remaining = categories.filter((category) => category.id !== id);

    askingForDelete().then(async (result) => {
      if (result.isConfirmed) {
        await updateDoc(doc(settingsCollection, "Service_Categories"), {
          id: "Service_Categories",
          categories: remaining,
        }).then(() => {
          deleteNotification("The category is deleted successfully.");
          setRefetch((p) => !p);
        });
      }
    });
  };

  const handleUploadImage = async (e) => {
    const { files } = e.target;
    setError({ for: "", text: "" });
    const result = await getFileUrl(files);
    if (result.error) {
      setError({ for: "image", text: result.message });
    } else {
      setCategory((p) => ({ ...p, image: result.url }));
    }
  };

  const handleUploadLogo = async (e) => {
    const { files } = e.target;
    setError({ for: "", text: "" });
    const result = await getFileUrl(files);
    if (result.error) {
      setError({ for: "logo", text: result.message });
    } else {
      await setDoc(doc(settingsCollection, "logo"), {
        id: "logo",
        logo: result.url,
      }).then(() => {
        setRefetch((p) => !p);
      });
    }
  };

  return (
    <div className="mb-2 bg-slate-200 p-2 rounded">
      <div className="flex lg:flex-row flex-col-reverse gap-2">
        <div className="flex-1 border border-zinc-200 rounded">
          <div className="text-right mb-4 flex items-center justify-between h-fit border-b border-[var(--primary-bg)] py-2">
            <h2 className="banner-section-title">Service Categories</h2>
            <button onClick={handleOpenModal} className="add-new-btn">
              Add New
            </button>
          </div>
          <div className=" bg-white grid md:grid-cols-3 grid-cols-2 gap-2 lg:gap-5 p-4 w-full">
            {categories?.length > 0 ? (
              categories?.map((category, i) => (
                <div
                  key={i}
                  className="flex flex-row items-center justify-center border p-2 py-3 rounded shadow-md shadow-black/30 relative"
                >
                  <div className="flex flex-col items-center justify-center gap-2 ">
                    <h3 className="text-sm text-slate-600 text-center">
                      {category?.title}
                    </h3>
                    <img
                      src={category?.image}
                      alt=""
                      className="w-16 h-16 rounded "
                    />
                  </div>
                  <div
                    onClick={() => handleDeleteCategory(category.id)}
                    className="absolute bottom-1 right-1 "
                  >
                    <DeleteButton />
                  </div>
                </div>
              ))
            ) : (
              <span>No category available</span>
            )}
          </div>
        </div>

        {/* todo */}
        <div className="flex-1 border border-zinc-200 rounded p-2 bg-white">
          <div className="flex items-center justify-center gap-2">
            <span className="text-lg font-semibold">Logo: </span>
            <TextField
              label="Select logo"
              type="file"
              onChange={handleUploadLogo}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
            <img src={logo} alt="" className="w-16" />
          </div>
        </div>
      </div>

      {/* add category modal */}
      <Dialog
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="responsive-dialog-title"
      >
        <Box>
          <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
            Local Service Category
          </DialogTitle>
          <IconButton
            aria-label="close"
            onClick={handleCloseModal}
            sx={{
              position: "absolute",
              right: 0,
              top: 0,
              color: "gray",
            }}
          >
            <CloseIcon />
          </IconButton>

          {/* modal body */}
          <DialogContent dividers sx={{ p: { xs: 2, md: 2 } }}>
            <Grid container spacing={2} sx={{ mb: 2, mt: 0.5 }}>
              {/* category title */}

              <Grid item xs={12} sm={12}>
                <TextField
                  label="Category title"
                  type="text"
                  id="logo_input"
                  placeholder="Provide a category title"
                  value={category.title}
                  onChange={(e) => {
                    setCategory((p) => ({ ...p, title: e.target.value }));
                    setCategory((p) => ({
                      ...p,
                      chatScreen: e.target.value
                        .split(" ")
                        .join("_")
                        .toLowerCase(),
                    }));
                  }}
                  fullWidth
                />
              </Grid>

              <Grid item xs={12} sm={12}>
                <TextField
                  label="Select an icon or logo"
                  type="file"
                  onChange={handleUploadImage}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
                {error.for === "image" && (
                  <span className="text-sm text-red-500">{error.text}</span>
                )}
              </Grid>
              {category.image && (
                <Grid item xs={12} sm={12}>
                  <img
                    src={category.image}
                    alt=""
                    className="w-20 h-20 rounded-lg"
                  />
                </Grid>
              )}
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button
              variant="contained"
              type="submit"
              autoFocus
              sx={{
                bgcolor: "var(--primary-bg)",
                color: "white",
                hover: "none",
              }}
              onClick={handleAddCategory}
              disabled={!category.image}
            >
              Add
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </div>
  );
};

export default CategoriesAndLogo;
