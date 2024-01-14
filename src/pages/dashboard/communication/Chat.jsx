import { useContext, useState } from "react";
import Messages from "./Messages";
import Input from "./Input";
import MenuIcon from "@mui/icons-material/Menu";
import { AdminChatContext } from "../../../contextAPIs/AdminChatProvider";
import { AudioRecorder } from "react-audio-voice-recorder";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "../../../firebase/firebase.config";
import { handleRedirectWhatsApp } from "../../../utils/utils";

const Chat = ({ setOpenSidebar }) => {
  const { data } = useContext(AdminChatContext);
  const [lastMessage, setLastMessage] = useState({});
  const [audioUrl, setAudioUrl] = useState("");

  const addAudioElement = async (blob) => {
    const fileRef = ref(storage, `file-${blob.size}`);

    const fileTask = await uploadBytesResumable(fileRef, blob);
    const fileURL = await getDownloadURL(fileTask.ref);
    setAudioUrl(fileURL);
  };

  return (
    <div className="w-full h-full rounded-lg ">
      <div className="md:p-3 p-2 bg-[blue] z-10 flex items-center justify-between text-white">
        <div className=" flex gap-2 items-center">
          {data?.oppositeUser?.photoURL && (
            <img
              src={data?.oppositeUser?.photoURL}
              alt=""
              className="h-10 w-10 rounded-full"
            />
          )}
          <div className="flex flex-col">
            {data?.oppositeUser?.displayName && (
              <p className="font-bold text-white">
                {data?.oppositeUser?.displayName}
              </p>
            )}
            {data?.oppositeUser?.phoneNumber && (
              <span className="text-sm text-slate-200 -mt-1">
                {data?.oppositeUser?.phoneNumber}
              </span>
            )}
          </div>
        </div>
        <div className="font-bold flex items-center gap-2 text-2xl h-10">
          {data?.oppositeUser?.displayName && (
            <div className="h-full">
              <AudioRecorder
                onRecordingComplete={addAudioElement}
                audioTrackConstraints={{
                  noiseSuppression: true,
                  echoCancellation: true,
                }}
                downloadFileExtension="webm"
              />
            </div>
          )}
          {data?.oppositeUser?.phoneNumber && (
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
              alt=""
              className="w-10 h-10 cursor-pointer"
              onClick={() =>
                handleRedirectWhatsApp(data?.oppositeUser?.phoneNumber)
              }
            />
          )}
          <div
            onClick={() => setOpenSidebar((p) => !p)}
            className="lg:hidden block"
          >
            <MenuIcon />
          </div>
        </div>
      </div>

      <Messages
        setLastMessage={setLastMessage}
        oppositeUser={data.oppositeUser}
      />

      <Input
        lastMessage={lastMessage}
        audioUrl={audioUrl}
        setAudioUrl={setAudioUrl}
      />
    </div>
  );
};

export default Chat;
