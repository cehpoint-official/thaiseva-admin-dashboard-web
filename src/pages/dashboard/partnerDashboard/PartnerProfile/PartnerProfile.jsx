import { doc, updateDoc } from "firebase/firestore";
import { useContext, useState } from "react";
import {
  partnersCollection,
  storage,
  usersCollection,
} from "../../../../firebase/firebase.config";
import { AuthContext } from "./../../../../contextAPIs/AuthProvider";
import PageHeading from "../../../../components/PageHeading";
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
import { PartnerContext } from "../../../../contextAPIs/PartnerProvider";

const PartnerProfile = () => {
  const { partnerDetails, setRefetch } = useContext(PartnerContext);
  const [profileEditModal, setProfileEditModal] = useState(false);
  const { user, updateUserProfile } = useContext(AuthContext);
  const [error, setError] = useState("");

  console.log(partnerDetails);

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
      address,
      phoneNumber,
      serviceArea,
      educationalBackground,
      numberOfVehicles,
      bankName,
      accountNumber,
      bankAddress,
      profile,
    } = data;

    // validating phone number
    const valid = isValidPhoneNumber(`+66 ${phoneNumber}`);
    if (!valid) {
      return setError("Invalid Number");
    }

    const personalInformation = {
      email: user?.email,
      fullName,
      phoneNumber,
      address,
    };

    const serviceInformation = {
      serviceArea,
      servicesOffered: partnerDetails?.serviceInformation?.servicesOffered,
    };

    const paymentInformation = { bankName, accountNumber, bankAddress };

    // modifing service information based on service category
    if (
      partnerDetails?.serviceCategory === "Official Work" ||
      partnerDetails?.serviceCategory === "Legal Administrative"
    ) {
      serviceInformation.educationalBackground = educationalBackground;
    } else if (
      partnerDetails?.serviceCategory === "Logistics and Transportation" ||
      partnerDetails?.serviceCategory === "Order Pick Up"
    ) {
      serviceInformation.numberOfVehicles = numberOfVehicles;
    }

    const updatedInfo = {
      personalInformation,
      serviceInformation,
      paymentInformation,
    };

    // adding users data to the useres collection
    await updateDoc(doc(usersCollection, user?.uid), {
      displayName: fullName,
    });

    await updateDoc(doc(partnersCollection, user?.uid), updatedInfo).catch(() =>
      console.log(" error")
    );

    const storageRef = ref(storage, user?.uid); // firebase storage to store profile img

    if (profile[0]) {
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

            // adding users data to the useres collection
            await updateDoc(doc(usersCollection, user?.uid), {
              photoURL: imgURL,
            });

            await updateDoc(doc(partnersCollection, user?.uid), {
              photoURL: imgURL,
            }).then(() => setRefetch((prev) => !prev));
          });
        }
      );
    }
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
          src={partnerDetails?.photoURL}
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
                {partnerDetails?.personalInformation?.fullName}
              </p>
              <p>
                <span className="font-bold">Email : </span>
                {partnerDetails?.personalInformation?.email}
              </p>
              <p>
                <span className="font-bold">Phone Number : </span>
                {partnerDetails?.personalInformation?.phoneNumber}
              </p>
              <p>
                <span className="font-bold">Address : </span>
                {partnerDetails?.personalInformation?.address}
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
                {partnerDetails?.serviceInformation?.serviceArea}
              </p>
              {partnerDetails?.serviceInformation?.educationalBackground && (
                <p>
                  <span className="font-bold">Institute : </span>
                  {partnerDetails?.serviceInformation?.educationalBackground}
                </p>
              )}
              {partnerDetails?.serviceInformation?.numberOfVehicles && (
                <p>
                  <span className="font-bold">Vehicles : </span>
                  {partnerDetails?.serviceInformation?.numberOfVehicles}
                </p>
              )}
              {partnerDetails?.serviceInformation?.vechicleTypes && (
                <p>
                  <span className="font-bold">Vehicles : </span>
                  {partnerDetails?.serviceInformation?.vechicleTypes}
                </p>
              )}
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
                  defaultValue={partnerDetails?.personalInformation?.fullName}
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
                  defaultValue={partnerDetails?.personalInformation?.photoURL}
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
                  defaultValue={
                    partnerDetails?.personalInformation?.phoneNumber
                  }
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
                  defaultValue={partnerDetails?.personalInformation?.address}
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
                  defaultValue={partnerDetails?.serviceInformation?.serviceArea}
                  fullWidth
                  {...register("serviceArea", { required: true })}
                />
                {errors?.serviceArea && (
                  <span className="text-red-500">Service Area is required</span>
                )}
              </Grid>

              {/* Number of Vehicles */}
              {(partnerDetails?.serviceCategory ===
                "Logistics and Transportation" ||
                partnerDetails?.serviceCategory === "Order Pick Up") && (
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Number of Vehicles"
                    type="number"
                    defaultValue={
                      partnerDetails?.serviceInformation?.numberOfVehicles
                    }
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

              {/* Educational Background */}
              {(partnerDetails?.serviceCategory === "Legal Administrative" ||
                partnerDetails?.serviceCategory === "Official Work") && (
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Institution Name"
                    type="text"
                    defaultValue={
                      partnerDetails?.serviceInformation?.educationalBackground
                    }
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

export default PartnerProfile;
