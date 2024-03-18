import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import axios from "axios";
import { format } from "date-fns";
import { API } from "../../../utils/constants";
import { sliceLeadDeleted } from "../../leads/leadSlice";
import TitleCard from "../../../components/Cards/TitleCard";
import { useParams } from "react-router-dom";

function AllLinks() {
  const dispatch = useDispatch();
  const [leadData, setLeadData] = useState([]);
  const [filterValue, setFilterValue] = useState("");
  const leadDeleted = useSelector((state) => state.lead.leadDeleted);
  const todayDate = new Date();
  const todayDateString = todayDate.toISOString().split("T")[0];
  const { category } = useParams();
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
      let categoryURL = `${API}/commissions/category/${category}`;
      let baseURL = categoryURL;
      baseURL = baseURL + `?hrId=${user._id}`;
      try {
        const response = await axios.get(baseURL, config);
        if (response.status === 200) {
          const filteredActiveLeads = response.data.filter(
            (lead) => lead.linkStatus === "ACTIVE"
          );
          console.log(response.data, "response.data")
          // Assuming setLeadData is a function to set the leads
          setLeadData(filteredActiveLeads);
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
  }, [leadDeleted, todayDateString, user._id, category, dispatch]);

  const handleFilterChange = (e) => {
    setFilterValue(e.target.value);
  };

  const filteredLeads = leadData?.filter((lead) => {
    return (
      lead?.name?.toLowerCase().includes(filterValue?.toLowerCase()) ||
      lead?.commission?.toString().includes(filterValue)
    );
  });

  const handleShareLink = async (linkId) => {
    console.log("linkId", linkId);
    navigator.clipboard
      .writeText(`https://makemoneyfromhome.app/leads/${user._id}/${linkId}`)
      .then(() => {
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
          text: `https://makemoneyfromhome.app/leads/${user._id}/${linkId}`,
          url: `https://makemoneyfromhome.app/leads/${user._id}/${linkId}`,
          // url: `http://localhost:3000/leads/${user._id}/${linkId}`,
        });
      } else {
        console.log("Web Share API not supported");
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

      <TitleCard
        title={`${category.toUpperCase().split("_").join(" ")} ${
          leadData?.length
        }`}
        topMargin="mt-2"
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
                              handleShareLink(l._id);
                            }}
                          >
                            Share
                          </button>
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
