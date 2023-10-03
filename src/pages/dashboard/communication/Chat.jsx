import { useContext } from "react";
import Messages from "./Messages";
import Input from "./Input";
import { ChatContext } from "../../../contextAPIs/ChatProvider";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import MenuIcon from "@mui/icons-material/Menu";

const Chat = ({ setOpenSidebar }) => {
  const { data } = useContext(ChatContext);

  return (
    <div className="w-full h-full">
      <div className=" p-3 bg-[blue] flex items-center justify-between text-white">
        <div className=" flex gap-2 items-center">
          <img
            src={data?.oppositeUser?.photoURL}
            alt=""
            className="h-10 w-10 rounded-full"
          />{" "}
          <p className="font-bold text-white">
            {data?.oppositeUser.displayName}
          </p>
        </div>
        <div className="font-bold flex items-center gap-2">
          <LocalPhoneIcon />
          <div onClick={() => setOpenSidebar((p) => !p)}>
            <MenuIcon sx={{ display: { sm: "block", md: "none" } }} />
          </div>
        </div>
      </div>
      <Messages />
      <Input />
    </div>
  );
};

export default Chat;
