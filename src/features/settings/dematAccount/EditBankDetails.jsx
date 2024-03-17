import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import TitleCard from "../../../components/Cards/TitleCard";
import { API } from "../../../utils/constants";
import { showNotification } from "../../common/headerSlice";
import { sliceLeadDeleted } from "../../leads/leadSlice";
import { useParams } from "react-router-dom";

const EditBankDetails = () => {
  const { commissionId } = useParams();
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
  const [commissionData, setCommissionData] = useState("");
  const dispatch = useDispatch();
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
      let categoryURL = `${API}/commissions/${commissionId}`;

      const baseURL = categoryURL;
      try {
        const response = await axios.get(baseURL, config);
        if (response.status === 200) {
          setCommissionData(response.data);
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
  }, [dispatch, commissionId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setCommissionData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();

    try {
      if (commissionData.name.trim() === "") {
        dispatch(
          showNotification({
            message: "Name is required!",
            status: 0,
          })
        );
        return;
      }
      if (commissionData.link.trim() === "") {
        dispatch(
          showNotification({
            message: "Link is required!",
            status: 0,
          })
        );
        return;
      }

      if (commissionData.commission.toString().trim() === "") {
        dispatch(
          showNotification({
            message: "Commission is required!",
            status: 0,
          })
        );
        return;
      }
      if (commissionData.category === "default") {
        dispatch(
          showNotification({
            message: "Category is required.",
            status: 0,
          })
        );
        return;
      }
      const tokenResponse = localStorage.getItem("accessToken");
      const tokenData = JSON.parse(tokenResponse);
      const token = tokenData.token;

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      await axios.put(
        `${API}/commissions/${commissionId}`,
        commissionData,
        config
      );
      dispatch(sliceLeadDeleted(true));

      dispatch(
        showNotification({
          message: "Account updated successfully!",
          status: 1,
        })
      );
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

  return (
    <>
      <TitleCard title="Edit Account Details" topMargin="mt-2">
        <form onSubmit={(e) => handleSaveEdit(e)}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="label">Name</label>
              <input
                type="text"
                name="name"
                className="input input-bordered w-full"
                value={commissionData?.name}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label className="label">Commission</label>
              <input
                type="number"
                name="commission"
                className="input input-bordered w-full"
                value={commissionData?.commission}
                onChange={handleInputChange}
              />
            </div>

            <div className="relative">
              <label className="label">Account link</label>
              <input
                type="text"
                name="link"
                className="input input-bordered w-full"
                value={commissionData.link}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label className="label">Category</label>
              <select
                name="category"
                type="category"
                className="input input-bordered w-full"
                onChange={handleInputChange}
                value={commissionData.category}
              >
                <option value="default" selected disabled>
                  Select Category
                </option>
                <option value="SAVINGS_ACCOUNT">Saving Account</option>
                <option value="SPECIAL_PRODUCTS">Special Product</option>
                <option value="DEMAT_ACCOUNT">Demat Account</option>
              </select>
            </div>
            <div>
              <label className="label">Image Link</label>
              <input
                type="text"
                name="imageLink"
                className="input input-bordered w-full"
                value={commissionData?.imageLink}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label className="label">Status</label>
              <select
                name="linkStatus"
                type="linkStatus"
                className="input input-bordered w-full pe-2"
                onChange={handleInputChange}
                value={commissionData?.linkStatus}
              >
                <option value="ACTIVE">Active</option>
                <option value="HOLD">Hold</option>
              </select>
            </div>
          </div>
          <div className="mt-16">
            <button className="btn btn-primary float-right" type="submit">
              Update
            </button>
          </div>
        </form>
      </TitleCard>
    </>
  );
};

export default EditBankDetails;
