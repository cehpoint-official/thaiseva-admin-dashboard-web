import { useContext, useState } from "react";
import { AuthContext } from "../../../contextAPIs/AuthProvider";
import { useEffect } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../../../firebase/firebase.config";
import { ChatContext } from "../../../contextAPIs/ChatProvider";
import { Tooltip } from "@mui/material";

const Chats = () => {
  const [chats, setChats] = useState([]);

  const { user } = useContext(AuthContext);
  const { dispatch } = useContext(ChatContext);

  useEffect(() => {
    const getChats = async () => {
      const unsub = onSnapshot(doc(db, "userChats", "ThaisevaAdmin"), (doc) => {
        setChats(doc.data());
      });

      () => {
        return unsub();
      };
    };

    user.uid && getChats();
  }, [user]);

  const handleSelect = (userInfo) => {
    dispatch({ type: "CHANGE_USER", payload: userInfo });
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
                onClick={() => handleSelect(chat[1].userInfo)}
              >
                <div className="flex items-center gap-2">
                  <img
                    src={chat[1].userInfo.photoURL}
                    alt=""
                    className="w-10 h-10 rounded-full bg-transparent"
                  />
                  <div>
                    <p className="font-bold text-white pb-0 -mb-1">
                      {chat[1].userInfo.displayName}
                    </p>
                    <span className="text-sm text-[lightgray]">
                      {chat[1]?.lastMessage?.text?.length > 19
                        ? chat[1]?.lastMessage?.text?.slice(0, 20) + "..."
                        : chat[1]?.lastMessage?.text}
                    </span>
                  </div>
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
