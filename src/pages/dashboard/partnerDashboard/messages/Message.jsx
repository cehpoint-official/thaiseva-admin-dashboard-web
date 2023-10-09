import { useContext } from "react";
import { AuthContext } from "../../../../contextAPIs/AuthProvider";
import { PartnerChatContext } from "../../../../contextAPIs/PartnerChatProvider";

const Message = ({ message }) => {
  const { user } = useContext(AuthContext);
  const { data } = useContext(PartnerChatContext);

  // let date;
  let time;

  if (message) {
    const seconds = new Date(message.date.seconds * 1000);
    // date = seconds.toLocaleDateString();
    time = seconds.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return (
    <div
      className={`flex gap-2 my-2 ${
        message?.senderId === user.uid ? "owner" : ""
      } `}
    >
      <div className="flex flex-col">
        {/* sender profile img */}
        <img
          src={
            message?.senderId === user.uid
              ? user?.photoURL
              : "https://images.pexels.com/photos/3823488/pexels-photo-3823488.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
          }
          alt=""
          className="w-10 h-10 rounded-full object-cover"
        />
      </div>
      <div className="flex flex-col gap-3 message-content w-8/12">
        {message.text && (
          <div className="relative">
            {/* message time */}
            <div className="">
              {/* <span className="text-[gray] text-xs">{date}</span>{" "} */}
              <p className="text-[gray] text-xs block w-fit">{time}</p>
            </div>
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
          </div>
        )}
        {message.img && <img src={message?.img} alt="" />}
      </div>
    </div>
  );
};

export default Message;
