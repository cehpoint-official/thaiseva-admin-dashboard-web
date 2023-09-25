import Sidebar from "./Sidebar";
import Chat from "./Chat";

const CustomerChat = () => {
  return (
    <div className="border-2 overflow-hidden h-[80vh] border-blue-300 rounded-lg flex">
      <Sidebar />
      <Chat />
    </div>
  );
};

export default CustomerChat;
