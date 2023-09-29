import { useContext } from "react";
import Messages from "./Messages";
// import { Input } from "postcss";
import Input from "./Input";
import { ChatContext } from "../../../../contextAPIs/ChatProvider";

const Chat = () => {
  const { data } = useContext(ChatContext);
  return (
    <div className="w-8/12">
      <div className="h-12 p-3">{data?.oppositeUser.displayName}</div>
      <Messages />
      <Input />
    </div>
  );
};

export default Chat;
