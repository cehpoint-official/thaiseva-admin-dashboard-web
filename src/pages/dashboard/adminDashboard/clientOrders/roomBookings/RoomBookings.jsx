import { useContext } from "react";
import { useState } from "react";
import { useEffect } from "react";
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
  TablePagination,
} from "@mui/material";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import CheckBoxIcon from "@mui/icons-material/CheckBox";

import { deleteDoc, doc, getDoc } from "firebase/firestore";
import {
  askingForDelete,
  calculateDiscountPrice,
  deleteNotification,
} from "../../../../../utils/utils";
import ViewDetailsIcon from "../../../../../components/ViewDetailsIcon";
import {
  roomBookingCollection,
  hotelPackageDetails,
} from "../../../../../firebase/firebase.config";
import { PartnerContext } from "../../../../../contextAPIs/PartnerProvider";
import PageHeading from "../../../../../components/PageHeading";
import { format } from "timeago.js";
import LoadingContent from "../../../../../components/LoadingContent";

const RoomBookings = () => {
  const {
    roomBookings,
    setRefetch,
    loadingData,
    setPage,
    setRowsPerPage,
    page,
    rowsPerPage,
  } = useContext(PartnerContext);
  const [matchedBookings, setMatchedBookings] = useState([]);
  const [openPackageDetailsModal, setOpenPackageDetailsModal] = useState(false);
  const [openBookingDetailsModal, setOpenBookingDetailsModal] = useState(false);
  const [bookingDetails, setBookingDetails] = useState({});
  const [packageDetails, setPackageDetailss] = useState({});

  useEffect(() => {
    const compare = (a, b) => {
      return a.status - b.status;
    };

    const sortedBookings = roomBookings.sort(compare);
    setMatchedBookings(sortedBookings);
  }, [roomBookings]);

  // Bookings table header
  let columns = [
    { property: "name", label: "Guest Name", width: 130 },
    { property: "phone", label: "Phone", width: 50 },
    { property: "noOfRooms", label: "Room Quantity", width: 100 },
    { property: "orderedAt", label: "Ordered At", width: 50 },
    { property: "roomNumbers", label: "Room Numbers", width: 100 },
    { property: "status", label: "Status", width: 50 },
    { property: "action", label: "Action", width: 120 },
  ];

  // creating single row
  function createData(
    name,
    phone,
    noOfRooms,
    orderedAt,
    roomNumbers,
    status,
    packageId,
    bookingId
  ) {
    return {
      name,
      phone,
      noOfRooms,
      orderedAt,
      roomNumbers,
      status,
      packageId,
      bookingId,
    };
  }

  // calling createData function with partner's data
  const rows = matchedBookings?.map((booking) => {
    return createData(
      booking?.guestDetails?.name,
      booking?.guestDetails?.phone,
      booking.noOfRooms,
      booking.orderedAt,
      booking.roomNumbers,
      booking.status,
      booking.id,
      booking.bookingId
    );
  });

  // setting booking details to the state
  const handleViewBookingDetails = async (id) => {
    const snapshot = await getDoc(doc(roomBookingCollection, id));
    if (snapshot.exists()) {
      const existingData = snapshot.data();
      setBookingDetails(existingData);
      setOpenBookingDetailsModal(true);
    }
  };

  // setting package details to the state
  const handleViewPackageDetails = async (id) => {
    const snapshot = await getDoc(doc(hotelPackageDetails, id));
    if (snapshot.exists()) {
      const existingData = snapshot.data();
      setPackageDetailss(existingData);
      setOpenPackageDetailsModal(true);
    }
  };

  // delete canceled booking
  const handleDelete = (id) => {
    askingForDelete().then(async (result) => {
      if (result.isConfirmed) {
        await deleteDoc(doc(roomBookingCollection, id)).then(() => {
          setRefetch((p) => !p);
          deleteNotification("The booking is deleted successfully.");
        });
      }
    });
  };

  // custom text field for common data
  const textField = (label, value, is12) => {
    return (
      <Grid item xs={12} sm={label === "Description" || is12 ? 12 : 6}>
        <div className="flex gap-2">
          <p>
            <span className="font-bold">{label}: </span>
            {label.includes("Price") && "$"}
            {value}
            {label === "Discount" && "%"}
          </p>
        </div>
      </Grid>
    );
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <div>
      <PageHeading text="All Room Bookings" />
      <span>{matchedBookings?.length}</span>
      <Paper sx={{ width: "100%", overflowX: "hidden" }}>
        <TableContainer sx={{ maxHeight: 440, maxWidth: "87vw" }}>
          {loadingData ? (
            <LoadingContent />
          ) : (
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell
                      key={column.property}
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
                {rows.map((row, i) => {
                  return (
                    <TableRow hover role="checkbox" tabIndex={-1} key={i}>
                      {columns.map((column) => {
                        const value = row[column.property];

                        const date = new Date(
                          row["orderedAt"]?.seconds * 1000 +
                            row["orderedAt"]?.nanoseconds / 1000000
                        );
                        return (
                          <TableCell key={column.property} align="center">
                            {(column.property === "status" && (
                              <span
                                className={`${
                                  (value === 1 && "bg-orange-300 text-black") ||
                                  (value === 2 && "bg-green-500") ||
                                  (value === 3 && "bg-red-600")
                                } text-white  py-1 px-2 rounded`}
                              >
                                {(value == 1 && "Pending") ||
                                  (value == 2 && "Accepted") ||
                                  (value == 3 && "Canceled")}
                              </span>
                            )) ||
                              (column.property === "orderedAt" &&
                                format(date)) ||
                              (column.property === "roomNumbers" && (
                                <div className="flex items-center justify-center flex-wrap gap-1">
                                  {value?.map((item, i) => (
                                    <span
                                      key={i}
                                      className="bg-[var(--primary-bg)] text-white p-1 rounded text-xs"
                                    >
                                      {item}
                                    </span>
                                  ))}
                                </div>
                              )) ||
                              (column.property === "action" && (
                                <div className="flex gap-1 justify-center">
                                  {row["status"] === 3 && (
                                    <button
                                      onClick={() => handleDelete(row.id)}
                                      className="bg-red-500 text-white p-1 rounded"
                                    >
                                      <DeleteForeverIcon />
                                    </button>
                                  )}
                                  {row["status"] !== 3 && (
                                    <button
                                      onClick={() =>
                                        handleViewBookingDetails(row.bookingId)
                                      }
                                      className="bg-green-500 text-white p-1 rounded ml-1"
                                    >
                                      <CheckBoxIcon />
                                    </button>
                                  )}

                                  <div
                                    onClick={() =>
                                      handleViewPackageDetails(row.packageId)
                                    }
                                  >
                                    <ViewDetailsIcon title="View Package Details" />
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

      {/* View Booking details and confirm booking modal */}
      <Dialog
        open={openBookingDetailsModal}
        onClose={() => setOpenBookingDetailsModal(false)}
        aria-labelledby="responsive-dialog-title"
      >
        <Box>
          <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
            Booking Details
          </DialogTitle>
          <IconButton
            aria-label="close"
            onClick={() => setOpenBookingDetailsModal(false)}
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
              {/* Guest Name */}
              {textField("Guest Name", bookingDetails?.guestDetails?.name)}

              {/* Guest Phone */}
              {textField("Guest Phone", bookingDetails?.guestDetails?.phone)}

              {/* Email */}
              {textField("Email", bookingDetails?.guestDetails?.email)}

              {/* Room Quantity */}
              {textField("Room Quantity", bookingDetails?.noOfRooms)}

              {/* Check In Date */}
              {textField("Check In", bookingDetails?.checkInDate)}

              {/* Check Out Date */}
              {textField("Check Out", bookingDetails?.checkOutDate)}

              {/* Manager's Number */}
              {bookingDetails?.managerPhone &&
                textField("Manager's Number", bookingDetails?.managerPhone)}
            </Grid>

            {/* manager information */}

            {bookingDetails?.roomNumbers && (
              <>
                <h3 className="font-bold text-center">Booked Rooms</h3>
                <div className="flex items-center justify-center w-full gap-3">
                  {bookingDetails?.roomNumbers?.map((item, i) => (
                    <div
                      key={i}
                      className="bg-[var(--primary-bg)] text-white py-1 px-2 rounded text-lg relative"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </>
            )}
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
              onClick={() => setOpenBookingDetailsModal(false)}
            >
              Close
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      {/* view package details modal */}
      <Dialog
        open={openPackageDetailsModal}
        onClose={() => setOpenPackageDetailsModal(false)}
        aria-labelledby="responsive-dialog-title"
      >
        <Box sx={{ lg: { width: "800" } }}>
          <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
            Package : {packageDetails?.packageName}
          </DialogTitle>
          <IconButton
            aria-label="close"
            onClick={() => setOpenPackageDetailsModal(false)}
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
              {/* Cover Photo */}
              <Grid item xs={12} sm={6}>
                {packageDetails && (
                  <img
                    src={packageDetails?.coverPhoto}
                    alt=""
                    className="h-44 w-full mx-auto rounded "
                  />
                )}
              </Grid>
              <Grid item xs={12} sm={6}>
                {textField("Package Name", packageDetails?.packageName, true)}
                {textField("Hotel Name", packageDetails?.name, true)}
                {textField("Phone", packageDetails?.phoneNumber, true)}
                {textField("Price", packageDetails?.price, true)}
                {/* Discount */}
                {textField("Discount", packageDetails?.discount, true)}
                {/* Discount Price*/}
                {textField(
                  "Discount Price",
                  calculateDiscountPrice(
                    packageDetails?.price,
                    packageDetails?.discount
                  ),
                  true
                )}
                {/* Number Of Guests */}
                {textField(
                  "Number Of Guests",
                  packageDetails?.numberOfGuests,
                  true
                )}

                {/* Period */}
                {textField("Period", packageDetails?.period, true)}
              </Grid>
            </Grid>
            <Grid container spacing={2} sx={{ mb: 2, mt: 0.5 }}>
              {/* Description */}
              {textField("Description", packageDetails?.description)}

              {/* Add Amenities */}
              <Grid item xs={12}>
                <h3 className="font-bold text-[var(--primary-bg)] border-b">
                  Amenities
                </h3>
                <div className="flex flex-wrap gap-1 text-sm my-2">
                  {packageDetails.amenities &&
                    packageDetails?.amenities?.map((amenity, i) => (
                      <span key={i} className="bg-gray-200 py-1 px-2 rounded">
                        {amenity}
                      </span>
                    ))}
                </div>
              </Grid>

              {/* Pictures */}
              <Grid item xs={12}>
                <h3 className="font-bold text-[var(--primary-bg)] border-b">
                  Room Pictures
                </h3>
                <div className="flex items-center justify-center">
                  <div className="grid sm:grid-cols-3 grid-cols-1 items-center justify-center gap-2 my-2">
                    {packageDetails.pictures?.map((picture, i) => (
                      <div key={i}>
                        <h4 className="text-lg">{picture?.label}</h4>
                        <img
                          src={picture?.url}
                          alt=""
                          className="h-36 sm:w-44 w-full rounded"
                        />
                      </div>
                    ))}
                  </div>
                </div>
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
              onClick={() => setOpenPackageDetailsModal(false)}
            >
              Close
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </div>
  );
};

export default RoomBookings;
