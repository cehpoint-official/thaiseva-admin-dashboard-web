import {
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
} from "@mui/material";
import { useContext } from "react";
import { useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import CloseIcon from "@mui/icons-material/Close";
import { useEffect } from "react";
import { RequirementContext } from "../../../../../contextAPIs/RequirementsProvider";
import { travelRequirementsCollection } from "../../../../../firebase/firebase.config";
import Loading from "../../../../../components/Loading";
import PageHeading from "../../../../../components/PageHeading";
import ViewDetailsIcon from "../../../../../components/ViewDetailsIcon";

const TravelRequirements = () => {
  const { travelRequirements, setRefetchRequirement } =
    useContext(RequirementContext);
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
    setMatchedRequirements(travelRequirements); // data is coming form requirement context provider

    // Getting the quantity of completed task
    const completedQuantity = travelRequirements.filter(
      (item) => item.isChecked === true
    );
    // Getting the quantity of pending task
    const pendingQuantity = travelRequirements.filter(
      (item) => item.isChecked === false && item.isCompleted === true
    );
    // Getting the quantity of not Yet task
    const notYetQuantity = travelRequirements.filter(
      (item) => item.isChecked === false && item.isCompleted === false
    );

    setTotalQuantity(travelRequirements.length); // number of total task
    setCompletedQuantity(completedQuantity.length); // number of completed task
    setPendingQuantity(pendingQuantity.length); // number of pending task
    setNotYetQuantity(notYetQuantity.length); // number of not yet task

    // Getting completed task
    if (queryStatus === "Completed") {
      const completedTasks = travelRequirements.filter(
        (item) => item.isChecked === true
      );
      setMatchedRequirements(completedTasks);
    }

    // Getting pending task
    if (queryStatus === "Pending") {
      const pendingTasks = travelRequirements.filter(
        (item) => item.isChecked === false && item.isCompleted === true
      );
      setMatchedRequirements(pendingTasks);
    }

    // Getting not yet task
    if (queryStatus === "Not Yet") {
      const notYetTasks = travelRequirements.filter(
        (item) => item.isCompleted === false
      );
      setMatchedRequirements(notYetTasks);
    }
  }, [travelRequirements, queryStatus]);

  const columns = [
    { id: "requirementTitle", label: "Title", width: 100 },
    {
      id: "providerPhone",
      label: "Provider's\u00a0Phone",
      width: 100,
    },
    {
      id: "locationName",
      label: "Location",
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
    locationName,
    isChecked,
    isCompleted,
    id
  ) {
    return {
      requirementTitle,
      providerPhone,
      locationName,
      isChecked,
      isCompleted,
      id,
    };
  }

  console.log(matchedRequirements);

  // calling createData function with partner's data
  const rows = matchedRequirements.map((requirement) => {
    return createData(
      requirement.requirementTitle,
      requirement.providerPhone,
      requirement.locationName,
      requirement.isChecked,
      requirement.isCompleted,
      requirement.id
    );
  });

  const handleViewDetails = async (id) => {
    const res = await getDoc(doc(travelRequirementsCollection, id));
    setRequirement(res.data());
    setViewDetailsModal(true);
  };

  const handleChangeStatus = async (id) => {
    await updateDoc(doc(travelRequirementsCollection, id), {
      isChecked: JSON.parse(isChecked),
    }).then(() => setRefetchRequirement((p) => !p));
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
    const matchingObjects = travelRequirements.filter((item) =>
      item.requirementTitle.toLowerCase().includes(text.toLowerCase())
    );

    setMatchedRequirements(matchingObjects);
  };

  const handleSearchByLocationName = (text) => {
    const matchingObjects = travelRequirements.filter((item) =>
      item.locationName.toLowerCase().includes(text.toLowerCase())
    );

    setMatchedRequirements(matchingObjects);
  };

  const handleSearchByPhone = (text) => {
    const matchingObjects = travelRequirements.filter((item) =>
      item.providerPhone.includes(text)
    );

    setMatchedRequirements(matchingObjects);
  };
  /* =============================================================
                    serach functionalities end
    =============================================================*/

  const loadingContent = (
    <div className="md:h-[40vh] w-full flex items-center justify-center">
      <Loading />
    </div>
  );

  return (
    <div>
      <PageHeading text="All Requirements" />
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
            label="Search By Location Name"
            type="search"
            placeholder="Type Location"
            fullWidth
            defaultValue=""
            onChange={(e) => handleSearchByLocationName(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            label="Search By Requirement Id"
            type="search"
            placeholder="Type Requirement Id"
            fullWidth
            defaultValue=""
            // onChange={(e) => handleSearchByServiceArea(e.target.value)}
          />
        </Grid>
      </Grid>

      <div className="flex flex-wrap gap-1 justify-between md:pr-4 mb-1">
        <button
          className={`py-1 px-2 rounded text-sm ${
            queryStatus === "Total" ? "bg-[blue] text-white" : "bg-gray-300"
          }`}
          onClick={() => setQueryStatus("Total")}
        >
          Total : {totalQuantity}
        </button>
        <button
          className={`py-1 px-2 rounded text-sm ${
            queryStatus === "Completed" ? "bg-[blue] text-white" : "bg-gray-300"
          }`}
          onClick={() => setQueryStatus("Completed")}
        >
          Completed : {completedQuantity}
        </button>
        <button
          className={`py-1 px-2 rounded text-sm ${
            queryStatus === "Pending" ? "bg-[blue] text-white" : "bg-gray-300"
          }`}
          onClick={() => setQueryStatus("Pending")}
        >
          Pending : {pendingQuantity}
        </button>
        <button
          className={`py-1 px-2 rounded text-sm ${
            queryStatus === "Not Yet" ? "bg-[blue] text-white" : "bg-gray-300"
          }`}
          onClick={() => setQueryStatus("Not Yet")}
        >
          Not Yet : {notYetQuantity}
        </button>
      </div>
      <Paper sx={{ width: "100%", overflowX: "hidden" }}>
        <TableContainer sx={{ maxHeight: 440, maxWidth: "87vw" }}>
          {!travelRequirements ? (
            loadingContent
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
                        color: "blue",
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
                              value = "Not Yet";
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
                          return (
                            <TableCell key={column.id} align="center">
                              {((value === "Not Yet" ||
                                value === "Pending" ||
                                value === "Completed") && (
                                <div
                                  className={`block ${
                                    (value === "Not Yet" &&
                                      "bg-slate-400 text-black") ||
                                    (value === "Pending" && "bg-orange-500") ||
                                    (value === "Completed" && "bg-green-500")
                                  } text-white  py-1 px-2 rounded`}
                                >
                                  {value}
                                </div>
                              )) ||
                                (column.id === "action" && (
                                  <>
                                    <div
                                      onClick={() => handleViewDetails(row.id)}
                                    >
                                      <ViewDetailsIcon />
                                    </div>
                                  </>
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
        // sx={{ minWidth: 400 }}
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          {requirement.requirementTitle}
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
        <DialogContent dividers sx={{ p: 2 }}>
          <div>
            <span>Task Details : </span>
            <div className="border-2 border-blue-400 p-2 rounded">
              <p>{requirement.requirementText}</p>
            </div>
          </div>
          <div className="flex flex-col">
            <FormControl>
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
            </FormControl>
            <button
              className="bg-[blue] text-white rounded py-1 px-2 text-xs w-fit mt-2"
              onClick={() => handleChangeStatus(requirement.id)}
              disabled={
                requirement.isChecked || requirement.isCompleted === false
              }
            >
              Save
            </button>
          </div>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            autoFocus
            sx={{ bgcolor: "blue", color: "white", hover: "none" }}
            onClick={() => setViewDetailsModal(false)}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default TravelRequirements;
