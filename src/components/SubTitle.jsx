import { Typography } from "@mui/material";

const SubTitle = ({ text }) => {
  return (
    <Typography variant="h6" sx={{ color: "blue", my: 1 }}>
      {text}
    </Typography>
  );
};

export default SubTitle;
