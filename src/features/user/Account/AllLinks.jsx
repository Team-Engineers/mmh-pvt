import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import axios from "axios";
import { format } from "date-fns";
import { API } from "../../../utils/constants";
import { sliceLeadDeleted } from "../../leads/leadSlice";
import TitleCard from "../../../components/Cards/TitleCard";
import { Link } from "react-router-dom";

function AllLinks() {
  const dispatch = useDispatch();
  const [leadData, setLeadData] = useState([]);
  const [filterValue, setFilterValue] = useState("");
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
          // console.log("response data of commision", response.data);
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

  const handleFilterChange = (e) => {
    setFilterValue(e.target.value);
  };

  const filteredLeads = leadData?.filter((lead) => {
    return (
      lead?.name?.toLowerCase().includes(filterValue?.toLowerCase()) ||
      lead?.commission?.toString().includes(filterValue)
    );
  });

  const handleShareLink = async (link) => {
    navigator.clipboard
      .writeText(link)
      .then(() => {
        // Do something after successfully copying the text
        console.log("Link copied successfully");
      })
      .catch((error) => {
        // Handle any errors that may occur during the copy process
        console.error("Error copying link:", error);
      });
    try {
      if (navigator.share) {
        await navigator.share({
          title: document.title,
          text: link,
          url: window.location.href,
        });
        console.log("Link shared successfully");
      } else {
        console.log("Web Share API not supported");
        // Fallback for unsupported browsers
        // You can provide your custom implementation for sharing here
      }
    } catch (error) {
      console.error("Error sharing link:", error);
    }
  };
  return (
    <>
      <div className="mb-4 flex items-center">
        <input
          type="text"
          placeholder="Filter by Name or Commission"
          value={filterValue}
          onChange={handleFilterChange}
          className="input input-sm input-bordered  w-full max-w-xs"
        />
      </div>

      <TitleCard title={`All Accounts ${leadData?.length}`} topMargin="mt-2">
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
                        <td>{l.name}</td>
                        <td>{l.commission}</td>
                        <td>
                          <button
                            className="btn px-6 btn-sm normal-case btn-success"
                            onClick={() => {
                              handleShareLink(l.link);
                            }}
                          >
                            Share
                          </button>
                        </td>
                        {/* <td>{l.assigneeStatus}</td> */}
                        <td>
                          <Link
                            to={`/app/createForm/${l._id}`}
                            className="btn px-6 btn-sm normal-case btn-primary"
                          >
                            Submit Account
                          </Link>
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

export default AllLinks;
