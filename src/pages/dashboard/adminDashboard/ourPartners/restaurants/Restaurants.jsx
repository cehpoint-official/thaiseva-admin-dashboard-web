import { useContext, useEffect, useState } from "react";
import PageHeading from "../../../../../components/PageHeading";
import { PartnerContext } from "../../../../../contextAPIs/PartnerProvider";
import { restaurentsCollection } from "../../../../../firebase/firebase.config";
import { doc, getDoc } from "firebase/firestore";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
} from "@mui/material";
import ViewDetailsIcon from "../../../../../components/ViewDetailsIcon";
import SubTitle from "../../../../../components/SubTitle";
import CloseIcon from "@mui/icons-material/Close";
import LoadingContent from "../../../../../components/LoadingContent";
import { item } from "../../../../../utils/utils";

const Restaurants = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [viewDetailsModal, setViewDetailsModal] = useState(false); //Add service modal
  const [restaurantDetails, setRestaurantDetails] = useState({ status: "" });
  const { restaurants, loadingData } = useContext(PartnerContext);
  const [matchedRestaurants, setMatchedRestaurants] = useState([]);

  useEffect(() => {
    setMatchedRestaurants(restaurants);
  }, [restaurants]);

  // Partners table header
  const columns = [
    { id: "name", label: "Name", width: 120 },
    { id: "phone", label: "Phone", width: 80 },
    { id: "email", label: "Email", width: 80 },
    { id: "address", label: "Address", width: 100 },
    { id: "isVerified", label: "Status", width: 100 },
    { id: "action", label: "Action", width: 120 },
  ];

  // creating single row
  function createData(name, phone, email, address, isVerified, status, id) {
    return { name, phone, email, address, isVerified, status, id };
  }

  // calling createData function with partner's data
  const rows = matchedRestaurants.map((restaurant) => {
    return createData(
      restaurant?.name,
      restaurant?.phone,
      restaurant?.email,
      restaurant?.address,
      restaurant?.isVerified,
      restaurant.uid
    );
  });

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleClose = () => {
    setRestaurantDetails({});
    setViewDetailsModal(false);
  };

  const handleViewDetails = async (id) => {
    const query = doc(restaurentsCollection, id);
    const data = await getDoc(query);

    setRestaurantDetails(data.data());
    setViewDetailsModal(true); //opening the modal
  };

  /* =============================================================
              serach functionalities start
  =============================================================*/
  const handleSearchByName = (text) => {
    const matchingObjects = restaurants.filter((item) =>
      item.name.toLowerCase().includes(text.toLowerCase())
    );
    setMatchedRestaurants(matchingObjects);
  };

  const handleSearchByLocation = (text) => {
    const matchingObjects = restaurants.filter((item) =>
      item.address.toLowerCase().includes(text.toLowerCase())
    );
    setMatchedRestaurants(matchingObjects);
  };
  /* =============================================================
              serach functionalities end
  =============================================================*/

  return (
    <div className="overflow-x-hidden">
      <PageHeading text="Restaurants" />
      <Grid container spacing={0.5} sx={{ mb: 2, mt: 0.5 }}>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            label="Search By Restaurant Name"
            type="search"
            placeholder="Restaurant Name"
            fullWidth
            defaultValue=""
            onChange={(e) => handleSearchByName(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            label="Search By Address"
            type="search"
            placeholder="Type Address"
            fullWidth
            defaultValue=""
            onChange={(e) => handleSearchByLocation(e.target.value)}
          />
        </Grid>
      </Grid>

      <Paper sx={{ width: "100%", overflowX: "hidden" }}>
        <TableContainer sx={{ maxHeight: 440, maxWidth: "87vw" }}>
          {loadingData ? (
            <LoadingContent />
          ) : (
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      align="center"
                      style={{
                        width: column.width,
                        color: "var(--primary-bg)",
                        fontWeight: "bold",
                      }}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {rows
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, i) => {
                    return (
                      <TableRow hover role="checkbox" tabIndex={-1} key={i}>
                        {columns.map((column) => {
                          const value = row[column.id];
                          return (
                            <TableCell key={column.id} align="center">
                              {(column.id === "isVerified" && (
                                <span
                                  className={`${
                                    value ? "bg-green-500" : "bg-slate-400"
                                  } text-white  py-1 px-2 rounded`}
                                >
                                  {value ? "Verified" : "Not Verified"}
                                </span>
                              )) ||
                                (column.id === "action" && (
                                  <div className="flex items-center justify-center gap-1">
                                    <div
                                      onClick={() =>
                                        handleViewDetails(row.email)
                                      }
                                    >
                                      <ViewDetailsIcon title="View Restaurant's info" />
                                    </div>
                                  </div>
                                )) ||
                                value}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          )}
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      {/* modal  */}
      <Dialog
        open={viewDetailsModal}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          Name: {restaurantDetails?.name}
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: "absolute",
            right: 0,
            top: 0,
            color: "gray",
          }}
        >
          <CloseIcon />
        </IconButton>

        {/* modal body */}
        <DialogContent dividers sx={{ p: { xs: 2, md: 4 } }}>
          <Grid container spacing={0.5} sx={{ mb: 2, mt: 0.5 }}>
            <Grid item xs={12} sm={6}>
              <div className="flex justify-between">
                <img
                  src={restaurantDetails?.photo}
                  alt=""
                  className="w-36 h-36 mx-auto rounded-full border-2 border-[var(--primary-bg)]"
                />
              </div>
            </Grid>
            <Grid item xs={12} sm={6}>
              {/* Driver Information */}
              <SubTitle text="Restaurant Information" />
              <Divider />
              <Grid container spacing={0.5} sx={{ mb: 2, mt: 0.5 }}>
                {item("Email", restaurantDetails?.email, true)}
                {item("Phone Number", restaurantDetails?.phone, true)}
                {item("Address", restaurantDetails?.address, true)}
                {item("Description", restaurantDetails?.description, true)}
              </Grid>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            autoFocus
            sx={{ bgcolor: "var(--primary-bg)", color: "white", hover: "none" }}
            onClick={() => setViewDetailsModal(false)}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Restaurants;
