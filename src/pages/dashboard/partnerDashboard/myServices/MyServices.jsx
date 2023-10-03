import { useContext, useEffect } from "react";
import { useState } from "react";
import Loading from "../../../../components/Loading";
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
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import { useForm } from "react-hook-form";
import { AuthContext } from "../../../../contextAPIs/AuthProvider";
import {
  arrayUnion,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import {
  localServicesCollection,
  partnersCollection,
} from "../../../../firebase/firebase.config";
import { v4 as uuid } from "uuid";
import { PartnerContext } from "../../../../contextAPIs/PartnerProvider";
import PageHeading from "../../../../components/PageHeading";
import { successNotification } from "../../../../components/Notifications";
// import { SuccessNotification } from "../../../../components/Notifications";

const MyServices = () => {
  const [services, setServices] = useState([]);
  const [addServiceModal, setAddServiceModal] = useState(false); //Add service modal
  const [updateServiceModal, setUpdateServiceModal] = useState(false); //Update service modal
  const [refetchServices, setRefetchServices] = useState(false);
  const { userData, loadingUserData, user } = useContext(AuthContext);
  const { partnerDetails } = useContext(PartnerContext);
  const [service, setService] = useState({});

  const {
    handleSubmit,
    // reset,
    register,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    const loadData = async (user, localServicesCollection) => {
      const docSnapshot = await getDocs(
        query(localServicesCollection, where("providerUid", "==", user.uid))
      );

      if (docSnapshot.docs.length > 0) {
        const list = docSnapshot.docs.map((doc) => doc.data());
        setServices(list);
      }
      if (docSnapshot.docs.length == 0) {
        setServices([]);
      }
    };
    user && !loadingUserData && loadData(user, localServicesCollection);
  }, [user, loadingUserData, refetchServices]);

  const handleAddService = async (data) => {
    const {
      serviceName,
      serviceArea,
      vehicleNumber,
      vehicleType,
      phoneNumber,
    } = data;

    const id = uuid();

    let service = {
      serviceName,
      serviceArea,
      serviceCategory: partnerDetails.serviceCategory,
      serviceProvider: partnerDetails.personalInformation.fullName,
      providerUid: user.uid,
      phoneNumber,
      id,
    };

    if (userData.serviceCategory === "Logistics and Transportation") {
      service.vehicleNumber = vehicleNumber;
      service.vehicleType = vehicleType;
    }

    await setDoc(doc(localServicesCollection, id), service).then(() =>
      setRefetchServices((p) => !p)
    );

    setAddServiceModal(false); // closing the add service modal after adding the modal

    // adding the srvice to partner's data
    await updateDoc(doc(partnersCollection, user.uid), {
      "serviceInformation.servicesOffered": arrayUnion({
        id,
      }),
    }).then(() =>
      successNotification("The task is added successfully.", "success")
    );
  };

  // Partners table header
  let columns = [
    { id: "name", label: "Name", width: 70 },
    {
      id: "serviceArea",
      label: "Service\u00a0Area",
      width: 130,
    },
  ];

  if (userData.serviceCategory === "Logistics and Transportation") {
    columns.push({ id: "vehicleNumber", label: "Vehicle Number", width: 80 });
  }
  columns.push({
    id: "action",
    label: "Action",
    width: 120,
  });

  // creating single row
  function createData(
    name,
    serviceArea,
    phone,
    providerUid,
    id,
    vehicleNumber
  ) {
    return { name, serviceArea, phone, providerUid, id, vehicleNumber };
  }

  // calling createData function with partner's data
  const rows = services?.map((service) => {
    return createData(
      service.serviceName,
      service.serviceArea,
      service.phone,
      service.providerUid,
      service.id,
      service.vehicleNumber
    );
  });

  // deleting service
  const handleDelete = async (id) => {
    await deleteDoc(doc(localServicesCollection, id)).then(() => {
      successNotification("The task is deleted successfully.", "success");
      setRefetchServices((p) => !p);
    });
  };

  const handleUpdateServiceModal = async (id) => {
    const res = await getDoc(doc(localServicesCollection, id));
    if (res.exists()) {
      const singleService = res.data();
      setService(singleService);

      setUpdateServiceModal(true);
    }
  };

  const handleUpdateService = async (e) => {
    e.preventDefault();
    const serviceName = e.target.serviceName.value;
    const serviceArea = e.target.serviceArea.value;
    console.log(serviceName, serviceArea);

    await updateDoc(doc(localServicesCollection, service.id), {
      serviceName,
      serviceArea,
    }).then(() => {
      setUpdateServiceModal(false);
      setRefetchServices((p) => !p);
      setService({});
      successNotification("The task is updated successfully.", "success");
    });
  };

  const loadingContent = (
    <div className="md:h-[40vh] w-full flex items-center justify-center">
      <Loading />
    </div>
  );

  return (
    <div>
      <PageHeading text={"My services"} />

      <div className="flex items-center justify-between  md:pr-3 mb-2">
        <p className="my-2 font-bold">{services.length} services available</p>{" "}
        <button
          onClick={() => {
            setAddServiceModal(true), setService({});
          }}
          className="py-1 px-2 rounded bg-[blue] text-white"
        >
          Add Service
        </button>
      </div>
      <Paper sx={{ width: "100%", overflowX: "hidden" }}>
        <TableContainer sx={{ maxHeight: 440, maxWidth: "87vw" }}>
          {!services ? (
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
                        color: "blue",
                        fontWeight: "bold",
                      }}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row, i) => {
                  return (
                    <TableRow hover role="checkbox" tabIndex={-1} key={i}>
                      {columns.map((column) => {
                        const value = row[column.id];
                        return (
                          <TableCell key={column.id} align="center">
                            {(column.id === "action" && (
                              <div className="flex gap-1">
                                <button
                                  onClick={() => handleDelete(row.id)}
                                  className="bg-red-500 text-white p-1 rounded"
                                >
                                  <DeleteForeverIcon />
                                </button>
                                <button
                                  onClick={() =>
                                    handleUpdateServiceModal(row.id)
                                  }
                                  className="bg-orange-500 text-white p-1 rounded ml-1"
                                >
                                  <EditIcon />
                                </button>
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
      </Paper>
      {/* Add service modal */}
      <Dialog
        open={addServiceModal}
        onClose={() => setAddServiceModal(false)}
        aria-labelledby="responsive-dialog-title"
      >
        <Box component="form" onSubmit={handleSubmit(handleAddService)}>
          <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
            Add New Service
          </DialogTitle>
          <IconButton
            aria-label="close"
            onClick={() => setAddServiceModal(false)}
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
            <Typography variant="div">
              <span className="font-bold">Category : </span>{" "}
              <span className="bg-[blue] text-white font-bold py-1 px-2 rounded inline-block">
                {partnerDetails.serviceCategory}
              </span>
            </Typography>

            <Grid container spacing={2} sx={{ mb: 2, mt: 0.5 }}>
              {/* Full Name */}
              <Grid item xs={12} sm={6} md={6}>
                <TextField
                  label="Service Name"
                  type="text"
                  defaultValue=""
                  fullWidth
                  {...register("serviceName", { required: true })}
                />
              </Grid>

              {/* Service Area */}
              <Grid item xs={12} sm={6} md={6}>
                <TextField
                  label="Service Area"
                  type="text"
                  placeholder="Which location will you provide the service?"
                  defaultValue=""
                  fullWidth
                  {...register("serviceArea", { required: true })}
                />
              </Grid>

              {/* Phone Number */}
              <Grid item xs={12} sm={6} md={6}>
                <TextField
                  label="Phone Number"
                  type="tel"
                  defaultValue=""
                  fullWidth
                  {...register("phoneNumber", { required: true })}
                />
              </Grid>

              {/* Vehicle Registration Number */}
              {partnerDetails.serviceCategory ===
                "Logistics and Transportation" && (
                <>
                  <Grid item xs={12} sm={6} md={6}>
                    <TextField
                      label="Vehicle Registration Number"
                      type="text"
                      placeholder="Number plate"
                      defaultValue=""
                      fullWidth
                      {...register("vehicleNumber", { required: true })}
                    />
                  </Grid>

                  {/* Vehicle Type */}
                  <Grid item xs={12} sm={6} md={6}>
                    <TextField
                      label="Vehicle Type"
                      type="text"
                      placeholder="Truck or Ven"
                      defaultValue=""
                      fullWidth
                      {...register("vehicleType", { required: true })}
                    />
                  </Grid>
                </>
              )}
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button
              variant="contained"
              type="submit"
              autoFocus
              sx={{ bgcolor: "blue", color: "white", hover: "none" }}
            >
              Add
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      {/* Update service modal */}
      <Dialog
        open={updateServiceModal}
        onClose={() => setUpdateServiceModal(false)}
        aria-labelledby="responsive-dialog-title"
      >
        <Box component="form" onSubmit={handleUpdateService}>
          <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
            Update the service
          </DialogTitle>
          <IconButton
            aria-label="close"
            onClick={() => setUpdateServiceModal(false)}
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
            {
              <Grid container spacing={0.5} sx={{ mb: 2, mt: 0.5 }}>
                {/* Full Name */}
                <Grid item xs={12} sm={6} md={6}>
                  <TextField
                    label="Service Name"
                    type="text"
                    defaultValue={service.serviceName}
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                    {...register("serviceName", { required: true })}
                  />
                </Grid>

                {/* Service Area */}
                <Grid item xs={12} sm={6} md={6}>
                  <TextField
                    label="Service Area"
                    type="text"
                    defaultValue={service.serviceArea}
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                    {...register("serviceArea", { required: true })}
                  />
                </Grid>
              </Grid>
            }
          </DialogContent>
          <DialogActions>
            <Button
              variant="contained"
              type="submit"
              autoFocus
              sx={{ bgcolor: "blue", color: "white", hover: "none" }}
              // onClick={handleUpdateService}
            >
              Update
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </div>
  );
};

export default MyServices;
