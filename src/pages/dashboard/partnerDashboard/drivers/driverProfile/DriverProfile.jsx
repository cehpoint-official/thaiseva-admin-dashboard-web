import { doc, updateDoc } from "firebase/firestore";
import { useContext, useState } from "react";

import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useForm } from "react-hook-form";
import { isValidPhoneNumber } from "react-phone-number-input";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { PartnerContext } from "../../../../../contextAPIs/PartnerProvider";
import { AuthContext } from "../../../../../contextAPIs/AuthProvider";
import {
  driversCollection,
  storage,
  usersCollection,
} from "../../../../../firebase/firebase.config";
import PageHeading from "../../../../../components/PageHeading";
import { successNotification } from "../../../../../components/Notifications";

const DriverProfile = () => {
  const { partnerDetails, setRefetch } = useContext(PartnerContext);
  const [profileEditModal, setProfileEditModal] = useState(false);
  const { user, updateUserProfile } = useContext(AuthContext);
  const [error, setError] = useState("");
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();

  /* ===============================================================
                          Handle Update Profile start
  ===============================================================*/
  // Handle form submission
  const handleUpdateProfile = async (data) => {
    setError("");
    const {
      fullName,
      profile,
      address,
      phoneNumber,
      numberPlate,
      serviceArea,
      vehicleType,
      bankName,
      accountNumber,
      bankAddress,
    } = data;

    // validating phone number
    const valid = isValidPhoneNumber(`+66 ${phoneNumber}`);
    if (!valid) {
      return setError("Invalid Number");
    }

    let photoURL = partnerDetails.driverInformation.photoURL || "";
    const driverInformation = {
      email: partnerDetails.driverInformation.email,
      drivingLicence: partnerDetails.driverInformation.drivingLicence,
      fullName,
      photoURL,
      phoneNumber,
      address,
    };
    const vehicleInformation = { numberPlate, vehicleType };
    const paymentInformation = { bankName, accountNumber, bankAddress };

    const updatedInfo = {
      status: partnerDetails.status,
      verified: partnerDetails.verified,
      driverInformation,
      vehicleInformation,
      serviceArea,
      serviceCategory: partnerDetails.serviceCategory,
      paymentInformation,
    };

    // adding users data to the useres collection
    await updateDoc(doc(usersCollection, user?.uid), {
      displayName: fullName,
    }).catch((error) => console.log(error));

    await updateDoc(doc(driversCollection, user?.uid), updatedInfo);

    const storageRef = ref(storage, user?.uid); // firebase storage to store profile img

    if (profile.length) {
      // Uploading the image to storage
      const uploadTask = uploadBytesResumable(storageRef, profile[0]);
      uploadTask.on(
        (error) => {
          console.log(error.message);
        },

        async () => {
          // getting the img url after uploading to the storage
          await getDownloadURL(uploadTask.snapshot.ref).then(async (imgURL) => {
            await updateUserProfile(fullName, imgURL); //updating user name and photoURL

            updatedInfo.driverInformation.photoURL = imgURL;
            // adding users data to the useres collection
            await updateDoc(doc(usersCollection, user?.uid), {
              photoURL: imgURL,
            });

            await updateDoc(
              doc(driversCollection, user?.uid),
              updatedInfo
            ).then(() => setRefetch((prev) => !prev));
          });
        }
      );
    }
    successNotification("Profile updated successfully.", "success");
    setRefetch((prev) => !prev);
    setProfileEditModal(false);
  };
  /* ===============================================================
                          Handle Update Profile End
  ===============================================================*/

  return (
    <div>
      <PageHeading text={"Partner's Profile"} />
      <div className="border border-[blue] rounded p-5 lg:mx-20 my-5 bg-blue-100 shadow-lg shadow-[#0000006d] pb-5">
        <div className="flex items-center justify-between mb-2 gap-2">
          <div className="inline-flex items-center gap-2 md:font-bold">
            <span className="md:block hidden">Service Category : </span>
            <div className="bg-[blue] py-1  md:text-lg text-sm px-2 rounded text-white">
              {partnerDetails.serviceCategory}
            </div>
          </div>
          <button
            onClick={() => setProfileEditModal(true)}
            className="text-[blue] py-1 px-2 md:text-lg text-sm inline-block rounded border-2 border-[blue]"
          >
            Edit Profile
          </button>
        </div>
        <img
          src={partnerDetails?.driverInformation?.photoURL}
          alt=""
          className="md:w-60 md:h-60 w-40 h-40 rounded-full border-4 border-blue-500 mx-auto"
        />

        {/* partner's details  */}
        <div className="flex md:flex-row flex-col flex-wrap gap-3 justify-between mt-3">
          <div className="mb-3 flex-1">
            <h5 className="font-bold text-lg mb-2 text-[blue] border-b border-blue-500">
              Personal Information:{" "}
            </h5>
            <div className="space-y-1">
              <p>
                <span className="font-bold">Name : </span>
                {partnerDetails?.driverInformation?.fullName}
              </p>
              <p>
                <span className="font-bold">Email : </span>
                {partnerDetails?.driverInformation?.email}
              </p>
              <p>
                <span className="font-bold">Phone Number : </span>
                {partnerDetails?.driverInformation?.phoneNumber}
              </p>
              <p>
                <span className="font-bold">Address : </span>
                {partnerDetails?.driverInformation?.address}
              </p>
            </div>
          </div>
          <div className="mb-3 flex-1">
            <h5 className="font-bold text-lg mb-2 text-[blue] border-b border-blue-500">
              Service Information:{" "}
            </h5>
            <div className="space-y-1">
              <p>
                <span className="font-bold">Service Area : </span>
                {partnerDetails?.serviceArea}
              </p>
              <p>
                <span className="font-bold">Vehicle Type : </span>
                {partnerDetails?.vehicleInformation?.vehicleType}
              </p>
              <p>
                <span className="font-bold">Vehicles : </span>
                {partnerDetails?.vehicleInformation?.numberPlate}
              </p>
            </div>
          </div>
          <div className="mb-3 flex-1">
            <h5 className="font-bold text-lg mb-2 text-[blue] border-b border-blue-500">
              Payment Information:{" "}
            </h5>
            <div className="space-y-1">
              <p>
                <span className="font-bold">Bank Name : </span>
                {partnerDetails?.paymentInformation?.bankName}
              </p>
              <p>
                <span className="font-bold">Account Number : </span>
                {partnerDetails?.paymentInformation?.accountNumber}
              </p>
              <p>
                <span className="font-bold">Bank Address : </span>
                {partnerDetails?.paymentInformation?.bankAddress}
              </p>
            </div>
          </div>
        </div>
        {/* driving licence */}
        <span className="font-bold">Your Licence : </span>
        <img
          src={partnerDetails?.driverInformation?.drivingLicence}
          alt=""
          className="md:h-[60vh] md:w-3/4 mx-auto"
        />
      </div>

      <Dialog
        open={profileEditModal}
        onClose={() => setProfileEditModal(false)}
        aria-labelledby="responsive-dialog-title"
      >
        <Box component="form" onSubmit={handleSubmit(handleUpdateProfile)}>
          <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
            Update Profile
          </DialogTitle>
          <IconButton
            aria-label="close"
            onClick={() => setProfileEditModal(false)}
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
            <Typography variant="h6" sx={{ my: 1, fontWeight: "bold" }}>
              Personal Information :
            </Typography>

            {/* personal information */}
            <Grid container spacing={3}>
              {/* Full Name */}
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Full Name"
                  type="text"
                  defaultValue={partnerDetails?.driverInformation?.fullName}
                  fullWidth
                  {...register("fullName", { required: true })}
                />
                {errors?.fullName && (
                  <span className="text-red-500">Full Name is required</span>
                )}
              </Grid>

              {/* Profile Picture */}
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Select Profile Picture"
                  type="file"
                  //   defaultValue={partnerDetails?.driverInformation?.photoURL}
                  placeholder=""
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  {...register("profile")}
                />
              </Grid>

              {/* Phone */}
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Phone Number"
                  placeholder="12 345 6789"
                  type="tel"
                  defaultValue={partnerDetails?.driverInformation?.phoneNumber}
                  fullWidth
                  {...register("phoneNumber", { required: true })}
                />
                {error.includes("Number") && (
                  <span className="text-red-500">{error}</span>
                )}
              </Grid>

              {/* Address */}
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Address"
                  type="text"
                  defaultValue={partnerDetails?.driverInformation?.address}
                  // placeholder="Type your current address."
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
              Service information :
            </Typography>
            <Grid container spacing={3}>
              {/* Service Area */}
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Which location will you provide the service?"
                  type="text"
                  defaultValue={partnerDetails?.serviceArea}
                  fullWidth
                  {...register("serviceArea", { required: true })}
                />
                {errors?.serviceArea && (
                  <span className="text-red-500">Service Area is required</span>
                )}
              </Grid>

              {/* Number Plate */}
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Number Plate"
                  type="text"
                  defaultValue={partnerDetails?.vehicleInformation?.numberPlate}
                  fullWidth
                  inputProps={{
                    min: 0,
                  }}
                  {...register("numberPlate", { required: true })}
                />
                {errors?.numberPlate && (
                  <span className="text-red-500">Number Plate is required</span>
                )}
              </Grid>

              {/* Vehicle Type */}
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Vehicle Type"
                  type="text"
                  defaultValue={partnerDetails?.vehicleInformation?.vehicleType}
                  fullWidth
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
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Bank Name"
                  type="text"
                  defaultValue={partnerDetails?.paymentInformation?.bankName}
                  placeholder="You will get paid in this bank"
                  fullWidth
                  {...register("bankName", { required: true })}
                />
                {errors?.bankName && (
                  <span className="text-red-500">Bank Name is required</span>
                )}
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Account Number"
                  type="text"
                  defaultValue={
                    partnerDetails?.paymentInformation?.accountNumber
                  }
                  placeholder="Type the number carefully"
                  fullWidth
                  rows={6}
                  {...register("accountNumber", { required: true })}
                />
                {errors?.accountNumber && (
                  <span className="text-red-500">
                    Account Number is required
                  </span>
                )}
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Bank Address"
                  type="text"
                  defaultValue={partnerDetails?.paymentInformation?.bankAddress}
                  placeholder="Where is the branch located?"
                  fullWidth
                  {...register("bankAddress", { required: true })}
                />
                {errors?.bankAddress && (
                  <span className="text-red-500">Bank Address is required</span>
                )}
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button
              variant="contained"
              type="submit"
              autoFocus
              sx={{ bgcolor: "blue", color: "white", hover: "none" }}
            >
              Update
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </div>
  );
};

export default DriverProfile;
