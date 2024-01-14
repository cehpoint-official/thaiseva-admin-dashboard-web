import { useContext, useState } from "react";
import { AuthContext } from "../../contextAPIs/AuthProvider";
import { Box, Button, Grid, Modal, Paper, TextField } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid blue",
  boxShadow: 24,
  p: 4,
};

const Login = () => {
  const { logInUser } = useContext(AuthContext);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    const form = e.target;
    const email = form.email.value;
    const password = form.password.value;

    logInUser(email, password)
      .then((res) => {
        const loggedUser = res.user;
        localStorage.setItem("email", email);
        localStorage.setItem("password", password);
        if (loggedUser) {
          navigate("/dashboard");
        }
      })
      .catch((error) => setError(error.message));
  };

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  return (
    <div className="w-screen h-screen flex items-center justify-center md:px-10 p-2 py-12 bg-[var(--primary-bg)]">
      {/* form container */}
      <Paper
        elevation={3}
        sx={{
          p: { xs: 2, sm: 3, md: 4 },
          mx: "auto",
          height: "fit-content",
          width: { xs: "100%", sm: "50%", md: "40%" },
        }}
        className="shadow-xl shadow-black"
      >
        <h3 className="text-center text-[var(--primary-bg)] font-bold text-2xl mb-3">
          Login
        </h3>
        <Box component="form" onSubmit={handleLogin}>
          <Grid container spacing={3}>
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

            {/* Password */}
            <Grid item xs={12}>
              <TextField
                label="Password"
                type="password"
                name="password"
                defaultValue=""
                fullWidth
              />
            </Grid>
          </Grid>
          {error && <span className="text-red-500">{error}</span>}
          <Box textAlign="center" sx={{ my: 2 }}>
            <Button
              type="submit"
              variant="contained"
              sx={{ backgroundColor: "var(--primary-bg)" }}
            >
              Login
            </Button>
          </Box>

          <div>
            Want to be a partner?{" "}
            <div
              onClick={handleOpen}
              className="text-[blue] underline inline-block"
            >
              Click Here
            </div>
          </div>
        </Box>
      </Paper>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <h3 className="font-bold text-xl text-slate-600">
            Which type of partner do you want to be?
          </h3>

          <ul className="list-disc pl-4">
            <li>
              <Link
                to="/partner-onboarding"
                className="online-block text-blue-600 hover:text-blue-800 underline"
              >
                Local Partner
              </Link>
            </li>
            <li>
              <Link
                to="/driver-onboarding"
                className="online-block text-blue-600 hover:text-blue-800 underline"
              >
                Driving
              </Link>
            </li>
            <li>
              <Link
                to="/restaurant-onboarding"
                className="online-block text-blue-600 hover:text-blue-800 underline"
              >
                Restaurant
              </Link>
            </li>
            <li>
              <Link
                to="/hotel-onboarding"
                className="online-block text-blue-600 hover:text-blue-800 underline"
              >
                Hotel Booking
              </Link>
            </li>
          </ul>
        </Box>
      </Modal>
    </div>
  );
};

export default Login;
