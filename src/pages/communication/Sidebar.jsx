import ChatNav from "./ChatNav";
import Chats from "./Chats";
import Search from "./Search";

const Sidebar = () => {
  return (
    <div className="flex-1 w-4/12 bg-[#3e3c61] text-[#ddddf7]">
      <ChatNav />
      <Search />
      <Chats />
    </div>
  );
};

export default Sidebar;
