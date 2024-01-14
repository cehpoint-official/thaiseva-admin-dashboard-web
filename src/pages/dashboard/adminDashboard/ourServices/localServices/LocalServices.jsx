import { useContext, useState } from "react";
import PageHeading from "../../../../../components/PageHeading";
import { useEffect } from "react";
import {
  doc,
  getDoc,
  onSnapshot,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import {
  localServicesCollection,
  partnersCollection,
  requirementsCollection,
} from "../../../../../firebase/firebase.config";
import { AuthContext } from "../../../../../contextAPIs/AuthProvider";
import ViewDetailsIcon from "../../../../../components/ViewDetailsIcon";
import AddTaskIcon from "@mui/icons-material/AddTask";
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
import { v4 as uuid } from "uuid";
import { successNotification } from "../../../../../utils/utils";
import ServiceCategoryBtn from "../../../../../components/ServiceCategoryBtn";
import LoadingContent from "../../../../../components/LoadingContent";

const LocalServices = () => {
  const { isAdmin, isSubAdmin } = useContext(AuthContext);
  const [localServices, setLocalServices] = useState([]);
  const [queryCategory, setQueryCategory] = useState("All");
  const [matchedServices, setMatchedServices] = useState([]);
  const [loadingServices, setLoadingServices] = useState(true);
  const [error, setError] = useState("");
  const [openServiceDetailsModal, setOpenServiceDetailsModal] = useState(false);
  const [partnerDetails, setPartnerDetails] = useState({});
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [serviceName, setServiceName] = useState("");
  const [openAddRequirementModal, setOpenAddRequirementModal] = useState(false); // Add requirement modal
  const [serviceDetails, setServiceDetails] = useState({
    serviceName: "",
    description: "",
    serviceCategory: "",
    serviceArea: "",
    phoneNumber: "",
  });

  useEffect(() => {
    setMatchedServices(localServices);
  }, [localServices]);

  // fetching all services
  useEffect(() => {
    const loadRequirements = async () => {
      setLoadingServices(true);
      let unSub;
      if (queryCategory === "All") {
        unSub = onSnapshot(localServicesCollection, (result) => {
          const list = result.docs.map((doc) => doc.data());
          if (list?.length > 0) {
            setLocalServices(list);
            setLoadingServices(false);
          } else {
            setLocalServices([]);

            setLoadingServices(false);
          }
        });
      } else {
        let q = query(
          localServicesCollection,
          where("serviceCategory", "==", queryCategory)
        );
        unSub = onSnapshot(q, (result) => {
          const list = result.docs.map((doc) => doc.data());

          if (list?.length > 0) {
            console.log(list);
            setLocalServices(list);
            setLoadingServices(false);
          } else {
            setLocalServices([]);
            setLoadingServices(false);
          }
        });
      }

      return () => {
        unSub();
      };
    };

    (isAdmin || isSubAdmin) && loadRequirements();
  }, [isAdmin, isSubAdmin, queryCategory]);

  const columns = [
    { id: "serviceName", label: "Service\u00a0Name", width: 100 },
    {
      id: "phoneNumber",
      label: "Phone\u00a0Number",
      width: 100,
    },
    {
      id: "serviceArea",
      label: "Service Area",
      width: 100,
    },
    {
      id: "serviceProvider",
      label: "Service Provider",
      width: 100,
    },
    {
      id: "serviceCategory",
      label: "Service Category",
      width: 100,
    },
    {
      id: "action",
      label: "Action",
      width: 50,
    },
  ];

  // creating single row
  function createData(
    serviceName,
    phoneNumber,
    serviceArea,
    serviceCategory,
    serviceProvider,
    providerUid,
    id
  ) {
    return {
      serviceName,
      phoneNumber,
      serviceArea,
      serviceCategory,
      serviceProvider,
      providerUid,
      id,
    };
  }

  // calling createData function with partner's data
  const rows = matchedServices?.map((service) => {
    return createData(
      service.serviceName,
      service.phoneNumber,
      service.serviceArea,
      service.serviceCategory,
      service.serviceProvider,
      service.providerUid,
      service.id
    );
  });

  /* =============================================================
              serach functionalities start
  =============================================================*/
  const handleSearchByTitle = (text) => {
    const matchingObjects = localServices.filter((item) =>
      item.serviceName.toLowerCase().includes(text.toLowerCase())
    );
    setMatchedServices(matchingObjects);
  };

  const handleSearchByServiceArea = (text) => {
    const matchingObjects = localServices.filter((item) =>
      item.serviceArea.toLowerCase().includes(text.toLowerCase())
    );

    setMatchedServices(matchingObjects);
  };

  const handleSearchByName = (text) => {
    const matchingObjects = localServices.filter((item) =>
      item.serviceProvider.toLowerCase().includes(text.toLowerCase())
    );

    setMatchedServices(matchingObjects);
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
              Add requirement functionalities start
  =============================================================*/
  // opening AddRequirementModal the modal while cliking on right sign icon
  const handleOpenAddRequirementModal = async (id, serviceName) => {
    setError("");
    const data = await getDoc(doc(partnersCollection, id));
    setPartnerDetails(data.data());
    setOpenAddRequirementModal(true);
    setServiceName(serviceName);
  };

  // storing the requrement in the database
  const handleAddRequirement = async (e) => {
    e.preventDefault();
    setError("");

    const requirementTitle = e.target.requirementTitle.value;
    const requirementText = e.target.requirementText.value;
    const locationName = e.target.locationName.value;
    const locationURL = e.target.locationURL.value;
    const clientName = e.target.clientName.value;
    const clientNumber = e.target.clientNumber.value;

    if (requirementTitle?.length < 5) {
      return setError("Invalid Requirement Title");
    } else if (requirementText?.length < 10) {
      return setError("Invalid Requirement Text");
    } else if (!clientName) {
      return setError("Client Name is required");
    } else if (!clientNumber) {
      return setError("Client Number is required");
    }

    // todo: add service area and location url
    const id = uuid();
    const date = new Date();

    const requirement = {
      id,
      date,
      providerUid: partnerDetails.uid,
      serviceCategory: partnerDetails.serviceCategory,
      serviceName,
      requirementTitle,
      requirementText,
      providerPhone: partnerDetails.personalInformation.phoneNumber,
      providerName: partnerDetails.personalInformation.fullName,
      isCompleted: false,
      isChecked: false,
      locationName,
      locationURL,
      clientName,
      clientNumber,
      comment: "",
    };

    await setDoc(doc(requirementsCollection, id), requirement).then(() => {
      setOpenAddRequirementModal(false);
      successNotification("Requirement is added successfully");
    });

    e.target.reset();
    setServiceName("");
  };
  /* =============================================================
              Add requirement functionalities end
  =============================================================*/

  // view service details modal
  const handleViewDetails = async (id) => {
    const res = await getDoc(doc(localServicesCollection, id));
    setServiceDetails(res.data());
    setOpenServiceDetailsModal(true);
  };

  const serviceCategories = [
    "All",
    "Official Work",
    "Legal Administrative",
    "Logistics and Transportation",
    "Order Local Sim",
    "Home Services",
    "Order Pick Up",
    "Others",
  ];

  // custom text field for common data
  const textField = (label, value, is12) => {
    return (
      <Grid item xs={12} sm={label === "Description" || is12 ? 12 : 6}>
        <div className="flex gap-2">
          <p>
            <span className="font-bold ">{label}: </span>
            <span className="text-slate-600">{value}</span>
          </p>
        </div>
      </Grid>
    );
  };

  return (
    <div>
      <PageHeading text="Local Services" />
      <div className="flex gap-2 flex-wrap mb-1">
        {serviceCategories.map((serviceCategory, i) => (
          <button
            key={i}
            onClick={() => setQueryCategory(serviceCategory)}
            className={` py-1 px-2 rounded ${
              queryCategory === serviceCategory
                ? "bg-[var(--primary-bg)] text-white"
                : "bg-gray-300"
            }`}
          >
            {serviceCategory}
          </button>
        ))}
      </div>
      <Grid container spacing={0.5} sx={{ mb: 2, mt: 2 }}>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            label="Search By Title"
            type="search"
            InputLabelProps={{ shrink: true }}
            placeholder="Requirement's Title"
            fullWidth
            onChange={(e) => handleSearchByTitle(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            label="Search By Service Area"
            type="search"
            InputLabelProps={{ shrink: true }}
            placeholder="Type Location"
            fullWidth
            onChange={(e) => handleSearchByServiceArea(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            label="Search By Provider's Name"
            type="search"
            placeholder="Provider's Name"
            fullWidth
            onChange={(e) => handleSearchByName(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            label="Search By Requirement Id"
            type="search"
            placeholder="Type Requirement Id"
            fullWidth
            onChange={(e) => handleSearchByServiceArea(e.target.value)}
          />
        </Grid>
      </Grid>
      <Paper sx={{ width: "100%", overflowX: "hidden" }}>
        <TableContainer sx={{ maxHeight: 440, maxWidth: "87vw" }}>
          {loadingServices ? (
            <LoadingContent />
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
                  ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  ?.map((row, i) => {
                    return (
                      <TableRow hover role="checkbox" tabIndex={-1} key={i}>
                        {columns.map((column) => {
                          let value = row[column.id];
                          return (
                            <TableCell key={column.id} align="center">
                              {(column.id === "action" && (
                                <div className="flex gap-1 items-center justify-center">
                                  <div
                                    onClick={() => handleViewDetails(row.id)}
                                    className="bg-[var(--primary-bg)] text-white p-1 rounded"
                                  >
                                    <ViewDetailsIcon title="View service details" />
                                  </div>
                                  <button
                                    onClick={() =>
                                      handleOpenAddRequirementModal(
                                        row.providerUid,
                                        row.serviceName
                                      )
                                    }
                                    className="bg-orange-400 text-white p-1 rounded ml-2"
                                  >
                                    <AddTaskIcon />
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

      {/* View service details modal */}
      <Dialog
        open={openServiceDetailsModal}
        onClose={() => setOpenServiceDetailsModal(false)}
        aria-labelledby="responsive-dialog-title"
      >
        <Box>
          <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
            {serviceDetails?.serviceName}
          </DialogTitle>
          <IconButton
            aria-label="close"
            onClick={() => setOpenServiceDetailsModal(false)}
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
            <ServiceCategoryBtn value={serviceDetails?.serviceCategory} />

            <Grid container spacing={2} sx={{ mb: 2, mt: 0.5 }}>
              {/* Service Provider Name */}
              {textField("Provider Name", serviceDetails?.serviceProvider)}

              {/* Service Area */}
              {textField("Service Area", serviceDetails?.serviceArea)}

              {/* Phone Number */}
              {textField("Phone Number", serviceDetails?.phoneNumber)}

              {/* Description */}
              {textField("Description", serviceDetails?.description, true)}

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
            {/* {error && <p className="text-red-500 text-center">{error}</p>} */}
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
              onClick={() => setOpenServiceDetailsModal(false)}
            >
              Close
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      {/* Add requirement modal */}
      <Dialog
        open={openAddRequirementModal}
        onClose={() => setOpenAddRequirementModal(false)}
        aria-labelledby="responsive-dialog-title"
      >
        <Box component="form" onSubmit={handleAddRequirement}>
          <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
            Add Requirement
          </DialogTitle>
          <IconButton
            aria-label="close"
            onClick={() => setOpenAddRequirementModal(false)}
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

            <p>
              You are giving the task to{" "}
              {partnerDetails?.personalInformation?.fullName}.
            </p>

            <Grid container spacing={2} sx={{ mb: 2, mt: 0.5 }}>
              {/* Requirement Title */}
              <Grid item xs={12}>
                <TextField
                  label="Requirement Title "
                  type="text"
                  name="requirementTitle"
                  InputLabelProps={{ shrink: true }}
                  placeholder="Give a relevant name for the Requirement."
                  fullWidth
                />
                {error.includes("Title") && (
                  <span className="text-red-500 text-sm">{error}</span>
                )}
              </Grid>

              {/* location */}
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Client location name"
                  type="text"
                  name="locationName"
                  InputLabelProps={{ shrink: true }}
                  placeholder="Type client location name"
                  fullWidth
                />
              </Grid>

              {/* location url */}
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Client location URL"
                  type="text"
                  name="locationURL"
                  InputLabelProps={{ shrink: true }}
                  placeholder="Give Client location URL"
                  fullWidth
                />
              </Grid>

              {/* Client's Name */}
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Client's Name"
                  type="text"
                  name="clientName"
                  InputLabelProps={{ shrink: true }}
                  placeholder="Client's Name"
                  fullWidth
                />
                {error.includes("Client Name") && (
                  <span className="text-red-500 text-sm">{error}</span>
                )}
              </Grid>

              {/* Client's Number */}
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Client's Number"
                  type="number"
                  name="clientNumber"
                  InputLabelProps={{ shrink: true }}
                  placeholder="Phone Number"
                  fullWidth
                />
                {error.includes("Client Number") && (
                  <span className="text-red-500 text-sm">{error}</span>
                )}
              </Grid>

              {/* Requirement Description */}
              <Grid item xs={12}>
                <TextField
                  label="Requirement Description"
                  type="text"
                  name="requirementText"
                  InputLabelProps={{ shrink: true }}
                  placeholder="Type the requirement in detail."
                  multiline
                  rows={3}
                  fullWidth
                />
                {error.includes("Text") && (
                  <span className="text-red-500 text-sm">{error}</span>
                )}
              </Grid>
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
            >
              Send
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </div>
  );
};

export default LocalServices;
