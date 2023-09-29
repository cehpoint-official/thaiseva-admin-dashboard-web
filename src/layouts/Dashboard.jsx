import * as React from "react";
import PropTypes from "prop-types";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";

import { Avatar, Badge, Collapse, Fade, Menu } from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import PersonAddDisabledIcon from "@mui/icons-material/PersonAddDisabled";
import PeopleIcon from "@mui/icons-material/People";
import ForumIcon from "@mui/icons-material/Forum";
import DriveEtaIcon from "@mui/icons-material/DriveEta";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import Diversity1Icon from "@mui/icons-material/Diversity1";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { PartnerContext } from "../contextAPIs/PartnerProvider";
import { AuthContext } from "../contextAPIs/AuthProvider";
import AdminDashboard from "../pages/dashboard/adminDashboard/AdminDashboard";
import PersonIcon from "@mui/icons-material/Person";
import TaskIcon from "@mui/icons-material/Task";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import BeenhereIcon from "@mui/icons-material/Beenhere";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import HandshakeIcon from "@mui/icons-material/Handshake";
import ApartmentIcon from "@mui/icons-material/Apartment";
import LocalHotelIcon from "@mui/icons-material/LocalHotel";
import TravelExploreIcon from "@mui/icons-material/TravelExplore";
import LuggageIcon from "@mui/icons-material/Luggage";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import FastfoodIcon from "@mui/icons-material/Fastfood";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import PartnerDashboard from "../pages/dashboard/partnerDashboard/PartnerDashboard";

const drawerWidth = 220;

