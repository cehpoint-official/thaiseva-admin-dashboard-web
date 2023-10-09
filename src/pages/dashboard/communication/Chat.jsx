import { useContext } from "react";
import Messages from "./Messages";
import Input from "./Input";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import MenuIcon from "@mui/icons-material/Menu";
import { AdminChatContext } from "../../../contextAPIs/AdminChatProvider";

const Chat = ({ setOpenSidebar }) => {
  const { data } = useContext(AdminChatContext);

  return (
    <div className="w-full h-full rounded-lg ">
      <div className=" p-3 bg-[blue] z-10 flex items-center justify-between text-white">
        <div className=" flex gap-2 items-center">
          <img
            src={data?.oppositeUser?.photoURL}
            alt=""
            className="h-10 w-10 rounded-full"
          />{" "}
          <p className="font-bold text-white">
            {data?.oppositeUser?.displayName}
          </p>
        </div>
        <div className="font-bold flex items-center gap-2 text-2xl">
          <div>
            <LocalPhoneIcon />
          </div>
          <div
            onClick={() => setOpenSidebar((p) => !p)}
            className="lg:hidden block"
          >
            <MenuIcon />
          </div>
        </div>
      </div>

      <Messages />

      <Input />
    </div>
  );
};

export default Chat;
