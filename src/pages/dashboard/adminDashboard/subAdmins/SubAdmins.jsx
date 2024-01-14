import { useContext, useState } from "react";
import { useEffect } from "react";
import {
  deleteDoc,
  doc,
  onSnapshot,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { app, usersCollection } from "../../../../firebase/firebase.config";
import { AuthContext } from "../../../../contextAPIs/AuthProvider";
import PageHeading from "../../../../components/PageHeading";
import Loading from "../../../../components/Loading";
import {
  askingForDelete,
  deleteNotification,
  getFileUrl,
} from "../../../../utils/utils";
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
} from "firebase/auth";
import DeleteButton from "../../../../components/DeleteButton";

const auth = getAuth(app);

const SubAdmins = () => {
  const { isAdmin, user, updateUserProfile } = useContext(AuthContext);
  const [subAdmins, setSubAdmins] = useState([]);
  const [matchedAdmins, setMatchedAdmins] = useState([]);
  const [error, setError] = useState({ for: "", text: "" });
  const [loadingServices, setLoadingServices] = useState(false);
  const [photoURL, setPhotoURL] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openModal, setOpenModal] = useState(false); // Add requirement modal
  const {
    handleSubmit,
    reset,
    register,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    setMatchedAdmins(subAdmins);
  }, [subAdmins]);

  // rooms for individual hotel owner
  useEffect(() => {
    const loadData = () => {
      const unSub = onSnapshot(
        query(usersCollection, where("role", "==", "Sub Admin")),
        (result) => {
          if (result.docs.length > 0) {
            const list = result.docs.map((doc) => doc.data());
            setSubAdmins(list);
            setLoadingServices(false);
          }
          if (result.docs.length == 0) {
            setSubAdmins([]);
            setLoadingServices(false);
          }
        }
      );

      return () => {
        unSub();
      };
    };
    isAdmin && loadData();
  }, [isAdmin]);

  const columns = [
    { id: "photoURL", label: "Profile", width: 150 },
    {
      id: "displayName",
      label: "Name",
      width: 100,
    },
    {
      id: "email",
      label: "Email",
      width: 70,
    },
    {
      id: "password",
      label: "Password",
      width: 50,
    },
    {
      id: "action",
      label: "Action",
      width: 50,
    },
  ];

  // creating single row
  function createData(photoURL, displayName, email, password, uid) {
    return { photoURL, displayName, email, password, uid };
  }

  // calling createData function with driver's data
  const rows = matchedAdmins.map((admin) => {
    return createData(
      admin.photoURL,
      admin.displayName,
      admin.email,
      admin.password,
      admin.uid
    );
  });

  /* =============================================================
              serach functionalities start
  =============================================================*/
  const handleSearchByName = (text) => {
    const matchingObjects = subAdmins.filter((admin) =>
      admin.displayName.toLowerCase().includes(text.toLowerCase())
    );
    setMatchedAdmins(matchingObjects);
  };

  const handleSearchByEmail = (text) => {
    const matchingObjects = subAdmins.filter((admin) =>
      admin.email.toLowerCase().includes(text.toLowerCase())
    );

    setMatchedAdmins(matchingObjects);
  };

  /* =============================================================
              serach functionalities end
  =============================================================*/

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  /* =============================================================
              Add New Sub Admin start
  =============================================================*/
  const handleOpenModal = () => {
    reset();
    setError({ for: "", text: "" });
    setOpenModal(true);
  };

  // opening AddPackagesModal the modal while cliking on right sign icon
  const handleCloseModal = () => {
    reset();
    setPhotoURL("");

    setOpenModal(false);
  };

  // storing admin data in the database
  const handleAddSubAdmin = async (data) => {
    setError({ for: "", text: "" });
    const { email, password, displayName } = data;

    if (!photoURL) {
      return setError({
        for: "photoURL",
        text: "Please select a profile picture",
      });
    }

    // Create sub-admin account
    await createUserWithEmailAndPassword(auth, email, password)
      .then(async (result) => {
        const createdSubAdmin = result.user;

        // adding users data to the useres collection
        await setDoc(doc(usersCollection, createdSubAdmin.uid), {
          email: email,
          displayName,
          password,
          photoURL,
          role: "Sub Admin",
          uid: createdSubAdmin.uid,
        });
        console.log(createdSubAdmin);
        await updateUserProfile(displayName, photoURL);
      })
      .catch((err) => {
        console.log(err.message);
        if (err?.message.includes("email")) {
          setError({ for: "email", text: "Invalid email" });
        }
        if (err?.message.includes("Password")) {
          setError({ for: "password", text: "Invalid password" });
        }
      });

    // Sign in as the main admin after creating the sub-admin
    await signInWithEmailAndPassword(
      auth,
      localStorage.getItem("email"),
      localStorage.getItem("password")
    ); // todo:
  };
  /* =============================================================
              Add New Sub Admin end
  =============================================================*/

  // delete package
  const handleDeleteSubAdmin = async (uid) => {
    askingForDelete().then(async (result) => {
      if (result.isConfirmed) {
        // await deleteUser(auth, uid).then(() =>
        //   console.log("Successfully deleted from authencation")
        // );
        await deleteDoc(doc(usersCollection, uid)).then(() => {
          deleteNotification("The Sub Admin is deleted successfully.");
        });
      }
    });
  };

  // upload cover photo
  const handleUploadPhotoURL = async (e) => {
    const { files } = e.target;
    setError({ for: "", text: "" });
    setError({
      for: "photoURL",
      text: "Picture is uploading...",
    });
    const result = await getFileUrl(files);
    if (result?.error) {
      setError({ for: "photoURL", text: result.message });
    } else {
      setPhotoURL(result.url);
      setError({
        for: "photoURL",
        text: "Picture is uploaded successfully.",
      });
    }
  };

  // custom text field for common data
  const textField = (label, name, placeholder, defaultValue) => {
    return (
      <Grid item xs={12} sm={6}>
        <TextField
          label={label}
          type="text"
          defaultValue={defaultValue && defaultValue}
          placeholder={placeholder}
          fullWidth
          {...register(name, { required: true })}
        />
        {errors?.name && (
          <span className="text-red-500 text-sm">{label} is required</span>
        )}
        {error.for === name && (
          <span className="text-red-500 text-sm">{error.text}</span>
        )}
      </Grid>
    );
  };

  const loadingContent = (
    <div className="md:h-[40vh] w-full flex items-center justify-center">
      <Loading />
    </div>
  );

  return (
    <div>
      <PageHeading text="Sub Admins" />

      <Grid container spacing={0.5} sx={{ mb: 2, mt: 2 }}>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            label="Search By Name"
            type="search"
            placeholder="Admin Name"
            fullWidth
            onChange={(e) => handleSearchByName(e.target.value)}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <TextField
            label="Search By Email"
            type="search"
            placeholder="Admin Email"
            fullWidth
            onChange={(e) => handleSearchByEmail(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          <div className="text-right md:pr-10 mb-4 flex items-center justify-end h-full">
            <button
              onClick={handleOpenModal}
              className="py-1 px-2 rounded bg-[var(--primary-bg)] text-white"
            >
              Add Sub Admin
            </button>
          </div>
        </Grid>
      </Grid>

      <Paper sx={{ width: "100%", overflowX: "hidden" }}>
        <TableContainer sx={{ maxHeight: 440, maxWidth: "87vw" }}>
          {loadingServices ? (
            loadingContent
          ) : (
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      align="center"
                      style={{
                        width: column.width,
                        color: "var(--primary-bg)",
                        fontWeight: "bold",
                      }}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {rows
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, i) => {
                    return (
                      <TableRow hover role="checkbox" tabIndex={-1} key={i}>
                        {columns.map((column) => {
                          let value = row[column.id];
                          return (
                            <TableCell key={column.id} align="center">
                              {(column.id === "action" && (
                                <div className="flex gap-1 items-center justify-center">
                                  <div
                                    onClick={() =>
                                      handleDeleteSubAdmin(row.uid)
                                    }
                                  >
                                    <DeleteButton />
                                  </div>
                                </div>
                              )) ||
                                (column.id === "photoURL" && (
                                  <div className="flex items-center justify-center">
                                    {" "}
                                    <img
                                      src={value}
                                      className="w-10 h-10 lg:w-16 lg:h-16  rounded-full"
                                    />
                                  </div>
                                )) ||
                                value}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          )}
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      {/* Add requirement modal */}
      <Dialog
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="responsive-dialog-title"
      >
        <Box component="form" onSubmit={handleSubmit(handleAddSubAdmin)}>
          <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
            Add New Sub Admin
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
              {/* Email */}
              {textField("Email", "email", "Email")}

              {/* Password */}
              {textField("Password", "password", "Password")}

              {/* Name */}
              {textField("Name", "displayName", "Name")}

              <Grid item xs={12} sm={6}>
                <TextField
                  label={"Select cover photo"}
                  type="file"
                  defaultValue=""
                  onChange={handleUploadPhotoURL}
                  placeholder=""
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
                {error.for === "photoURL" && (
                  <span
                    className={` text-sm ${
                      (error?.text.includes("select") && "text-red-500") ||
                      (error?.text.includes("uploading") &&
                        "text-orange-500") ||
                      (error?.text.includes("success") && "text-green-500")
                    }`}
                  >
                    {error.text}
                  </span>
                )}
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button
              variant="contained"
              type="submit"
              disabled={!photoURL}
              autoFocus
              sx={{
                bgcolor: "var(--primary-bg)",
                color: "white",
                hover: "none",
              }}
            >
              Add
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </div>
  );
};

export default SubAdmins;
