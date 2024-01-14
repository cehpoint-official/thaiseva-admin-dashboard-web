import { useContext, useState } from "react";
import Messages from "./Messages";
import { PartnerChatContext } from "../../../../contextAPIs/PartnerChatProvider";
import PartnerChatInput from "./PartnerChatInput";
import { AudioRecorder } from "react-audio-voice-recorder";
import { storage } from "../../../../firebase/firebase.config";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

const PartnerChats = () => {
  const { data } = useContext(PartnerChatContext);
  const [audioUrl, setAudioUrl] = useState("");

  const addAudioElement = async (blob) => {
    const fileRef = ref(storage, "first-autio");

    const fileTask = await uploadBytesResumable(fileRef, blob);
    const fileURL = await getDownloadURL(fileTask.ref);
    setAudioUrl(fileURL);
  };

  return (
    <div className="w-full  h-[calc(100vh-80px)] border-2 border-[#0000ff5a] rounded-lg overflow-hidden">
      <div className="h-16 p-3 flex gap-2 bg-[blue] items-center justify-between">
        <div className="flex gap-2 items-center">
          <img
            src={data?.oppositeUser?.photoURL}
            alt=""
            className="h-10 w-10 rounded-full"
          />{" "}
          <p className="font-bold text-white">
            {data?.oppositeUser?.displayName}
          </p>
        </div>
        <div>
          <AudioRecorder
            onRecordingComplete={addAudioElement}
            audioTrackConstraints={{
              noiseSuppression: true,
              echoCancellation: true,
            }}
            downloadFileExtension="webm"
          />
        </div>
      </div>
      <Messages />
      <PartnerChatInput audioUrl={audioUrl} setAudioUrl={setAudioUrl} />
    </div>
  );
};

export default PartnerChats;
