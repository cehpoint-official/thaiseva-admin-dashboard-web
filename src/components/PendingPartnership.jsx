import animation from "../assets/pending-animation.json";
import Lottie from "lottie-react";

const PendingPartnership = () => {
  return (
    <div className="w-full h-[80vh] flex items-center justify-center">
      <div className="flex justify-center items-center flex-col grow">
        <h1 className="bg-orange-400 text-white w-fit py-1 px-2 rounded text-xl">
          Pending
        </h1>
        <Lottie animationData={animation} loop={true} className="w-32" />
        <h3 className="text-center text-xl ">
          Your account will be
          <span className="bg-[blue] text-white py-1 px-2 rounded mx-1">
            activated
          </span>
          within 24 hours.
        </h3>
      </div>
    </div>
  );
};

export default PendingPartnership;