function Dashboard(props) {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const { setQueryText, totalRequest } = React.useContext(PartnerContext);
  const [activeStatus, setActiveStatus] = React.useState(0);
  const { logOut, isAdmin, isPartner, user } = React.useContext(AuthContext);
  const [open, setOpen] = React.useState(false);
  const [openCommuincationMenu, setOpenCommunicationMenu] =
    React.useState(false);
  const [activeMenu, setActiveMenu] = React.useState("");

  const navigate = useNavigate(); // to navigate the user
  const location = useLocation(); // to track the url

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleChangeQueryText = (text, i) => {
    setQueryText(text);
    setActiveStatus(i);
  };

  const adminNavRoutes = [
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

  const communicationChild = [
    {
      icon: <ForumIcon />,
      link: "customer-chat",
      label: "Customer Chat",
    },
    { icon: <DriveEtaIcon />, link: "driver-chat", label: "Driver Chat" },
    { icon: <Diversity1Icon />, link: "partner-chat", label: "Partner Chat" },
  ];

  let partnerNavRoutes = [];

  if (isPartner) {
    partnerNavRoutes = [
      { icon: <PersonIcon />, url: "/profile", label: "Profile" },
      {
        icon: <TaskAltIcon />,
        url: "",
        label: "Requirements",
      },
      {
        icon: <TaskIcon />,
        url: "/my-services",
        label: "My Services",
      },

      {
        icon: <SupportAgentIcon />,
        url: "/support",
        label: "Support",
      },
    ];
  }

  const clientOrderRoute = [
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
      url: "/dashboard/food-orders",
      lable: "Food Orders",
      icon: <FastfoodIcon />,
    },
  ];
  const ourServiceRoute = [
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
  ];

  const ourPartnerRoute = [
    {
      url: "/dashboard/restaurants",
      lable: "Restaurants",
      icon: <RestaurantIcon />,
    },
    { url: "/dashboard/hotels", lable: "Hotels", icon: <ApartmentIcon /> },
    {
      url: "/dashboard/drivers",
      lable: "Drivers",
      icon: <DirectionsCarIcon />,
    },
    {
      url: "/dashboard/local-partners",
      lable: "Local Partners",
      icon: <HandshakeIcon />,
    },
  ];

  const handleLogOut = () => {
    logOut()
      .then(() => {
        navigate("/login");
      })
      .catch((error) => console.log(error));
  };

  const drawer = (
    <div className="bg-[blue] text-white min-h-full scrollbar scrollbar-thumb-gray-900 scrollbar-track-gray-100">
      <Toolbar>
        {(isAdmin && "Admin Dashboard") || (isPartner && "Partner Dashboard")}
      </Toolbar>
      <Divider />
      <List sx={{ pt: 0 }}>
        {isAdmin && (
          <>
            {/* partner route with child */}
            {isAdmin && (
              <>
                <Link to={"/dashboard"}>
                  <ListItem
                    sx={{ py: 2 }}
                    className={`justify-between relative py-3 px-4 border-b border-[#b8b8b8b0] ${
                      location.pathname === "/dashboard" ? "bg-[#0909dc]" : ""
                    }`}
                  >
                    <TaskAltIcon />
                    <span className="grow ml-2">Local Tasks</span>
                    <div
                      className={`triangle h-6 w-6 bg-white absolute -right-1 top-auto z-10 ${
                        location.pathname === "/dashboard" ? "block" : "hidden"
                      }`}
                    ></div>
                  </ListItem>
                </Link>

                <div className="text-yellow-300 pl-2 text-lg font-bold  py-1 z-10 overflow-hidden border-gray-300 ">
                  Client&apos;s Orders
                </div>
                {clientOrderRoute.map((route) => (
                  <Link to={route.url} key={route.url}>
                    <ListItem
                      sx={{ py: 2 }}
                      className={`justify-between text-green-200 relative py-3 px-4 border-y border-[#b8b8b8b0] hover:bg-[#0909dc] ${
                        location.pathname === route.url ? "bg-[#0909dc]" : ""
                      }`}
                    >
                      {route.icon}
                      <span className="grow ml-2">{route.lable}</span>
                      <div
                        className={`triangle h-6 w-6 bg-white absolute -right-1 top-auto z-10 ${
                          location.pathname === route.url ? "block" : "hidden"
                        }`}
                      ></div>
                    </ListItem>
                  </Link>
                ))}

                <Divider />
                <div className="text-yellow-300 pl-2 text-lg font-bold  py-1 z-10 overflow-hidden border-gray-300">
                  Our Services
                </div>
                {ourServiceRoute.map((route) => (
                  <Link to={route.url} key={route.url}>
                    <ListItem
                      sx={{ py: 2 }}
                      className={`justify-between relative py-3 px-4 border-y border-[#b8b8b8b0] text-green-200 hover:bg-[#0909dc] ${
                        location.pathname === route.url ? "bg-[#0909dc]" : ""
                      }`}
                    >
                      {route.icon}
                      <span className="grow ml-2">{route.lable}</span>
                      <div
                        className={`triangle h-6 w-6 bg-white absolute -right-1 top-auto z-10 ${
                          location.pathname === route.url ? "block" : "hidden"
                        }`}
                      ></div>
                    </ListItem>
                  </Link>
                ))}

                <div className="text-yellow-300 pl-2 text-lg font-bold  py-1 z-10 overflow-hidden border-gray-300">
                  Our Partners
                </div>
                {ourPartnerRoute.map((route) => (
                  <Link to={route.url} key={route.url}>
                    <ListItem
                      sx={{ py: 2 }}
                      className={`justify-between relative py-3 px-4 border-y border-[#b8b8b8b0] text-green-200 hover:bg-[#0909dc] ${
                        location.pathname === route.url ? "bg-[#0909dc]" : ""
                      }`}
                    >
                      {route.icon}
                      <span className="grow ml-2">{route.lable}</span>
                      <div
                        className={`triangle h-6 w-6 bg-white absolute -right-1 top-auto z-10 ${
                          location.pathname === route.url ? "block" : "hidden"
                        }`}
                      ></div>
                    </ListItem>
                  </Link>
                ))}

                <Divider />
                <Link to={"/dashboard/local-partners"}>
                  <ListItem
                    open={location.pathname === "/dashboard/local-partners"}
                    onClick={() => setOpen((prevOpen) => !prevOpen)}
                    sx={{ py: 2 }}
                    className={`justify-between relative py-3 px-4 border-b border-[#b8b8b8b0]  ${
                      location.pathname === "/dashboard/local-partners"
                        ? "bg-[#0909dc]"
                        : ""
                    }`}
                  >
                    <PeopleIcon />
                    <span className="grow ml-2">Local Partners</span>
                    {location.pathname === "/dashboard/local-partners" ? (
                      <ExpandLess />
                    ) : (
                      <ExpandMore />
                    )}
                    <div
                      className={`triangle h-6 w-6 bg-white absolute -right-1 top-auto z-10 ${
                        location.pathname === "/dashboard/local-partners"
                          ? "block"
                          : "hidden"
                      }`}
                    ></div>
                  </ListItem>
                </Link>
                <Divider />
              </>
            )}
            <Collapse
              component="li"
              in={location.pathname === "/dashboard/local-partners"}
              timeout="auto"
              unmountOnExit
            >
              <List disablePadding>
                {isAdmin &&
                  adminNavRoutes?.map((item, i) => (
                    <ListItem
                      key={item.queryText}
                      disablePadding
                      sx={{
                        color: "white",
                        pl: 2,
                        m: 0,
                        bgcolor: `${activeStatus === i && "#0909dc"}`,
                      }}
                      onClick={() => handleChangeQueryText(item.queryText, i)}
                    >
                      <ListItemButton className="space-x-2">
                        <span>{item.icon}</span>
                        {item.queryText === "Pending" ? (
                          <Badge
                            color="secondary"
                            badgeContent={`${
                              item.queryText === "Pending" && totalRequest
                            }`}
                          >
                            <ListItemText primary={item.label} sx={{ ml: 0 }} />
                          </Badge>
                        ) : (
                          <ListItemText primary={item.label} sx={{ ml: 0 }} />
                        )}
                      </ListItemButton>
                    </ListItem>
                  ))}
              </List>
            </Collapse>
            {isAdmin && (
              <ListItem
                open={openCommuincationMenu}
                onClick={() => setOpenCommunicationMenu((p) => !p)}
                sx={{ py: 2 }}
                className={` flex justify-between relative ${
                  activeMenu === "Communication" ? "bg-[#0909dc]" : ""
                }`}
              >
                <SupportAgentIcon />
                <span className="grow ml-2">Communication</span>
                {openCommuincationMenu ? <ExpandLess /> : <ExpandMore />}

                <div
                  className={`triangle h-6 w-6 bg-white absolute -right-1 top-auto z-10  ${
                    activeMenu === "Communication" ? "block" : "hidden"
                  }`}
                ></div>
              </ListItem>
            )}
            <Collapse
              component="li"
              in={openCommuincationMenu}
              timeout="auto"
              unmountOnExit
            >
              <List disablePadding>
                {isAdmin &&
                  communicationChild.map((item, i) => (
                    <Link
                      key={item.link}
                      to={item.link}
                      className="w-full flex justify-between relative"
                    >
                      <ListItem
                        disablePadding
                        sx={{
                          color: "white",
                          pl: 2,
                          m: 0,
                          bgcolor: `${activeStatus === i && "#0909dc"}`,
                        }}
                        // onClick={() => handleChangeQueryText(item.queryText, i)}
                      >
                        <ListItemButton className="space-x-2">
                          <span>{item.icon}</span>
                          <ListItemText primary={item.label} sx={{ ml: 0 }} />
                        </ListItemButton>
                      </ListItem>
                    </Link>
                  ))}
              </List>
            </Collapse>
          </>
        )}

        {isPartner &&
          partnerNavRoutes.map((item) => (
            <Link to={`/dashboard${item.url}`} key={item.url}>
              {" "}
              <ListItem
                disablePadding
                sx={{
                  color: "white",
                  p: 0,
                  m: 0,
                  bgcolor: `${
                    location.pathname === "/dashboard" + item.url && "#0909dc"
                  }`,
                }}
                onClick={() => setActiveMenu(item.label)}
                // onClick={() => handleChangeQueryText(item.url, i)}
                className="relative"
              >
                <ListItemButton>
                  <span> {item.icon}</span>
                  <ListItemText primary={item.label} sx={{ ml: 1 }} />
                </ListItemButton>
                <div
                  className={`triangle h-6 w-6 bg-white absolute -right-1 top-auto z-10  ${
                    location.pathname === "/dashboard" + item.url
                      ? "block"
                      : "hidden"
                  }`}
                ></div>
              </ListItem>{" "}
            </Link>
          ))}
      </List>
    </div>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  const avaterMenu = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          backgroundColor: "blue",
        }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ fontWeight: "bold" }}
          >
            Thaiseva
          </Typography>

          <div className="flex gap-2 items-center">
            <Avatar
              alt="Cindy Baker"
              src={user?.photoURL}
              className="border-2"
              id="fade-button"
              aria-controls={avaterMenu ? "fade-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={avaterMenu ? "true" : undefined}
              onClick={handleClick}
            />

            <div>
              <Menu
                id="fade-menu"
                MenuListProps={{
                  "aria-labelledby": "fade-button",
                }}
                anchorEl={anchorEl}
                open={avaterMenu}
                onClose={handleClose}
                TransitionComponent={Fade}
                sx={{ mt: 0.5 }}
              >
                <button
                  onClick={handleLogOut}
                  className=" h-fit font-bold text-white border-2 border-gray-700 rounded-lg py-1 px-2 text-xs m-2 bg-blue-600"
                >
                  Log Out
                </button>
              </Menu>
            </div>
          </div>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
        className="scrollbar scrollbar-thumb-gray-900 scrollbar-track-gray-100"
      >
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              bgcolor: "blue",
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              bgcolor: "blue",
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar></Toolbar>

        {location.pathname === "/dashboard" &&
          ((isAdmin && <AdminDashboard />) ||
            (isPartner && <PartnerDashboard />))}
        {(isAdmin || isPartner) && <Outlet />}
      </Box>
    </Box>
  );
}

Dashboard.propTypes = {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window: PropTypes.func,
};

export default Dashboard;
