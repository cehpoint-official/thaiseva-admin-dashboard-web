import { useContext } from "react";
import Messages from "./Messages";
import { PartnerChatContext } from "../../../../contextAPIs/PartnerChatProvider";
import PartnerChatInput from "./PartnerChatInput";

const PartnerChats = () => {
  const { data } = useContext(PartnerChatContext);

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
      <PartnerChatInput />
    </div>
  );
};

export default PartnerChats;
