import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function PaymentSuccess() {
  let navigate = useNavigate();
  const queryParams = new URLSearchParams(window.location.search);
  const sessionId = queryParams.get("session_id");

  const afterPayment = async () => {
    let res = await axios.get(
      `${process.env.REACT_APP_SERVER_URL}/occupant/successfullpayment/${sessionId}`
    );
    if (res.data.message) {
      navigate("../../occupant/bills");
    }
  };

  useEffect(() => {
    afterPayment();
  }, []);
  return <div>Payment success... please wait .....</div>;
}

export default PaymentSuccess;
