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
} from "@mui/material";
import PageHeading from "../../../../../components/PageHeading";
import { useEffect } from "react";
import { deleteDoc, doc, getDoc } from "firebase/firestore";
import {
  travelBookingCollection,
  travelServicesDetailsCollection,
} from "../../../../../firebase/firebase.config";
import {
  askingForDelete,
  calculateDiscountPrice,
  deleteNotification,
} from "../../../../../utils/utils";
import ViewDetailsIcon from "../../../../../components/ViewDetailsIcon";
import { format } from "timeago.js";
import LoadingContent from "../../../../../components/LoadingContent";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import { useContext } from "react";
import { useState } from "react";
import { PartnerContext } from "../../../../../contextAPIs/PartnerProvider";

const TravelBookings = () => {
  const { travelBookings, setRefetch, loadingData } =
    useContext(PartnerContext);
  const [matchedBookings, setMatchedBookings] = useState([]);
  const [openPackageDetailsModal, setOpenPackageDetailsModal] = useState(false);
  const [openBookingDetailsModal, setOpenBookingDetailsModal] = useState(false);
  const [bookingDetails, setBookingDetails] = useState({});
  const [packageDetails, setPackageDetailss] = useState({});

  useEffect(() => {
    setMatchedBookings(travelBookings);
  }, [travelBookings]);
  console.log(travelBookings);
  // Bookings table header
  let columns = [
    { property: "guestName", label: "Guest Name", width: 130 },
    { property: "phone", label: "Phone", width: 50 },
    { property: "packageTitle", label: "Package Title", width: 100 },
    { property: "orderedAt", label: "Ordered At", width: 50 },
    { property: "pickUp", label: "Pick Up Time", width: 100 },
    { property: "status", label: "Status", width: 50 },
    { property: "action", label: "Action", width: 120 },
  ];

  // creating single row
  function createData(
    guestName,
    phone,
    packageTitle,
    orderedAt,
    roomNumbers,
    status,
    id,
    hotelUid
  ) {
    return {
      guestName,
      phone,
      packageTitle,
      orderedAt,
      roomNumbers,
      status,
      id,
      hotelUid,
    };
  }

  // calling createData function with partner's data
  const rows = matchedBookings?.map((booking) => {
    return createData(
      booking?.guestDetails?.name,
      booking?.guestDetails?.phoneNumber,
      booking.title,
      booking.orderedAt,
      booking.roomNumbers,
      booking.status,
      booking.id,
      booking.packageId
    );
  });

  // setting booking details to the state
  const handleViewBookingDetails = async (id) => {
    const snapshot = await getDoc(doc(travelBookingCollection, id));
    if (snapshot.exists()) {
      const existingData = snapshot.data();
      setBookingDetails(existingData);
      setOpenBookingDetailsModal(true);
    }
  };

  // setting package details to the state
  const handleViewPackageDetails = async (id) => {
    const snapshot = await getDoc(doc(travelServicesDetailsCollection, id));
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
        await deleteDoc(doc(travelBookingCollection, id)).then(() => {
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

  return (
    <div>
      <PageHeading text="Travel Bookings" />

      <Paper sx={{ width: "100%", overflowX: "hidden" }}>
        <TableContainer sx={{ maxHeight: 440, maxWidth: "87vw" }}>
          {loadingData ? (
            <LoadingContent />
          ) : (
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  {columns?.map((column) => (
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
                {rows?.map((row, i) => {
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
                            {((value === "Pending" ||
                              value === "Accepted" ||
                              value === "Canceled") && (
                              <span
                                className={`${
                                  (value === "Pending" &&
                                    "bg-orange-300 text-black") ||
                                  (value === "Accepted" && "bg-green-500") ||
                                  (value === "Canceled" && "bg-red-600")
                                } text-white  py-1 px-2 rounded`}
                              >
                                {value}
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
                                  {row["status"] === "Canceled" && (
                                    <button
                                      onClick={() => handleDelete(row.id)}
                                      className="bg-red-500 text-white p-1 rounded"
                                    >
                                      <DeleteForeverIcon />
                                    </button>
                                  )}
                                  <button
                                    onClick={() =>
                                      handleViewBookingDetails(row.id)
                                    }
                                    className="bg-orange-500 text-white p-1 rounded ml-1"
                                  >
                                    <EditIcon />
                                  </button>

                                  <div
                                    onClick={() =>
                                      handleViewPackageDetails(row.hotelUid)
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
              {textField("Guest Name", bookingDetails?.gestDetails?.name)}

              {/* Guest Phone */}
              {textField("Guest Phone", bookingDetails?.gestDetails?.phone)}

              {/* Email */}
              {textField("Email", bookingDetails?.gestDetails?.email)}

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
                {/* Room Name */}
                {textField("Package Name", packageDetails?.packageName, true)}
                {/* Price */}
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

export default TravelBookings;
