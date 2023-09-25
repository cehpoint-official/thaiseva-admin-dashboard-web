import { createBrowserRouter } from "react-router-dom";
import Main from "../layouts/Main";
import Dashboard from "../layouts/Dashboard";
import OnboardingForm from "../pages/register/OnboardingForm";
import Login from "../pages/login/Login";
import CustomerChat from "../pages/communication/CustomerChat";
import MyServices from "../pages/dashboard/partnerDashboard/myServices/MyServices";
import PrivetRouter from "./PrivetRouter";
import Support from "../pages/dashboard/partnerDashboard/support/Support";
import PartnerProfile from "../pages/dashboard/partnerDashboard/PartnerProfile/PartnerProfile";
import PartnerRoute from "./PartnerRoute";
import DriverOnBoarding from "../pages/onBoardingForm/driverOnBoarding/DriverOnBoarding";
import LocalPartners from "../pages/localPartners/LocalPartners";
import AllRequirements from "../pages/allRequirements/AllRequirements";
import HotelBookings from "../pages/hotelBookings/HotelBookings";
import FoodOrders from "../pages/foodOrders/FoodOrders";
import Drivers from "./../pages/drivers/Drivers";

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <PrivetRouter>
        <Main />
      </PrivetRouter>
    ),
  },
  {
    path: "/dashboard",
    element: (
      <PrivetRouter>
        <Dashboard />
      </PrivetRouter>
    ),
    children: [
      {
        path: "/dashboard/all-requirements",
        element: (
          <PrivetRouter>
            <AllRequirements />
          </PrivetRouter>
        ),
      },
      {
        path: "/dashboard/hotel-bookings",
        element: (
          <PrivetRouter>
            <HotelBookings />
          </PrivetRouter>
        ),
      },
      {
        path: "/dashboard/food-orders",
        element: (
          <PrivetRouter>
            <FoodOrders />
          </PrivetRouter>
        ),
      },
      {
        path: "/dashboard/drivers",
        element: (
          <PrivetRouter>
            <Drivers />
          </PrivetRouter>
        ),
      },
      {
        path: "/dashboard/local-partners",
        element: (
          <PrivetRouter>
            <LocalPartners />
          </PrivetRouter>
        ),
      },
      {
        path: "/dashboard/customer-chat",
        element: (
          <PrivetRouter>
            <CustomerChat />
          </PrivetRouter>
        ),
      },
      {
        path: "/dashboard/my-services",
        element: (
          <PartnerRoute>
            <MyServices />
          </PartnerRoute>
        ),
      },
      {
        path: "/dashboard/profile",
        element: (
          <PartnerRoute>
            <PartnerProfile />
          </PartnerRoute>
        ),
      },
      {
        path: "/dashboard/support",
        element: (
          <PartnerRoute>
            <Support />
          </PartnerRoute>
        ),
      },
    ],
  },
  {
    path: "/register",
    element: <OnboardingForm />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/driver-onboarding",
    element: <DriverOnBoarding />,
  },
]);
