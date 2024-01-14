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
import RoomServices from "./../pages/dashboard/adminDashboard/ourServices/roomServices/RoomServices";
import TravelServices from "./../pages/dashboard/adminDashboard/ourServices/travelServices/TravelServices";
import FoodServices from "./../pages/dashboard/adminDashboard/ourServices/foodServices/FoodServices";
import Restaurants from "./../pages/dashboard/adminDashboard/ourPartners/restaurants/Restaurants";
import Hotels from "./../pages/dashboard/adminDashboard/ourPartners/hotels/Hotels";
import HotelOnboarding from "../pages/forms/HotelOnboarding";
import Drivers from "../pages/dashboard/adminDashboard/ourPartners/drivers/Drivers";
import LocalPartners from "../pages/dashboard/adminDashboard/ourPartners/localPartners/LocalPartners";
import TravelRequirements from "../pages/dashboard/adminDashboard/requirements/travelRequirements/TravelRequirements";
import ChatWithAdmin from "../pages/dashboard/partnerDashboard/messages/ChatWithAdmin";
import CustomerChat from "../pages/dashboard/communication/customerSupport/CustomerChat";
import LocalPartnerSupport from "../pages/dashboard/communication/localPartnerSupport/LocalPartnerSupport";
import AddedRooms from "../pages/dashboard/partnerDashboard/hotel/addedRooms/AddedRooms";
import DriverChat from "../pages/dashboard/communication/driverSupport/DriverChat";
import HotelSupport from "../pages/dashboard/communication/hotelSupport/HotelSupport";
import AddedMenu from "../pages/dashboard/partnerDashboard/restaurants/addedMenu/AddedMenu";
import SubAdmins from "../pages/dashboard/adminDashboard/subAdmins/SubAdmins";
import RoomBookings from "../pages/dashboard/adminDashboard/clientOrders/roomBookings/RoomBookings";
import Banners from "../components/HomeBanners";
import LocalServices from "../pages/dashboard/adminDashboard/ourServices/localServices/LocalServices";
import LocalRequirements from "../pages/dashboard/adminDashboard/requirements/LocalRequirements";
import AdminRoute from "./AdminRoute";
import HeadAdminRoute from "./HeadAdminRoute";
import AdminStatistics from "../pages/dashboard/adminDashboard/adminStatistics/AdminStatistics";
import StatisticsProvider from "../contextAPIs/StatisticsProvider";
import CarServices from "../pages/dashboard/adminDashboard/ourServices/carServices/CarServices";
import CarBookings from "../pages/dashboard/adminDashboard/clientOrders/carBookings/CarBookings";
import Invoices from "../pages/dashboard/adminDashboard/invoices/Invoices";

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
      {
        path: "/dashboard/invoices",
        element: (
          <AdminRoute>
            <Invoices />
          </AdminRoute>
        ),
      },
      /* =================================================
                          Requirements
      =================================================*/

      {
        path: "/dashboard/travel-requirements",
        element: (
          <PrivetRouter>
            <TravelRequirements />
          </PrivetRouter>
        ),
      },
      {
        path: "/dashboard/local-requirements",
        element: (
          <AdminRoute>
            <LocalRequirements />
          </AdminRoute>
        ),
      },
      {
        path: "/dashboard/admin-statistics",
        element: (
          <AdminRoute>
            <StatisticsProvider>
              <AdminStatistics />
            </StatisticsProvider>
          </AdminRoute>
        ),
      },
      /* =================================================
                          Client's Orders
      =================================================*/
      {
        path: "/dashboard/room-bookings",
        element: (
          <AdminRoute>
            <RoomBookings />
          </AdminRoute>
        ),
      },
      {
        path: "/dashboard/travel-bookings",
        element: (
          <AdminRoute>
            <TravelBookings />
          </AdminRoute>
        ),
      },
      {
        path: "/dashboard/car-bookings",
        element: (
          <AdminRoute>
            <CarBookings />
          </AdminRoute>
        ),
      },

      /* =================================================
                          Our Services
      =================================================*/
      {
        path: "/dashboard/local-services",
        element: (
          <AdminRoute>
            <LocalServices />
          </AdminRoute>
        ),
      },
      {
        path: "/dashboard/room-services",
        element: (
          <AdminRoute>
            <RoomServices />
          </AdminRoute>
        ),
      },
      {
        path: "/dashboard/travel-services",
        element: (
          <AdminRoute>
            <TravelServices />
          </AdminRoute>
        ),
      },
      {
        path: "/dashboard/food-services",
        element: (
          <AdminRoute>
            <FoodServices />
          </AdminRoute>
        ),
      },
      {
        path: "/dashboard/car-services",
        element: (
          <AdminRoute>
            <CarServices />
          </AdminRoute>
        ),
      },

      /* =================================================
                         Our Partners
      =================================================*/
      {
        path: "/dashboard/restaurants",
        element: (
          <AdminRoute>
            <Restaurants />
          </AdminRoute>
        ),
      },
      {
        path: "/dashboard/hotels",
        element: (
          <AdminRoute>
            <Hotels />
          </AdminRoute>
        ),
      },
      {
        path: "/dashboard/drivers",
        element: (
          <AdminRoute>
            <Drivers />
          </AdminRoute>
        ),
      },
      {
        path: "/dashboard/local-partners",
        element: (
          <AdminRoute>
            <LocalPartners />
          </AdminRoute>
        ),
      },
      {
        path: "/dashboard/customer-chat",
        element: (
          <AdminRoute>
            <CustomerChat />
          </AdminRoute>
        ),
      },
      {
        path: "/dashboard/driver-chat",
        element: (
          <AdminRoute>
            <DriverChat />
          </AdminRoute>
        ),
      },
      {
        path: "/dashboard/partner-chat",
        element: (
          <AdminRoute>
            <LocalPartnerSupport />
          </AdminRoute>
        ),
      },
      {
        path: "/dashboard/hotel-chat",
        element: (
          <AdminRoute>
            <HotelSupport />
          </AdminRoute>
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
        path: "/dashboard/profile/:category/:uid",
        element: (
          <PrivetRouter>
            <PartnerProfile />
          </PrivetRouter>
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
        path: "/dashboard/added-rooms",
        element: (
          <PrivetRouter>
            <PartnerRoute>
              <AddedRooms />
            </PartnerRoute>
          </PrivetRouter>
        ),
      },
      {
        path: "/dashboard/added-menu",
        element: (
          <PrivetRouter>
            <PartnerRoute>
              <AddedMenu />
            </PartnerRoute>
          </PrivetRouter>
        ),
      },
      {
        path: "/dashboard/messages",
        element: (
          <PrivetRouter>
            <PartnerRoute>
              <ChatWithAdmin />
            </PartnerRoute>
          </PrivetRouter>
        ),
      },
      {
        path: "/dashboard/sub-admins",
        element: (
          <HeadAdminRoute>
            <SubAdmins />
          </HeadAdminRoute>
        ),
      },
      {
        path: "/dashboard/banners",
        element: (
          <PrivetRouter>
            <Banners />
          </PrivetRouter>
        ),
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
    path: "/hotel-onboarding",
    element: <HotelOnboarding />,
  },
  {
    path: "/login",
    element: <Login />,
  },
]);
