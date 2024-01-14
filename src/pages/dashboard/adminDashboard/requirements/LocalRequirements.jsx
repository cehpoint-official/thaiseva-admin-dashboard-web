import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  IconButton,
  Paper,
  Radio,
  RadioGroup,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { useContext } from "react";
import { useState } from "react";
import { deleteDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import CloseIcon from "@mui/icons-material/Close";
import { useEffect } from "react";
import { format } from "timeago.js";
import { RequirementContext } from "../../../../contextAPIs/RequirementsProvider";
import { requirementsCollection } from "../../../../firebase/firebase.config";
import { askingForDelete, deleteNotification } from "../../../../utils/utils";
import PageHeading from "../../../../components/PageHeading";
import LoadingContent from "../../../../components/LoadingContent";
import DeleteButton from "../../../../components/DeleteButton";
import ViewDetailsIcon from "../../../../components/ViewDetailsIcon";

const LocalRequirements = () => {
  const {
    allRequirements,
    setRefetch,
    queryCategory,
    setQueryCategory,
    loadingReq,
  } = useContext(RequirementContext);
  const [requirement, setRequirement] = useState({});
  const [queryStatus, setQueryStatus] = useState("Total");

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [viewDetailsModal, setViewDetailsModal] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [totalQuantity, setTotalQuantity] = useState([]);
  const [completedQuantity, setCompletedQuantity] = useState(0);
  const [pendingQuantity, setPendingQuantity] = useState(0);
  const [notYetQuantity, setNotYetQuantity] = useState(0);

  const [matchedRequirements, setMatchedRequirements] = useState([]);

  useEffect(() => {
    if (queryStatus === "Total") {
      setMatchedRequirements(allRequirements); // data is coming form requirement context provider
    }

    // Getting the quantity of completed task
    const completedQuantity = allRequirements.filter(
      (item) => item.isChecked === true
    );
    // Getting the quantity of pending task
    const pendingQuantity = allRequirements.filter(
      (item) => item.isChecked === false && item.isCompleted === true
    );
    // Getting the quantity of not Yet task
    const notYetQuantity = allRequirements.filter(
      (item) => item.isChecked === false && item.isCompleted === false
    );

    setTotalQuantity(allRequirements.length); // number of total task
    setCompletedQuantity(completedQuantity.length); // number of completed task
    setPendingQuantity(pendingQuantity.length); // number of pending task
    setNotYetQuantity(notYetQuantity.length); // number of not yet task

    // Getting completed task
    if (queryStatus === "Completed") {
      const completedTasks = allRequirements.filter(
        (item) => item.isChecked === true
      );
      setMatchedRequirements(completedTasks);
    }

    // Getting pending task
    if (queryStatus === "Pending") {
      const pendingTasks = allRequirements.filter(
        (item) => item.isChecked === false && item.isCompleted === true
      );
      setMatchedRequirements(pendingTasks);
    }

    // Getting not yet task
    if (queryStatus === "Incomplete") {
      const notYetTasks = allRequirements.filter(
        (item) => item.isCompleted === false
      );
      setMatchedRequirements(notYetTasks);
    }
  }, [allRequirements, queryStatus]);

  const columns = [
    { id: "requirementTitle", label: "Title", width: 100 },
    {
      id: "providerPhone",
      label: "Provider's\u00a0Phone",
      width: 100,
    },
    {
      id: "serviceCategory",
      label: "Service\u00a0Category",
      width: 100,
    },
    {
      id: "date",
      label: "Task Assigned",
      width: 100,
    },
    {
      id: "status",
      label: "Status",
      width: 100,
    },
    {
      id: "action",
      label: "Action",
      width: 50,
    },
  ];

  // creating single row
  function createData(
    requirementTitle,
    providerPhone,
    serviceCategory,
    isChecked,
    isCompleted,
    id,
    date
  ) {
    return {
      requirementTitle,
      providerPhone,
      serviceCategory,
      isChecked,
      isCompleted,
      id,
      date,
    };
  }

  // calling createData function with partner's data
  const rows = matchedRequirements.map((requirement) => {
    return createData(
      requirement.requirementTitle,
      requirement.providerPhone,
      requirement.serviceCategory,
      requirement.isChecked,
      requirement.isCompleted,
      requirement.id,
      requirement?.date
    );
  });

  const handleViewDetails = async (id) => {
    const res = await getDoc(doc(requirementsCollection, id));
    setRequirement(res.data());
    setViewDetailsModal(true);
  };

  const handleChangeStatus = async (id) => {
    await updateDoc(doc(requirementsCollection, id), {
      isChecked: JSON.parse(isChecked),
    }).then(() => setRefetch((p) => !p));
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  /* =============================================================
                serach functionalities start
    =============================================================*/
  const handleSearchByTitle = (text) => {
    const matchingObjects = allRequirements.filter((item) =>
      item.requirementTitle.toLowerCase().includes(text.toLowerCase())
    );

    /* const matchingObjects = allRequirements.filter((item) =>
        item.serviceInformation.servicesOffered.some((service) =>
          service.toLowerCase().includes(text.toLowerCase())
        )
      ); */

    setMatchedRequirements(matchingObjects);
  };

  const handleSearchByServiceArea = (text) => {
    const matchingObjects = allRequirements.filter((item) =>
      item.serviceArea.toLowerCase().includes(text.toLowerCase())
    );

    setMatchedRequirements(matchingObjects);
  };

  const handleSearchByPhone = (text) => {
    const matchingObjects = allRequirements.filter((item) =>
      item.providerPhone.includes(text)
    );

    setMatchedRequirements(matchingObjects);
  };
  /* =============================================================
                serach functionalities end
    =============================================================*/

  // deleting the requirement
  const handleDeleteRequirement = (id) => {
    askingForDelete().then(async (result) => {
      if (result.isConfirmed) {
        await deleteDoc(doc(requirementsCollection, id)).then(() => {
          deleteNotification("The Requirement is deleted successfully.");
        });
      }
    });
  };

  const serviceCategories = [
    "All",
    "Official Work",
    "Legal Administrative",
    "Logistics and Transportation",
    "Order Local Sim",
    "Home Services",
    "Order Pick Up",
    "Others",
  ];

  // custom text field for common data
  const item = (label, value, is12) => {
    return (
      <Grid item xs={12} sm={is12 ? 12 : 6} fullWidth>
        <p className="">
          <span className="font-bold">{label}: </span>
          <span className="text-slate-600"> {value}</span>
        </p>
      </Grid>
    );
  };

  return (
    <div>
      <PageHeading text="All Requirements" />
      <p className="text-xl font-bold mb-1">Search by Category : </p>
      <div className="flex gap-2 flex-wrap mb-1">
        {serviceCategories.map((serviceCategory, i) => (
          <button
            key={i}
            onClick={() => setQueryCategory(serviceCategory)}
            className={` py-1 px-2 rounded ${
              queryCategory === serviceCategory
                ? "bg-[var(--primary-bg)] text-white"
                : "bg-gray-300"
            }`}
          >
            {serviceCategory}
          </button>
        ))}
      </div>
      <Grid container spacing={0.5} sx={{ mb: 2, mt: 2 }}>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            label="Search By Title"
            type="search"
            placeholder="Requirement's Title"
            fullWidth
            defaultValue=""
            onChange={(e) => handleSearchByTitle(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          {" "}
          <TextField
            label="Search By Service Area"
            type="search"
            placeholder="Type Location"
            fullWidth
            defaultValue=""
            onChange={(e) => handleSearchByServiceArea(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          {" "}
          <TextField
            label="Search By Provider's Phone"
            type="search"
            placeholder="Provider's Phone"
            fullWidth
            defaultValue=""
            onChange={(e) => handleSearchByPhone(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            label="Search By Requirement Id"
            type="search"
            placeholder="Type Requirement Id"
            fullWidth
            defaultValue=""
            onChange={(e) => handleSearchByServiceArea(e.target.value)}
          />
        </Grid>
      </Grid>

      <div className="flex flex-wrap gap-1 justify-between md:pr-4 mb-1">
        <button
          className={`py-1 px-2 rounded text-sm ${
            queryStatus === "Total"
              ? "bg-[var(--primary-bg)] text-white"
              : "bg-gray-300"
          }`}
          onClick={() => setQueryStatus("Total")}
        >
          Total : {totalQuantity}
        </button>
        <button
          className={`py-1 px-2 rounded text-sm ${
            queryStatus === "Completed"
              ? "bg-[var(--primary-bg)] text-white"
              : "bg-gray-300"
          }`}
          onClick={() => setQueryStatus("Completed")}
        >
          Completed : {completedQuantity}
        </button>
        <button
          className={`py-1 px-2 rounded text-sm ${
            queryStatus === "Pending"
              ? "bg-[var(--primary-bg)] text-white"
              : "bg-gray-300"
          }`}
          onClick={() => setQueryStatus("Pending")}
        >
          Pending : {pendingQuantity}
        </button>
        <button
          className={`py-1 px-2 rounded text-sm ${
            queryStatus === "Incomplete"
              ? "bg-[var(--primary-bg)] text-white"
              : "bg-gray-300"
          }`}
          onClick={() => setQueryStatus("Incomplete")}
        >
          Incomplete : {notYetQuantity}
        </button>
      </div>
      <Paper sx={{ width: "100%", overflowX: "hidden" }}>
        <TableContainer sx={{ maxHeight: 440, maxWidth: "87vw" }}>
          {loadingReq ? (
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
                          let value = row[column.id];

                          if (column.id === "status") {
                            if (
                              row.isCompleted === false &&
                              row.isChecked === false
                            ) {
                              value = "Incomplete";
                            } else if (
                              row.isCompleted === true &&
                              row.isChecked === false
                            ) {
                              value = "Pending";
                            } else if (
                              row.isCompleted === true &&
                              row.isChecked === true
                            ) {
                              value = "Completed";
                            }
                          }

                          const date = new Date(
                            row["date"].seconds * 1000 +
                              row["date"].nanoseconds / 1000000
                          );
                          return (
                            <TableCell key={column.id} align="center">
                              {((value === "Incomplete" ||
                                value === "Pending" ||
                                value === "Completed") && (
                                <span
                                  className={`${
                                    (value === "Incomplete" &&
                                      "bg-slate-400 text-black") ||
                                    (value === "Pending" && "bg-orange-500") ||
                                    (value === "Completed" && "bg-green-500")
                                  } text-white  py-1 px-2 rounded`}
                                >
                                  {value}
                                </span>
                              )) ||
                                (column?.id === "date" && format(date)) ||
                                (column.id === "action" && (
                                  <div className="flex items-center justify-center gap-1">
                                    {(row["isChecked"] ||
                                      row["isCompleted"] !== true) && (
                                      <div
                                        onClick={() =>
                                          handleDeleteRequirement(row.id)
                                        }
                                      >
                                        <DeleteButton />
                                      </div>
                                    )}
                                    <div
                                      onClick={() => handleViewDetails(row.id)}
                                    >
                                      <ViewDetailsIcon title="View Requirement's details" />
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

      <Dialog
        open={viewDetailsModal}
        onClose={() => setViewDetailsModal(false)}
        aria-labelledby="responsive-dialog-title"
        fullWidth
      >
        <Box>
          <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
            <Typography variant="div">
              <span className="font-semibold ">Category : </span>{" "}
              <span className="bg-[var(--primary-bg)] text-white font-bold py-1 px-2 rounded inline-block text-sm">
                {requirement?.serviceCategory}
              </span>
            </Typography>
          </DialogTitle>
          <IconButton
            aria-label="close"
            onClick={() => setViewDetailsModal(false)}
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
          <DialogContent dividers sx={{ p: { xs: 2, md: 2 } }}>
            {/* personal information */}

            <Grid container spacing={1} fullWidth>
              {item("Task Name", requirement?.requirementTitle)}
              {item("Service Name", requirement?.serviceName)}
              {item("Provider", requirement?.providerName)}
              {item("Provider Phone", requirement?.providerPhone)}
              {item("Client Location", requirement?.locationName)}
              {item("Clinet's Name", requirement?.clientName)}
              {item("Client's Phone", requirement?.clientNumber)}
              {item("Description", requirement?.requirementText, true)}
            </Grid>

            {requirement.isChecked ? (
              <p className="bg-green-500 text-center py-1 rounded text-white my-3">
                The task was completed
              </p>
            ) : (
              <div className="">
                {requirement.isCompleted && (
                  <p className="bg-orange-500 text-center p-1 rounded text-white my-3 text-sm">
                    The service provider has completed this task. Confirm the
                    task after asking the client.
                  </p>
                )}
                <div className="flex flex-col">
                  <FormControl>
                    {requirement.isCompleted && (
                      <>
                        <FormLabel className="mt-2">Verify the task</FormLabel>
                        <RadioGroup
                          name="controlled-radio-buttons-group"
                          defaultValue={requirement.isChecked}
                          onChange={(e) => setIsChecked(e.target.value)}
                        >
                          <FormControlLabel
                            value={true}
                            control={<Radio />}
                            label="Checked"
                          />
                        </RadioGroup>
                      </>
                    )}
                  </FormControl>
                  <button
                    className="bg-[var(--primary-bg)] text-white rounded py-1 px-2 text-xs w-fit mt-2"
                    onClick={() => handleChangeStatus(requirement.id)}
                    disabled={
                      requirement.isChecked || requirement.isCompleted === false
                    }
                  >
                    {requirement.isCompleted ? "Confirm" : "Not Completed"}
                  </button>
                </div>
              </div>
            )}
          </DialogContent>
          <DialogActions>
            <Button
              variant="contained"
              type="submit"
              autoFocus
              sx={{
                bgcolor: "var(--primary-bg)",
                color: "white",
                hover: "none",
              }}
              onClick={() => setViewDetailsModal(false)}
            >
              Close
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </div>
  );
};

export default LocalRequirements;
