import { useContext, useEffect } from "react";
import { useState } from "react";
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
  TableRow,
  TextField,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import { deleteDoc, doc, getDoc, updateDoc } from "firebase/firestore";

import {
  hotelsCollection,
  hotelPackageDetails,
  hotelPackages,
} from "../../../../../firebase/firebase.config";
import PageHeading from "../../../../../components/PageHeading";
import ViewDetailsIcon from "../../../../../components/ViewDetailsIcon";
import { PartnerContext } from "../../../../../contextAPIs/PartnerProvider";
import SubTitle from "../../../../../components/SubTitle";
import {
  askingForDelete,
  calculateDiscountPrice,
  deleteNotification,
} from "../../../../../utils/utils";
import DeleteButton from "../../../../../components/DeleteButton";
import LoadingContent from "../../../../../components/LoadingContent";
import RedirectWhatsApp from "../../../../../components/RedirectWhatsApp";
const RoomServices = () => {
  const { rooms, loadingData } = useContext(PartnerContext);
  const [openModal, setOpenModal] = useState(false); //Add service modal
  const [viewHotelDetailsModal, setViewHotelDetailsModal] = useState(false);
  const [hotelDetails, setHotelDetails] = useState({});
  const [status, setStatus] = useState("Pending");
  const [matchedRooms, setMatchedRooms] = useState([]);
  const [roomDetails, setRoomDetails] = useState({
    id: "",
    packageName: "",
    price: "",
    description: "",
    discount: "",
    location: {},
    period: "",
    bookingInfo: {},
    numberOfGuests: "",
    address: "",
    ratings: "",
    numberOfReviews: "",
    amenities: [],
    included: [],
    pictures: [],
    places: [],
  });

  useEffect(() => {
    setMatchedRooms(rooms);
  }, [rooms]);

  // Partners table header
  let columns = [
    { property: "name", label: "Name", width: 130 },
    { property: "price", label: "Price", width: 50 },
    { property: "discount", label: "Discount", width: 50 },
    { property: "period", label: "Period", width: 50 },
    { property: "ratings", label: "Rating", width: 50 },
    { property: "numberOfReviews", label: "Reviews", width: 50 },
    { property: "status", label: "Status", width: 50 },
    { property: "action", label: "Action", width: 120 },
  ];

  // creating single row
  function createData(
    name,
    price,
    discount,
    period,
    ratings,
    numberOfReviews,
    status,
    id,
    hotelUid
  ) {
    return {
      name,
      price,
      period,
      discount,
      ratings,
      numberOfReviews,
      status,
      id,
      hotelUid,
    };
  }

  // calling createData function with partner's data
  const rows = matchedRooms?.map((room) => {
    return createData(
      room.packageName,
      room.price,
      room.discount,
      room.period,
      room.ratings,
      room.numberOfReviews,
      room.status,
      room.id,
      room.hotelUid
    );
  });

  /* =============================================================
              serach functionalities start
  =============================================================*/
  const handleSearchByPackageName = (text) => {
    const matchingObjects = rooms.filter((item) =>
      item.packageName.toLowerCase().includes(text.toLowerCase())
    );
    setMatchedRooms(matchingObjects);
  };

  // const handleSearchByServiceArea = (text) => {
  //   const matchingObjects = rooms.filter((item) =>
  //     item.serviceArea.toLowerCase().includes(text.toLowerCase())
  //   );

  //   setMatchedRooms(matchingObjects);
  // };

  // const handleSearchByPhone = (text) => {
  //   const matchingObjects = rooms.filter((item) =>
  //     item.providerPhone.includes(text)
  //   );

  //   setMatchedRooms(matchingObjects);
  // };
  /* =============================================================
              serach functionalities end
  =============================================================*/

  // deleting room
  const handleDelete = async (id) => {
    askingForDelete().then(async (result) => {
      if (result.isConfirmed) {
        await deleteDoc(doc(hotelPackages, id));
        await deleteDoc(doc(hotelPackageDetails, id)).then(() => {
          deleteNotification("The Room is deleted successfully.");
        });
      }
    });
  };

  // opening AddPackagesModal the modal while cliking on right sign icon
  const handleCloseModal = () => {
    setRoomDetails({
      id: "",
      packageName: "",
      price: "",
      description: "",
      discount: "",
      location: {},
      period: "",
      bookingInfo: {},
      numberOfGuests: "",
      address: "",
      ratings: "",
      numberOfReviews: "",
      amenities: [],
      included: [],
      pictures: [],
      places: [],
    });
    setOpenModal(false);
  };

  // upadate package
  const handleViewRoomDetails = async (id) => {
    const snapshot = await getDoc(doc(hotelPackageDetails, id));
    if (snapshot.exists()) {
      const existingData = snapshot.data();
      setRoomDetails(existingData);
    }
    setOpenModal(true);
  };

  const handleUpdateStatus = async (id) => {
    const updatedStatus = { status: status };

    await updateDoc(doc(hotelPackages, id), updatedStatus);
    await updateDoc(doc(hotelPackageDetails, id), updatedStatus).then(() => {
      setOpenModal(false);
    });
  };

  const handleViewHotelDetails = async (id) => {
    setViewHotelDetailsModal(true); //opening the modal
    const query = doc(hotelsCollection, id);
    const data = await getDoc(query);

    setHotelDetails(data.data());
  };

  // custom text field for common data
  const textField = (label, value, is12) => {
    return (
      <Grid item xs={12} sm={label === "Description" || is12 ? 12 : 6}>
        <div className="flex gap-2">
          <p>
            <span className="font-bold">{label}: </span>
            {label.includes("Price") && "฿"}
            {value}
            {label === "Discount" && "%"}
          </p>
        </div>
      </Grid>
    );
  };

  return (
    <div>
      <PageHeading text="Room Services" />
      <Grid container spacing={0.5} sx={{ mb: 2, mt: 2 }}>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            label="Search By Package Name"
            type="search"
            placeholder="Package Name"
            fullWidth
            defaultValue=""
            onChange={(e) => handleSearchByPackageName(e.target.value)}
          />
        </Grid>
      </Grid>
      <div className="flex items-center justify-between  md:pr-3 mb-2">
        <p className="my-2 font-bold">{rooms.length} services available</p>{" "}
      </div>
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

                        return (
                          <TableCell key={column.property} align="center">
                            {((value === "Pending" ||
                              value === "Approved" ||
                              value === "Denied") && (
                              <span
                                className={`${
                                  (value === "Pending" &&
                                    "bg-orange-300 text-black") ||
                                  (value === "Approved" && "bg-green-500") ||
                                  (value === "Denied" && "bg-red-600")
                                } text-white  py-1 px-2 rounded`}
                              >
                                {value}
                              </span>
                            )) ||
                              (column.property === "action" && (
                                <div className="flex gap-1 justify-center">
                                  {row["status"] === "Denied" && (
                                    <div
                                      onClick={() => handleDelete(row.id)}
                                      className="bg-red-500 text-white p-1 rounded"
                                    >
                                      <DeleteButton />
                                    </div>
                                  )}
                                  <button
                                    onClick={() =>
                                      handleViewRoomDetails(row.id)
                                    }
                                    className="bg-orange-500 text-white p-1 rounded ml-1"
                                  >
                                    <EditIcon />
                                  </button>

                                  <div
                                    onClick={() =>
                                      handleViewHotelDetails(row.hotelUid)
                                    }
                                  >
                                    <ViewDetailsIcon title="View Hotel's Info" />
                                  </div>
                                </div>
                              )) ||
                              (column.property === "price" && `฿${value}`) ||
                              (column.property === "discount" && `${value}%`) ||
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

      {/* view room details and change status modal */}
      <Dialog
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="responsive-dialog-title"
      >
        <Box sx={{ lg: { width: "800" } }}>
          <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
            Name : {roomDetails?.hotelName}
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
              {/* Cover Photo */}
              <Grid item xs={12} sm={6}>
                {roomDetails && (
                  <img
                    src={roomDetails?.coverPhoto}
                    alt=""
                    className="h-44 w-full mx-auto rounded "
                  />
                )}
              </Grid>
              <Grid item xs={12} sm={6}>
                {/* Room Name */}
                {textField("Package Name", roomDetails?.packageName, true)}
                {/* Price */}
                {textField("Price", roomDetails?.price, true)}
                {/* Discount */}
                {textField("Discount", roomDetails?.discount, true)}
                {/* Discount Price*/}
                {textField(
                  "Discount Price",
                  calculateDiscountPrice(
                    roomDetails?.price,
                    roomDetails?.discount
                  ),
                  true
                )}
                {/* Number Of Guests */}
                {textField(
                  "Number Of Guests",
                  roomDetails?.numberOfGuests,
                  true
                )}
                {/* Requirement Title */}
                {textField("Address", roomDetails?.address, true)}
                {/* Period */}
                {textField("Period", roomDetails?.period, true)}
              </Grid>
            </Grid>
            <Grid container spacing={2} sx={{ mb: 2, mt: 0.5 }}>
              {/* Description */}
              {textField("Description", roomDetails?.description)}

              {/* Add Amenities */}
              <Grid item xs={12}>
                <h3 className="font-bold text-[var(--primary-bg)] border-b">
                  Amenities
                </h3>
                <div className="flex flex-wrap gap-1 text-sm my-2">
                  {roomDetails.amenities &&
                    roomDetails?.amenities?.map((amenity, i) => (
                      <span key={i} className="bg-gray-200 py-1 px-2 rounded">
                        {amenity}
                      </span>
                    ))}
                </div>
              </Grid>

              {/* Add images */}
              <Grid item xs={12}>
                <h3 className="font-bold text-[var(--primary-bg)] border-b">
                  Room Pictures
                </h3>
                <div className="flex flex-wrap gap-2 my-2">
                  {roomDetails.pictures?.map((picture, i) => (
                    <div key={i}>
                      <h4 className="text-lg">{picture?.label}</h4>
                      <img
                        src={picture?.url}
                        alt=""
                        className="h-36 w-40 rounded"
                      />
                    </div>
                  ))}
                </div>
              </Grid>

              {/* Permission */}
              <h3 className="font-bold text-xl text-[var(--primary-bg)] border-b ml-4">
                Permission
              </h3>
              <Grid container spacing={2} sx={{ mb: 2, mt: 0.5, p: 1 }}>
                <Grid item xs={12} sm={6} md={6}>
                  <span className="font-bold ">Current Status : </span>{" "}
                  <span
                    className={`${
                      (roomDetails?.status === "Pending" &&
                        "bg-orange-300 text-black") ||
                      (roomDetails?.status === "Approved" && "bg-green-500") ||
                      (roomDetails?.status === "Denied" && "bg-red-600")
                    } text-white  py-1 px-2 rounded`}
                  >
                    {roomDetails?.status}
                  </span>
                </Grid>
                <Grid item xs={12} sm={6} md={6}>
                  <FormControl fullWidth>
                    <InputLabel id="status-label ">Change Status</InputLabel>
                    <Select
                      labelId="status-label"
                      label="Change Status"
                      defaultValue={roomDetails?.status}
                      onChange={(e) => setStatus(e.target.value)}
                    >
                      <MenuItem value="Pending">Pending</MenuItem>
                      <MenuItem value="Approved">Approved</MenuItem>
                      <MenuItem value="Denied">Denied</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
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
              onClick={() => handleUpdateStatus(roomDetails?.id)}
            >
              Update
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      {/* modal  */}
      <Dialog
        open={viewHotelDetailsModal}
        onClose={() => setViewHotelDetailsModal(false)}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          Name: {hotelDetails?.hotelInformation?.hotelName}
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={() => setViewHotelDetailsModal(false)}
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
                  className="w-32 h-32 border-2 border-[var(--primary-bg)]"
                />
              </div>
            </Grid>
            <Grid item xs={12} sm={6}>
              {/* Driver Information */}
              <div className="flex items-center justify-between">
                <SubTitle text="Hotel Information" />
                {hotelDetails?.hotelInformation?.phoneNumber && (
                  <RedirectWhatsApp
                    number={hotelDetails?.hotelInformation?.phoneNumber}
                  />
                )}
              </div>
              <Divider />
              <Grid container spacing={0.5} sx={{ mb: 2, mt: 0.5 }}>
                <Grid item xs={12}>
                  <span className="font-bold">Email: </span>
                  {hotelDetails?.hotelInformation?.email}
                </Grid>
                <Grid item xs={12}>
                  <span className="font-bold">Phone Number: </span>{" "}
                  {hotelDetails?.hotelInformation?.phoneNumber}
                </Grid>
                <Grid item xs={12}>
                  <span className="font-bold">Address: </span>
                  {hotelDetails?.hotelInformation?.address}
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            autoFocus
            sx={{ bgcolor: "var(--primary-bg)", color: "white", hover: "none" }}
            onClick={() => setViewHotelDetailsModal(false)}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default RoomServices;
