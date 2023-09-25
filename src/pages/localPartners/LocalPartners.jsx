import {
  arrayUnion,
  deleteDoc,
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import {
  // deleteUserFromAuth,
  partnersCollection,
  requirementsCollection,
  usersCollection,
} from "../../firebase/firebase.config";
import { useContext, useEffect, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
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
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import CloseIcon from "@mui/icons-material/Close";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import Loading from "../../components/Loading";
import { PartnerContext } from "../../contextAPIs/PartnerProvider";
import SubTitle from "../../components/SubTitle";
import AddTaskIcon from "@mui/icons-material/AddTask";
import { v4 as uuid } from "uuid";

const LocalPartners = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [viewDetailsModal, setViewDetailsModal] = useState(false); //Add service modal
  const [openAddRequirementModal, setOpenAddRequirementModal] = useState(false); // Add requirement modal
  const [partnerDetails, setPartnerDetails] = useState({});
  const [status, setStatus] = useState("Pending");
  const {
    partners,
    refetch,
    setRefetch,
    queryText,
    setQueryCategory,
    queryCategory,
    loadingPartnerData,
  } = useContext(PartnerContext);
  const [matchedPartners, setMatchedPartners] = useState([]);

  useEffect(() => {
    setMatchedPartners(partners);
  }, [partners]);

  // Partners table header
  const columns = [
    { id: "name", label: "Name", width: 70 },
    {
      id: "phoneNumber",
      label: "Phone\u00a0Number",
      width: 130,
    },
    {
      id: "serviceArea",
      label: "Service\u00a0Area",
      width: 170,
    },
    {
      id: "status",
      label: "Status",
      width: 100,
    },
    {
      id: "action",
      label: "Action",
      width: 120,
    },
  ];

  // creating single row
  function createData(name, phoneNumber, serviceArea, status, id) {
    return { name, phoneNumber, serviceArea, status, id };
  }

  // calling createData function with partner's data
  const rows = matchedPartners.map((partner) => {
    return createData(
      partner.personalInformation.fullName,
      partner.personalInformation.phoneNumber,
      partner.serviceInformation.serviceArea,
      partner.status,
      partner.uid
    );
  });

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleClose = () => {
    setViewDetailsModal(false);
  };

  const handleViewDetails = async (id) => {
    setViewDetailsModal(true); //opening the modal
    const query = doc(partnersCollection, id);
    const data = await getDoc(query);

    setPartnerDetails(data.data());
  };

  const handleChangeStatus = async (id) => {
    handleClose();

    const updatedStatus = { status: status };

    await updateDoc(doc(partnersCollection, id), updatedStatus);
    await updateDoc(doc(usersCollection, id), updatedStatus);
    setRefetch(!refetch);

    setPartnerDetails({});

    setStatus("Pending");
  };

  const handleDelete = async (id) => {
    await deleteDoc(doc(partnersCollection, id)); // deleting partner data from partners collection
    await deleteDoc(doc(usersCollection, id)); // deleting partner data from user's collection
    // await deleteUserFromAuth({ uid: id }).then(() => console.log("deleted")); // deleting user account form authentication

    setRefetch(!refetch);
  };

  /* =============================================================
              serach functionalities start
  =============================================================*/
  const handleSearchByName = (text) => {
    const matchingObjects = partners.filter((item) =>
      item.personalInformation.fullName
        .toLowerCase()
        .includes(text.toLowerCase())
    );

    /* const matchingObjects = partners.filter((item) =>
      item.serviceInformation.servicesOffered.some((service) =>
        service.toLowerCase().includes(text.toLowerCase())
      )
    ); */

    setMatchedPartners(matchingObjects);
  };

  const handleSearchByServiceArea = (text) => {
    const matchingObjects = partners.filter((item) =>
      item.serviceInformation.serviceArea
        .toLowerCase()
        .includes(text.toLowerCase())
    );

    setMatchedPartners(matchingObjects);
  };
  /* =============================================================
              serach functionalities end
  =============================================================*/

  /* =============================================================
              Add requirement functionalities start
  =============================================================*/
  // opening AddRequirementModal the modal while cliking on right sign icon
  const handleOpenAddRequirementModal = async (id) => {
    const data = await getDoc(doc(partnersCollection, id));
    setPartnerDetails(data.data());

    setOpenAddRequirementModal(true);
  };

  // storing the requrement in the database
  const handleAddRequirement = async (e) => {
    e.preventDefault();

    const requirementTitle = e.target.requirementTitle.value;
    const requirementText = e.target.requirementText.value;

    const id = uuid();
    const requirment = {
      id,
      providerUid: partnerDetails.uid,
      serviceCategory: partnerDetails.serviceCategory,
      requirementTitle,
      requirementText,
      providerPhone: partnerDetails.personalInformation.phoneNumber,
      isCompleted: false,
      isChecked: false,
      comment: "",
    };

    await setDoc(doc(requirementsCollection, id), requirment).then(() =>
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

  const loadingContent = (
    <div className="md:h-[40vh] w-full flex items-center justify-center">
      <Loading />
    </div>
  );

  return (
    <div className="overflow-x-hidden">
      <Grid container spacing={0.5} sx={{ mb: 2, mt: 0.5 }}>
        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth>
            <InputLabel id="service-category-label">
              Service Category
            </InputLabel>
            <Select
              labelId="service-category-label"
              label="Service Category"
              defaultValue="Others"
              onChange={(e) => setQueryCategory(e.target.value)}
            >
              <MenuItem value="Official Work">Official Work</MenuItem>
              <MenuItem value="Legal Administrative">
                Legal Administrative
              </MenuItem>
              <MenuItem value="Logistics and Transportation">
                Logistics and Transportation
              </MenuItem>
              <MenuItem value="Order Local Sim">Order Local Sim</MenuItem>
              <MenuItem value="Home Services">Home Services</MenuItem>
              <MenuItem value="Order Pick Up">Order Pick Up</MenuItem>
              <MenuItem value="Others">Others</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            label="Search By Partner's Name"
            type="search"
            placeholder="Partner's Name"
            fullWidth
            defaultValue=""
            onChange={(e) => handleSearchByName(e.target.value)}
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
      </Grid>

      <p className="my-2 font-bold">
        {matchedPartners.length + " " + queryText} partners available at{" "}
        <span className="text-[blue]"> {queryCategory} </span>
        category
      </p>
      <Paper sx={{ width: "100%", overflowX: "hidden" }}>
        <TableContainer sx={{ maxHeight: 440, maxWidth: "87vw" }}>
          {loadingPartnerData ? (
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
                          const value = row[column.id];
                          return (
                            <TableCell key={column.id} align="center">
                              {((value === "Pending" ||
                                value === "Verified" ||
                                value === "Denied") && (
                                <span
                                  className={`${
                                    (value === "Pending" &&
                                      "bg-orange-300 text-black") ||
                                    (value === "Verified" && "bg-green-500") ||
                                    (value === "Denied" && "bg-red-600")
                                  } text-white  py-1 px-2 rounded`}
                                >
                                  {value}
                                </span>
                              )) ||
                                (column.id === "action" && (
                                  <>
                                    <button
                                      onClick={() => handleViewDetails(row.id)}
                                      className="bg-[blue] text-white p-1 rounded"
                                    >
                                      <RemoveRedEyeIcon />
                                    </button>
                                    {queryText === "Verified" && (
                                      <button
                                        onClick={() =>
                                          handleOpenAddRequirementModal(row.id)
                                        }
                                        className="bg-orange-400 text-white p-1 rounded ml-2"
                                      >
                                        <AddTaskIcon />
                                      </button>
                                    )}
                                    {queryText === "Denied" && (
                                      <button
                                        onClick={() => handleDelete(row.id)}
                                        className="bg-red-600 text-white p-1 rounded ml-2"
                                      >
                                        <DeleteForeverIcon />
                                      </button>
                                    )}
                                  </>
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

      {/* modal  */}

      <Dialog
        open={viewDetailsModal}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          Name: {partnerDetails?.personalInformation?.fullName}
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleClose}
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
        <DialogContent dividers sx={{ p: { xs: 2, md: 4 } }}>
          <div className="flex justify-between">
            <Typography variant="div">
              <span className="font-bold">Category : </span>{" "}
              <span className="bg-[blue] text-white font-bold py-1 px-2 rounded inline-block">
                {partnerDetails.serviceCategory}
              </span>
            </Typography>

            <img
              src={partnerDetails?.personalInformation?.photoURL}
              alt=""
              className="w-32 h-32 border-2 border-blue-500"
            />
          </div>

          {/* Personal Information */}
          <SubTitle text=" Personal Information" />

          <Divider />
          <Grid container spacing={0.5} sx={{ mb: 2, mt: 0.5 }}>
            <Grid item xs={12} sm={6} md={6}>
              <span className="font-bold">Email: </span>
              {partnerDetails?.personalInformation?.email}
            </Grid>
            <Grid item xs={12} sm={6} md={6}>
              <span className="font-bold">Phone Number: </span>{" "}
              {partnerDetails?.personalInformation?.phoneNumber}
            </Grid>
            <Grid item xs={12} sm={6} md={6}>
              <span className="font-bold">Address: </span>
              {partnerDetails?.personalInformation?.address}
            </Grid>
          </Grid>

          {/* Service Information */}
          <SubTitle text="Service Information" />

          <Divider />
          <Grid container spacing={0.5} sx={{ mb: 2, mt: 0.5 }}>
            <Grid item xs={12} sm={6} md={6}>
              <span className="font-bold">Service Area :</span>{" "}
              {partnerDetails?.serviceInformation?.serviceArea}
            </Grid>
            {(partnerDetails.serviceCategory === "Legal Administrative" ||
              partnerDetails.serviceCategory === "Official Work") && (
              <Grid item xs={12} sm={6} md={6}>
                <span className="font-bold">Education : </span>
                {partnerDetails?.serviceInformation?.educationalBackground}
              </Grid>
            )}
            {(partnerDetails.serviceCategory === "Legal Administrative" ||
              partnerDetails.serviceCategory === "Official Work") && (
              <Grid item xs={12} sm={6} md={6}>
                <span className="font-bold">Experience: </span>
                {partnerDetails?.serviceInformation?.experienceYears} years
              </Grid>
            )}
            {(partnerDetails.serviceCategory ===
              "Logistics and Transportation" ||
              partnerDetails.serviceCategory === "Order Pick Up") && (
              <Grid item xs={12} sm={6} md={6}>
                <span className="font-bold">Number of Vehicles : </span>
                {partnerDetails?.serviceInformation?.numberOfVehicles}
              </Grid>
            )}
          </Grid>

          {/* Payment Information */}
          <SubTitle text="Payment Information" />

          <Grid container spacing={0.5} sx={{ mb: 2, mt: 0.5 }}>
            <Grid item xs={12} sm={6} md={6}>
              <span className="font-bold"> Bank Name : </span>
              {partnerDetails?.paymentInformation?.bankName}
            </Grid>
            <Grid item xs={12} sm={6} md={6}>
              <span className="font-bold"> Account Number : </span>
              {partnerDetails?.paymentInformation?.accountNumber}
            </Grid>
            <Grid item xs={12} sm={6} md={6}>
              <span className="font-bold"> Bank Location: </span>
              {partnerDetails?.paymentInformation?.bankAddress}
            </Grid>
          </Grid>

          {/* Permission */}
          <SubTitle text="Permission" />

          <Grid container spacing={2} sx={{ mb: 2, mt: 0.5 }}>
            <Grid item xs={12} sm={6} md={6}>
              <span className="font-bold ">Current Status : </span>{" "}
              <span
                className={`${
                  (partnerDetails?.status === "Pending" &&
                    "bg-orange-300 text-black") ||
                  (partnerDetails?.status === "Verified" && "bg-green-500") ||
                  (partnerDetails?.status === "Denied" && "bg-red-600")
                } text-white  py-1 px-2 rounded`}
              >
                {partnerDetails?.status}
              </span>
            </Grid>
            <Grid item xs={12} sm={6} md={6}>
              <FormControl fullWidth>
                <InputLabel id="status-label ">Change Status</InputLabel>
                <Select
                  labelId="status-label"
                  label="Change Status"
                  defaultValue="Pending"
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <MenuItem value="Pending">Pending</MenuItem>
                  <MenuItem value="Verified">Verified</MenuItem>
                  <MenuItem value="Denied">Denied</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            autoFocus
            sx={{ bgcolor: "blue", color: "white", hover: "none" }}
            onClick={() => handleChangeStatus(partnerDetails.uid)}
          >
            Save
          </Button>
        </DialogActions>
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

export default LocalPartners;
