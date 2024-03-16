import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import TitleCard from "../../../components/Cards/TitleCard";
import axios from "axios";
import { API } from "../../../utils/constants";
import { sliceMemberDeleted, sliceMemberStatus } from "../../leads/leadSlice";
import { format } from "date-fns";

function SalaryDistributed() {
  let user;
  const userString = localStorage.getItem("user");
  if (userString !== null && userString !== undefined) {
    try {
      user = JSON.parse(userString);
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
      const baseURL = `${API}/payments`;
      try {
        const response = await axios.get(baseURL, config);
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
  }, [memberDeleted, memberStatus, dispatch, user._id]);

  const handleFilterChange = (e) => {
    setFilterValue(e.target.value);
  };

  const filteredLeads = teamMember?.filter((lead) => {
    return (
      lead?.accountHolderName
        ?.toLowerCase()
        .includes(filterValue.toLowerCase()) ||
      lead?.accountNumber?.toString().includes(filterValue) ||
      lead?.amount?.toString().includes(filterValue) ||
      lead?.bankName?.toLowerCase().includes(filterValue.toLowerCase()) ||
      lead?.branchName?.toLowerCase().includes(filterValue.toLowerCase()) ||
      lead?.ifscCode?.toLowerCase().includes(filterValue.toLowerCase()) ||
      lead?.upiId?.toLowerCase().includes(filterValue.toLowerCase()) ||
      lead?.hrName?.toLowerCase().includes(filterValue.toLowerCase()) ||
      lead?.hrContact?.toString().includes(filterValue)
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
        <TitleCard title={`Received Salary Record`} topMargin="mt-2">
          <div className="overflow-x-auto w-full">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>HR Name</th>
                  <th>HR Contact</th>

                  <th>Bank Name</th>
                  <th>Account Holder Name</th>
                  <th>IFSC code</th>
                  <th>Account Number</th>
                  <th>UPI Id</th>
                  <th>Sent</th>
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
                      <td>{l.hrName}</td>
                      <td>{l.hrContact}</td>
                      <td>{l.bankName}</td>
                      <td>{l.accountHolderName}</td>
                      <td>{l.ifscCode}</td>
                      <td>{l.accountNumber}</td>
                      <td>{l.upiId}</td>
                      <td>
                        <button
                          className={`btn px-6 btn-sm normal-case btn-success`}
                        >
                          {l.amount}
                        </button>
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

export default SalaryDistributed;
