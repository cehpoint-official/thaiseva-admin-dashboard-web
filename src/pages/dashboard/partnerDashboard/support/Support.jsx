import { Box, Button, Grid, Paper, TextField } from "@mui/material";
import PageHeading from "../../../../components/PageHeading";
import { useContext } from "react";
import { ChatContext } from "../../../../contextAPIs/ChatProvider";
import { AuthContext } from "../../../../contextAPIs/AuthProvider";
import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../../../firebase/firebase.config";

const Support = () => {
  const { dispatch } = useContext(ChatContext);
  const { user } = useContext(AuthContext);

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const handleSelect = async () => {
    const adminInfo = {
      uid: "ThaisevaAdmin",
      displayName: "Admin Support",
      photoURL:
        "https://images.pexels.com/photos/3823488/pexels-photo-3823488.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2", // todo : thaiseva logo
    };

    dispatch({ type: "CHANGE_USER", payload: adminInfo });

    const conversationId =
      "ThaisevaAdmin" > user?.uid
        ? "ThaisevaAdmin" + user.uid
        : user.uid + "ThaisevaAdmin";

    try {
      const res = await getDoc(doc(db, "chats", conversationId));

      if (!res.exists()) {
        await setDoc(doc(db, "chats", conversationId), { message: [] });

        // creating conversation for thaiseva admin
        await updateDoc(doc(db, "userChats", "ThaisevaAdmin"), {
          [conversationId + ".userInfo"]: {
            uid: user.uid,
            displayName: user.displayName,
            photoURL: user.photoURL,
          },
          [conversationId + ".date"]: serverTimestamp(),
        });

        // creating conversation for user
        await updateDoc(doc(db, "userChats", user.uid), {
          [conversationId + ".userInfo"]: {
            uid: "ThaisevaAdmin",
            displayName: "Admin Support",
            photoURL:
              "https://images.pexels.com/photos/3823488/pexels-photo-3823488.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2", // todo : thaiseva logo
          },
          [conversationId + ".date"]: serverTimestamp(),
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <PageHeading text={"Admin Support"} />

      <div className="flex lg:flex-row flex-col">
        <div className="flex-1">
          <Paper
            elevation={3}
            sx={{
              p: { xs: 2, sm: 3, md: 4 },
              mt: 3,
              mx: "auto",
              height: "fit-content",
              width: { xs: "100%", sm: "100%", md: "60%" },
            }}
          >
            <h3 className="text-center text-[blue] font-bold md:text-xl mb-3">
              Need help? Write here we will response as soon as possible.
            </h3>
            <Box component="form" onSubmit={handleSubmit}>
              <Grid container spacing={{ xs: 1, sm: 2, md: 3 }}>
                {/* Email */}
                <Grid item xs={12}>
                  <TextField
                    label="Email"
                    type="email"
                    name="email"
                    defaultValue=""
                    fullWidth
                  />
                </Grid>

                {/* Subject */}
                <Grid item xs={12}>
                  <TextField
                    label="Subject"
                    type="text"
                    name="subject"
                    defaultValue=""
                    fullWidth
                  />
                </Grid>

                {/* Message */}
                <Grid item xs={12}>
                  <TextField
                    id="outlined-multiline-flexible"
                    label="Message"
                    multiline
                    fullWidth
                    rows={4}
                  />
                </Grid>
              </Grid>
              <Box textAlign="center" sx={{ mt: 2 }}>
                <Button type="submit" variant="contained" color="primary">
                  Send
                </Button>
              </Box>
            </Box>
          </Paper>
        </div>
        {/* <div className="flex-1">
          <button onClick={handleSelect} className="">
            Add Admin
          </button>
        </div> */}
      </div>
    </div>
  );
};

export default Support;
