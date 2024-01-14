import { useContext, useEffect, useState } from "react";
import PageHeading from "../../../../../components/PageHeading";
import { PartnerContext } from "../../../../../contextAPIs/PartnerProvider";
import {
  chatRoomsCollection,
  chatsCollection,
  hotelsCollection,
  usersCollection,
} from "../../../../../firebase/firebase.config";
import {
  deleteDoc,
  deleteField,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import {
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
} from "@mui/material";
import ViewDetailsIcon from "../../../../../components/ViewDetailsIcon";
import SubTitle from "../../../../../components/SubTitle";
import CloseIcon from "@mui/icons-material/Close";
import LoadingContent from "../../../../../components/LoadingContent";
import {
  askingForDelete,
  deleteNotification,
  item,
  successNotification,
} from "../../../../../utils/utils";
import StaticMap from "../../../../../components/StaticMap";
import DeleteButton from "../../../../../components/DeleteButton";
import { Link } from "react-router-dom";
import PersonIcon from "@mui/icons-material/Person";

const Hotels = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [viewDetailsModal, setViewDetailsModal] = useState(false); //Add service modal
  const [hotelDetails, setHotelDetails] = useState({ status: "" });
  const [status, setStatus] = useState("Pending");
  const { hotels, loadingPartnerData, setUid } = useContext(PartnerContext);
  const [matchedHotels, setMatchedHotels] = useState([]);

  useEffect(() => {
    setMatchedHotels(hotels);
  }, [hotels]);

  // Partners table header
  const columns = [
    { id: "hotelName", label: "Name", width: 120 },
    { id: "phoneNumber", label: "Phone Number", width: 130 },
    { id: "email", label: "Email", width: 80 },
    { id: "address", label: "Address", width: 100 },
    { id: "status", label: "Status", width: 100 },
    { id: "action", label: "Action", width: 120 },
  ];

  // creating single row
  function createData(
    hotelName,
    phoneNumber,
    email,
    address,
    status,
    uid,
    serviceCategory
  ) {
    return {
      hotelName,
      phoneNumber,
      email,
      address,
      status,
      uid,
      serviceCategory,
    };
  }

  // calling createData function with partner's data
  const rows = matchedHotels.map((hotel) => {
    return createData(
      hotel.hotelInformation?.hotelName,
      hotel.hotelInformation?.phoneNumber,
      hotel.hotelInformation?.email,
      hotel.hotelInformation?.address,
      hotel.status,
      hotel.uid,
      hotel.serviceCategory
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
    setHotelDetails({});
    setViewDetailsModal(false);
  };

  const handleViewDetails = async (id) => {
    const query = doc(hotelsCollection, id);
    const data = await getDoc(query);

    setHotelDetails(data.data());
    setStatus(data.data()?.status);
    setViewDetailsModal(true); //opening the modal
  };

  const handleDelete = async (id) => {
    askingForDelete().then(async (result) => {
      if (result.isConfirmed) {
        await deleteDoc(doc(hotelsCollection, id)).then(() => {
          deleteNotification("The Hotel is deleted successfully.");
        }); // deleting partner data from partners collection

        await updateDoc(doc(chatRoomsCollection, "HotelSupport"), {
          [id + "_HotelSupport"]: deleteField(),
        });
        await deleteDoc(doc(chatsCollection, id + "_HotelSupport"));

        await updateDoc(doc(usersCollection, id), {
          isSuspended: true,
        });
      }
    });
  };

  /* =============================================================
              serach functionalities start
  =============================================================*/
  const handleSearchByName = (text) => {
    const matchingObjects = hotels.filter((item) =>
      item.hotelInformation.hotelName.toLowerCase().includes(text.toLowerCase())
    );

    setMatchedHotels(matchingObjects);
  };

  const handleSearchByLocation = (text) => {
    const matchingObjects = hotels.filter((item) =>
      item.hotelInformation.address.toLowerCase().includes(text.toLowerCase())
    );

    setMatchedHotels(matchingObjects);
  };
  /* =============================================================
              serach functionalities end
  =============================================================*/

  // changing the status
  const handleChangeStatus = async (id) => {
    handleClose();
    const updatedStatus = { status: status };

    await updateDoc(doc(hotelsCollection, id), updatedStatus);
    await updateDoc(doc(usersCollection, id), updatedStatus).then(async () => {
      successNotification("Status is changed successfully");
    });
    setHotelDetails({});
    setStatus("Pending");
  };

  return (
    <div className="overflow-x-hidden">
      <PageHeading text="Hotels" />
      <Grid container spacing={0.5} sx={{ mb: 2, mt: 0.5 }}>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            label="Search By Hotel Name"
            type="search"
            placeholder="Hotel Name"
            fullWidth
            defaultValue=""
            onChange={(e) => handleSearchByName(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            label="Search By Address"
            type="search"
            placeholder="Type Address"
            fullWidth
            defaultValue=""
            onChange={(e) => handleSearchByLocation(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          <div className="text-right md:pr-10 mb-4 flex items-center justify-end h-full">
            <Link
              to="/hotel-onboarding"
              target="_blank"
              className="add-new-btn"
            >
              Add New Hotel
            </Link>
          </div>
        </Grid>
      </Grid>

      <Paper sx={{ width: "100%", overflowX: "hidden" }}>
        <TableContainer sx={{ maxHeight: 440, maxWidth: "87vw" }}>
          {loadingPartnerData ? (
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
                                  <div className="flex items-center justify-center gap-1">
                                    <div
                                      onClick={() => handleViewDetails(row.uid)}
                                    >
                                      <ViewDetailsIcon title="View hotel's info" />
                                    </div>
                                    <Link
                                      to={`/dashboard/profile/${row.serviceCategory}/${row.uid}`}
                                      onClick={() => setUid(row.uid)}
                                    >
                                      <button className="bg-slate-300 p-1 rounded ml-2">
                                        <PersonIcon />
                                      </button>
                                    </Link>

                                    {row["status"] === "Denied" && (
                                      <div
                                        onClick={() => handleDelete(row.uid)}
                                      >
                                        <DeleteButton title="Delete hotel" />
                                      </div>
                                    )}
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

      {/* modal  */}
      <Dialog
        open={viewDetailsModal}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          Name: {hotelDetails?.hotelInformation?.hotelName}
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
          <Grid container spacing={0.5} sx={{ mb: 2, mt: 0.5 }}>
            <Grid item xs={12} sm={6}>
              <div className="flex justify-between">
                <img
                  src={hotelDetails?.hotelInformation?.logoURL}
                  alt=""
                  className="w-36 h-36 mx-auto rounded-full border-2 border-[var(--primary-bg)]"
                />
              </div>
            </Grid>
            <Grid item xs={12} sm={6}>
              {/* Driver Information */}
              <SubTitle text="Hotel Information" />
              <Divider />
              <Grid container spacing={0.5} sx={{ mb: 2, mt: 0.5 }}>
                {item("Email", hotelDetails?.hotelInformation?.email, true)}
                {item(
                  "Phone Number",
                  hotelDetails?.hotelInformation?.phoneNumber,
                  true
                )}
                {item("Address", hotelDetails?.hotelInformation?.address, true)}
              </Grid>
            </Grid>
          </Grid>

          {/* Payment Information */}
          <SubTitle text="Payment Information" />
          <Divider />
          <Grid container spacing={0.5} sx={{ mb: 2, mt: 0.5 }}>
            {item("Bank Name", hotelDetails?.paymentInformation?.bankName)}
            {item(
              "Account Number",
              hotelDetails?.paymentInformation?.accountNumber
            )}
            {item(
              "Bank Location",
              hotelDetails?.paymentInformation?.bankAddress
            )}
          </Grid>

          <div>
            <h4 className="font-bold">Hotel Location: </h4>
            <StaticMap location={hotelDetails?.hotelInformation?.location} />
          </div>

          <div>
            <span className="font-bold"> Hotel License: </span>
            <img
              src={hotelDetails?.hotelInformation?.license}
              alt=""
              className="sm:w-3/4 w-full sm:h-60 mx-auto"
            />
          </div>

          <Grid container spacing={2} sx={{ mb: 2, mt: 0.5 }}>
            <Grid item xs={12} sm={6} md={6}>
              <span className="font-bold ">Current Status : </span>{" "}
              <span
                className={`${
                  (hotelDetails?.status === "Pending" &&
                    "bg-orange-300 text-black") ||
                  (hotelDetails?.status === "Verified" && "bg-green-500") ||
                  (hotelDetails?.status === "Denied" && "bg-red-600")
                } text-white  py-1 px-2 rounded`}
              >
                {hotelDetails?.status}
              </span>
            </Grid>
            <Grid item xs={12} sm={6} md={6}>
              <FormControl fullWidth>
                <InputLabel id="status-label ">Change Status</InputLabel>
                <Select
                  labelId="status-label"
                  label="Change Status"
                  defaultValue={
                    hotelDetails?.status ? hotelDetails?.status : status
                  }
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
            sx={{ bgcolor: "var(--primary-bg)", color: "white", hover: "none" }}
            onClick={() => handleChangeStatus(hotelDetails.uid)}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Hotels;
