import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { API } from "../utils/constants";
import axios from "axios";
import InputText from "../components/Input/InputText";
import ErrorText from "../components/Typography/ErrorText";
import { useDispatch } from "react-redux";
import { showNotification } from "../features/common/headerSlice";

const ClientPage = () => {
  const [accountImg, setAccountImg] = useState("");
  const { userId, commissionId } = useParams();
  const dispatch = useDispatch();
  // const [name, setName] = useState("");

  // console.log("user is ", user);
  const INITIAL_COMMISSION_OBJ = {
    name: "",
    customerContact: "",
    hrName: "",
    hrId: "",
    hrContact: "",
    commissionAmount: "",
    category: "",
  };
  const [formData, setFormData] = useState(INITIAL_COMMISSION_OBJ);
  const [errorMessage, setErrorMessage] = useState("");
  const [commissionData, setCommissionData] = useState("");
  const [userData, setUserData] = useState("");
  const [isChecked, setIsChecked] = useState(false);
  const handleCheckboxChange = () => {
    setIsChecked(!isChecked); // Toggle the isChecked state
    setErrorMessage(""); // Clear any existing error message when checkbox state changes
  };

  useEffect(() => {
    const fetchCommissionData = async () => {
      try {
        const response = await axios.get(`${API}/commissions/${commissionId}`);
        setCommissionData(response.data);
        console.log("commission data in response ", response.data);
        setAccountImg(response.data.imageLink);
      } catch (error) {
        if (error.response.status === 409) {
          localStorage.clear();
          window.location.href = "/login";
        }
        console.error("Error fetching user data:", error);
      }
    };
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${API}/employee/?id=${userId}`);
        setUserData(response.data.data[0]);
      } catch (error) {
        if (error.response.status === 409) {
          localStorage.clear();
          window.location.href = "/login";
        }
        console.error("Error fetching user data:", error);
      }
    };
    fetchUserData();
    fetchCommissionData();
  }, [commissionId, userId]);

  // const handleInputChange = (e) => {
  //   const { name, value } = e.target;
  //   setFormData((prevData) => ({
  //     ...prevData,
  //     [name]: value,
  //   }));
  // };

  const updateFormValue = ({ updateType, value }) => {
    setErrorMessage("");
    setFormData({ ...formData, [updateType]: value });
  };

  const redirectLink = commissionData.link;

  const submitForm = async (e) => {
    console.log("form data is", formData);
    e.preventDefault();
    setErrorMessage("");
    if (formData?.customerName?.trim() === "")
      return setErrorMessage("Name is required!");
    if (!formData?.customerContact?.trim() === "") {
      return setErrorMessage("Phone Number is required!");
    } else if (formData?.customerContact?.trim()?.length !== 10) {
      return setErrorMessage("Phone Number must be 10 digits!");
    }
    if (!isChecked) {
      return setErrorMessage("Please agree to the terms.");
    }

    try {
      console.log("value of customer name is", formData.customerName);
      console.log(
        "commisiion of customer name is",
        commissionData.commissionAmount
      );

      const updatedFormData = {
        name: commissionData.name,
        customerName: formData.customerName,
        customerContact: formData.customerContact,
        hrContact: userData.contact,
        hrName: userData.name,
        hrId: userData._id,
        commissionAmount: commissionData.commission,
        category: commissionData.category,
      };

      const response = await axios.post(
        `${API}/commissionForm`,
        updatedFormData
      );
      if (response.status === 201) {
        dispatch(
          showNotification({
            message: "Form Created Successfully!",
            status: 1,
          })
        );
        
        setFormData(INITIAL_COMMISSION_OBJ);
        window.location.href =redirectLink ;
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
    <div className=" container mx-auto flex justify-center items-center  h-[100vh]">
      <div className="flex justify-center px-6 w-[100%]">
        <div className="w-full xl:w-3/4 lg:w-11/12 flex ">
          <div
            className="w-full h-auto  hidden lg:block lg:w-1/2 bg-cover rounded-l-lg"
            style={{
              backgroundImage: `url(${accountImg})`,
            }}
          ></div>
          <div className="w-full lg:w-1/2  lg:p-5 rounded-lg lg:rounded-l-none">
            <h3 className="text-2xl text-center">
              Fill Below Details to Continue
            </h3>
            <form onSubmit={(e) => submitForm(e)} className="px-6 pt-6 rounded">
              <div className="mb-4">
                <InputText
                  type="text"
                  updateType="customerName"
                  containerStyle="mt-4"
                  labelTitle="Enter Name as per Aadhar Card"
                  updateFormValue={updateFormValue}
                />

                <InputText
                  type="number"
                  updateType="customerContact"
                  containerStyle="mt-4"
                  labelTitle="Enter Mobile number"
                  updateFormValue={updateFormValue}
                  // placeholder="Phone Number must be 10 digits"
                />
                <InputText
                  type="email"
                  updateType="email id"
                  containerStyle="mt-4"
                  labelTitle="Enter Email id"
                  updateFormValue={updateFormValue}
                />
                <InputText
                  type="text"
                  updateType="state"
                  containerStyle="mt-4"
                  labelTitle="Enter State"
                  // updateFormValue={updateFormValue}
                />
              </div>
              <div className="mb-4">
                <input
                  className="mr-2 leading-tight"
                  type="checkbox"
                  id="checkbox_id"
                  checked={isChecked}
                  onChange={() => handleCheckboxChange()}
                />
                <label className="text-sm" htmlFor="checkbox_id">
                  Before Submitting my Information. I have read and agree to the
                  terms of use & Privacy Policy.
                </label>
              </div>
              <ErrorText styleClass="mb-4">{errorMessage}</ErrorText>
              {/* {errorMessage && <div className="error-message">{errorMessage}</div>} */}
              <div className="mb-4 text-center">
                <button type="submit" className={"btn mt-2 w-full btn-primary"}>
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientPage;
