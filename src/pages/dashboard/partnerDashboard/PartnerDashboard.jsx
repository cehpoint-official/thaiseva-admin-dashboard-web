import { useContext } from "react";

import { AuthContext } from "../../../contextAPIs/AuthProvider";
import PendingPartnership from "../../../components/PendingPartnership";
import PageHeading from "../../../components/PageHeading";
import { useState } from "react";
import Loading from "../../../components/Loading";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import CloseIcon from "@mui/icons-material/Close";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormLabel,
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
} from "@mui/material";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { requirementsCollection } from "../../../firebase/firebase.config";
import { RequirementContext } from "../../../contextAPIs/RequirementsProvider";

const PartnerDashboard = () => {
  const { isVerifiedPartner } = useContext(AuthContext);
  const { myRequirements, setRefetch } = useContext(RequirementContext);
  const [requirement, setRequirement] = useState({});
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [viewDetailsModal, setViewDetailsModal] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  if (!isVerifiedPartner) {
    console.log(isVerifiedPartner);
    return <PendingPartnership />;
  }

  const columns = [
    { id: "requirementTitle", label: "Title", width: 100 },
    {
      id: "status",
      label: "Status",
      width: 100,
    },
    {
      id: "action",
      label: "Action",
      width: 120,
    },
  ];

  // creating single row
  function createData(requirementTitle, isChecked, isCompleted, id) {
    return {
      requirementTitle,
      isChecked,
      isCompleted,
      id,
    };
  }

  // calling createData function with partner's data
  const rows = myRequirements?.map((requirement) => {
    return createData(
      requirement.requirementTitle,
      requirement.isChecked,
      requirement.isCompleted,
      requirement.id
    );
  });

  const handleChangeStatus = async (id) => {
    console.log(JSON.parse(isCompleted));
    await updateDoc(doc(requirementsCollection, id), {
      isCompleted: JSON.parse(isCompleted),
    }).then(() => setRefetch((p) => !p));
  };

  const handleViewDetails = async (id) => {
    const res = await getDoc(doc(requirementsCollection, id));
    setRequirement(res.data());
    setViewDetailsModal(true);
  };

  //
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const loadingContent = (
    <div className="md:h-[40vh] w-full flex items-center justify-center">
      <Loading />
    </div>
  );
  return (
    <div>
      <PageHeading text={"Requirments"} />
      <Paper sx={{ width: "100%", overflowX: "hidden" }}>
        <TableContainer sx={{ maxHeight: 440, maxWidth: "87vw" }}>
          {!myRequirements ? (
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
                              value = "Not Completed";
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
                              {((value === "Not Completed" ||
                                value === "Pending" ||
                                value === "Completed") && (
                                <span
                                  className={`${
                                    (value === "Not Completed" &&
                                      "bg-slate-400 text-black") ||
                                    (value === "Pending" && "bg-orange-500") ||
                                    (value === "Completed" && "bg-green-500")
                                  } text-white  py-1 px-2 rounded`}
                                >
                                  {value}
                                </span>
                              )) ||
                                (column.id === "action" && (
                                  <>
                                    <button
                                      onClick={() => handleViewDetails(row.id)}
                                      className="bg-[blue] text-white p-1 rounded"
                                    >
                                      <RemoveRedEyeIcon />
                                    </button>
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

      {/* modal  */}

      <Dialog
        open={viewDetailsModal}
        onClose={() => setViewDetailsModal(false)}
        aria-labelledby="responsive-dialog-title"
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
            <span>Task Details : </span>{" "}
            <div className="border-2 border-blue-400 p-2 rounded">
              <p>{requirement.requirementText}</p>
            </div>
          </div>
          <div className="flex flex-col">
            <FormControl>
              <FormLabel className="mt-2">Completed the task?</FormLabel>
              <RadioGroup
                name="controlled-radio-buttons-group"
                defaultValue={requirement.isCompleted}
                onChange={(e) => setIsCompleted(e.target.value)}
              >
                <FormControlLabel
                  value={false}
                  control={<Radio />}
                  label="Not Yet"
                />
                <FormControlLabel
                  value={true}
                  control={<Radio />}
                  label="Completed"
                />
              </RadioGroup>
            </FormControl>
            <button
              className="bg-[blue] text-white rounded py-1 px-2 text-xs w-fit mt-2"
              onClick={() => handleChangeStatus(requirement.id)}
              disabled={requirement.isChecked}
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

export default PartnerDashboard;
