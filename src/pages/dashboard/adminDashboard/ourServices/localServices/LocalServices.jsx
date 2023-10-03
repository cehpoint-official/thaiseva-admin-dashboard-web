import { useContext, useState } from "react";
import PageHeading from "../../../../../components/PageHeading";
import { useEffect } from "react";
import {
  arrayUnion,
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
  requirementsCollection,
} from "../../../../../firebase/firebase.config";
import { AuthContext } from "../../../../../contextAPIs/AuthProvider";
import ViewDetailsIcon from "./../../../../../components/ViewDetailsIcon";
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
  Typography,
} from "@mui/material";
import Loading from "../../../../../components/Loading";
import { v4 as uuid } from "uuid";

const LocalServices = () => {
  const { isAdmin } = useContext(AuthContext);
  const [localServices, setLocalServices] = useState([]);
  const [queryCategory, setQueryCategory] = useState("All");
  const [matchedServices, setMatchedServices] = useState([]);
  const [loadingServices, setLoadingServices] = useState(false);
  const [partnerDetails, setPartnerDetails] = useState({});
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  // const [searchText, setSearchText] = useState("");
  const [openAddRequirementModal, setOpenAddRequirementModal] = useState(false); // Add requirement modal

  useEffect(() => {
    setMatchedServices(localServices);
  }, [localServices]);

  // fetching all services
  useEffect(() => {
    const loadRequirements = async () => {
      setLoadingServices(true);
      let snapshot;

      if (queryCategory === "All") {
        snapshot = await getDocs(localServicesCollection);
      } else {
        snapshot = await getDocs(
          query(
            localServicesCollection,
            where("serviceCategory", "==", queryCategory)
          )
        );
      }

      const list = snapshot.docs.map((doc) => doc.data());
      setLocalServices(list);
      setLoadingServices(false);
    };

    isAdmin && loadRequirements();
  }, [isAdmin, queryCategory]);

  const columns = [
    { id: "serviceName", label: "Service\u00a0Name", width: 100 },
    {
      id: "phoneNumber",
      label: "Phone\u00a0Number",
      width: 100,
    },
    {
      id: "serviceCategory",
      label: "Service\u00a0Category",
      width: 100,
    },
    {
      id: "serviceProvider",
      label: "Service Provider",
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
    serviceCategory,
    serviceProvider,
    providerUid,
    id
  ) {
    return {
      serviceName,
      phoneNumber,
      serviceCategory,
      serviceProvider,
      providerUid,
      id,
    };
  }

  // calling createData function with partner's data
  const rows = matchedServices.map((service) => {
    return createData(
      service.serviceName,
      service.phoneNumber,
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

  const handleSearchByPhone = (text) => {
    const matchingObjects = localServices.filter((item) =>
      item.providerPhone.includes(text)
    );

    setMatchedServices(matchingObjects);
  };
  /* =============================================================
              serach functionalities end
  =============================================================*/

  const handleViewDetails = async (id) => {
    const res = await getDoc(doc(localServices, id));
    console.log(res.data());
  };

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
  const handleOpenAddRequirementModal = async (id) => {
    const data = await getDoc(doc(partnersCollection, id));
    setPartnerDetails(data.data());
    console.log(data.data());
    setOpenAddRequirementModal(true);
  };

  // storing the requrement in the database
  const handleAddRequirement = async (e) => {
    e.preventDefault();

    const requirementTitle = e.target.requirementTitle.value;
    const requirementText = e.target.requirementText.value;
    const locationName = e.target.locationName.value;
    const locationURL = e.target.locationURL.value;
    // todo: add service area and location url
    const id = uuid();
    const requirement = {
      id,
      providerUid: partnerDetails.uid,
      serviceCategory: partnerDetails.serviceCategory,
      requirementTitle,
      requirementText,
      providerPhone: partnerDetails.personalInformation.phoneNumber,
      isCompleted: false,
      isChecked: false,
      locationName,
      locationURL,
      comment: "",
    };

    await setDoc(doc(requirementsCollection, id), requirement).then(() =>
      console.log("requirement added successfully")
    );
    await updateDoc(doc(partnersCollection, partnerDetails.uid), {
      requirements: arrayUnion({ id }),
    }).then(() => console.log("added to partner's details"));

    e.target.reset();
  };
  /* =============================================================
              Add requirement functionalities end
  =============================================================*/
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

  const loadingContent = (
    <div className="md:h-[40vh] w-full flex items-center justify-center">
      <Loading />
    </div>
  );

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
                ? "bg-[blue] text-white"
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
            placeholder="Requirement's Title"
            fullWidth
            defaultValue=""
            onChange={(e) => handleSearchByTitle(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          {" "}
          <TextField
            label="Search By Service Area"
            type="search"
            placeholder="Type Location"
            fullWidth
            defaultValue=""
            onChange={(e) => handleSearchByServiceArea(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          {" "}
          <TextField
            label="Search By Provider's Phone"
            type="search"
            placeholder="Provider's Phone"
            fullWidth
            defaultValue=""
            onChange={(e) => handleSearchByPhone(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          {" "}
          <TextField
            label="Search By Requirement Id"
            type="search"
            placeholder="Type Requirement Id"
            fullWidth
            defaultValue=""
            onChange={(e) => handleSearchByServiceArea(e.target.value)}
          />
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
                                    onClick={() => handleViewDetails(row.id)}
                                    className="bg-[blue] text-white p-1 rounded"
                                  >
                                    <ViewDetailsIcon />
                                  </div>
                                  <button
                                    onClick={() =>
                                      handleOpenAddRequirementModal(
                                        row.providerUid
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
            <Typography variant="div">
              <span className="font-bold">Category : </span>{" "}
              <span className="bg-[blue] text-white font-bold py-1 px-2 rounded inline-block">
                {partnerDetails.serviceCategory}
              </span>
            </Typography>

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
                  placeholder="Give a relevant name for the Requirement."
                  defaultValue=""
                  fullWidth
                />
              </Grid>

              {/* location */}
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Client location name"
                  type="text"
                  name="locationName"
                  placeholder="Type client location name"
                  defaultValue=""
                  fullWidth
                />
              </Grid>

              {/* location url */}
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Client location URL"
                  type="url"
                  name="locationURL"
                  placeholder="Give Client location URL"
                  defaultValue=""
                  fullWidth
                />
              </Grid>

              {/* Requirement Description */}
              <Grid item xs={12}>
                <TextField
                  label="Requirement Description"
                  type="text"
                  name="requirementText"
                  placeholder="Type the requirement in detail."
                  defaultValue=""
                  multiline
                  rows={3}
                  fullWidth
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button
              variant="contained"
              type="submit"
              autoFocus
              sx={{ bgcolor: "blue", color: "white", hover: "none" }}
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
