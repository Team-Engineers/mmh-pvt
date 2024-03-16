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
import { useParams } from "react-router-dom";

function AllDematAccount() {
  const dispatch = useDispatch();
  const { category } = useParams();
  const [leadData, setLeadData] = useState([]);
  const [filterValue, setFilterValue] = useState("");
  const [currentlyEditing, setCurrentlyEditing] = useState(null);
  const [editedData, setEditedData] = useState({
    name: "",
    commission: "",
    link: "",
    imageLink: "",
    category: "",
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
      let categoryURL = `${API}/commissions/category/${category}`;
      if (category === "all_products") {
        categoryURL = `${API}/commissions`;
      }
      const baseURL = categoryURL;
      try {
        const response = await axios.get(baseURL, { params: params });
        if (response.status === 200) {
          // console.log("response data of commision", response.data);
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
  }, [leadDeleted, todayDateString, category, dispatch]);

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
  const handleFilterChange = (e) => {
    setFilterValue(e.target.value);
  };

  const filteredLeads = leadData?.filter((lead) => {
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
        !editedData.imageLink ||
        editedData.category === "default"
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
        category: editedData.category,
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedData({ ...editedData, [name]: value });
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
    let categoryURL = `${API}/commissions/category/${category}`;
    if (category === "all_products") {
      categoryURL = `${API}/commissions`;
    }
    const baseURL = categoryURL;
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
        title={`${category.toUpperCase().split("_").join(" ")} ${leadData?.length}`}
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
                    <th>Name</th>

                    <th>Commission</th>
                    <th>Account Link</th>
                    <th>Category</th>
                    <th>Image Link</th>
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
                        <td style={{ maxWidth: "7rem" }}>
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
                        <td style={{ maxWidth: "7rem" }}>
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
                        <td style={{ maxWidth: "7rem" }}>
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
                        <td style={{ maxWidth: "10rem" }}>
                          <div className="overflow-hidden truncate">
                            {currentlyEditing === k ? (
                              <select
                                name="category"
                                updateType="category"
                                className="input input-bordered w-full pe-2"
                                value={editedData.category?.toUpperCase()} // Set initial value to uppercase
                                onChange={handleInputChange}
                              >
                                <option value="default" disabled>
                                  Select Category
                                </option>
                                <option value="SAVINGS_ACCOUNT">
                                  Savings Account
                                </option>
                                <option value="SPECIAL_PRODUCTS">
                                  Special Product
                                </option>
                                <option value="DEMAT_ACCOUNT">
                                  Demat Account
                                </option>
                              </select>
                            ) : (
                              l.category.toUpperCase() // Display uppercase category if not editing
                            )}
                          </div>
                        </td>

                        <td style={{ maxWidth: "7rem" }}>
                          <div className=" overflow-hidden truncate">
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
