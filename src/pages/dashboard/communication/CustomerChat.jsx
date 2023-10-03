import Sidebar from "./Sidebar";
import Chat from "./Chat";
import { useContext, useState } from "react";
import { AuthContext } from "../../../contextAPIs/AuthProvider";

const CustomerChat = () => {
  /*   const { loading, isAdmin, logOut } = useContext(AuthContext);
  console.log(loading, isAdmin);
  if (!isAdmin) {
    return logOut();
  } */
  const [openSidebar, setOpenSidebar] = useState(false);
  console.log(openSidebar);
  return (
    <div className="border-2 overflow-hidden md:h-[80vh] h-screen border-blue-300 rounded-lg flex relative">
      <div
        className={`md:w-4/12   ${
          openSidebar ? "absolute z-10 w-full left-0" : "-left-60"
        }`}
      >
        <Sidebar setOpenSidebar={setOpenSidebar} />
      </div>
      <div className="md:w-8/12">
        <Chat setOpenSidebar={setOpenSidebar} />
      </div>
    </div>
  );
};

export default CustomerChat;
