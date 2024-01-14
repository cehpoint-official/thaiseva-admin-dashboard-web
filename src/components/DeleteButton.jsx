import { Tooltip } from "@mui/material";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

const DeleteButton = ({ title }) => {
  return (
    <Tooltip title={title} arrow placement="top">
      <button className="bg-red-500 text-white p-1 rounded">
        <DeleteForeverIcon />
      </button>
    </Tooltip>
  );
};

export default DeleteButton;
