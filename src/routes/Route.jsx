import { createBrowserRouter } from "react-router-dom";
import Main from "../layouts/Main";
import Dashboard from "../layouts/Dashboard";
import PrivetRouter from "./PrivetRouter";
import MyServices from "../pages/dashboard/partnerDashboard/myServices/MyServices";
import PartnerRoute from "./PartnerRoute";
import PartnerProfile from "../pages/dashboard/partnerDashboard/PartnerProfile/PartnerProfile";
import Support from "../pages/dashboard/partnerDashboard/support/Support";
import PartnerOnboarding from "../pages/forms/PartnerOnboarding";
import DriverOnBoarding from "../pages/forms/DriverOnBoarding";
import Login from "../pages/login/Login";
import TravelBookings from "./../pages/dashboard/adminDashboard/clientOrders/travelBookings/TravelBookings";
import FoodOrders from "../pages/dashboard/adminDashboard/clientOrders/foodOrders/FoodOrders";
import LocalServices from "../pages/dashboard/adminDashboard/ourServices/localServices/LocalServices";
import RoomServices from "./../pages/dashboard/adminDashboard/ourServices/roomServices/RoomServices";
import TravelServices from "./../pages/dashboard/adminDashboard/ourServices/travelServices/TravelServices";
import FoodServices from "./../pages/dashboard/adminDashboard/ourServices/foodServices/FoodServices";
import RoomBookings from "../pages/dashboard/adminDashboard/clientOrders/roomBookings/RoomBookings";
import Restaurants from "./../pages/dashboard/adminDashboard/ourPartners/restaurants/Restaurants";
import Hotels from "./../pages/dashboard/adminDashboard/ourPartners/hotels/Hotels";
import RestaurantOnboarding from "../pages/forms/RestaurantOnboarding";
import HotelOnboarding from "../pages/forms/HotelOnboarding";
import Drivers from "../pages/dashboard/adminDashboard/ourPartners/drivers/Drivers";
import LocalPartners from "../pages/dashboard/adminDashboard/ourPartners/localPartners/LocalPartners";
import TravelRequirements from "../pages/dashboard/adminDashboard/requirements/travelRequirements/TravelRequirements";
import ChatWithAdmin from "../pages/dashboard/partnerDashboard/messages/ChatWithAdmin";
import CustomerChat from "../pages/dashboard/communication/customerSupport/CustomerChat";
import DriverSupport from "../pages/dashboard/communication/driverSupport/DriverSupport";
import LocalPartnerSupport from "../pages/dashboard/communication/localPartnerSupport/LocalPartnerSupport";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Main />,
  },
  {
    path: "/dashboard",
    element: (
      <PrivetRouter>
        <Dashboard />
      </PrivetRouter>
    ),
    children: [
      /* =================================================
                          Requirements
      =================================================*/

      {
        path: "/dashboard/travel-requirements",
        element: <TravelRequirements />,
      },
      /* =================================================
                          Client's Orders
      =================================================*/
      {
        path: "/dashboard/room-bookings",
        element: (
          <PrivetRouter>
            <RoomBookings />
          </PrivetRouter>
        ),
      },
      {
        path: "/dashboard/travel-bookings",
        element: (
          <PrivetRouter>
            <TravelBookings />
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

      /* =================================================
                          Our Services
      =================================================*/
      {
        path: "/dashboard/local-services",
        element: (
          <PrivetRouter>
            <LocalServices />
          </PrivetRouter>
        ),
      },
      {
        path: "/dashboard/room-services",
        element: (
          <PrivetRouter>
            <RoomServices />
          </PrivetRouter>
        ),
      },
      {
        path: "/dashboard/travel-services",
        element: (
          <PrivetRouter>
            <TravelServices />
          </PrivetRouter>
        ),
      },
      {
        path: "/dashboard/food-services",
        element: (
          <PrivetRouter>
            <FoodServices />
          </PrivetRouter>
        ),
      },

      /* =================================================
                         Our Partners
      =================================================*/
      {
        path: "/dashboard/restaurants",
        element: (
          <PrivetRouter>
            <Restaurants />
          </PrivetRouter>
        ),
      },
      {
        path: "/dashboard/hotels",
        element: (
          <PrivetRouter>
            <Hotels />
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
        path: "/dashboard/driver-chat",
        element: (
          <PrivetRouter>
            <DriverSupport />
          </PrivetRouter>
        ),
      },
      {
        path: "/dashboard/partner-chat",
        element: (
          <PrivetRouter>
            <LocalPartnerSupport />
          </PrivetRouter>
        ),
      },

      /* =================================================
                    Partner dashboard routes
    =================================================*/
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
          <PrivetRouter>
            <PartnerRoute>
              <Support />
            </PartnerRoute>
          </PrivetRouter>
        ),
      },
      {
        path: "/dashboard/messages",
        element: <ChatWithAdmin />,
      },
    ],
  },

  /* =================================================
                     Onboarding Forms
    =================================================*/
  {
    path: "/partner-onboarding",
    element: <PartnerOnboarding />,
  },
  {
    path: "/driver-onboarding",
    element: <DriverOnBoarding />,
  },
  {
    path: "/restaurant-onboarding",
    element: <RestaurantOnboarding />,
  },
  {
    path: "/hotel-onboarding",
    element: <HotelOnboarding />,
  },
  {
    path: "/login",
    element: <Login />,
  },
]);
