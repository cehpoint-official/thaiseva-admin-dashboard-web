import { useContext } from "react";
import Messages from "./Messages";
import { PartnerChatContext } from "../../../../contextAPIs/PartnerChatProvider";
import PartnerChatInput from "./PartnerChatInput";

const PartnerChats = () => {
  const { data } = useContext(PartnerChatContext);

  return (
    <div className="w-full  h-[calc(100vh-80px)] border-2 border-[#0000ff5a] rounded-lg overflow-hidden">
      <div className="h-16 p-3 flex gap-2 bg-[blue] items-center">
        <img
          src={data?.oppositeUser?.photoURL}
          alt=""
          className="h-10 w-10 rounded-full"
        />{" "}
        <p className="font-bold text-white">{data?.oppositeUser.displayName}</p>
      </div>
      <Messages />
      <PartnerChatInput />
    </div>
  );
};

export default PartnerChats;
