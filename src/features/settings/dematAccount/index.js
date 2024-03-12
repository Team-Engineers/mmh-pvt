import { useState } from "react";
// import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import ErrorText from "../../../components/Typography/ErrorText";
import InputText from "../../../components/Input/InputText";
import { showNotification } from "../../common/headerSlice";
import axios from "axios";
import { API } from "../../../utils/constants";

function DematAccount() {
  const INITIAL_ACCOUNT_OBJ = {
    name: "",
    link: "",
    commission: "",
    imageLink: "",
  };

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [accountObj, setAccountObj] = useState(INITIAL_ACCOUNT_OBJ);
  const dispatch = useDispatch();
  // let userId = "";

  const submitForm = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    if (accountObj.name.trim() === "")
      return setErrorMessage("Name is required!");
    if (accountObj.link.trim() === "")
      return setErrorMessage("Link is required!");
    if (accountObj.commission.trim() === "")
      return setErrorMessage("Commission is required!");
    else {
      setLoading(true);
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
      setLoading(false);
    }
  };

  const updateFormValue = ({ updateType, value }) => {
    setErrorMessage("");
    setAccountObj({ ...accountObj, [updateType]: value });
  };

  return (
    <div className="min-h-screen  bg-base-200 flex items-center">
      <div className="card mx-auto max-w-xl w-full  shadow-xl">
        <div className="grid grid-cols-1  bg-base-100 rounded-xl">
          <div className="py-24 px-10">
            <h2 className="text-2xl font-semibold mb-2 text-center">
              Add Account
            </h2>
            <form onSubmit={(e) => submitForm(e)}>
              <div className="mb-4">
                <InputText
                  defaultValue={accountObj.name}
                  updateType="name"
                  containerStyle="mt-4"
                  labelTitle="Name"
                  updateFormValue={updateFormValue}
                />

                <InputText
                  defaultValue={accountObj.link}
                  updateType="link"
                  containerStyle="mt-4"
                  labelTitle="Link"
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

                <InputText
                  defaultValue={accountObj.imageLink}
                  type="imageLink"
                  updateType="imageLink"
                  containerStyle="mt-4"
                  labelTitle="Image Link"
                  updateFormValue={updateFormValue}
                />
              </div>

              <ErrorText styleClass="mt-8">{errorMessage}</ErrorText>
              <button
                type="submit"
                className={
                  "btn mt-2 w-full btn-primary" + (loading ? " loading" : "")
                }
              >
                Submit
              </button>

              {/* <div className='text-center mt-4'>Already have an account? <Link to="/login"><span className="  inline-block  hover:text-primary hover:underline hover:cursor-pointer transition duration-200">Login</span></Link></div> */}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DematAccount;
