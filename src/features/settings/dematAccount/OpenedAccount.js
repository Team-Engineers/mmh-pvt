import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import TrashIcon from "@heroicons/react/24/outline/TrashIcon";
import { openModal } from "../../common/modalSlice";
import {
  CONFIRMATION_MODAL_CLOSE_TYPES,
  MODAL_BODY_TYPES,
} from "../../../utils/globalConstantUtil";
import TitleCard from "../../../components/Cards/TitleCard";
import axios from "axios";
import { API } from "../../../utils/constants";
import { sliceMemberDeleted, sliceMemberStatus } from "../../leads/leadSlice";
import * as XLSX from "xlsx";
import { showNotification } from "../../common/headerSlice";
import { format } from "date-fns";

function OpenedAccount() {
  const dispatch = useDispatch();
  const [teamMember, setTeamMember] = useState([]);
  const [filterValue, setFilterValue] = useState("");

  const memberDeleted = useSelector((state) => state.lead.memberDeleted);
  const memberStatus = useSelector((state) => state.lead.memberStatus);

  useEffect(() => {
    const fetchData = async () => {
      //   const todayDate = new Date().toISOString().split("T")[0];
      //   const params = {
      //     page: currentPage,
      //     limit: itemsPerPage,
      //     offset: Math.max(0, currentPage - 1) * itemsPerPage,
      //     approvedAt: "null",
      //     isAdmin: "false",
      //   };
      const baseURL = `${API}/commissionForm`;
      try {
        const response = await axios.get(baseURL);
        setTeamMember(response.data);
      } catch (error) {
        if (error.response.status === 409) {
          localStorage.clear();
          window.location.href = "/login";
        }
        console.error("error", error);
      }
      // console.log("it is running or not when status is changing", memberStatus);
      dispatch(sliceMemberStatus(""));
      dispatch(sliceMemberDeleted(false));
    };

    fetchData();
  }, [memberDeleted, memberStatus, dispatch]);

  // const employeeData = JSON.parse(localStorage.getItem("employee-details"));

  const deleteCurrentLead = (id) => {
    dispatch(
      openModal({
        title: "Confirmation",
        bodyType: MODAL_BODY_TYPES.CONFIRMATION,
        extraObject: {
          message: `Are you sure you want to delete this form?`,
          type: CONFIRMATION_MODAL_CLOSE_TYPES.COMMISSIONFORM_DELETE,
          index: id,
          // index,
        },
      })
    );
  };
  const handleFilterChange = (e) => {
    setFilterValue(e.target.value);
  };

  const filteredLeads = teamMember?.filter((lead) => {
    return (
      lead?.name?.toLowerCase().includes(filterValue.toLowerCase()) ||
      lead?.customerContact?.toString().includes(filterValue) ||
      lead?.hrContact?.toString().includes(filterValue) ||
      lead?.hrName?.toLowerCase().includes(filterValue.toLowerCase()) ||
      lead?.customerName?.toLowerCase().includes(filterValue.toLowerCase()) ||
      lead?.status?.toLowerCase().includes(filterValue.toLowerCase())
    );
  });

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
    link.download = "account_opened_by_HR.xlsx";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportXLSX = async () => {
    const baseURL = `${API}/commissionForm`;
    try {
      const response = await axios.get(baseURL);
      downloadXLSX(response.data);
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
          Export Opened Account
        </button>
      </div>
    );
  };

  const handleStatusChange = async (memberId, newStatus) => {
    try {
      const storedToken = localStorage.getItem("accessToken");
      const employeeData = {
        status: newStatus,
      };
      if (storedToken) {
        const accessToken = JSON.parse(storedToken).token;

        if (accessToken) {
          const headers = {
            Authorization: `Bearer ${accessToken}`,
          };

          await axios.patch(`${API}/commissionForm/${memberId}`, employeeData, {
            headers,
          });

          dispatch(sliceMemberStatus(newStatus));
          dispatch(
            showNotification({
              message: `Status updated Successfully!`,
              status: 1,
            })
          );
        }
      } else {
        dispatch(
          showNotification({
            message: `Access Token not found`,
            status: 0,
          })
        );
      }
    } catch (error) {
      if (error.response.status === 409) {
        localStorage.clear();
        window.location.href = "/login";
      } else {
        dispatch(
          showNotification({ message: `Error in updating Status`, status: 0 })
        );
      }
    }
  };

  return (
    <>
      <div className="mb-4 flex items-center">
        <input
          type="text"
          placeholder="Filter by Name or Phone"
          value={filterValue}
          onChange={handleFilterChange}
          className="input input-sm input-bordered  w-full max-w-xs"
        />
      </div>
      {filteredLeads?.length === 0 ? (
        <p>No Data Found</p>
      ) : (
        <TitleCard
          title={`Total Opened Account ${teamMember?.length}`}
          topMargin="mt-2"
          TopSideButtons={<TopSideButtons onExportXLSX={handleExportXLSX} />}
        >
          <div className="overflow-x-auto w-full">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Account</th>
                  <th>HR Name</th>
                  <th>HR Contact</th>
                  <th>Customer Name</th>
                  <th>Customer Contact</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredLeads?.map((l, k) => {
                  return (
                    <tr key={k}>
                      <td>
                        {l.createdAt
                          ? format(new Date(l?.createdAt), "dd/MM/yyyy")
                          : "N/A"}
                      </td>
                      <td>{l.name}</td>
                      <td>{l.hrName}</td>
                      <td>{l.hrContact}</td>
                      <td>{l.customerName}</td>
                      <td>{l.customerContact}</td>
                      <td>
                        {" "}
                        <select
                          value={l.status}
                          onChange={(e) =>
                            handleStatusChange(l._id, e.target.value)
                          }
                        >
                          <option value="PENDING">Pending</option>
                          <option value="APPROVED">Approved</option>
                        </select>
                      </td>
                      <td>
                        <div className="flex item-center justify-between">
                          <button
                            className="btn btn-square btn-ghost"
                            onClick={() => deleteCurrentLead(l._id)}
                          >
                            <TrashIcon className="w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </TitleCard>
      )}
    </>
  );
}

export default OpenedAccount;
