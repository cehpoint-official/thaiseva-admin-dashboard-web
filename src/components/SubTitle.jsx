import { Typography } from "@mui/material";

const SubTitle = ({ text }) => {
  return (
    <Typography variant="h6" sx={{ color: "blue" }}>
      {text}
    </Typography>
  );
};

export default SubTitle;
