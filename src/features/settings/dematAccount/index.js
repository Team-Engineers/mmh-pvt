import { useState } from "react";
// import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import InputText from "../../../components/Input/InputText";
import { showNotification } from "../../common/headerSlice";
import axios from "axios";
import { API } from "../../../utils/constants";
import TitleCard from "../../../components/Cards/TitleCard";

function DematAccount() {
  const INITIAL_ACCOUNT_OBJ = {
    name: "",
    link: "",
    commission: "",
    imageLink: "",
    category: "default",
    linkStatus: "ACTIVE",
  };

  const [accountObj, setAccountObj] = useState(INITIAL_ACCOUNT_OBJ);
  const dispatch = useDispatch();
  // let userId = "";

  const submitForm = async (e) => {
    e.preventDefault();
    if (accountObj.name.trim() === "") {
      dispatch(
        showNotification({
          message: "Account Name is required!",
          status: 0,
        })
      );
      return;
    }
    if (accountObj.link.trim() === "") {
      dispatch(
        showNotification({
          message: "Link is required!",
          status: 0,
        })
      );
      return;
    }
    if (accountObj.commission.toString().trim() === "") {
      dispatch(
        showNotification({
          message: "Commission is required!",
          status: 0,
        })
      );
      return;
    }
    if (accountObj.category === "default") {
      dispatch(
        showNotification({
          message: "Category is required.",
          status: 0,
        })
      );
      return;
    } else {
      accountObj.name = accountObj.name.replace(/\s/g, "");
      accountObj.link = accountObj.link.replace(/\s/g, "");
      accountObj.commission = accountObj.commission.replace(/\s/g, "");
      accountObj.imageLink = accountObj.imageLink.replace(/\s/g, "");

      try {
        const tokenResponse = localStorage.getItem("accessToken");
        const tokenData = JSON.parse(tokenResponse);
        const token = tokenData.token;
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const response = await axios.post(
          `${API}/commissions`,
          accountObj,
          config
        );

        if (response.status === 201) {
          setAccountObj(INITIAL_ACCOUNT_OBJ);

          dispatch(
            showNotification({
              message: "Account Created Successfully!",
              status: 1,
            })
          );
        }
      } catch (error) {
        dispatch(
          showNotification({
            message: `${error.response.data.message}`,
            status: 0,
          })
        );
      }
    }
  };

  const updateFormValue = ({ updateType, value }) => {
    setAccountObj({ ...accountObj, [updateType]: value });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAccountObj({ ...accountObj, [name]: value });
  };

  return (
    <>
      <TitleCard title="Fill Account Details" topMargin="mt-2">
        <form onSubmit={(e) => submitForm(e)}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputText
              defaultValue={accountObj.name}
              updateType="name"
              containerStyle="mt-4"
              labelTitle="Account Name"
              updateFormValue={updateFormValue}
            />

            <InputText
              defaultValue={accountObj.link}
              updateType="link"
              containerStyle="mt-4"
              labelTitle="Account Link"
              updateFormValue={updateFormValue}
            />
            <InputText
              defaultValue={accountObj.commission}
              type="commission"
              updateType="commission"
              containerStyle="mt-4"
              labelTitle="Commission"
              updateFormValue={updateFormValue}
            />

            <div>
              <label className="label mt-4">Category</label>
              <select
                name="category"
                updateType="category"
                className="input input-bordered w-full pe-2"
                onChange={handleInputChange}
                value={accountObj.category}
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
              <label className="label mt-3">Status</label>
              <select
                name="linkStatus"
                updateType="linkStatus"
                className="input input-bordered w-full pe-2"
                onChange={handleInputChange}
                value={accountObj.linkStatus}
              >
                <option value="ACTIVE">Active</option>
                <option value="HOLD">Hold</option>
              </select>
            </div>
            <InputText
              defaultValue={accountObj.imageLink}
              type="imageLink"
              updateType="imageLink"
              containerStyle="mt-4"
              labelTitle="Image Link"
              updateFormValue={updateFormValue}
            />
          </div>
          <div className="mt-4">
            <button className="btn btn-primary float-right" type="submit">
              Submit
            </button>
          </div>
        </form>
      </TitleCard>
    </>
  );
}

export default DematAccount;
