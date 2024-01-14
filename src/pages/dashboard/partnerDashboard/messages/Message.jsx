import { useContext } from "react";
import { AuthContext } from "../../../../contextAPIs/AuthProvider";
import { PartnerChatContext } from "../../../../contextAPIs/PartnerChatProvider";
import DeleteIcon from "@mui/icons-material/Delete";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../../firebase/firebase.config";
import { PartnerContext } from "../../../../contextAPIs/PartnerProvider";

const Message = ({ message }) => {
  const { logo } = useContext(PartnerContext);
  const { user } = useContext(AuthContext);
  const { data } = useContext(PartnerChatContext);

  let date;
  let time;

  if (message) {
    const seconds = new Date(message.date.seconds * 1000);
    date = seconds.toLocaleDateString();
    time = seconds.toLocaleTimeString([], {
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
      className={`flex gap-2 my-2 ${
        message?.senderId === user.uid ? "owner" : ""
      } `}
    >
      <div className="flex flex-col">
        {/* sender profile img */}
        <img
          src={message?.senderId === user.uid ? user?.photoURL : logo}
          alt=""
          className="w-10 h-10 rounded-full object-cover"
        />
      </div>
      <div className="flex flex-col gap-3 message-content w-8/12 relative">
        {/* message time */}
        <div className="flex gap-1 absolute z-10 -top-4">
          <span className="text-[gray] text-xs">{date}</span>{" "}
          <p className="text-[gray] text-xs block w-fit">{time}</p>
        </div>
        {message.text && (
          <div
            className={`relative message flex flex-col  ${
              message?.senderId === user.uid ? "justify-end items-end" : ""
            }`}
          >
            {/* message text*/}

            <p
              className={` py-2 px-4 mt-0 w-fit min-h-[40px] ${
                message?.senderId === user.uid
                  ? "owner-message"
                  : "opposite-text"
              }`}
            >
              {message?.text}
            </p>
            {message?.senderId === user.uid && (
              <span
                className="delete-msg-btn"
                onClick={() => handleDeleteMessage(message?.id)}
              >
                <DeleteIcon />
              </span>
            )}
          </div>
        )}
        {/* audio and image container */}
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
          {message?.senderId === user.uid && (
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
