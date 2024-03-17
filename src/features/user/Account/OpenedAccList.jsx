import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import TitleCard from "../../../components/Cards/TitleCard";
import axios from "axios";
import { API } from "../../../utils/constants";
import { sliceMemberDeleted, sliceMemberStatus } from "../../leads/leadSlice";
import { format } from "date-fns";
import { useParams } from "react-router-dom";

function OpenedAccList() {
  const { status } = useParams();
  let user;
  const userString = localStorage.getItem("user");
  if (userString !== null && userString !== undefined) {
    try {
      user = JSON.parse(userString);
      delete user?.password;
    } catch (error) {
      console.error("Error parsing JSON:", error);
      localStorage.clear();
    }
  } else {
    localStorage.clear();
  }
  const dispatch = useDispatch();
  const [teamMember, setTeamMember] = useState([]);
  const [filterValue, setFilterValue] = useState("");

  const memberDeleted = useSelector((state) => state.lead.memberDeleted);
  const memberStatus = useSelector((state) => state.lead.memberStatus);

  useEffect(() => {
    const fetchData = async () => {
      const tokenResponse = localStorage.getItem("accessToken");
      const tokenData = JSON.parse(tokenResponse);
      const token = tokenData.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const params = {
        hrId: user._id,
      };
      const baseURL = `${API}/commissionForm/status/${status}`;
      try {
        const response = await axios.get(baseURL, { params: params },  config);

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
  }, [memberDeleted, memberStatus,user._id, dispatch, status]);

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
          title={`Total ${status} Account ${teamMember?.length}`}
          topMargin="mt-2"
        >
          <div className="overflow-x-auto w-full">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Account</th>
                  <th>Customer Name</th>
                  <th>Customer Contact</th>
                  <th>Commission</th>

                  <th>Status</th>
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
                      <td>{l.customerName}</td>
                      <td>{l.customerContact}</td>
                      <td>{l.commissionAmount}</td>
                      <td>
                        <button
                          className={`btn px-6 btn-sm normal-case ${
                            l.status === "PENDING" ? "btn-grey" : "btn-success"
                          }`}
                        >
                          {l.status}
                        </button>{" "}
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

export default OpenedAccList;
