import { Box, Button, Grid, Paper, TextField, Typography } from "@mui/material";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  db,
  driversCollection,
  storage,
  usersCollection,
} from "../../firebase/firebase.config";
import { doc, setDoc, updateDoc } from "firebase/firestore";
import { useContext } from "react";
import { AuthContext } from "../../contextAPIs/AuthProvider";
import { useNavigate } from "react-router-dom";

const DriverOnBoarding = () => {
  const { createUser, updateUserProfile } = useContext(AuthContext);
  const allowedExtensions = ["jpg", "jpeg", "png", "gif", "svg"];
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const {
    handleSubmit,
    // reset,
    register,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setError("");
    const {
      email,
      password,
      fullName,
      profile,
      address,
      phoneNumber,
      numberPlate,
      serviceArea,
      vehicleType,
      drivingLicence,
      bankName,
      accountNumber,
      bankAddress,
    } = data;

    const accountInfo = { email, password };
    const driverInformation = { email, fullName, phoneNumber, address };
    const vehicleInformation = { numberPlate, vehicleType };
    const paymentInformation = { bankName, accountNumber, bankAddress };

    const serviceInfo = {
      accountInfo,
      status: "Pending",
      verified: false,
      driverInformation,
      serviceArea,
      vehicleInformation,
      paymentInformation,
    };

    // console.log(profile[0].name, drivingLicence[0].name);

    // console.log(drivingLicence[0].name.split(".")[1]);
    // const profileExt = profile[0].name.split(".")[1];
    // const drivingLicenceExt = drivingLicence[0].name.split(".")[1];
    // const isValidProfile = allowedExtensions.includes(profileExt);
    // const isValidLicence = allowedExtensions.includes(drivingLicenceExt);
    console.log(email);

    // creating the user into Firebase authentication
    /* await createUser(email, password)
      .then(async (res) => {
        const createdUser = res.user;

        if (createdUser) {
          // adding users data to the useres collection
          await setDoc(doc(usersCollection, createdUser.uid), {
            email: email,
            displayName: fullName,
            role: "Partner",
            status: "Pending",
            serviceCategory: "Driving",
            uid: createdUser.uid,
          }).catch((error) => {
            console.log(error);
          });

          navigate("/dashboard");

          const profileRef = ref(storage, `${createdUser.uid}-profile`); // firebase storage to store profile img

          // Uploading the profile image to storage
          const profileTask = uploadBytesResumable(profileRef, profile[0]);
          profileTask.on(
            (error) => {
              console.log(error.message);
            },

            async () => {
              // getting the profile img url after uploading to the storage
              await getDownloadURL(profileTask.snapshot.ref).then(
                async (photoURL) => {
                  await updateUserProfile(fullName, photoURL); //updating user name and photoURL
                  await updateDoc(doc(usersCollection, createdUser.uid), {
                    photoURL: photoURL,
                  });

                  serviceInfo.uid = createdUser.uid; // adding unique uid
                  serviceInfo.driverInformation.photoURL = photoURL; // adding profile URL

                  // creating an empty chat conversation for the user.
                  await setDoc(doc(db, "userChats", createdUser.uid), {});
                }
              );
            }
          );

          const licenceRef = ref(storage, `${createdUser.uid}-licence`); // firebase storage to store licence img
          // Uploading the driving licence to the storage
          const licenceTask = uploadBytesResumable(
            licenceRef,
            drivingLicence[0]
          );
          licenceTask.on(
            (error) => {
              console.log(error.message);
            },

            async () => {
              // getting the img url after uploading to the storage
              await getDownloadURL(licenceTask.snapshot.ref).then(
                async (licenceURL) => {
                  // adding service's data to the partners collection

                  serviceInfo.driverInformation.drivingLicence = licenceURL;
                  await setDoc(
                    doc(driversCollection, createdUser.uid),
                    serviceInfo
                  ).then(() =>
                    console.log("successfully set to the driver's collection")
                  );
                }
              );
            }
          );
        }
      })
      .catch((error) => console.log(error)); */
  };

  const GridItem = ({ label, name, type }) => {
    return (
      <Grid item xs={12} sm={6} md={4}>
        <TextField
          label={label}
          type={type}
          placeholder="example@gmail.com"
          defaultValue=""
          fullWidth
          {...register(name, { required: true })}
        />
        {errors?.name && (
          <span className="text-red-500">{label} is required</span>
        )}
      </Grid>
    );
  };

  console.log(GridItem());

  return (
    <div className="w-full h-full md:px-10 p-2 py-12 bg-[blue]">
      {/* form container */}
      <Paper
        elevation={3}
        sx={{ p: { xs: 2, sm: 3, md: 4, lg: 5 }, mx: "auto" }}
      >
        <h3 className="text-center text-[blue] font-bold text-2xl">
          Driving Partner Onboarding Form
        </h3>

        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          {/* Account Information*/}
          <Typography variant="h6" sx={{ my: 1, fontWeight: "bold" }}>
            Account & Driver Information :
          </Typography>
          <Grid container spacing={3}>
            {/* Email */}
            {/* <Grid item xs={12} sm={6} md={4}>
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
            </Grid> */}
            {GridItem("Email", "email", "email")}

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
                {...register("phoneNumber", { required: true })}
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

            {/* Driving Licence */}
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                label="Select Driving Licence"
                type="file"
                defaultValue=""
                placeholder=""
                fullWidth
                InputLabelProps={{ shrink: true }}
                {...register("drivingLicence", { required: true })}
              />
              {errors?.drivingLicence && (
                <span className="text-red-500">
                  Driving Licence is required
                </span>
              )}
            </Grid>
          </Grid>

          {/* Service Information*/}
          <Typography variant="h6" sx={{ my: 1, fontWeight: "bold" }}>
            Service & Vehicle information :
          </Typography>
          <Grid container spacing={3}>
            {/* Service Category */}
            <Grid item xs={12} sm={6} md={4}>
              {/* Number plate */}
              <TextField
                label="Vehicle's number plate"
                type="text"
                placeholder="Vehicle registration number"
                fullWidth
                {...register("numberPlate", { required: true })}
              />
              {errors?.numberPlate && (
                <span className="text-red-500">Number Plate is required</span>
              )}
            </Grid>

            {/* Service Area */}
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                label="Which location will you provide the service?"
                type="tel"
                placeholder="City Name, District Name"
                fullWidth
                {...register("serviceArea", { required: true })}
              />
              {errors?.serviceArea && (
                <span className="text-red-500">Service Area is required</span>
              )}
            </Grid>

            {/* Vehicle Type */}
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                label="Vehicle Type"
                type="text"
                fullWidth
                inputProps={{
                  min: 0,
                }}
                {...register("vehicleType", { required: true })}
              />
              {errors?.vehicleType && (
                <span className="text-red-500">Vehicle Type is required</span>
              )}
            </Grid>
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

export default DriverOnBoarding;

/* 

// Assuming drivingLicence[0] is the file input element
const selectedFile = drivingLicence[0].files[0];
const fileExtension = selectedFile.type;

if (!allowedExtensions.includes(fileExtension)) {
  console.log("Invalid file type. Please select an image or SVG file.");
} else {
  const licenceRef = ref(storage, `${createdUser.uid}-licence`);
  const licenceTask = uploadBytesResumable(licenceRef, selectedFile);

  licenceTask.on(
    "state_changed",
    (snapshot) => {
      // Progress monitoring if needed
    },
    (error) => {
      console.log(error.message);
    },
    async () => {
      // Getting the image URL after uploading to the storage
      const licenceURL = await getDownloadURL(licenceTask.snapshot.ref);
      
      // Adding service's data to the partners collection
      serviceInfo.driverInformation.drivingLicence = licenceURL;

      await setDoc(doc(driversCollection, createdUser.uid), serviceInfo).then(() =>
        console.log("Successfully set to the driver's collection")
      );
    }
  );
} */
