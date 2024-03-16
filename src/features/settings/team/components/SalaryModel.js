import { useDispatch } from "react-redux";
import axios from "axios";
import { API } from "../../../../utils/constants";
import { sliceMemberDeleted } from "../../../leads/leadSlice";
import { showNotification } from "../../../common/headerSlice";
import { useState } from "react";
import InputText from "../../../../components/Input/InputText";
import { MODAL_BODY_TYPES } from "../../../../utils/globalConstantUtil";
function SalaryModel({ extraObject, closeModal }) {
  const dispatch = useDispatch();
  const {
    message,
    type,
    userId,
    amount,
    bankName,
    branchName,
    accountHolderName,
    accountNumber,
    ifscCode,
    upiId,
    hrName,
    hrContact
  } = extraObject;

  const INITIAL_PAYMENT_OBJ = {
    userId: userId,
    amount: amount,
    bankName: bankName,
    branchName: branchName,
    accountHolderName: accountHolderName,
    accountNumber: accountNumber,
    ifscCode: ifscCode,
    upiId: upiId,
    hrName : hrName,
    hrContact : hrContact
  };
  const [paymentData, setPaymentData] = useState(INITIAL_PAYMENT_OBJ);

  // console.log("tlid and userId",TLid,userId)

  // console.log("body type",type)
  const proceedWithAssign = async () => {
    if (type === MODAL_BODY_TYPES.SEND_SALARY) {
      try {
        const storedToken = localStorage.getItem("accessToken");

        if (storedToken) {
          const accessToken = JSON.parse(storedToken).token;

          if (accessToken) {
            const headers = {
              Authorization: `Bearer ${accessToken}`,
            };

            const response = await axios.post(
              `${API}/payments`,

              paymentData,

              {
                headers,
              }
            );
            dispatch(sliceMemberDeleted(true));
            dispatch(
              showNotification({
                message: `${response.data.message}`,
                status: 1,
              })
            );
          }
        } else {
          dispatch(
            showNotification({ message: "Access token not found", status: 0 })
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
      }
    }
    closeModal();
  };

  const updateFormValue = ({ updateType, value }) => {
    setPaymentData({ ...paymentData, [updateType]: value });
  };

  return (
    <>
      <div className=" grid grid-cols-1 divide-y divide-slate-600  flex-col  mt-4 items-start justify-center">
        <div className="flex items-center   justify-between">
          <div className="text-xl">Account Balance</div>
          <div className="text-xl">{amount}</div>
        </div>
        <div className="flex items-center  divider-y  justify-between">
          <div className="text-xl">Account Holder Name</div>
          <div className="text-xl">{accountHolderName}</div>
        </div>

        <div className="flex items-center    justify-between">
          <div className="text-xl">Bank Name</div>
          <div className="text-xl">{bankName}</div>
        </div>

        <div className="flex items-center    justify-between">
          <div className="text-xl">Account Number</div>
          <div className="text-xl">{accountNumber}</div>
        </div>

        <div className="flex items-center    justify-between">
          <div className="text-xl">IFSC Code</div>
          <div className="text-xl">{ifscCode}</div>
        </div>

        <div className="flex divide-x-0 items-center    justify-between">
          <div className="text-xl">Branch Name</div>
          <div className="text-xl">{branchName}</div>
        </div>
        <div className="flex items-center    justify-between">
          <div className="text-xl">UPI Id</div>
          <div className="text-xl">{upiId}</div>
        </div>
      </div>
      <h6 className=" text-xl mt-8 text-center">{message}</h6>

      <div className="mt-2">
        <InputText
          type="number"
          defaultValue={paymentData.amount}
          updateType="amount"
          containerStyle="mt-4 mb-4"
          updateFormValue={updateFormValue}
          minValue={0}
          maxValue={paymentData.amount}
        />
      </div>

      <div className="modal-action mt-12">
        <button className="btn btn-outline" onClick={() => closeModal()}>
          Cancel
        </button>

        <button
          className="btn btn-primary w-36"
          onClick={() => proceedWithAssign()}
        >
          Send
        </button>
      </div>
    </>
  );
}

export default SalaryModel;
