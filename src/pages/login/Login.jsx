import { useContext, useState } from "react";
import { AuthContext } from "../../contextAPIs/AuthProvider";
import { Box, Button, Grid, Paper, TextField } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";

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
        if (loggedUser) {
          navigate("/dashboard");
        }
      })
      .catch((error) => setError(error.message));
  };
  return (
    <div className="w-screen h-screen flex items-center justify-center md:px-10 p-2 py-12 bg-[blue]">
      {/* form container */}
      <Paper
        elevation={3}
        sx={{
          p: { xs: 2, sm: 3, md: 4 },
          mx: "auto",
          height: "fit-content",
          width: { xs: "100%", sm: "50%", md: "40%" },
        }}
      >
        <h3 className="text-center text-[blue] font-bold text-2xl mb-3">
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
            <Button type="submit" variant="contained" color="primary">
              Submit
            </Button>
          </Box>

          <p>
            Want to be a partner?{" "}
            <Link to="/register" className="text-[blue] underline">
              Register
            </Link>
          </p>
        </Box>
      </Paper>
    </div>
  );
};

export default Login;
