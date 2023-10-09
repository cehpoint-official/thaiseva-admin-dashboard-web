import { useContext, useEffect, useRef } from "react";
import { AuthContext } from "../../../contextAPIs/AuthProvider";
import { AdminChatContext } from "../../../contextAPIs/AdminChatProvider";

const Message = ({ message }) => {
  const { user } = useContext(AuthContext);
  const { data } = useContext(AdminChatContext);

  // let date;
  let time;

  if (message) {
    const seconds = new Date(message?.date?.seconds * 1000);
    // date = seconds.toLocaleDateString();
    time = seconds?.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return (
    <div
      className={`flex gap-2 my-2 ${
        message?.senderId === "_CustomerSupport" ? "owner" : ""
      } `}
    >
      <div className="flex flex-col">
        {/* sender profile img */}
        <img
          src={
            message?.senderId === "_CustomerSupport"
              ? "https://images.pexels.com/photos/3823488/pexels-photo-3823488.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
              : data.oppositeUser.photoURL
          }
          alt=""
          className="w-10 h-10 rounded-full object-cover"
        />
      </div>
      <div className="flex flex-col gap-3 message-content w-8/12">
        {message.text && (
          <div className="relative">
            {/* message time */}
            <div>
              {/* <span className="text-[gray] text-xs">{date}</span>{" "} */}
              <p className="text-[gray] text-xs block w-fit text-right">
                {time}
              </p>
            </div>
            {/* message text*/}

            <p
              className={`py-2 lg:px-4 px-2 mt-0 w-fit min-h-[36px] leading-5 ${
                message?.senderId === "_CustomerSupport"
                  ? "owner-message"
                  : "opposite-text"
              }`}
            >
              {message?.text}
            </p>
          </div>
        )}
        {message.img && <img src={message?.img} alt="" />}
      </div>
    </div>
  );
};

export default Message;
