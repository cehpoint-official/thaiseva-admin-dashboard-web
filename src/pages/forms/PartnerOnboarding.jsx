import { useForm } from "react-hook-form";
import {
  Box,
  Button,
  Chip,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Paper,
  Select,
  TextField,
} from "@mui/material";
import { useContext, useState } from "react";
import {
  collection,
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import {
  chatRoomsCollection,
  chatsCollection,
  db,
  usersCollection,
} from "../../firebase/firebase.config";
import { AuthContext } from "../../contextAPIs/AuthProvider";
import { useNavigate } from "react-router-dom";
const partnersCollection = collection(db, "partners");
import { getFileUrl } from "../../utils/utils";
import SubTitle from "../../components/SubTitle";
import {
  GoogleMap,
  MarkerF,
  StandaloneSearchBox,
} from "@react-google-maps/api";

const center = { lat: 48.8584, lng: 2.2945 };

const PartnerOnboarding = () => {
  const { createUser, updateUserProfile } = useContext(AuthContext);
  const [serviceCategory, setServiceCategory] = useState("Others");
  const [profileURL, setProfileURL] = useState("");
  const [vechicleNames, setVechicleNames] = useState([]);
  const [map, setMap] = useState(null);
  const [location, setLocation] = useState(null);
  const [searchBox, setSearchBox] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const {
    handleSubmit,
    // reset,
    register,
    formState: { errors },
  } = useForm();

  let vechicleTypes = [];

  if (serviceCategory === "Logistics and Transportation") {
    vechicleTypes = ["Truck", "Van", "Others"];
  } else if (serviceCategory === "Order Pick Up") {
    vechicleTypes = ["Toyota", "Honda", "Ford", "Nissan", "Others"];
  }

  /* ===============================================================
                          Handle form submission start
  ===============================================================*/
  // Handle form submission
  const onSubmit = async (data) => {
    setError("");
    const {
      email,
      password,
      fullName,
      address,
      serviceArea,
      educationalBackground,
      numberPlate,
      bankName,
      accountNumber,
      phoneNumber,
      bankAddress,
    } = data;
    // validating patner's info
    if (!profileURL) {
      return setError("Provide a valid profile");
    } else if (phoneNumber?.length < 7 || phoneNumber?.length > 11) {
      return setError("Invalid Number");
    }
    const accountInfo = { email, password };

    const personalInformation = {
      fullName,
      email,
      phoneNumber,
      address,
      photoURL: profileURL,
      location,
    };

    const serviceInformation = {
      serviceArea,
    };

    const paymentInformation = { bankName, accountNumber, bankAddress };

    // modifing service information based on service category
    if (
      serviceCategory === "Official Work" ||
      serviceCategory === "Legal Administrative"
    ) {
      serviceInformation.educationalBackground = educationalBackground;
    } else if (
      serviceCategory === "Logistics and Transportation" ||
      serviceCategory === "Order Pick Up"
    ) {
      serviceInformation.numberPlate = numberPlate;
      serviceInformation.vechicleNames = vechicleNames;
    }

    const partnerInfo = {
      serviceCategory,
      verified: false,
      status: "Pending",
      accountInfo,
      personalInformation,
      serviceInformation,
      paymentInformation,
    };

    // creating the user into Firebase authentication
    await createUser(email, password)
      .then(async (res) => {
        const createdUser = res.user;

        if (createdUser) {
          // adding partner's data to the partners collection
          partnerInfo.uid = createdUser.uid;

          // adding users data to the useres collection
          await setDoc(doc(usersCollection, createdUser.uid), {
            email: email,
            displayName: fullName,
            photoURL: profileURL,
            role: "Partner",
            status: "Pending",
            serviceCategory,
            uid: createdUser.uid,
          }).catch((error) => {
            console.log(error);
          });
          navigate("/dashboard");
          await updateUserProfile(fullName, profileURL); //updating user name and photoURL
          await setDoc(doc(partnersCollection, createdUser.uid), partnerInfo);

          const hasRoom = await getDoc(
            doc(chatRoomsCollection, "LocalPartnerSupport")
          );

          if (!hasRoom.exists()) {
            // creating conversation for thaiseva admin
            await setDoc(doc(chatRoomsCollection, "LocalPartnerSupport"), {
              [createdUser.uid + "_LocalPartnerSupport"]: {
                userInfo: {
                  uid: createdUser?.uid,
                  displayName: createdUser?.displayName,
                  photoURL: createdUser?.photoURL,
                  phoneNumber,
                },
                isRead: true,
                date: serverTimestamp(),
              },
            });
          } else {
            // creating conversation for thaiseva admin
            await updateDoc(doc(chatRoomsCollection, "LocalPartnerSupport"), {
              [createdUser.uid + "_LocalPartnerSupport"]: {
                userInfo: {
                  uid: createdUser?.uid,
                  displayName: createdUser?.displayName,
                  photoURL: createdUser?.photoURL,
                  phoneNumber,
                },
                isRead: true,
                date: serverTimestamp(),
              },
            });
          }

          await setDoc(
            doc(chatsCollection, createdUser.uid + "_LocalPartnerSupport"),
            { messages: [] }
          );
        }
      })
      .catch((error) => console.log(error));
  };
  /* ===============================================================
                          Handle form submission end
  ===============================================================*/

  /* ========================================================
              Google maps functionalities Started
 ======================================================== */
  const onMapLoad = (map) => {
    setMap(map);
  };

  const onMapClick = (e) => {
    setLocation({
      lat: e.latLng.lat(),
      lng: e.latLng.lng(),
    });
  };

  const onSearchLoad = (searchBox) => {
    setSearchBox(searchBox);
  };

  const onPlacesChanged = () => {
    const places = searchBox.getPlaces();

    if (places.length === 0) return;

    const location = places[0].geometry.location;

    setLocation({
      lat: location.lat(),
      lng: location.lng(),
    });
    map.setCenter(location);
  };
  /* ========================================================
            Google maps functionalities Ended
======================================================== */

  // uploading profile photo
  const handleUploadProfile = async (e) => {
    const { files } = e.target;
    setError("");
    const result = await getFileUrl(files);
    if (result.error) {
      setError(result.message);
    } else {
      setProfileURL(result.url);
    }
  };

  // setting selected vechicle into the select input
  const handleChangeVechicleNames = (event) => {
    const {
      target: { value },
    } = event;
    setVechicleNames(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  // handling service category change
  const handleChangeServiceCategory = (e) => {
    setServiceCategory(e.target.value);
    setVechicleNames([]);
  };

  // custom text field for common data
  const textField = (label, name, placeholder) => {
    return (
      <Grid item xs={12} sm={6} md={4}>
        <TextField
          label={label}
          type={name === "phoneNumber" ? "number" : "text"}
          placeholder={placeholder}
          fullWidth
          {...register(name, { required: true })}
        />
        {errors?.name && (
          <span className="text-red-500">{label} is required</span>
        )}
        {error.includes("Number") && name === "phoneNumber" && (
          <span className="text-red-500">{error}</span>
        )}
      </Grid>
    );
  };

  return (
    <div className="w-full h-full md:px-10 p-2 py-12 bg-[blue]">
      {/* form container */}
      <Paper
        elevation={3}
        sx={{ p: { xs: 2, sm: 3, md: 4, lg: 5 }, mx: "auto" }}
      >
        <h3 className="text-center text-[blue] font-bold text-2xl">
          Local Partner Onboarding Form
        </h3>

        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          {/* Account Information*/}
          <SubTitle text="Account & Contact Information :" />
          <Grid container spacing={3}>
            {/* Email */}
            {textField("Email", "email", "example@gmail.com")}

            {/* Password */}
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                label="Password"
                type="password"
                defaultValue=""
                fullWidth
                {...register("password", {
                  required: true,
                  minLength: 6,
                  maxLength: 20,
                  pattern: /(?=.*[A-Z])(?=.*[!@#$&%*])(?=.*[0-9])(?=.*[a-z])/,
                })}
              />
              {errors.password && (
                <span className="text-red-500">Password is required</span>
              )}
              {errors.password?.type === "minLength" && (
                <p className="text-red-400">
                  Password must have minimum six characters.
                </p>
              )}
              {errors.password?.type === "maxLength" && (
                <span className="text-red-400">
                  Password must be less than 20 characters.
                </span>
              )}
              {errors.password?.type === "pattern" && (
                // Password must have
                <p className="text-red-400">
                  at least one uppercase letter, one special character, and one
                  number.
                </p>
              )}
            </Grid>

            {/* Confirm Password */}
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                label="Confirm Password"
                type="password"
                defaultValue=""
                fullWidth
                {...register("confirm", { required: true })}
              />
              {errors?.password !== errors?.confirm && (
                <span className="text-red-500">
                  Password doesn&apos;t match
                </span>
              )}
            </Grid>

            {/* Full Name */}
            {textField("Full Name", "fullName", "Your Full Name")}

            {/* Profile Picture */}
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                label="Select Profile Picture"
                type="file"
                fullWidth
                InputLabelProps={{ shrink: true }}
                onChange={handleUploadProfile}
              />
              {(error.includes("file") || error.includes("profile")) && (
                <span className="text-red-500 text-sm">{error}</span>
              )}
            </Grid>

            {/* Phone */}
            {textField("Phone Number", "phoneNumber", "12 345 6789")}

            {/* Address */}
            {textField("Address", "address", "Type your current address")}
          </Grid>
          {/* Service Information*/}
          <SubTitle text="Service information that you will provide :" />

          <Grid container spacing={3}>
            {/* Service Category */}
            <Grid item xs={12} sm={6} md={4}>
              <FormControl fullWidth>
                <InputLabel id="service-category-label">
                  Service Category
                </InputLabel>
                <Select
                  labelId="service-category-label"
                  label="Service Category"
                  defaultValue="Others"
                  onChange={handleChangeServiceCategory}
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

            {/* Service Area */}
            {textField(
              "Which location will you provide the service?",
              "serviceArea",
              "City Name, District Name"
            )}

            {/* Number of Vehicles */}
            {(serviceCategory === "Logistics and Transportation" ||
              serviceCategory === "Order Pick Up") &&
              textField("Number of Vehicles", "numberPlate", "Number Plate")}

            {/* Type of Vehicles */}
            {(serviceCategory === "Logistics and Transportation" ||
              serviceCategory === "Order Pick Up") && (
              <Grid item xs={12} sm={6} md={4}>
                <FormControl fullWidth>
                  <InputLabel id="vehicle-types-label">
                    Type of Vehicles
                  </InputLabel>
                  <Select
                    labelId="vehicle-types-label"
                    multiple
                    fullWidth
                    value={vechicleNames}
                    onChange={handleChangeVechicleNames}
                    input={
                      <OutlinedInput
                        label="Type of Vehicles"
                        id="vehicle-types"
                      />
                    }
                    renderValue={(selected) => (
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                        {selected.map((value) => (
                          <Chip key={value} label={value} />
                        ))}
                      </Box>
                    )}
                  >
                    {vechicleTypes.map((name) => (
                      <MenuItem key={name} value={name}>
                        {name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            )}

            {/* Educational Background */}
            {(serviceCategory === "Legal Administrative" ||
              serviceCategory === "Official Work") &&
              textField(
                "Institution Name",
                "educationalBackground",
                "Where did you complete graduation?"
              )}
          </Grid>
          {/* Payment Information*/}
          <SubTitle text="Payment Information :" />
          <Grid container spacing={3}>
            {textField("Bank Name", "bankName", "Bank Name")}
            {textField(
              "Account Number",
              "accountNumber",
              "Type the number carefully"
            )}
            {textField(
              "Bank Address",
              "bankAddress",
              "Where is the branch located?"
            )}
          </Grid>

          <div className="w-full h-[400px] my-4 relative">
            <div className="absolute top-2 left-1/3 z-10 ">
              <StandaloneSearchBox
                onLoad={onSearchLoad}
                onPlacesChanged={onPlacesChanged}
              >
                <input
                  type="text"
                  placeholder="Search for a location"
                  className="location-input border border-blue-500"
                />
              </StandaloneSearchBox>
            </div>
            <GoogleMap
              id="map"
              center={center}
              zoom={14}
              onLoad={onMapLoad}
              onClick={onMapClick}
              mapContainerStyle={{ width: "100%", height: "100%" }}
            >
              {location && <MarkerF position={location} />}
            </GoogleMap>
          </div>
          <Box textAlign="center" sx={{ my: 2 }}>
            <Button type="submit" variant="contained" color="primary">
              Submit
            </Button>
          </Box>
        </Box>
      </Paper>
    </div>
  );
};

export default PartnerOnboarding;
