import { useContext, useEffect, useRef } from "react";
import { AuthContext } from "../../contextAPIs/AuthProvider";
import { ChatContext } from "../../contextAPIs/ChatProvider";

const Message = ({ message }) => {
  const { user } = useContext(AuthContext);
  const { data } = useContext(ChatContext);

  const ref = useRef();

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]);

  return (
    <div
      ref={ref}
      className={`flex gap-2 ${message?.senderId === user?.uid && "owner"} `}
    >
      <div className="flex flex-col">
        {/* sender profile img */}
        <img
          src={
            message?.senderId === user?.uid
              ? user.photoURL
              : data.oppositeUser.photoURL
          }
          alt=""
          className="w-10 h-10 rounded-full object-cover"
        />

        {/* message time */}
        <span className="text-[gray]">Just Now</span>
      </div>
      <div className="flex flex-col gap-3  message-content w-8/12">
        {/* message text*/}
        <p
          className={` py-2 px-4 mt-2 w-fit ${
            message?.senderId === user?.uid ? "owner-message" : "opposite-text"
          }`}
        >
          {message?.text}
        </p>
        {message.img && <img src={message?.img} alt="" />}
      </div>
    </div>
  );
};

export default Message;
