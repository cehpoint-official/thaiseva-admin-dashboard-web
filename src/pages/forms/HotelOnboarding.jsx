import { Box, Button, Grid, Paper, TextField } from "@mui/material";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  db,
  hotelsCollection,
  storage,
  usersCollection,
} from "../../firebase/firebase.config";
import { doc, setDoc, updateDoc } from "firebase/firestore";
import { useContext } from "react";
import { AuthContext } from "../../contextAPIs/AuthProvider";
import { useNavigate } from "react-router-dom";
import SubTitle from "../../components/SubTitle";

const HotelOnboarding = () => {
  const { createUser, updateUserProfile } = useContext(AuthContext);
  const allowedExtensions = ["jpg", "jpeg", "png", "svg"];
  const [logoError, setLogoError] = useState("");
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
    setLogoError("");
    setLicenceError("");
    setPasswordError("");
    const {
      email,
      password,
      hotelName,
      confirm,
      logo,
      phoneNumber,
      address,
      hotelLicence,
    } = data;

    const accountInfo = { email, password };
    const hotelInformation = { email, hotelName, address, phoneNumber };

    const hotelInfo = {
      accountInfo,
      status: "Pending",
      verified: false,
      serviceCategory: "Hotel",
      hotelInformation,
    };

    const logoExt = logo[0].name.split(".")[1];
    const hotelLicenceExt = hotelLicence[0].name.split(".")[1];
    const isValidLogo = allowedExtensions.includes(logoExt);
    const isValidLicence = allowedExtensions.includes(hotelLicenceExt);

    if (password !== confirm) {
      return setPasswordError("Password doesn't matched");
    } else if (!isValidLogo) {
      return setLogoError("Allowed file extensions jpg, jpeg, png, svg");
    } else if (!isValidLicence) {
      return setLicenceError("Allowed file extensions jpg, jpeg, png, svg");
    }

    // creating the user into Firebase authentication

    // creating the user into Firebase authentication
    await createUser(email, password)
      .then(async (res) => {
        const createdUser = res.user;

        if (createdUser) {
          // adding users data to the useres collection
          await setDoc(doc(usersCollection, createdUser.uid), {
            email: email,
            displayName: hotelName,
            role: "Partner",
            status: "Pending",
            serviceCategory: "Hotel",
            uid: createdUser.uid,
          }).catch((error) => {
            console.log(error);
          });

          navigate("/dashboard");

          const logoRef = ref(storage, `${createdUser.uid}-profile`); // firebase storage to store profile img

          // Uploading the profile image to storage
          const logoTask = uploadBytesResumable(logoRef, logo[0]);
          logoTask.on(
            (error) => {
              console.log(error.message);
            },

            async () => {
              // getting the profile img url after uploading to the storage
              await getDownloadURL(logoTask.snapshot.ref).then(
                async (logoURL) => {
                  await updateUserProfile(hotelName, logoURL); //updating user name and logoURL
                  await updateDoc(doc(usersCollection, createdUser.uid), {
                    photoURL: logoURL,
                  });

                  hotelInfo.uid = createdUser.uid; // adding unique uid
                  hotelInfo.hotelInformation.logoURL = logoURL; // adding profile URL
                  await setDoc(
                    doc(hotelsCollection, createdUser.uid),
                    hotelInfo
                  );
                }
              );
            }
          );

          const licenceRef = ref(storage, `${createdUser.uid}-licence`); // firebase storage to store licence img
          // Uploading the driving licence to the storage
          const licenceTask = uploadBytesResumable(licenceRef, hotelLicence[0]);
          licenceTask.on(
            (error) => {
              console.log(error.message);
            },

            async () => {
              // getting the img url after uploading to the storage
              await getDownloadURL(licenceTask.snapshot.ref).then(
                async (licenceURL) => {
                  // adding service's data to the partners collection

                  hotelInfo.hotelInformation.licence = licenceURL;
                  await updateDoc(
                    doc(hotelsCollection, createdUser.uid),
                    hotelInfo
                  ).then(() =>
                    console.log("successfully set to the driver's collection")
                  );
                }
              );
            }
          );
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
    <div className="w-full min-h-screen flex items-center justify-center md:px-10 p-2 py-12 bg-[blue]">
      {/* form container */}
      <Paper
        elevation={3}
        sx={{
          p: { xs: 2, sm: 3, md: 4, lg: 5 },
          mx: "auto",
          width: { lg: "70%" },
        }}
      >
        <h3 className="text-center text-[blue] font-bold text-2xl mb-3">
          Hotel Onboarding Form
        </h3>

        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          {/* Account Information*/}
          <SubTitle text="Account & Hotel Information :" />

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

            {/* Restaurent Name */}
            {textField("Hotel Name", "hotelName", "Enter The Hotel Name")}

            {/* Hotel Logo */}
            {fileField("Hotel's Logo", "logo", logoError)}

            {/* Phone */}
            {textField("Phone Number", "phoneNumber", "12 345 6789")}

            {/* Location */}
            {textField("Location", "address", "Where is your hotel located?")}

            {/* Hotel Licence */}
            {fileField("Hotel Licence", "hotelLicence", licenceError)}
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

export default HotelOnboarding;
