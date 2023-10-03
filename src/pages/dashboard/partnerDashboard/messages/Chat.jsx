import { useContext } from "react";
import { ChatContext } from "../../../../contextAPIs/ChatProvider";
import Input from "../../communication/Input";
import Messages from "./Messages";

const Chat = () => {
  const { data } = useContext(ChatContext);

  return (
    <div className="w-full h-full">
      <div className="h-16 p-3 flex gap-2 bg-[blue] items-center">
        <img
          src={data?.oppositeUser?.photoURL}
          alt=""
          className="h-10 w-10 rounded-full"
        />{" "}
        <p className="font-bold text-white">{data?.oppositeUser.displayName}</p>
      </div>
      <Messages />
      <Input />
    </div>
  );
};

export default Chat;
