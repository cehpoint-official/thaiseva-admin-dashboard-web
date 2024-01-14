import { Tooltip } from "@mui/material";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";

const ViewDetailsIcon = ({ title }) => {
  return (
    <Tooltip title={title} arrow placement="top">
      <button className="bg-[var(--primary-bg)] text-white p-1 rounded">
        <RemoveRedEyeIcon />
      </button>
    </Tooltip>
  );
};

export default ViewDetailsIcon;
