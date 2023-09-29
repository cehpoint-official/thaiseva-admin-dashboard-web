import { Tooltip } from "@mui/material";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";

const ViewDetailsIcon = () => {
  return (
    <Tooltip title="View Details" arrow placement="top">
      <button className="bg-[blue] text-white p-1 rounded">
        <RemoveRedEyeIcon />
      </button>
    </Tooltip>
  );
};

export default ViewDetailsIcon;
