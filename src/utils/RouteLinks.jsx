import {
  ApartmentIcon,
  BedIcon,
  BeenhereIcon,
  Diversity1Icon,
  DriveEtaIcon,
  FastfoodIcon,
  ForumIcon,
  HomeIcon,
  HowToRegIcon,
  LocalHotelIcon,
  LocalTaxiIcon,
  LuggageIcon,
  ManageAccountsIcon,
  NoCrashIcon,
  PersonAddAlt1Icon,
  PersonAddDisabledIcon,
  ReceiptIcon,
  RestaurantIcon,
  SignalCellularAltIcon,
  TaskAltIcon,
  TravelExploreIcon,
} from "./Icons";

export const primaryLinks = [
  { icon: <HomeIcon />, link: "/dashboard", label: "Dashboard" },
  {
    icon: <SignalCellularAltIcon />,
    link: "/dashboard/admin-statistics",
    label: "Statistics",
  },
  { icon: <ReceiptIcon />, link: "/dashboard/invoices", label: "Invoices" },
  {
    icon: <LocalTaxiIcon />,
    link: "/dashboard/travel-requirements",
    label: "Travel Requirements",
  },
  {
    icon: <TaskAltIcon />,
    link: "/dashboard/local-requirements",
    label: "Local Requirements",
  },
];

export const clientOrderLinks = [
  {
    url: "/dashboard/room-bookings",
    lable: "Room Bookings",
    icon: <BeenhereIcon />,
  },
  {
    url: "/dashboard/travel-bookings",
    lable: "Travel Bookings",
    icon: <TravelExploreIcon />,
  },
  {
    url: "/dashboard/car-bookings",
    lable: "Car Bookings",
    icon: <NoCrashIcon />,
  },
];

export const partnerStatus = [
  {
    icon: <HowToRegIcon />,
    queryText: "Verified",
    label: "Verified",
  },
  {
    icon: <PersonAddAlt1Icon />,
    queryText: "Pending",
    label: "Requests",
  },
  {
    icon: <PersonAddDisabledIcon />,
    queryText: "Denied",
    label: "Denied",
  },
];

export const communicationChild = [
  {
    icon: <ForumIcon />,
    link: "customer-chat",
    label: "Customer Chat",
  },
  { icon: <Diversity1Icon />, link: "partner-chat", label: "Partner Chat" },
  { icon: <DriveEtaIcon />, link: "driver-chat", label: "Driver Chat" },
  { icon: <BedIcon />, link: "hotel-chat", label: "Hotel Chat" },
];

export const ourPartnerLinks = [
  {
    url: "/dashboard/restaurants",
    lable: "Restaurants",
    icon: <RestaurantIcon />,
  },
  { url: "/dashboard/hotels", lable: "Hotels", icon: <ApartmentIcon /> },
];

export const ourServiceLinks = [
  {
    url: "/dashboard/local-services",
    lable: "Local Services",
    icon: <ManageAccountsIcon />,
  },
  {
    url: "/dashboard/room-services",
    lable: "Room Services",
    icon: <LocalHotelIcon />,
  },
  {
    url: "/dashboard/travel-services",
    lable: "Travel Services",
    icon: <LuggageIcon />,
  },
  {
    url: "/dashboard/food-services",
    lable: "Food Services",
    icon: <FastfoodIcon />,
  },
  {
    url: "/dashboard/car-services",
    lable: "Car Services",
    icon: <FastfoodIcon />,
  },
];
