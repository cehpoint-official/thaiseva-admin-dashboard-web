import Chats from "./Chats";
import Search from "./Search";

const Sidebar = ({ setOpenSidebar }) => {
  return (
    <div className="h-full bg-[#3e3c61] text-[#ddddf7]">
      <Search setOpenSidebar={setOpenSidebar} />
      <Chats setOpenSidebar={setOpenSidebar} />
    </div>
  );
};

export default Sidebar;
