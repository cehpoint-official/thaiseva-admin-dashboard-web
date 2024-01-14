import { Grid } from "@mui/material";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import Swal from "sweetalert2";
import { storage } from "../firebase/firebase.config";

// calculating discount price
const calculateDiscountPrice = (price, percent) => {
  const discount = (parseFloat(percent) / 100) * parseFloat(price);
  const discountPrice = parseFloat(price) - discount;
  return discountPrice.toFixed(2);
};

// getting the ago time based on the booking time

function timeAgo(date) {
  const currentDate = new Date();
  const timestamp = new Date(date);
  const timeDifference = currentDate - timestamp;
  const minutes = Math.floor(timeDifference / 60000); // 1 minute = 60,000 milliseconds
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (minutes < 1) {
    return "Just now";
  } else if (minutes === 1) {
    return "1 min ago";
  } else if (minutes < 60) {
    return minutes + " mins ago";
  } else if (hours === 1) {
    return "1 hour ago";
  } else if (hours < 24) {
    return hours + " hours ago";
  } else if (days === 1) {
    return "1 day ago";
  } else {
    return days + " days ago";
  }
}

function updateDynamicTimeDisplay(initialDate) {
  const time = timeAgo(initialDate);

  return time;
}

const successNotification = (text) => {
  return Swal.fire({
    position: "bottom-end",
    icon: "success",
    title: text,
    showConfirmButton: false,
    timer: 1500,
  });
};

const askingForDelete = () => {
  return Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "blue",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
  });
};

const deleteNotification = (text) => {
  return Swal.fire("Deleted!", text, "success");
};

const simpleNotification = (text) => {
  return Swal.fire({
    title: text,
    showCancelButton: false, // Hide the cancel button
    confirmButtonText: "OK",
    confirmButtonColor: "blue",
  });
};

// custom text field for common data
const item = (label, value, is12) => {
  return (
    <Grid item xs={12} sm={is12 ? 12 : 6}>
      <p className="">
        <span className="font-bold">{label}: </span>
        <span className="text-slate-600"> {value}</span>
      </p>
    </Grid>
  );
};

const getFileUrl = async (files) => {
  const allowedExtensions = ["jpg", "jpeg", "png"];
  let err = "";
  let url = "";

  const file = files[0];
  const fileExt = file.name.split(".")[1];
  const isValidFile = allowedExtensions.includes(fileExt);

  if (!isValidFile) {
    err = "Allowed file extensions jpg, jpeg, png";
    return { error: true, message: err };
  }

  const fileRef = ref(storage, `${file.lastModified}-file`); // firebase storage to store license img
  //  // Uploading the file image to storage
  const fileTask = await uploadBytesResumable(fileRef, file);

  // Get the download URL
  const photoURL = await getDownloadURL(fileTask.ref);

  if (photoURL) {
    url = photoURL;
  }

  return { error: false, url };
};

function calculateTimeAgo(timestamp) {
  const currentTimestamp = new Date();
  const firestoreTimestamp = new Date(
    timestamp?.seconds * 1000 + timestamp?.nanoseconds / 1000000
  ); // Convert Firestore timestamp to JavaScript Date
  // console.log(currentTimestamp, firestoreTimestamp);
  const timeDifference = currentTimestamp - firestoreTimestamp;
  // console.log(timeDifference);
  const minutes = Math.floor(timeDifference / 60000); // 1 minute = 60,000 milliseconds
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (minutes < 1) {
    return "Just now";
  } else if (minutes === 1) {
    return "1 min ago";
  } else if (minutes < 60) {
    return minutes + " mins ago";
  } else if (hours === 1) {
    return "1 hour ago";
  } else if (hours < 24) {
    return hours + " hours ago";
  } else if (days === 1) {
    return "1 day ago";
  } else {
    return days + " days ago";
  }
}

const handleRedirectWhatsApp = (phoneNumber) => {
  const stringNum = String(phoneNumber);
  let numWithCode = "";
  const haveCountryCode = stringNum.startsWith(88);
  if (!haveCountryCode) {
    numWithCode = "88" + stringNum;
  }

  const url = `https://wa.me/${numWithCode}?text= `;
  window.location.href = url;
};

const amountCalculator = (array) => {
  let total = array?.reduce((total, current) => total + current?.amount, 0);

  return total;
};

const dateCalculator = (timestamp) => {
  const seconds = new Date(timestamp?.seconds * 1000);
  const date = seconds.toLocaleDateString();

  return date;
};

const timeCalculator = (timestamp) => {
  const seconds = new Date(timestamp?.seconds * 1000);
  const time = seconds?.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return time;
};

export {
  calculateDiscountPrice,
  updateDynamicTimeDisplay,
  successNotification,
  askingForDelete,
  deleteNotification,
  simpleNotification,
  item,
  getFileUrl,
  calculateTimeAgo,
  amountCalculator,
  handleRedirectWhatsApp,
  dateCalculator,
  timeCalculator,
};
