import { useContext, useState } from "react";
import PageHeading from "../../../../../components/PageHeading";
import { useEffect } from "react";
import {
  Timestamp,
  arrayUnion,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import {
  driversCollection,
  partnersCollection,
  requirementsCollection,
  travelRequirementsCollection,
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
import AddRequirementIcon from "../../../../../components/AddRequirementIcon";

const TravelSErvices = () => {
  const { isAdmin } = useContext(AuthContext);
  const [drivers, setDrivers] = useState([]);
  const [matchedDrivers, setMatchedDrivers] = useState([]);
  const [loadingServices, setLoadingServices] = useState(false);
  const [partnerDetails, setPartnerDetails] = useState({});
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  // const [searchText, setSearchText] = useState("");
  const [openAddRequirementModal, setOpenAddRequirementModal] = useState(false); // Add requirement modal

  useEffect(() => {
    setMatchedDrivers(drivers);
  }, [drivers]);

  // fetching all services
  useEffect(() => {
    const loadDrivers = async () => {
      setLoadingServices(true);
      let snapshot = await getDocs(
        query(driversCollection, where("status", "==", "Verified"))
      );

      const list = snapshot.docs.map((doc) => doc.data());
      setDrivers(list);
      setLoadingServices(false);
    };

    isAdmin && loadDrivers();
  }, [isAdmin]);

  const columns = [
    { id: "fullName", label: "Driver's\u00a0Name", width: 100 },
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
      id: "action",
      label: "Action",
      width: 50,
    },
  ];

  // creating single row
  function createData(fullName, phoneNumber, serviceArea, providerUid) {
    return { fullName, phoneNumber, serviceArea, providerUid };
  }

  // calling createData function with driver's data
  const rows = matchedDrivers.map((driver) => {
    return createData(
      driver.driverInformation.fullName,
      driver.driverInformation.phoneNumber,
      driver.serviceArea,
      driver.uid
    );
  });

  /* =============================================================
              serach functionalities start
  =============================================================*/
  const handleSearchByDriverName = (text) => {
    const matchingObjects = drivers.filter((item) =>
      item.driverInformation.fullName.toLowerCase().includes(text.toLowerCase())
    );
    setMatchedDrivers(matchingObjects);
  };

  const handleSearchByServiceArea = (text) => {
    const matchingObjects = drivers.filter((item) =>
      item.serviceArea.toLowerCase().includes(text.toLowerCase())
    );

    setMatchedDrivers(matchingObjects);
  };

  const handleSearchByPhone = (text) => {
    const matchingObjects = drivers.filter((item) =>
      item.driverInformation.phoneNumber.includes(text)
    );

    setMatchedDrivers(matchingObjects);
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
  const handleOpenAddRequirementModal = async (id) => {
    const data = await getDoc(doc(driversCollection, id));
    setPartnerDetails(data.data());
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
      providerPhone: partnerDetails.driverInformation.phoneNumber,
      isCompleted: false,
      isChecked: false,
      locationName,
      locationURL,
      date: Timestamp.now(),
      comment: "",
    };

    // console.log(new Date(requirement.date.seconds * 1000));

    await setDoc(doc(travelRequirementsCollection, id), requirement).then(() =>
      console.log("requirement added successfully")
    );
    await updateDoc(doc(driversCollection, partnerDetails.uid), {
      requirements: arrayUnion({ id }),
    }).then(() => console.log("added to partner's details"));

    e.target.reset();
  };
  /* =============================================================
              Add requirement functionalities end
  =============================================================*/

  const loadingContent = (
    <div className="md:h-[40vh] w-full flex items-center justify-center">
      <Loading />
    </div>
  );

  return (
    <div>
      <PageHeading text="Travel Services" />

      <Grid container spacing={0.5} sx={{ mb: 2, mt: 2 }}>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            label="Search By Title"
            type="search"
            placeholder="Requirement's Title"
            fullWidth
            defaultValue=""
            onChange={(e) => handleSearchByDriverName(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            label="Search By Driver's Phone"
            type="search"
            placeholder="Driver's Phone"
            fullWidth
            defaultValue=""
            onChange={(e) => handleSearchByPhone(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
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
                                    onClick={() =>
                                      handleOpenAddRequirementModal(
                                        row.providerUid
                                      )
                                    }
                                  >
                                    <AddRequirementIcon />
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
              <span className="font-bold">Category : </span>
              <span className="bg-[blue] text-white font-bold py-1 px-2 rounded inline-block">
                {partnerDetails?.serviceCategory}
              </span>
            </Typography>

            <p>
              You are giving the task to
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

export default TravelSErvices;
