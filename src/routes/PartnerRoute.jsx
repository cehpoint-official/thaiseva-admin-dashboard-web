import { useContext } from "react";
import { AuthContext } from "../contextAPIs/AuthProvider";
import PendingPartnership from "../components/PendingPartnership";
import Loading from "../components/Loading";
import SentimentVeryDissatisfiedIcon from "@mui/icons-material/SentimentVeryDissatisfied";

const PartnerRoute = ({ children }) => {
  const { userData, isLoading } = useContext(AuthContext);

  if (isLoading) {
    return (
      <h3>
        <Loading />
      </h3>
    );
  }
  //Returning account pending message

  if (userData.status === "Verified" || userData?.isSuspended) {
    return children;
  } else if (userData.status === "Pending") {
    return <PendingPartnership />;
  } else {
    return (
      <div className="w-full h-[70vh] flex items-center justify-center">
        <div className="flex flex-col items-center justify-center text-xl">
          <SentimentVeryDissatisfiedIcon />
          <h2 className="font-bold text-center text-red-500">
            Your account has been suspended temporarily.
          </h2>
        </div>
      </div>
    );
  }
};

export default PartnerRoute;
