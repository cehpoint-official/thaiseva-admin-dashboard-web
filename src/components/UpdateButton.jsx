import { Tooltip } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";

const UpdateButton = ({ title }) => {
  return (
    <Tooltip title={title} arrow placement="top">
      <button className="bg-orange-500 text-white p-1 rounded">
        <EditIcon />
      </button>
    </Tooltip>
  );
};

export default UpdateButton;
