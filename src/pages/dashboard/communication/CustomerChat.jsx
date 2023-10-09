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

  return (
    <div className="border-2 overflow-hidden  h-[calc(100vh-80px)] border-blue-300 rounded-lg flex relative">
      <div
        className={`lg:w-4/12 w-full h-full duration-300 z-10 lg:static absolute ${
          openSidebar ? "top-0 left-0" : "-left-full"
        }`}
      >
        <Sidebar setOpenSidebar={setOpenSidebar} />
      </div>
      <div className="lg:w-8/12 w-full h-full">
        <Chat setOpenSidebar={setOpenSidebar} />
      </div>
    </div>
  );
};

export default CustomerChat;
