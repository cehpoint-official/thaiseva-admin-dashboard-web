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
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useForm } from "react-hook-form";
import { AuthContext } from "../../../../contextAPIs/AuthProvider";
import {
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { localServicesCollection } from "../../../../firebase/firebase.config";
import { v4 as uuid } from "uuid";
import { PartnerContext } from "../../../../contextAPIs/PartnerProvider";
import PageHeading from "../../../../components/PageHeading";
import {
  askingForDelete,
  deleteNotification,
  successNotification,
} from "../../../../utils/utils";
import DeleteButton from "../../../../components/DeleteButton";
import UpdateButton from "../../../../components/UpdateButton";
import ServiceCategoryBtn from "../../../../components/ServiceCategoryBtn";

const MyServices = () => {
  const [services, setServices] = useState([]);
  const [addServiceModal, setAddServiceModal] = useState(false); //Add service modal
  const [refetchServices, setRefetchServices] = useState(false);
  const { userData, loadingUserData, user } = useContext(AuthContext);
  const { partnerDetails } = useContext(PartnerContext);
  const [error, setError] = useState(" ");
  const [serviceDetails, setServiceDetails] = useState({
    id: "",
    serviceName: "",
    description: "",
    serviceCategory: "",
    serviceArea: "",
    phoneNumber: "",
  });

  const {
    handleSubmit,
    reset,
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

  const handleOpenAddServiceModal = () => {
    reset();
    setServiceDetails({
      serviceName: "",
      serviceCategory: "",
      serviceArea: "",
      phoneNumber: "",
    });
    setAddServiceModal(true);
  };

  const handleCloseAddServiceModal = () => {
    setAddServiceModal(false);
  };

  // adding new service
  const handleAddService = async (data) => {
    setError("");
    const {
      serviceName,
      serviceArea,
      description,
      vehicleNumber,
      vehicleType,
      phoneNumber,
    } = data;

    if (phoneNumber?.length > 11 || phoneNumber?.length < 8) {
      return setError("Invalid phone number");
    }

    let id = "";
    if (serviceDetails?.id) {
      id = serviceDetails?.id;
    } else {
      id = uuid();
    }

    let service = {
      serviceName,
      serviceArea,
      description,
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

    await setDoc(doc(localServicesCollection, id), service).then(() => {
      successNotification(
        `The service is ${
          serviceDetails?.serviceName ? "updated" : "added"
        } successfully`
      );
      setRefetchServices((p) => !p);
      setAddServiceModal(false);
    });
  };

  // deleting service
  const handleDelete = async (id) => {
    askingForDelete().then(async (result) => {
      if (result.isConfirmed) {
        await deleteDoc(doc(localServicesCollection, id)).then(() => {
          setRefetchServices((p) => !p);
          deleteNotification("The service is deleted successfully.");
        });
      }
    });
  };

  const handleUpdateServiceModal = async (id) => {
    reset();
    setServiceDetails({
      serviceName: "",
      serviceCategory: "",
      serviceArea: "",
      phoneNumber: "",
    });
    const res = await getDoc(doc(localServicesCollection, id));
    const singleService = res.data();
    setServiceDetails(singleService);
    setAddServiceModal(true);
  };

  const loadingContent = (
    <div className="md:h-[40vh] w-full flex items-center justify-center">
      <Loading />
    </div>
  );

  // custom text field for common data
  const textField = (label, name, placeholder, defaultValue) => {
    return (
      <Grid item xs={12} sm={name === "description" ? 12 : 6}>
        <TextField
          label={label}
          type={name === "phoneNumber" ? "number" : "text"}
          placeholder={placeholder}
          defaultValue={defaultValue && defaultValue}
          multiline={name === "description"}
          fullWidth
          {...register(name, { required: true })}
          rows={name === "description" ? 3 : ""}
        />
        {errors?.name && (
          <span className="text-red-500">{label} is required</span>
        )}
      </Grid>
    );
  };

  return (
    <div>
      <PageHeading text={"My services"} />

      <div className="flex items-center justify-between  md:pr-3 mb-2">
        <p className="my-2 font-bold">{services?.length} services available</p>{" "}
        <button
          onClick={handleOpenAddServiceModal}
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
                              <div className="flex items-center justify-center gap-1">
                                <div onClick={() => handleDelete(row.id)}>
                                  <DeleteButton title="Delete the service" />
                                </div>
                                <div
                                  onClick={() =>
                                    handleUpdateServiceModal(row.id)
                                  }
                                >
                                  <UpdateButton title="Update the service" />
                                </div>
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
        onClose={handleCloseAddServiceModal}
        aria-labelledby="responsive-dialog-title"
      >
        <Box component="form" onSubmit={handleSubmit(handleAddService)}>
          <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
            {serviceDetails?.serviceName
              ? "Update the service"
              : "Add New Service"}
          </DialogTitle>
          <IconButton
            aria-label="close"
            onClick={handleCloseAddServiceModal}
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
            <ServiceCategoryBtn value={partnerDetails?.serviceCategory} />

            <Grid container spacing={2} sx={{ mb: 2, mt: 0.5 }}>
              {/* Service Name */}
              {textField(
                "Service Name",
                "serviceName",
                "",
                serviceDetails?.serviceName
              )}

              {/* Service Area */}
              {textField(
                "Service Area",
                "serviceArea",
                "Your Available Range",
                serviceDetails?.serviceArea
              )}

              {/* Phone Number */}
              {textField(
                "Phone Number",
                "phoneNumber",
                "Provide an active number",
                serviceDetails?.phoneNumber
              )}

              {/* Description */}
              {textField(
                "Description",
                "description",
                "Type the task description here...",
                serviceDetails?.description
              )}

              {/* Vehicle Registration Number */}
              {partnerDetails.serviceCategory ===
                "Logistics and Transportation" && (
                <>
                  {textField(
                    "Vehicle Registration Number",
                    "vehicleNumber",
                    "Number plate",
                    serviceDetails?.serviceArea
                  )}

                  {/* Vehicle Type */}
                  {textField(
                    "Vehicle Type",
                    "vehicleType",
                    "Truck or Ven",
                    serviceDetails?.serviceArea
                  )}
                </>
              )}
            </Grid>
            {error && <p className="text-red-500 text-center">{error}</p>}
          </DialogContent>
          <DialogActions>
            <Button
              variant="contained"
              type="submit"
              autoFocus
              sx={{ bgcolor: "blue", color: "white", hover: "none" }}
            >
              {serviceDetails?.serviceName ? "Update" : "Add"}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </div>
  );
};

export default MyServices;
