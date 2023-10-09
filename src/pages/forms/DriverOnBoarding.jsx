import { Box, Button, Grid, Paper, TextField } from "@mui/material";
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
import SubTitle from "../../components/SubTitle";

const DriverOnBoarding = () => {
  const { createUser, updateUserProfile } = useContext(AuthContext);
  const allowedExtensions = ["jpg", "jpeg", "png", "svg"];
  const [profileError, setProfileError] = useState("");
  const [licenceError, setLicenceError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const navigate = useNavigate();

  const {
    handleSubmit,
    // reset,
    register,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setProfileError("");
    setLicenceError("");
    setPasswordError("");
    const {
      email,
      password,
      fullName,
      profile,
      confirm,
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
      serviceCategory: "Driving",
      vehicleInformation,
      paymentInformation,
    };

    const profileExt = profile[0].name.split(".")[1];
    const drivingLicenceExt = drivingLicence[0].name.split(".")[1];
    const isValidProfile = allowedExtensions.includes(profileExt);
    const isValidLicence = allowedExtensions.includes(drivingLicenceExt);

    if (password !== confirm) {
      return setPasswordError("Password doesn't matched");
    } else if (!isValidProfile) {
      console.log("error");
      return setProfileError("Allowed file extensions jpg, jpeg, png, svg");
    } else if (!isValidLicence) {
      console.log("error");
      return setLicenceError("Allowed file extensions jpg, jpeg, png, svg");
    }

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
            serviceCategory: "Driving",
            uid: createdUser.uid,
          }).catch((error) => {
            console.log(error);
          });
          serviceInfo.uid = createdUser.uid; // adding unique uid

          navigate("/dashboard");

          const profileRef = ref(storage, createdUser.uid + profile[0].name); // firebase storage to store profile img
          const licenceRef = ref(storage, `${createdUser.uid}-licence`); // firebase storage to store licence img

          // Uploading the profile image to storage
          const profileTask = await uploadBytesResumable(
            profileRef,
            profile[0]
          );
          // Uploading the driving licence to the storage
          const licenceTask = await uploadBytesResumable(
            licenceRef,
            drivingLicence[0]
          );

          // Get the download URL
          const photoURL = await getDownloadURL(profileTask.ref);
          const licenceURL = await getDownloadURL(licenceTask.ref);

          if (photoURL) {
            await updateUserProfile(fullName, photoURL); //updating user name and photoURL
            await updateDoc(doc(usersCollection, createdUser.uid), {
              photoURL: photoURL,
            });

            serviceInfo.driverInformation.photoURL = photoURL; // adding profile URL
            await setDoc(doc(driversCollection, createdUser.uid), serviceInfo);
          }

          if (licenceURL) {
            console.log("Licence is Uploaded successfully", licenceURL);
            // adding service's data to the partners collection
            serviceInfo.driverInformation.drivingLicence = licenceURL;

            await updateDoc(doc(driversCollection, createdUser.uid), {
              serviceInfo,
            });
          }
        }
      })
      .catch((error) => console.log(error));
  };

  // custom text field for common data
  const textField = (label, name, placeholder) => {
    return (
      <Grid item xs={12} sm={6} md={4}>
        <TextField
          label={label}
          type={name === "phoneNumber" ? "tel" : "text"}
          placeholder={placeholder}
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

  // custom file field for profile and licence
  const fileField = (label, name, fileError) => {
    return (
      <Grid item xs={12} sm={6} md={4}>
        <TextField
          label={"Select " + label}
          type="file"
          defaultValue=""
          placeholder=""
          fullWidth
          InputLabelProps={{ shrink: true }}
          {...register(name, { required: true })}
        />

        {errors?.name && (
          <span className="text-red-500">{label} is required</span>
        )}
        {fileError && <span className="text-red-500 text-sm">{fileError}</span>}
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
          Driving Partner Onboarding Form
        </h3>

        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          {/* Account Information*/}
          <SubTitle text="Account & Driver Information :" />

          <Grid container spacing={3} sx={{ py: 1 }}>
            {/* Email */}
            {textField("Email", "email", "email", "example@gmail.com")}

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
              {passwordError && (
                <span className="text-red-500 text-sm">{passwordError}</span>
              )}
            </Grid>

            {/* Full Name */}
            {textField("Full Name", "fullName", "Enter Your Full Name")}

            {/* Profile Picture */}
            {fileField("Profile Picture", "profile", profileError)}

            {/* Phone */}
            {textField("Phone Number", "phoneNumber", "12 345 6789")}

            {/* Address */}
            {textField("Address", "address", "Type your current address")}

            {/* Driving Licence */}
            {fileField("Driving Licence", "drivingLicence", licenceError)}
          </Grid>

          {/* Service Information*/}
          <SubTitle text="Service & Vehicle information :" />

          <Grid container spacing={3} sx={{ py: 1 }}>
            {/* Vehicle Type */}
            {textField(
              "Vehicle Type",
              "vehicleType",
              "Type the vehicle's model"
            )}

            {/* Number plate */}
            {textField(
              "Number plate",
              "numberPlate",
              "Vehicle registration number"
            )}

            {/* Service Area */}
            {textField(
              "Which location will you provide the service?",
              "serviceArea",
              "City Name, District Name"
            )}
          </Grid>

          {/* Payment Information*/}
          <SubTitle text="Payment Information :" />

          <Grid container spacing={3} sx={{ py: 1 }}>
            {/* Bank Name */}
            {textField(
              "Bank Name",
              "bankName",
              "You will get paid in this bank"
            )}

            {/* Account Number */}
            {textField(
              "Account Number",
              "accountNumber",
              "Type the number carefully"
            )}

            {/* Bank Address */}
            {textField(
              "Bank Address",
              "bankAddress",
              "Where is the branch located?"
            )}
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
