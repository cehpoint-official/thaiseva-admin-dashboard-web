import { useContext, useRef, useState } from "react";
import PageHeading from "../../../../../components/PageHeading";
import { useEffect } from "react";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
} from "firebase/firestore";
import {
  db,
  storage,
  travelServicesCollection,
} from "../../../../../firebase/firebase.config";
import { AuthContext } from "../../../../../contextAPIs/AuthProvider";
import ViewDetailsIcon from "./../../../../../components/ViewDetailsIcon";
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
import Loading from "../../../../../components/Loading";
import { v4 as uuid } from "uuid";
import { useForm } from "react-hook-form";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import {
  askingForDelete,
  deleteNotification,
  successNotification,
} from "../../../../../utils/utils";
import DeleteButton from "../../../../../components/DeleteButton";

const TravelServices = () => {
  const { isAdmin, isSubAdmin } = useContext(AuthContext);
  const [travelServices, setTravelServices] = useState([]);
  const [matchedTravelServices, setMatchedTravelServices] = useState([]);
  const [loadingServices, setLoadingServices] = useState(false);
  const [coverPhotoURL, setCoverPhotoURL] = useState("");

  const [packageDetails, setPackageDetails] = useState({
    id: "",
    title: "",
    price: "",
    description: "",
    discount: "",
    location: "",
    period: "",
    NumberOfPassengers: "",
    rating: 0.0,
    numberOfReviews: 0,
  });
  const [arrayData, setArrayData] = useState({
    amenities: [],
    included: [],
    pictures: [],
    places: [],
  });

  const [refetch, setRefetch] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openModal, setOpenModal] = useState(false); // Add requirement modal
  const amenitiesRef = useRef();
  const placesRef = useRef();
  const includedRef = useRef();
  const {
    handleSubmit,
    reset,
    register,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    setMatchedTravelServices(travelServices);
  }, [travelServices]);

  // fetching all services
  useEffect(() => {
    const loadtravelServices = async () => {
      setLoadingServices(true);
      let snapshot = await getDocs(travelServicesCollection);

      const list = snapshot.docs.map((doc) => doc.data());
      setTravelServices(list);
      setLoadingServices(false);
    };

    (isAdmin || isSubAdmin) && loadtravelServices();
  }, [isAdmin, isSubAdmin, refetch]);

  const columns = [
    { id: "title", label: "Title", width: 150 },
    {
      id: "location",
      label: "Location",
      width: 100,
    },
    {
      id: "period",
      label: "Period",
      width: 70,
    },
    {
      id: "price",
      label: "Price",
      width: 50,
    },
    {
      id: "discount",
      label: "Discount",
      width: 50,
    },
    {
      id: "rating",
      label: "Rating",
      width: 50,
    },
    {
      id: "action",
      label: "Action",
      width: 50,
    },
  ];

  // creating single row
  function createData(title, location, period, price, discount, rating, id) {
    return { title, location, period, price, discount, rating, id };
  }

  // calling createData function with driver's data
  const rows = matchedTravelServices.map((service) => {
    return createData(
      service.title,
      service.location,
      service.period,
      service.price,
      service.discount,
      service.rating,
      service.id
    );
  });

  /* =============================================================
              serach functionalities start
  =============================================================*/
  const handleSearchByTitle = (text) => {
    const matchingObjects = travelServices.filter((item) =>
      item.title.toLowerCase().includes(text.toLowerCase())
    );
    setMatchedTravelServices(matchingObjects);
  };

  const handleSearchByServiceArea = (text) => {
    const matchingObjects = travelServices.filter((item) =>
      item.location.toLowerCase().includes(text.toLowerCase())
    );

    setMatchedTravelServices(matchingObjects);
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
              Add Packages functionalities start
  =============================================================*/
  const handleOpenModal = () => {
    reset();
    setOpenModal(true);
  };

  // opening AddPackagesModal the modal while cliking on right sign icon
  const handleCloseModal = () => {
    reset();
    setPackageDetails({
      id: "",
      title: "",
      price: 0,
      description: "",
      discount: "",
      location: "",
      period: "",
      NumberOfPassengers: 0,
      rating: "0",
      numberOfReviews: "",
    });
    setCoverPhotoURL("");
    setArrayData({
      amenities: [],
      included: [],
      pictures: [],
      places: [],
    });
    setOpenModal(false);
  };

  // storing the requrement in the database
  const handleAddTravelService = async (data) => {
    const {
      title,
      price,
      description,
      discount,
      location,
      period,
      NumberOfPassengers,
    } = data;

    let id;
    if (packageDetails.id) {
      id = packageDetails.id;
    } else {
      id = uuid();
    }

    const travelInfo = {
      id,
      title,
      description,
      price: parseFloat(price),
      discount: parseFloat(discount),
      location,
      period,
      coverPhoto: coverPhotoURL,
      rating: "0",
      numberOfRatings: 0,
      numberOfReviews: 0,
    };

    const travelDetails = {
      ...travelInfo,
      NumberOfPassengers,
      amenities: arrayData?.amenities,
      included: arrayData?.included,
      pictures: arrayData?.pictures,
      places: arrayData?.places,
    };

    console.log(travelDetails);

    await setDoc(doc(travelServicesCollection, id), travelInfo).then(() =>
      setRefetch((p) => !p)
    );

    await setDoc(
      doc(collection(db, "sightseeingPackagesDetails"), id),
      travelDetails
    ).then(() => reset());

    setPackageDetails({
      id: "",
      title: "",
      price: 0,
      description: "",
      discount: "",
      location: "",
      period: "",
      NumberOfPassengers: 0,
      rating: 0,
      numberOfReviews: 0,
    });

    setCoverPhotoURL("");
    setArrayData({
      amenities: [],
      included: [],
      pictures: [],
      places: [],
    });
    successNotification(`The Package is added successfully`);
    setOpenModal(false);
  };
  /* =============================================================
              Add Packages functionalities end
  =============================================================*/

  // upadate package
  const handleViewPackage = async (id) => {
    console.log(id);
    reset();
    const snapshot = await getDoc(
      doc(collection(db, "sightseeingPackagesDetails"), id)
    );
    if (snapshot.exists()) {
      const existingData = snapshot.data();
      const {
        id,
        title,
        price,
        description,
        discount,
        location,
        period,
        NumberOfPassengers,
        rating,
        numberOfReviews,
      } = existingData;
      console.log(existingData);

      setPackageDetails({
        id,
        title,
        price,
        description,
        discount,
        location,
        period,
        NumberOfPassengers,
        rating,
        numberOfReviews,
      });
      // console.log(title, description);
      setCoverPhotoURL(existingData?.coverPhoto);
      setArrayData((p) => ({
        ...p,
        amenities: existingData?.amenities || [],
        included: existingData?.included || [],
        pictures: existingData?.pictures || [],
        places: existingData?.places || [],
      }));
    }
    setOpenModal(true);
  };

  // delete package
  const handleDeletePackage = async (id) => {
    askingForDelete().then(async (result) => {
      if (result.isConfirmed) {
        await deleteDoc(doc(travelServicesCollection, id));
        await deleteDoc(
          doc(collection(db, "sightseeingPackagesDetails"), id)
        ).then(() => {
          deleteNotification("The Package is deleted successfully.");
          setRefetch((p) => !p);
        });
      }
    });
  };

  // handleing add amenities
  const handleAddAmenities = () => {
    const element = amenitiesRef.current.querySelector("input");
    if (!element.value) {
      return;
    }
    const newAmenities = [...arrayData.amenities, element.value];
    setArrayData((p) => ({ ...p, amenities: newAmenities }));
    element.value = "";
  };

  // handling remove amenities
  const handleRemoveAmenity = (i) => {
    const { amenities } = arrayData;
    const newAmenities = arrayData.amenities
      .slice(0, i)
      .concat(amenities.slice(i + 1));
    setArrayData((p) => ({ ...p, amenities: newAmenities }));
  };

  // handling add include
  const handleAddInclude = () => {
    const element = includedRef.current.querySelector("input");
    if (!element.value) {
      return;
    }
    const newAmenities = [...arrayData.included, element.value];
    setArrayData((p) => ({ ...p, included: newAmenities }));
    element.value = "";
  };

  // handling remove include
  const handleRemoveInclude = (i) => {
    const { included } = arrayData;
    const newIncluded = arrayData.included
      .slice(0, i)
      .concat(included.slice(i + 1));
    setArrayData((p) => ({ ...p, included: newIncluded }));
  };

  // upload cover photo
  const handleUploadCoverPhoto = async (e) => {
    const file = e.target.files[0];

    const fileRef = ref(storage, `${file.lastModified}-coverPhoto`); // firebase storage to store license img
    //  // Uploading the profile image to storage
    const coverPhotoTask = await uploadBytesResumable(fileRef, file);

    // Get the download URL
    const photoURL = await getDownloadURL(coverPhotoTask.ref);

    if (photoURL) {
      setCoverPhotoURL(photoURL);
    }
  };

  // upload pictures
  const handleUploadPictures = async (e) => {
    let file = e.target.files[0];

    const imageRef = ref(storage, `${file.lastModified}-placePhoto`); // firebase storage to store license img
    //  // Uploading the profile image to storage
    const imageTask = await uploadBytesResumable(imageRef, file);

    // Get the download URL
    const imageURL = await getDownloadURL(imageTask.ref);

    if (imageURL) {
      setArrayData((p) => ({
        ...p,
        pictures: [...arrayData.pictures, imageURL],
      }));
    }
  };

  // remove picture
  const handleRemovePicture = (i) => {
    const { pictures } = arrayData;
    const newPictures = arrayData.pictures
      .slice(0, i)
      .concat(pictures.slice(i + 1));
    setArrayData((p) => ({ ...p, pictures: newPictures }));
  };

  // handling add Places
  const handleAddPlace = () => {
    const element = placesRef.current.querySelector("input");
    if (!element.value) {
      return;
    }
    const newPlace = [...arrayData.places, element.value];
    setArrayData((p) => ({ ...p, places: newPlace }));
    element.value = "";
  };

  // handling remove place
  const handleRemovePlace = (i) => {
    const { places } = arrayData;
    const newPlaces = arrayData.places.slice(0, i).concat(places.slice(i + 1));
    setArrayData((p) => ({ ...p, places: newPlaces }));
  };

  // custom text field for common data
  const textField = (label, name, placeholder, defaultValue) => {
    return (
      <Grid item xs={12} sm={name === "description" ? 12 : 6}>
        <TextField
          label={label}
          type={
            name === "price" ||
            name === "discount" ||
            name === "NumberOfPassengers"
              ? "number"
              : "text"
          }
          defaultValue={defaultValue && defaultValue}
          placeholder={placeholder}
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
            placeholder="Travel Service Title"
            fullWidth
            defaultValue=""
            onChange={(e) => handleSearchByTitle(e.target.value)}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <TextField
            label="Search By location"
            type="search"
            placeholder="Type Location"
            fullWidth
            defaultValue=""
            onChange={(e) => handleSearchByServiceArea(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          <div className="text-right md:pr-10 mb-4 flex items-center justify-end h-full">
            <button onClick={handleOpenModal} className="add-new-btn">
              Add New Package
            </button>
          </div>
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
                          let value = row[column.id];
                          return (
                            <TableCell key={column.id} align="center">
                              {(column.id === "action" && (
                                <div className="flex gap-1 items-center justify-center">
                                  <div
                                    onClick={() => handleViewPackage(row.id)}
                                  >
                                    <ViewDetailsIcon title="View Details" />
                                  </div>
                                  <div
                                    onClick={() => handleDeletePackage(row.id)}
                                  >
                                    <DeleteButton />
                                  </div>
                                </div>
                              )) ||
                                (column.id === "price" && `$${value}`) ||
                                (column.id === "discount" && `${value}%`) ||
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
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="responsive-dialog-title"
      >
        <Box component="form" onSubmit={handleSubmit(handleAddTravelService)}>
          <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
            Add New Package
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
              {/* Requirement Title */}
              {textField(
                "Package Title",
                "title",
                "Package Title",
                packageDetails?.title
              )}

              {/* Requirement Title */}
              {textField(
                "Location",
                "location",
                "Location",
                packageDetails?.location
              )}

              {/* Price */}
              {textField("Price", "price", "Price", packageDetails?.price)}

              {/* Discount */}
              {textField(
                "Discount",
                "discount",
                "Discount in %",
                packageDetails?.discount
              )}

              {/* Description */}
              {textField(
                "Description",
                "description",
                "Type Package Description...",
                packageDetails?.description
              )}

              {/* Period */}
              {textField("Period", "period", "Period", packageDetails?.period)}

              {/* Number Of Passengers */}
              {textField(
                "Number Of Passengers",
                "NumberOfPassengers",
                "Number Of Passengers",
                packageDetails?.NumberOfPassengers
              )}

              {/* Cover Photo */}
              <Grid item xs={12}>
                <div className="flex md:flex-row flex-col gap-2 ">
                  <div className="flex-1">
                    <TextField
                      label={"Select cover photo"}
                      type="file"
                      defaultValue=""
                      onChange={handleUploadCoverPhoto}
                      placeholder=""
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                    />
                  </div>
                  <div className="flex-1">
                    {coverPhotoURL && (
                      <div className="w-fit relative">
                        <img
                          src={coverPhotoURL}
                          alt=""
                          className="h-16 w-16 rounded opacity-80"
                        />
                        <span
                          onClick={() => setCoverPhotoURL("")}
                          className="bg-red-400 hover:bg-red-500 cursor-pointer text-white p-1 absolute top-0 right-0 h-5 w-5 rounded-full flex items-center justify-center"
                        >
                          x
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </Grid>

              {/* Add Amenities */}
              <Grid item xs={12}>
                <div className="flex md:flex-row flex-col">
                  <div className="flex-1 flex gap-2 items-center">
                    <TextField
                      ref={amenitiesRef}
                      label="Add Amenities"
                      type="text"
                      placeholder="Add Amenities"
                      fullWidth
                    />
                    <div onClick={handleAddAmenities} className="input-add-btn">
                      Add
                    </div>
                  </div>
                  <div className="flex-1 p-4 ">
                    <h3 className="font-bold text-center">Added Amenities</h3>
                    <div className="flex flex-wrap gap-2">
                      {arrayData.amenities &&
                        arrayData?.amenities?.map((amenity, i) => (
                          <div key={i} className="flex gap-1 text-sm">
                            <span>{amenity}</span>
                            <div
                              onClick={() => handleRemoveAmenity(i)}
                              className="bg-gray-200 hover:bg-gray-300 p-1 rounded-full h-5 w-5 flex items-center justify-center cursor-pointer"
                            >
                              x
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </Grid>

              {/* Add Places */}
              <Grid item xs={12}>
                <div className="flex md:flex-row flex-col">
                  <div className="flex-1 flex gap-2 items-center">
                    <TextField
                      ref={placesRef}
                      id="add-place"
                      label="Places"
                      type="text"
                      placeholder="Add places name here"
                      fullWidth
                    />
                    <div onClick={handleAddPlace} className="input-add-btn">
                      Add
                    </div>
                  </div>
                  <div className="flex-1 p-4 ">
                    <h3 className="font-bold text-center">Added Places</h3>
                    <div className="flex flex-wrap gap-2">
                      {arrayData.places &&
                        arrayData?.places?.map((place, i) => (
                          <div key={i} className="flex gap-1">
                            <span>{place}</span>
                            <div
                              onClick={() => handleRemovePlace(i)}
                              className="bg-gray-200 hover:bg-gray-300 p-2 rounded-full h-6 w-6 flex items-center justify-center cursor-pointer"
                            >
                              x
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </Grid>

              {/* Add Included */}
              <Grid item xs={12}>
                <div className="flex flex-col">
                  <div className=" flex gap-2 items-center">
                    <TextField
                      ref={includedRef}
                      label="Included"
                      type="text"
                      placeholder="What are included?"
                      fullWidth
                    />
                    <div onClick={handleAddInclude} className="input-add-btn">
                      Add
                    </div>
                  </div>
                  <div className="flex-1 p-4 ">
                    <h3 className="font-bold text-center">Added Includes</h3>
                    <div className="flex flex-wrap gap-2">
                      {arrayData.included &&
                        arrayData?.included?.map((item, i) => (
                          <div key={i} className="flex gap-1">
                            <span>{item}</span>
                            <div
                              onClick={() => handleRemoveInclude(i)}
                              className="bg-gray-200 hover:bg-gray-300 p-2 rounded-full h-6 w-6 flex items-center justify-center cursor-pointer"
                            >
                              x
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </Grid>

              {/* Add Pictures */}
              <Grid item xs={12}>
                <div className="flex flex-col">
                  <div className="lg:w-1/2">
                    <TextField
                      label="Select Image"
                      type="file"
                      onChange={handleUploadPictures}
                      defaultValue=""
                      placeholder=""
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                    />
                  </div>
                  <div className="flex-1 px-3">
                    <h3 className="font-bold text-center my-1">
                      Added Pictures
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {arrayData.pictures?.map((picture, i) => (
                        <div key={i} className="relative">
                          <img
                            src={picture}
                            alt=""
                            className="h-16 w-16 rounded opacity-80"
                          />
                          <span
                            onClick={() => handleRemovePicture(i)}
                            className="bg-red-400 hover:bg-red-500 cursor-pointer text-white p-1 absolute top-0 right-0 h-5 w-5 rounded-full flex items-center justify-center"
                          >
                            x
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* {fileError && <span className="text-red-500 text-sm">{fileError}</span>} */}
              </Grid>

              <Grid item xs={12} sm={6}></Grid>
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
              {packageDetails?.title ? "Update" : "Add"}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </div>
  );
};

export default TravelServices;
