import React from "react";
import { Link } from "react-router-dom";

function PaymentFailure() {
  return (
    <div>
      <p className="text-danger">Payment Failed...</p>
      <p>
        If amount is debited ... please contact admin for refund with 24 hours
      </p>
      <Link to="../../occupant/bills">click here to try again</Link>
      <p></p>
    </div>
  );
}

export default PaymentFailure;
