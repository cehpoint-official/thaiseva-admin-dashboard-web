import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { Avatar, Badge, Collapse, Fade, Menu } from "@mui/material";
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
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";
import * as React from "react";
import { useContext } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { AdminChatContext } from "../contextAPIs/AdminChatProvider";
import { AuthContext } from "../contextAPIs/AuthProvider";
import { PartnerContext } from "../contextAPIs/PartnerProvider";
import AdminDashboard from "../pages/dashboard/adminDashboard/AdminDashboard";
import PartnerDashboard from "../pages/dashboard/partnerDashboard/PartnerDashboard";
import PartnerRoute from "../routes/PartnerRoute";
import {
  AdminPanelSettingsIcon,
  ChatBubbleRoundedIcon,
  DirectionsCarIcon,
  HandshakeIcon,
  LocalHotelIcon,
  MenuIcon,
  PersonIcon,
  SupportAgentIcon,
  TaskAltIcon,
  TaskIcon,
} from "../utils/Icons";
import {
  clientOrderLinks,
  communicationChild,
  ourPartnerLinks,
  ourServiceLinks,
  partnerStatus,
  primaryLinks,
} from "../utils/RouteLinks";

const drawerWidth = 230;

function Dashboard(props) {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const { setQueryText, totalRequest, driverRequest, setChatRoom } =
    React.useContext(PartnerContext);
  const [activeStatus, setActiveStatus] = React.useState(0);
  const { logOut, isAdmin, isSubAdmin, isPartner, user, userData } =
    React.useContext(AuthContext);
  const [openCommuincationMenu, setOpenCommunicationMenu] =
    React.useState(false);
  const location = useLocation(); // to track the url
  const { dispatch } = useContext(AdminChatContext);
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleChangeQueryText = (text, i) => {
    setQueryText(text);
    setActiveStatus(i);
  };

  if (userData?.isSuspended) {
    return (
      <div className="h-screen w-full flex items-center justify-center text-red-500 text-xl font-bold">
        <h3 className="text-xl">Your account has been banned permanently.</h3>
      </div>
    );
  }

  let partnerNavRoutes = [
    {
      icon: <PersonIcon />,
      url: `/profile/${userData?.serviceCategory}/${user?.uid}`,
      label: "Profile",
    },
  ];

  if (isPartner) {
    if (userData?.serviceCategory === "Hotel") {
      partnerNavRoutes[3] = {
        icon: <LocalHotelIcon />,
        url: "/added-rooms",
        label: "Added Rooms",
      };
      partnerNavRoutes[2] = {
        icon: <TaskIcon />,
        url: "",
        label: "Bookings",
      };
    } else if (
      userData?.serviceCategory !== "Driving" &&
      userData?.serviceCategory !== "Hotel"
    ) {
      partnerNavRoutes[2] = {
        icon: <TaskIcon />,
        url: "/my-services",
        label: "My Services",
      };
    } else {
      partnerNavRoutes[1] = {
        icon: <TaskAltIcon />,
        url: "",
        label: "Requirements",
      };
    }

    partnerNavRoutes.push({
      icon: <SupportAgentIcon />,
      url: "/support",
      label: "Support",
    });
    partnerNavRoutes.push({
      icon: <ChatBubbleRoundedIcon />,
      url: "/messages",
      label: "Messages",
    });
  }

  const handleLogOut = () => {
    logOut();
  };

  // handling changing chat room
  const handleChatRooom = (link) => {
    setChatRoom(
      (link === "customer-chat" && "CustomerSupport") ||
        (link === "driver-chat" && "DriversSupport") ||
        (link === "partner-chat" && "LocalPartnerSupport") ||
        (link === "hotel-chat" && "HotelSupport") ||
        (link === "restaurant-chat" && "RestaurantSupport")
    );

    dispatch({
      type: "CHANGE_USER",
      payload: { chatId: "", oppositeUser: {} },
    });
  };

  // showig dashboard title based on user category
  let text = "";
  if (isAdmin || isSubAdmin) {
    text = "Admin Dashboard";
  } else if (isPartner) {
    if (userData.serviceCategory === "Hotel") {
      text = "Hotel Dashboard";
    } else if (userData.serviceCategory === "Driving") {
      text = "Driver Dashboard";
    } else {
      text = "Partner Dashboard";
    }
  }

  const drawer = (
    <div className="bg-[var(--primary-bg)] text-white dashboard-menu">
      <Toolbar>
        <div className="text-2xl font-bold text-yellow-300">Thaiseva</div>
      </Toolbar>
      <Divider />
      <List sx={{ pt: 0 }} className="dashboard-menu">
        {(isAdmin || isSubAdmin) && (
          <>
            {/* partner route with child */}

            <>
              {primaryLinks?.map((item) => (
                <Link to={item?.link} key={item?.link}>
                  <ListItem
                    sx={{ py: 2 }}
                    className={`justify-between relative py-3 px-4 border-b border-[#b8b8b8b0] ${
                      location.pathname === item?.link
                        ? "bg-[var(--secondary-bg)]"
                        : ""
                    }`}
                  >
                    {item?.icon}
                    <span className="grow ml-2">{item?.label}</span>
                    <div
                      className={`triangle h-6 w-6 bg-white absolute right-0 top-auto z-10 ${
                        location.pathname === item?.link ? "block" : "hidden"
                      }`}
                    ></div>
                  </ListItem>
                </Link>
              ))}

              <div className="text-yellow-300 border-b-2 mt-2 border-yellow-300 pl-2 text-lg font-bold  py-1 z-10 overflow-hidden">
                Client&apos;s Orders
              </div>
              {clientOrderLinks?.map((route, i) => (
                <Link to={route.url} key={i}>
                  <ListItem
                    sx={{ py: 2 }}
                    className={`justify-between relative py-3 px-4 border-b border-[#b8b8b8b0] hover:bg-[var(--secondary-bg)] ${
                      location.pathname === route.url
                        ? "bg-[var(--secondary-bg)]"
                        : ""
                    }`}
                  >
                    {route.icon}
                    <span className="grow ml-2">{route.lable}</span>
                    <div
                      className={`triangle h-6 w-6 bg-white absolute right-0 top-auto z-10 ${
                        location.pathname === route.url ? "block" : "hidden"
                      }`}
                    ></div>
                  </ListItem>
                </Link>
              ))}

              <Divider />
              <div className="text-yellow-300 border-b-2 mt-2 border-yellow-300 pl-2 text-lg font-bold  py-1 z-10 overflow-hidden">
                Our Services
              </div>
              {ourServiceLinks?.map((route, i) => (
                <Link to={route.url} key={i}>
                  <ListItem
                    sx={{ py: 2 }}
                    className={`justify-between relative py-3 px-4 border-b border-[#b8b8b8b0] hover:bg-[var(--secondary-bg)] ${
                      location.pathname === route.url
                        ? "bg-[var(--secondary-bg)]"
                        : ""
                    }`}
                  >
                    {route.icon}
                    <span className="grow ml-2">{route.lable}</span>
                    {
                      <div
                        className={`triangle h-6 w-6 bg-white absolute right-0 top-auto z-10 ${
                          location.pathname === route.url ? "block" : "hidden"
                        }`}
                      ></div>
                    }
                  </ListItem>
                </Link>
              ))}

              <div className="text-yellow-300 border-b-2 mt-2 border-yellow-300 pl-2 text-lg font-bold py-1 z-10 overflow-hidden">
                Our Partners
              </div>
              {ourPartnerLinks?.map((route, i) => (
                <Link to={route.url} key={i}>
                  <ListItem
                    sx={{ py: 2 }}
                    className={`justify-between relative py-3 px-4 border-b border-[#b8b8b8b0] hover:bg-[var(--secondary-bg)] ${
                      location.pathname === route.url
                        ? "bg-[var(--secondary-bg)]"
                        : ""
                    }`}
                  >
                    {route.icon}
                    <span className="grow ml-2">{route.lable}</span>
                    <div
                      className={`triangle h-6 w-6 bg-white absolute right-0 top-auto z-10 ${
                        location.pathname === route.url ? "block" : "hidden"
                      }`}
                    ></div>
                  </ListItem>
                </Link>
              ))}
              <Divider />
              <Link to={"/dashboard/drivers"}>
                <ListItem
                  open={location.pathname === "/dashboard/drivers"}
                  sx={{ py: 2 }}
                  className={`justify-between relative py-3 px-4 border-b border-[#b8b8b8b0]  ${
                    location.pathname === "/dashboard/drivers"
                      ? "bg-[var(--secondary-bg)]"
                      : ""
                  }`}
                >
                  <DirectionsCarIcon />
                  <span className="grow ml-2">Drivers</span>
                  {location.pathname === "/dashboard/drivers" ? (
                    <ExpandLess />
                  ) : (
                    <ExpandMore />
                  )}
                  <div
                    className={`triangle h-6 w-6 bg-white absolute  right-0 top-auto z-10 ${
                      location.pathname === "/dashboard/drivers"
                        ? "block"
                        : "hidden"
                    }`}
                  ></div>
                </ListItem>
              </Link>
              <Collapse
                component="li"
                in={location.pathname === "/dashboard/drivers"}
                timeout="auto"
                unmountOnExit
              >
                <List disablePadding>
                  {isAdmin &&
                    partnerStatus?.map((item, i) => (
                      <ListItem
                        key={i}
                        disablePadding
                        sx={{
                          color: "white",
                          pl: 2,
                          m: 0,
                          bgcolor: `${
                            activeStatus === i && "var(--secondary-bg)"
                          }`,
                        }}
                        onClick={() => handleChangeQueryText(item.queryText, i)}
                      >
                        <ListItemButton className="space-x-2">
                          <span>{item.icon}</span>
                          {item.queryText === "Pending" ? (
                            <Badge
                              color="secondary"
                              badgeContent={`${
                                item.queryText === "Pending" && driverRequest
                              }`}
                            >
                              <ListItemText
                                primary={item.label}
                                sx={{ ml: 0 }}
                              />
                            </Badge>
                          ) : (
                            <ListItemText primary={item.label} sx={{ ml: 0 }} />
                          )}
                        </ListItemButton>
                      </ListItem>
                    ))}
                </List>
              </Collapse>
              <Divider />
              <Link to={"/dashboard/local-partners"}>
                <ListItem
                  open={location.pathname === "/dashboard/local-partners"}
                  sx={{ py: 2 }}
                  className={`justify-between relative py-3 px-4 border-b border-[#b8b8b8b0]  ${
                    location.pathname === "/dashboard/local-partners"
                      ? "bg-[var(--secondary-bg)]"
                      : ""
                  }`}
                >
                  <HandshakeIcon />
                  <span className="grow ml-2">Local Partners</span>
                  {location.pathname === "/dashboard/local-partners" ? (
                    <ExpandLess />
                  ) : (
                    <ExpandMore />
                  )}
                  <div
                    className={`triangle h-6 w-6 bg-white absolute  right-0 top-auto z-10 ${
                      location.pathname === "/dashboard/local-partners"
                        ? "block"
                        : "hidden"
                    }`}
                  ></div>
                </ListItem>
              </Link>
              <Divider />
            </>

            <Collapse
              component="li"
              in={location.pathname === "/dashboard/local-partners"}
              timeout="auto"
              unmountOnExit
            >
              <List disablePadding>
                {isAdmin &&
                  partnerStatus?.map((item, i) => (
                    <ListItem
                      key={item.queryText}
                      disablePadding
                      sx={{
                        color: "white",
                        pl: 2,
                        m: 0,
                        bgcolor: `${
                          activeStatus === i && "var(--secondary-bg)"
                        }`,
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
            {(isAdmin || isSubAdmin) && (
              <ListItem
                open={openCommuincationMenu}
                onClick={() => setOpenCommunicationMenu((p) => !p)}
                sx={{ py: 2 }}
                className={` flex justify-between relative`}
              >
                <SupportAgentIcon />
                <span className="grow ml-2">Communication</span>
                {openCommuincationMenu ? <ExpandLess /> : <ExpandMore />}
              </ListItem>
            )}
            <Collapse
              component="li"
              in={openCommuincationMenu}
              timeout="auto"
              unmountOnExit
            >
              <List disablePadding>
                {(isAdmin || isSubAdmin) &&
                  communicationChild?.map((item) => (
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
                          bgcolor: `${
                            location.pathname === "/dashboard/" + item.link &&
                            "var(--secondary-bg)"
                          }`,
                        }}
                        onClick={() => handleChatRooom(item.link)}
                      >
                        <ListItemButton className="space-x-2">
                          <span>{item.icon}</span>
                          <ListItemText primary={item.label} sx={{ ml: 0 }} />
                          <div
                            className={`triangle h-6 w-6 bg-white absolute right-0 top-auto z-10  ${
                              location?.pathname === "/dashboard/" + item?.link
                                ? "block"
                                : "hidden"
                            }`}
                          ></div>
                        </ListItemButton>
                      </ListItem>
                    </Link>
                  ))}
              </List>
            </Collapse>

            {isAdmin && (
              <ListItem
                disablePadding
                sx={{
                  color: "white",
                  m: 0,
                  bgcolor: `${
                    location.pathname === "/dashboard/sub-admins" &&
                    "var(--secondary-bg)"
                  }`,
                }}
              >
                <Link
                  to="/dashboard/sub-admins"
                  className="w-full flex justify-between relative"
                >
                  <ListItemButton className="space-x-2 w-full">
                    <span>
                      <AdminPanelSettingsIcon />
                    </span>
                    <ListItemText primary="Sub Admins" sx={{ ml: 0 }} />
                    <div
                      className={`triangle h-6 w-6 bg-white absolute right-0 top-auto z-10  ${
                        location?.pathname === "/dashboard/sub-admins"
                          ? "block"
                          : "hidden"
                      }`}
                    ></div>
                  </ListItemButton>
                </Link>
              </ListItem>
            )}
          </>
        )}

        {isPartner &&
          partnerNavRoutes.map((item, i) => (
            <Link to={`/dashboard${item.url}`} key={i}>
              <ListItem
                disablePadding
                sx={{
                  color: "white",
                  p: 0,
                  m: 0,
                  bgcolor: `${
                    location.pathname === "/dashboard" + item.url &&
                    "var(--secondary-bg)"
                  }`,
                }}
                className="relative"
              >
                <ListItemButton>
                  <span> {item.icon}</span>
                  <ListItemText primary={item.label} sx={{ ml: 1 }} />
                </ListItemButton>
                <div
                  className={`triangle h-6 w-6 bg-white absolute right-0 top-auto z-10  ${
                    location.pathname === "/dashboard" + item.url
                      ? "block"
                      : "hidden"
                  }`}
                ></div>
              </ListItem>
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
          backgroundColor: "var(--primary-bg)",
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
            {<div className="font-bold block">{text}</div>}
          </Typography>

          <div className="flex gap-2 items-center">
            <Avatar
              alt="Cindy Baker"
              src={user?.photoURL}
              className="border-2 bg-white border-yellow-300"
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
                  className="h-fit font-bold text-white border-2 border-gray-700 rounded-lg py-1 px-2 text-xs m-2 bg-[var(--primary-bg)]"
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
        sx={{
          width: { sm: drawerWidth },
          flexShrink: { sm: 0 },
        }}
        aria-label="mailbox folders"
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
              bgcolor: "var(--primary-bg)",
            },
          }}
          className="dashboard-menu overflow-x-hidden"
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
              bgcolor: "var(--primary-bg)",
            },
          }}
          open
          className="dashboard-menu overflow-x-hidden"
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 1,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar></Toolbar>

        {location.pathname === "/dashboard" &&
          (((isAdmin || isSubAdmin) && <AdminDashboard />) ||
            (isPartner && (
              <PartnerRoute>
                <PartnerDashboard />
              </PartnerRoute>
            )))}
        {(isAdmin || isSubAdmin || isPartner) && <Outlet />}
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
