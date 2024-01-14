import { useContext, useState } from "react";
import { AuthContext } from "../../../contextAPIs/AuthProvider";
import { useEffect } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../../../firebase/firebase.config";
import { AdminChatContext } from "../../../contextAPIs/AdminChatProvider";
import { Tooltip } from "@mui/material";
import { PartnerContext } from "../../../contextAPIs/PartnerProvider";

const Chats = ({ setOpenSidebar }) => {
  const [chats, setChats] = useState([]);
  const { user } = useContext(AuthContext);
  const { dispatch } = useContext(AdminChatContext);
  const { chatRoom } = useContext(PartnerContext);

  useEffect(() => {
    const getChats = async () => {
      const unsub = onSnapshot(doc(db, "chatRooms", chatRoom), (doc) => {
        setChats(doc.data());
      });

      () => {
        return unsub();
      };
    };

    user.uid && getChats();
  }, [user, chatRoom]);

  const handleSelect = async (userInfo) => {
    dispatch({ type: "CHANGE_USER", payload: userInfo[1].userInfo });

    setOpenSidebar(false);
  };

  return (
    <div className="h-full overflow-y-scroll">
      {chats &&
        Object?.entries(chats)
          ?.sort((a, b) => b[1].date - a[1].date)
          .map((chat) => (
            <Tooltip key={chat[0]} arrow title="Tap to chat" placement="top">
              <div
                className=" p-2 flex justify-between cursor-pointer hover:bg-[#2f2d52]"
                onClick={() => handleSelect(chat)}
              >
                <div
                  className={`flex items-center gap-2 w-full relative ${
                    chat[1]?.isRead === false ? "font-bold " : ""
                  }`}
                >
                  <img
                    src={chat[1].userInfo?.photoURL}
                    alt=""
                    className="w-10 h-10 rounded-full bg-transparent"
                  />

                  <div>
                    <p className="font-bold text-white pb-0 -mb-1">
                      {chat[1]?.userInfo?.displayName?.length > 19
                        ? chat[1]?.userInfo?.displayName?.slice(0, 20) + "..."
                        : chat[1]?.userInfo?.displayName}
                    </p>
                    {chat[1]?.lastMessage?.text && (
                      <span className="text-sm text-[lightgray]">
                        {chat[1]?.lastMessage?.text?.length > 19
                          ? chat[1]?.lastMessage?.text?.slice(0, 20) + "..."
                          : chat[1]?.lastMessage?.text}
                      </span>
                    )}

                    {chat[1]?.audioUrl && (
                      <span className="text-sm text-[lightgray]">
                        Sent an Audio
                      </span>
                    )}
                    {chat[1]?.imgUrl && (
                      <span className="text-sm text-[lightgray]">
                        Sent an Image
                      </span>
                    )}
                  </div>
                  {chat[1]?.isRead === false && (
                    <span className="bg-orange-500 text-white py-1 px-2 rounded absolute top-1 right-8">
                      New
                    </span>
                  )}
                </div>
                <div className="text-sm">
                  {new Date(chat[1]?.date?.seconds * 1000).toLocaleDateString()}
                </div>
              </div>
            </Tooltip>
          ))}
    </div>
  );
};

export default Chats;
