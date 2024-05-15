import React, { useState } from "react";
import "./css/home.scss";
import "./css/modal.css";
import cross from "./css/cross.png";
import crash from "./css/crash.jpg";
import check from "./css/check.png";
import Input from "../login/Input";
import Button from "../login/Button";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { devApiLink } from "./config";

import "react-toastify/dist/ReactToastify.css";

const Signup = () => {
  const [modalFlag, setModalFlag] = useState(false);
  const [username, setUsername] = useState("");
  const [useremail, setUseremail] = useState("");
  const [userPhone, setUserPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirm_password, setConfirm_password] = useState("");

  let flag = 0;
  // handle signup
  const handleSignUp = () => {
    if (username == "") {
      flag = 1;
      toast.error("Name field is required");
    }
    if (useremail == "") {
      toast.error("User field is required");
      flag = 1;
    }
    if (userPhone == "") {
      toast.error("Phonenumber field is required");
      flag = 1;
    }
    if (password == "") {
      toast.error("password field is required");
      flag = 1;
    }

    if (password !== confirm_password) {
      toast.error("Password is not match. Please confirm password.");
      flag = 1;
    }
    if (flag == 0) {
      axios
        .post(devApiLink + "/user/register", {
          email: useremail,
          password: password,
          phone: userPhone,
          name: username,
        })
        .then((res) => {
          console.log(res.data);
          window.location = "/signin";
        });
      setModalFlag(!modalFlag);
    }
  };

  return (
    <div className="backimage">
      <div className="content">
        <div className="left">
          <div className="rocket">
            <img src={crash} />
          </div>
        </div>
        <div className="right">
          <div
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              gap: "80px",
            }}
          >
            <a href="/">home</a>

            <a href="/signin">signin</a>
          </div>
          <hr
            style={{
              width: "100%",
              height: "1px",
              opacity: "0.5",
              backgroundColor: "yellow",
            }}
          />
          <ToastContainer />

          <Input
            className="input default-input"
            type="text"
            placeholder="UserName"
            value={username}
            handleUpdate={setUsername}
          />
          <Input
            className="input default-input"
            type="text"
            placeholder="Email"
            value={useremail}
            handleUpdate={setUseremail}
          />
          <Input
            className="input default-input"
            type="text"
            placeholder="PhoneNumber"
            value={userPhone}
            handleUpdate={setUserPhone}
          />
          <Input
            className="input default-input"
            type="password"
            placeholder="Password"
            value={password}
            handleUpdate={setPassword}
          />
          <Input
            className="input default-input"
            type="password"
            placeholder="Confirm Password"
            value={confirm_password}
            handleUpdate={setConfirm_password}
          />

          <Button
            className="btn default-btn"
            type="button"
            text="Sign Up"
            // link="/accounts"
            style={{ width: "100%" }}
            action={handleSignUp}
          />
        </div>
      </div>
      <div className="tablewrap">
        <div className="tablecontent">
          <table>
            <thead>
              <tr className="table-header-padding">
                <th style={{ color: "#0E4162" }}></th>
                <th style={{ color: "#2F5C87" }}>
                  Credit Monitoring Service(6 Months)
                </th>
                <th style={{ color: "#52778C" }}>
                  Credit Monitoring Service(12 Months)
                </th>
                <th style={{ color: "#4CA3C4" }}>
                  Credit Report, Score and Alerts Service(Monthly Subscription)
                </th>
                <th style={{ color: "#EF8E48" }}>One-off Credit Report</th>
                <th style={{ color: "#E4B12D" }}>Basic Credit Alert Service</th>
              </tr>
              <tr className="table-opacity">
                <td style={{ backgroundColor: "#0E4162", color: "white" }}>
                  Service Charge#
                </td>
                <td style={{ backgroundColor: "#2F5C87", color: "white" }}>
                  $688/6 Months
                </td>
                <td style={{ backgroundColor: "#52778C", color: "white" }}>
                  $888/12 Months
                </td>
                <td style={{ backgroundColor: "#4CA3C4", color: "white" }}>
                  $280/1 Month
                </td>
                <td style={{ backgroundColor: "#EF8E48", color: "white" }}>
                  $280/one-off
                </td>
                <td style={{ backgroundColor: "#E4B12D", color: "white" }}>
                  FREE
                </td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>How to Subscribe</td>
                <td>Mobile App only</td>
                <td>Mobile App only</td>
                <td>Web Portable Only</td>
                <td>In Person at TransUnion Office Only</td>
                <td>Mobile App or Web Portal</td>
              </tr>

              <tr>
                <td>Credit Report</td>
                <td>
                  <img src={check} />
                </td>
                <td>
                  <img src={check} />
                </td>
                <td>
                  <img src={check} />
                </td>
                <td>
                  <img src={check} />
                </td>
                <td>
                  <img src={cross} />
                </td>
              </tr>

              <tr>
                <td>Score Simulator</td>
                <td>
                  <img src={check} />
                </td>
                <td>
                  <img src={check} />
                </td>
                <td>
                  <img src={check} />
                </td>
                <td>
                  <img src={cross} />
                </td>
                <td>
                  <img src={cross} />
                </td>
              </tr>

              <tr>
                <td>Debt Analysis</td>
                <td>
                  <img src={check} />
                </td>
                <td>
                  <img src={cross} />
                </td>
                <td>
                  <img src={check} />
                </td>
                <td>
                  <img src={cross} />
                </td>
                <td>
                  <img src={cross} />
                </td>
              </tr>

              <tr>
                <td>Credit Alert</td>
                <td>
                  <img src={check} />
                </td>
                <td>
                  <img src={check} />
                </td>
                <td>
                  <img src={cross} />
                </td>
                <td>
                  <img src={cross} />
                </td>
                <td>
                  <img src={cross} />
                </td>
              </tr>
              <tr>
                <td>Credit Alert</td>
                <td>
                  <img src={cross} />
                </td>
                <td>
                  <img src={check} />
                </td>
                <td>
                  <img src={cross} />
                </td>
                <td>
                  <img src={cross} />
                </td>
                <td>
                  <img src={cross} />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Signup;
