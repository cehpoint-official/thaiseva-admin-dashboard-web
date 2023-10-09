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
  Typography,
} from "@mui/material";
import { useContext, useState } from "react";
import { isValidPhoneNumber } from "react-phone-number-input";
import { collection, doc, setDoc, updateDoc } from "firebase/firestore";
import { db, storage, usersCollection } from "../../firebase/firebase.config";
import { AuthContext } from "../../contextAPIs/AuthProvider";
import { useNavigate } from "react-router-dom";
const partnersCollection = collection(db, "partners");
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

const PartnerOnboarding = () => {
  const { createUser, updateUserProfile } = useContext(AuthContext);
  const [serviceCategory, setServiceCategory] = useState("Others");
  const [vechicleNames, setVechicleNames] = useState([]);
  const [phoneNumber, setPhoneNumber] = useState("");
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
      numberOfVehicles,
      bankName,
      accountNumber,
      bankAddress,
      profile,
    } = data;

    const valid = isValidPhoneNumber(`+66 ${phoneNumber}`);

    // validating patner's info
    if (!valid) {
      return setError("Invalid Number");
    }
    const accountInfo = { email, password };

    const personalInformation = {
      fullName,
      email,
      phoneNumber,
      address,
    };

    const serviceInformation = {
      serviceArea,
      servicesOffered: [],
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
      serviceInformation.numberOfVehicles = numberOfVehicles;
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
          // adding users data to the useres collection
          await setDoc(doc(usersCollection, createdUser.uid), {
            email: email,
            displayName: fullName,
            role: "Partner",
            status: "Pending",
            serviceCategory,
            uid: createdUser.uid,
          }).catch((error) => {
            console.log(error);
          });

          navigate("/dashboard");

          const storageRef = ref(storage, createdUser.uid); // firebase storage to store profile img

          // Uploading the image to storage
          const uploadTask = uploadBytesResumable(storageRef, profile[0]);
          uploadTask.on(
            (error) => {
              console.log(error.message);
            },

            async () => {
              // getting the img url after uploading to the storage
              await getDownloadURL(uploadTask.snapshot.ref).then(
                async (photoURL) => {
                  await updateUserProfile(fullName, photoURL); //updating user name and photoURL
                  await updateDoc(doc(usersCollection, createdUser.uid), {
                    photoURL: photoURL,
                  });
                  // adding partner's data to the partners collection
                  partnerInfo.uid = createdUser.uid;
                  partnerInfo.personalInformation.photoURL = photoURL;
                  await setDoc(
                    doc(partnersCollection, createdUser.uid),
                    partnerInfo
                  ).catch(() => console.log(" error"));
                }
              );
            }
          );
        }
      })
      .catch((error) => console.log(error));
  };
  /* ===============================================================
                          Handle form submission end
  ===============================================================*/

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

  return (
    <div className="w-full h-full md:px-10 p-2 py-12 bg-[blue]">
      {/* form container */}
      <Paper
        elevation={3}
        sx={{ p: { xs: 2, sm: 3, md: 4, lg: 5 }, mx: "auto" }}
      >
        <h3 className="text-center text-[blue] font-bold text-2xl">
          Partner Onboarding Form
        </h3>

        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          {/* Account Information*/}
          <Typography variant="h6" sx={{ my: 1, fontWeight: "bold" }}>
            Account & Contact Information :{" "}
          </Typography>{" "}
          <Grid container spacing={3}>
            {/* Email */}
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                label="Email"
                type="email"
                placeholder="example@gmail.com"
                defaultValue=""
                fullWidth
                {...register("email", { required: true })}
              />
              {errors?.email && (
                <span className="text-red-500">Email is required</span>
              )}
            </Grid>

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
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                label="Full Name"
                type="text"
                defaultValue=""
                fullWidth
                {...register("fullName", { required: true })}
                className="capitalize"
              />
              {errors?.fullName && (
                <span className="text-red-500">Full Name is required</span>
              )}
            </Grid>

            {/* Profile Picture */}
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                label="Select Profile Picture"
                type="file"
                defaultValue=""
                placeholder=""
                fullWidth
                InputLabelProps={{ shrink: true }}
                {...register("profile", { required: true })}
              />
              {errors?.profile && (
                <span className="text-red-500">
                  Profile picture is required
                </span>
              )}
            </Grid>

            {/* Phone */}
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                label="Phone Number"
                placeholder="12 345 6789"
                type="tel"
                fullWidth
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
              {error.includes("Number") && (
                <span className="text-red-500">{error}</span>
              )}
            </Grid>

            {/* Address */}
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                label="Address"
                type="text"
                placeholder="Type your current address."
                fullWidth
                {...register("address", { required: true })}
              />
              {errors?.address && (
                <span className="text-red-500">Address is required</span>
              )}
            </Grid>
          </Grid>
          {/* Service Information*/}
          <Typography variant="h6" sx={{ my: 1, fontWeight: "bold" }}>
            Service information that you will provide :
          </Typography>
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
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                label="Which location will you provide the service?"
                type="tel"
                placeholder="City Name, District Name"
                // InputLabelProps={{ shrink: true }}
                fullWidth
                {...register("serviceArea", { required: true })}
              />
              {errors?.serviceArea && (
                <span className="text-red-500">Service Area is required</span>
              )}
            </Grid>

            {/* Number of Vehicles */}
            {(serviceCategory === "Logistics and Transportation" ||
              serviceCategory === "Order Pick Up") && (
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="Number of Vehicles"
                  type="number"
                  fullWidth
                  inputProps={{
                    min: 0,
                  }}
                  {...register("numberOfVehicles", { required: true })}
                />
                {errors?.numberOfVehicles && (
                  <span className="text-red-500">
                    Number of Vehicles is required
                  </span>
                )}
              </Grid>
            )}

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
              serviceCategory === "Official Work") && (
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="Institution Name"
                  type="text"
                  placeholder="Where did you complete graduation?"
                  fullWidth
                  {...register("educationalBackground", { required: true })}
                />
                {errors?.educationalBackground && (
                  <span className="text-red-500">
                    Institution Name is required
                  </span>
                )}
              </Grid>
            )}
          </Grid>
          {/* Payment Information*/}
          <Typography variant="h6" sx={{ my: 1, fontWeight: "bold" }}>
            Payment Information :{" "}
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                label="Bank Name"
                type="text"
                placeholder="You will get paid in this bank"
                fullWidth
                {...register("bankName", { required: true })}
              />
              {errors?.bankName && (
                <span className="text-red-500">Bank Name is required</span>
              )}
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                label="Account Number"
                type="text"
                placeholder="Type the number carefully"
                fullWidth
                rows={6}
                {...register("accountNumber", { required: true })}
              />
              {errors?.accountNumber && (
                <span className="text-red-500">Account Number is required</span>
              )}
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                label="Bank Address"
                type="text"
                placeholder="Where is the branch located?"
                fullWidth
                {...register("bankAddress", { required: true })}
              />
              {errors?.bankAddress && (
                <span className="text-red-500">Bank Address is required</span>
              )}
            </Grid>
          </Grid>
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
