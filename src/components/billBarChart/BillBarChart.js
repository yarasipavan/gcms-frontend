import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../slices/login.slice";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LinearScale,
  CategoryScale,
  BarElement,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
} from "chart.js";

ChartJS.register(
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);
function BillBarChart() {
  // const labels = [];
  // const dataValues = [];

  let navigate = useNavigate();
  let dispatch = useDispatch();
  let token = localStorage.getItem("token");

  // states
  let [billData, setBillData] = useState({});
  let [billDataFetch, setFillDataFetch] = useState(0);
  let [billDataError, setBillDataError] = useState("");
  let [labels, setLabels] = useState([]);
  let [dataValues, setDataValues] = useState([]);

  const getBillData = () => {
    try {
      axios
        .get(`${process.env.REACT_APP_SERVER_URL}/admin/billData`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          setBillData(res.data);
          setBillDataError("");
        });
    } catch (err) {
      console.log(err);
      if (err.response?.status === 401) {
        //logout completely and navigate to login
        dispatch(logout());
        navigate("/");
      } else {
        if (err.response?.data?.alertMsg)
          setBillDataError(err.response.data.alertMsg);
        //set error message
        else setBillDataError(err.message);
      }
    } finally {
      setFillDataFetch(1);
    }
  };

  const setData = (data) => {
    console.log(data);

    if (Array.isArray(data)) {
      let labelArray = [];
      let dataValuesArray = [];
      data.map((billDetails) => {
        let month = new Date(
          billDetails.year,
          billDetails.month - 1
        ).toLocaleString("en-US", {
          month: "short",
        });
        console.log(labels);

        labelArray.push(month + "-" + billDetails.year);

        dataValuesArray.push(billDetails.totalSum);
      });
      setLabels(labelArray);
      setDataValues(dataValuesArray);
    }
  };

  useEffect(() => {
    getBillData();
  }, []);
  useEffect(() => {
    setData(billData);
  }, [billData]);
  const options = {};
  const data = {
    labels: labels,
    datasets: [
      {
        label: "Total Bill",
        data: dataValues,
        backgroundColor: "black",
        borderColor: "black",
      },
    ],
  };
  return (
    <div className="row">
      <h5 className="text-center">
        Total bill graph generated in last 12 months
      </h5>
      <div className="w-50">
        <Bar data={data} options={options}></Bar>
      </div>
      <div className="w-50">
        <Line data={data} options={options}></Line>
      </div>
    </div>
  );
}

export default BillBarChart;
