import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import TitleCard from "../../../components/Cards/TitleCard";
import { API } from "../../../utils/constants";
import { showNotification } from "../../common/headerSlice";
import { sliceLeadDeleted } from "../../leads/leadSlice";
import { useParams } from "react-router-dom";
import ErrorText from "../../../components/Typography/ErrorText";

const SubmitAccount = () => {
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

  const { id } = useParams();

  // console.log("user is ", user);
  const INITIAL_COMMISSION_OBJ = {
    name: "",
    customerName: "",
    customerContact: "",
    hrName: user?.name,
    hrId: user?._id,
    hrContact: user?.contact,
  };
  const [formData, setFormData] = useState(INITIAL_COMMISSION_OBJ);
  const [errorMessage, setErrorMessage] = useState("");
  const [commission, setCommission] = useState("");
  const [name, setName] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchCommissionData = async () => {
      try {
        const response = await axios.get(`${API}/commissions/${id}`);
        setCommission(response.data.commission);
        setName(response.data.name);
      } catch (error) {
        if (error.response.status === 409) {
          localStorage.clear();
          window.location.href = "/login";
        }
        console.error("Error fetching user data:", error);
      }
    };
    fetchCommissionData();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    setFormData({
      ...formData,
      name: name,
    });
  };

  const handleUpdate = async () => {
    setErrorMessage("");
    if (formData.customerName.trim() === "")
      return setErrorMessage("Customer Name is required!");
    if (formData.customerContact.trim() === "")
      return setErrorMessage("Customer Contact is required!");

    try {
      const tokenResponse = localStorage.getItem("accessToken");
      const tokenData = JSON.parse(tokenResponse);
      const token = tokenData.token;
      // Set the Authorization header with the token
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.post(
        `${API}/commissionForm`,
        formData,
        config
      );
      if (response.status === 201) {
        dispatch(sliceLeadDeleted(true));
        dispatch(
          showNotification({
            message: "Form Created Successfully!",
            status: 1,
          })
        );
        setFormData({
          ...formData, // Spread the current state to ensure you don't lose other values
          name: name,
          customerName: "",
          customerContact: "",
        });
      } else {
        dispatch(
          showNotification({
            message: "Error in creating form!",
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
          showNotification({
            message: `${error.response.data.message}`,

            status: 0,
          })
        );
      }
      console.log("error", error);
    }
  };

  return (
    <>
      <TitleCard title="Account Form" topMargin="mt-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="label">Customer Name</label>
            <input
              type="text"
              name="customerName"
              className="input input-bordered w-full"
              value={formData?.customerName}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label className="label">Customer Contact</label>
            <input
              type="number"
              name="customerContact"
              className="input input-bordered w-full"
              value={formData?.customerContact}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label className="label">Account</label>
            <input
              type="text"
              name="name"
              className="input input-bordered w-full"
              value={formData?.name || name}
              onChange={handleInputChange}
              disabled
            />
          </div>
          <div className="relative">
            <label className="label">Commission</label>
            <input
              type="number"
              className="input input-bordered w-full"
              value={commission}
              disabled
            />
          </div>

          <div className="relative">
            <label className="label">HR Name</label>
            <input
              type="text"
              name="hrName"
              className="input input-bordered w-full"
              value={user?.name}
              disabled
            />
          </div>

          <div className="relative">
            <label className="label">HR Contact</label>
            <input
              type="number"
              className="input input-bordered w-full"
              value={user?.contact}
              disabled
            />
          </div>
        </div>
        <ErrorText styleClass="mt-8">{errorMessage}</ErrorText>

        <div className="mt-16">
          <button
            className="btn btn-primary float-right"
            onClick={handleUpdate}
          >
            Submit
          </button>
        </div>
      </TitleCard>
    </>
  );
};

export default SubmitAccount;
