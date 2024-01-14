import { useContext } from "react";
import { AdminChatContext } from "../../../contextAPIs/AdminChatProvider";
import DeleteIcon from "@mui/icons-material/Delete";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../firebase/firebase.config";
import { PartnerContext } from "../../../contextAPIs/PartnerProvider";

const Message = ({ message }) => {
  const { data } = useContext(AdminChatContext);
  const { logo } = useContext(PartnerContext);

  let date;
  let time;

  if (message) {
    const seconds = new Date(message?.date?.seconds * 1000);
    date = seconds.toLocaleDateString();
    time = seconds?.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  const handleDeleteMessage = async (id) => {
    const dod = doc(db, "chats", data.chatId);
    const res = await getDoc(dod);
    const { messages } = res.data();
    const remaining = messages.filter((message) => message?.id !== id);
    await updateDoc(dod, { messages: remaining });
  };

  return (
    <div
      className={`flex gap-2 my-2 relative ${
        message?.senderId === "_CustomerSupport" ? "owner" : ""
      } `}
    >
      <div className="flex flex-col">
        {/* sender profile img */}
        <img
          src={
            message?.senderId === "_CustomerSupport"
              ? logo
              : data.oppositeUser.photoURL
          }
          alt=""
          className="w-10 h-10 rounded-full object-cover"
        />
      </div>
      <div className="flex flex-col gap-3 message-content w-8/12 relative">
        {/* message time */}
        <div className="flex gap-1 -mb-2 absolute z-10 -top-4">
          <span className="text-[gray] text-xs">{date}</span>{" "}
          <p className="text-[gray] text-xs block w-fit text-right">{time}</p>
        </div>
        {message?.text && (
          <div
            className={`relative message flex flex-col  ${
              message?.senderId === "_CustomerSupport"
                ? "justify-end items-end"
                : ""
            }`}
          >
            {/* message text*/}

            <p
              className={`py-2 lg:px-4  px-2 mt-0 w-fit min-h-[36px] leading-5 ${
                message?.senderId === "_CustomerSupport"
                  ? "owner-message"
                  : "opposite-text"
              }`}
            >
              {message?.text}
            </p>
            {message?.senderId === "_CustomerSupport" && (
              <span
                className="delete-msg-btn"
                onClick={() => handleDeleteMessage(message?.id)}
              >
                <DeleteIcon />
              </span>
            )}
          </div>
        )}
        <div className="message-file w-fit relative">
          {message?.imageUrl && (
            <img
              src={message?.imageUrl}
              alt=""
              className="w-full h-full rounded-lg"
            />
          )}
          {message?.audioUrl && (
            <audio src={message?.audioUrl} controls></audio>
          )}
          {message?.senderId === "_CustomerSupport" && (
            <span
              className="delete-msg-btn"
              onClick={() => handleDeleteMessage(message?.id)}
            >
              <DeleteIcon />
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Message;
