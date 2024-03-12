import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import TrashIcon from "@heroicons/react/24/outline/TrashIcon";
import * as XLSX from "xlsx";
import axios from "axios";
import { format } from "date-fns";
import { API } from "../../../utils/constants";
import { sliceLeadDeleted } from "../../leads/leadSlice";
import { openModal } from "../../common/modalSlice";
import {
  CONFIRMATION_MODAL_CLOSE_TYPES,
  MODAL_BODY_TYPES,
} from "../../../utils/globalConstantUtil";
import { showNotification } from "../../common/headerSlice";
import TitleCard from "../../../components/Cards/TitleCard";
import InputText from "../../../components/Input/InputText";

function AllDematAccount() {
  const dispatch = useDispatch();
  const [leadData, setLeadData] = useState([]);
  const [sortConfig, setSortConfig] = useState({
    column: "name",
    order: "asc",
  });
  const [filterValue, setFilterValue] = useState("");
  const [currentlyEditing, setCurrentlyEditing] = useState(null);
  const [editedData, setEditedData] = useState({
    name: "",
    commission: "",
    link: "",
    imageLink: "",
  });

  // const leadDetails = JSON.parse(localStorage.getItem("lead-details"));
  // console.log("lead details from local storage", leadDetails);
  const leadDeleted = useSelector((state) => state.lead.leadDeleted);
  const todayDate = new Date();
  const todayDateString = todayDate.toISOString().split("T")[0];
  useEffect(() => {
    const fetchData = async () => {
      const params = {
        // page: currentPage,
        // limit: itemsPerPage,
        // offset: Math.max(0, currentPage - 1) * 10,
      };
      const baseURL = `${API}/commissions`;
      try {
        const response = await axios.get(baseURL, { params: params });
        if (response.status === 200) {
          console.log("response data of commision", response.data);
          // localStorage.setItem("lead-details", JSON.stringify(response.data));
          setLeadData(response.data);
        } else {
          console.log("access token incorrect");
        }
      } catch (error) {
        if (error.response.status === 409) {
          localStorage.clear();
          window.location.href = "/login";
        }
        console.error("error", error);
      }
      dispatch(sliceLeadDeleted(false));
    };

    fetchData();
  }, [leadDeleted, todayDateString, dispatch]);

  const deleteCurrentLead = (index) => {
    dispatch(
      openModal({
        title: "Confirmation",
        bodyType: MODAL_BODY_TYPES.CONFIRMATION,
        extraObject: {
          message: `Are you sure you want to delete this Account?`,
          type: CONFIRMATION_MODAL_CLOSE_TYPES.ACCOUNT_DELETE,
          index: index,
        },
      })
    );
  };

  const handleSort = (column) => {
    if (column === sortConfig.column) {
      setSortConfig({
        ...sortConfig,
        order: sortConfig.order === "asc" ? "desc" : "asc",
      });
    } else {
      setSortConfig({ column, order: "asc" });
    }
  };

  const sortedLeads = leadData?.slice().sort((a, b) => {
    const aValue = a[sortConfig.column] || "";
    const bValue = b[sortConfig.column] || "";

    if (sortConfig.order === "asc") {
      return aValue.localeCompare(bValue);
    } else {
      return bValue.localeCompare(aValue);
    }
  });

  const handleFilterChange = (e) => {
    setFilterValue(e.target.value);
  };

  const filteredLeads = sortedLeads?.filter((lead) => {
    return (
      lead?.name?.toLowerCase().includes(filterValue?.toLowerCase()) ||
      lead?.link?.toLowerCase().includes(filterValue) ||
      lead?.imageLink?.toLowerCase().includes(filterValue.toLowerCase()) ||
      lead?.commission?.toString().includes(filterValue)
    );
  });

  const toggleEdit = (index) => {
    setEditedData({
      name: filteredLeads[index].name,
      commission: filteredLeads[index].commission,
      link: filteredLeads[index].link,
      imageLink: filteredLeads[index].imageLink,
    });

    setCurrentlyEditing((prevIndex) => (prevIndex === index ? null : index));
  };

  const handleSaveEdit = async (leadId, index) => {
    try {
      // Validate edited data (you can add more validation as needed)
      if (
        !editedData.name ||
        !editedData.commission ||
        !editedData.link ||
        !editedData.imageLink
      ) {
        dispatch(
          showNotification({
            message: "All fields are required.",
            status: 0,
          })
        );
        return;
      }
      const tokenResponse = localStorage.getItem("accessToken");
      const tokenData = JSON.parse(tokenResponse);
      const token = tokenData.token;

      // Set the Authorization header with the token
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const updatedLead = {
        name: editedData.name,
        commission: editedData.commission,
        link: editedData.link,
        imageLink: editedData.imageLink,
      };

      await axios.put(`${API}/commissions/${leadId}`, updatedLead, config);
      dispatch(sliceLeadDeleted(true));

      dispatch(
        showNotification({
          message: "Account updated successfully!",
          status: 1,
        })
      );

      // Clear the edited values and toggle off editing mode
      setEditedData({ name: "", commission: "", link: "", imageLink: "" });
      setCurrentlyEditing(null);
    } catch (error) {
      if (error.response.status === 409) {
        localStorage.clear();
        window.location.href = "/login";
      } else {
        dispatch(
          showNotification({
            message: "Error updating Account. Please try again.",
            status: 0,
          })
        );
      }
    }
  };

  const updateFormValue = ({ updateType, value }) => {
    setEditedData({ ...editedData, [updateType]: value });
  };

  const convertDataToXLSX = (data) => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

    const blob = XLSX.write(wb, {
      bookType: "xlsx",
      mimeType:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      type: "binary",
    });

    // Convert the binary string to a Blob
    const blobData = new Blob([s2ab(blob)], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    return blobData;
  };

  // Utility function to convert binary string to ArrayBuffer
  const s2ab = (s) => {
    const buf = new ArrayBuffer(s.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i !== s.length; ++i) view[i] = s.charCodeAt(i) & 0xff;
    return buf;
  };

  // Function to trigger the download
  const downloadXLSX = (data) => {
    const blob = convertDataToXLSX(data);
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = "account_data.xlsx";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportXLSX = async () => {
    const baseURL = `${API}/commissions`;
    try {
      const response = await axios.get(baseURL);
      if (response.status === 200) {
        downloadXLSX(response.data);
      } else {
        console.log("access token incorrect");
      }
    } catch (error) {
      if (error.response.status === 409) {
        localStorage.clear();
        window.location.href = "/login";
      }
      console.error("error", error);
    }
  };

  const TopSideButtons = ({ onExportXLSX }) => {
    return (
      <div className="flex-wrap gap-[10px] max-sm:mt-[10px] flex justify-center">
        <button
          className="btn px-6 btn-sm normal-case btn-primary"
          onClick={onExportXLSX}
        >
          Export Account
        </button>
      </div>
    );
  };

  return (
    <>
      <div className="mb-4 flex items-center">
        <input
          type="text"
          placeholder="Filter by Name or Commission or Link"
          value={filterValue}
          onChange={handleFilterChange}
          className="input input-sm input-bordered  w-full max-w-xs"
        />
      </div>

      <TitleCard
        title={`All Accounts ${leadData?.length}`}
        topMargin="mt-2"
        TopSideButtons={<TopSideButtons onExportXLSX={handleExportXLSX} />}
      >
        {filteredLeads?.length === 0 ? (
          <p>No Data Found</p>
        ) : (
          <>
            <div className="overflow-x-auto w-full">
              <table className="table w-full">
                <thead>
                  <tr>
                    <th>image</th>

                    <th>Date</th>
                    <th
                      onClick={() => handleSort("name")}
                      className={`cursor-pointer ${
                        sortConfig.column === "name" ? "font-bold" : ""
                      } ${
                        sortConfig.column === "name"
                          ? sortConfig.order === "asc"
                            ? "sort-asc"
                            : "sort-desc"
                          : ""
                      }`}
                    >
                      Name
                    </th>

                    <th
                      onClick={() => handleSort("commission")}
                      className={`cursor-pointer ${
                        sortConfig.column === "commission" ? "font-bold" : ""
                      } ${
                        sortConfig.column === "commission"
                          ? sortConfig.order === "asc"
                            ? "sort-asc"
                            : "sort-desc"
                          : ""
                      }`}
                    >
                      Commission
                    </th>
                    <th
                      onClick={() => handleSort("link")}
                      className={`cursor-pointer ${
                        sortConfig.column === "link" ? "font-bold" : ""
                      } ${
                        sortConfig.column === "link"
                          ? sortConfig.order === "asc"
                            ? "sort-asc"
                            : "sort-desc"
                          : ""
                      }`}
                    >
                      Account Link
                    </th>
                    <th
                      onClick={() => handleSort("imageLink")}
                      className={`cursor-pointer ${
                        sortConfig.column === "imageLink" ? "font-bold" : ""
                      } ${
                        sortConfig.column === "imageLink"
                          ? sortConfig.order === "asc"
                            ? "sort-asc"
                            : "sort-desc"
                          : ""
                      }`}
                    >
                      Image Link
                    </th>
                    {/* <th>Assignee Status</th> */}

                    <th className="text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLeads?.map((l, k) => {
                    return (
                      <tr key={k}>
                        <td className="flex justify-center">
                          <img
                            src={l.imageLink}
                            alt={`img ${k}`}
                            className="w-20 h-16"
                          />
                        </td>

                        <td>
                          {l.createdAt
                            ? format(new Date(l?.createdAt), "dd/MM/yyyy")
                            : "N/A"}
                        </td>
                        <td>
                          {currentlyEditing === k ? (
                            <InputText
                              defaultValue={editedData.name}
                              updateType="name"
                              //   containerStyle="mt-4"
                              updateFormValue={updateFormValue}
                            />
                          ) : (
                            l.name
                          )}
                        </td>
                        <td>
                          {currentlyEditing === k ? (
                            <InputText
                              defaultValue={editedData.commission}
                              updateType="commission"
                              //   containerStyle="mt-4"
                              updateFormValue={updateFormValue}
                            />
                          ) : (
                            l.commission
                          )}
                        </td>
                        <td style={{ maxWidth: "4rem" }}>
                          <div className="max-w-6 overflow-hidden truncate">
                            {currentlyEditing === k ? (
                              <InputText
                                defaultValue={editedData.link}
                                updateType="link"
                                //   containerStyle="mt-4"
                                updateFormValue={updateFormValue}
                              />
                            ) : (
                              l.link
                            )}
                          </div>
                        </td>
                        <td style={{ maxWidth: "4rem" }}>
                          <div className="max-w-6 overflow-hidden truncate">
                            {currentlyEditing === k ? (
                              <InputText
                                defaultValue={editedData.imageLink}
                                updateType="imageLink"
                                updateFormValue={updateFormValue}
                              />
                            ) : (
                              l.imageLink
                            )}
                          </div>
                        </td>

                        {/* <td>{l.assigneeStatus}</td> */}
                        <td>
                          <div className="flex item-center justify-between">
                            {currentlyEditing !== k ? (
                              <button
                                className="btn btn-square btn-ghost"
                                onClick={() => deleteCurrentLead(l._id)}
                              >
                                <TrashIcon className="w-5" />
                              </button>
                            ) : (
                              ""
                            )}
                            <div className="flex gap-3 items-center justify-center">
                              {currentlyEditing === k && (
                                <button
                                  className="btn btn-square btn-ghost"
                                  onClick={() => handleSaveEdit(l._id, k)}
                                >
                                  SAVE
                                </button>
                              )}
                              <button
                                className="btn btn-square btn-ghost"
                                onClick={() => toggleEdit(k)}
                              >
                                {currentlyEditing === k ? "Cancel" : "Edit"}
                              </button>
                            </div>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </TitleCard>
    </>
  );
}

export default AllDematAccount;
