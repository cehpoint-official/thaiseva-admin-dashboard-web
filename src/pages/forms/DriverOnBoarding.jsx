import { Box, Button, Grid, Paper, TextField } from "@mui/material";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  chatRoomsCollection,
  chatsCollection,
  driversCollection,
  usersCollection,
} from "../../firebase/firebase.config";
import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { useContext } from "react";
import { AuthContext } from "../../contextAPIs/AuthProvider";
import { useNavigate } from "react-router-dom";
import SubTitle from "../../components/SubTitle";
import { getFileUrl } from "../../utils/utils";

const DriverOnBoarding = () => {
  const { createUser, updateUserProfile } = useContext(AuthContext);
  const [error, setError] = useState({ for: "", text: "" });
  const [photoURL, setPhotoURL] = useState("");
  const [license, setLicense] = useState("");
  const navigate = useNavigate();

  const {
    handleSubmit,
    // reset,
    register,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setError({ for: "", text: "" });
    const {
      email,
      password,
      fullName,
      confirm,
      address,
      phoneNumber,
      numberPlate,
      serviceArea,
      vehicleType,
      bankName,
      accountNumber,
      bankAddress,
    } = data;

    const accountInfo = { email, password };
    const driverInformation = {
      email,
      fullName,
      phoneNumber,
      address,
      photoURL,
      license,
    };
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

    if (password !== confirm) {
      return setError({ for: "password", text: "Password doesn't matched" });
    } else if (!photoURL) {
      return setError({ for: "profile", text: "Profile is required" });
    } else if (!license) {
      return setError({ for: "license", text: "Driving license is required" });
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
          await updateUserProfile(fullName, photoURL); //updating user name and photoURL
          await setDoc(doc(driversCollection, createdUser.uid), serviceInfo);

          const hasRoom = await getDoc(
            doc(chatRoomsCollection, "DriversSupport")
          );

          if (!hasRoom.exists()) {
            // creating conversation for thaiseva admin
            await setDoc(doc(chatRoomsCollection, "DriversSupport"), {
              [createdUser.uid + "_DriversSupport"]: {
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
            await updateDoc(doc(chatRoomsCollection, "DriversSupport"), {
              [createdUser.uid + "_DriversSupport"]: {
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
            doc(chatsCollection, createdUser.uid + "_DriversSupport"),
            { messages: [] }
          );
        }
      })
      .catch((error) => console.log(error));
  };

  // upload profile
  const handleUploadProfile = async (e) => {
    const { files } = e.target;
    setError({ for: "", text: "" });
    const result = await getFileUrl(files);
    if (result?.error) {
      setError({ for: "profile", text: result.message });
    } else {
      setPhotoURL(result.url);
    }
  };

  // upload licence
  const handleUploadLicense = async (e) => {
    const { files } = e.target;
    setError({ for: "", text: "" });
    const result = await getFileUrl(files);
    if (result?.error) {
      setError({ for: "license", text: result.message });
    } else {
      setLicense(result.url);
    }
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

  // custom file field for profile and license
  const fileField = (label, name) => {
    return (
      <Grid item xs={12} sm={6} md={4}>
        <TextField
          label={"Select " + label}
          type="file"
          fullWidth
          InputLabelProps={{ shrink: true }}
          onChange={
            name === "profile" ? handleUploadProfile : handleUploadLicense
          }
        />

        {error?.for === name && (
          <span className="text-red-500">{error.text}</span>
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
              {error.for === "password" && (
                <span className="text-red-500 text-sm">{error.text}</span>
              )}
            </Grid>

            {/* Full Name */}
            {textField("Full Name", "fullName", "Enter Your Full Name")}

            {/* Profile Picture */}
            {fileField("Profile Picture", "profile")}

            {/* Phone */}
            {textField("Phone Number", "phoneNumber", "12 345 6789")}

            {/* Address */}
            {textField("Address", "address", "Type your current address")}

            {/* Driving License */}
            {fileField("Driving License", "drivingLicense")}
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
