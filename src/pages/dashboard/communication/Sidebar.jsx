import Chats from "./Chats";
import Search from "./Search";

const Sidebar = ({ setOpenSidebar }) => {
  return (
    <div className="h-full bg-[#3e3c61] text-[#ddddf7]">
      {/* <div className="font-bold text-center h-16 p-3 bg-[#cfcfcf] text-xl text-[blue]">
        Partners Conversation
      </div> */}
      <Search setOpenSidebar={setOpenSidebar} />
      <Chats />
    </div>
  );
};

export default Sidebar;
