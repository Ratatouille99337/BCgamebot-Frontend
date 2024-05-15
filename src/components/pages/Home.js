import React from "react";
import "./css/home.scss";
import cross from "./css/cross.png";
import crash from "./css/crash.jpg";
import check from "./css/check.png";

const Home = () => {
  return (
    <div className="backimage">
      <div className="content">
        <div className="left">
          <div className="rocket">
            <img src={crash} />
          </div>
        </div>
        <div className="right">
          <div className="textarea">
            <p>We make a Good luck!</p>
            <p style={{ fontSize: "30px" }}>
              If you want Bingo, Please contact us.
            </p>
          </div>
          <div className="buttonarea">
            <a className="sign" href="/signin">
              SignIn
            </a>

            <a className="sign" href="/signup">
              SignUp
            </a>
            
          </div>
        </div>
      </div>
      <div className="tablewrap">
        <div className="tablecontent">
          <table style={{ padding: "80px" }}>
            <thead>
              <tr className="table-header-padding sticky">
                <th className="sticky" style={{ color: "#0E4162" }}></th>
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
              <tr className="table-opacity sticky">
                <td
                  className="sticky"
                  style={{ backgroundColor: "#0E4162", color: "white" }}
                >
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
              <tr className="sticky">
                <td className="sticky">How to Subscribe</td>
                <td>Mobile App only</td>
                <td>Mobile App only</td>
                <td>Web Portable Only</td>
                <td>In Person at TransUnion Office Only</td>
                <td>Mobile App or Web Portal</td>
              </tr>

              <tr className="sticky">
                <td className="sticky">Credit Report</td>
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

              <tr className="sticky">
                <td className="sticky">Score Simulator</td>
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

              <tr className="sticky">
                <td className="sticky">Debt Analysis</td>
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

              <tr className="sticky">
                <td className="sticky">Credit Alert</td>
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
              <tr className="sticky">
                <td className="sticky">Credit Alert</td>
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

export default Home;
