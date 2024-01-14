import { Typography } from "@mui/material";

const ServiceCategoryBtn = ({ value }) => {
  return (
    <Typography variant="div">
      <span className="font-semibold sm:inline-block hidden">Category : </span>{" "}
      <span className="bg-[blue] text-white text-sm font-bold py-1 px-2 rounded inline-block">
        {value}
      </span>
    </Typography>
  );
};

export default ServiceCategoryBtn;
