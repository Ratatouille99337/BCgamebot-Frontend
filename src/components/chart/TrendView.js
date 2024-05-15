import React from "react";

import "../pages/css/trend.css";

export default function TrendView({ data }) {
  return (
    <div className="trendview">
      {data.map(({ result }) => {
        let className = "";

        if (result < 2) className = "red-circle";
        else if (result >= 2 && result < 10) className = "green-circle";
        else if (result >= 10 && result < 100) className = "yellow-circle";
        else if (result >= 100) className = "sky-circle";
        else className = "empty-circle";

        return <div className={className} />;
      })}
    </div>
  );
}

export function TempTrendView({ data }) {
  return (
    <>
      {data.map((item, ind) => (
        <div key={ind} className="trendview">
          <span style={{ width: "50px", textAlign: "center" }}>{item[0]}</span>
          <span style={{ width: "100px", textAlign: "center" }}>{item[1]}</span>
          <span style={{ width: "50px", textAlign: "center" }}>{item[2]}</span>
          {item.slice(3).map((result, ind) => {
            let className = "";

            if (result < 2) className = "red-circle";
            else if (result >= 2 && result < 10) className = "green-circle";
            else if (result >= 10 && result < 100) className = "yellow-circle";
            else if (result >= 100) className = "sky-circle";
            else className = "empty-circle";

            return <div key={ind} className={className} />;
          })}
        </div>
      ))}
    </>
  );
}

export function TempLongMoonsTrendView({ data }) {
  console.log(data);
  return (
    <>
      {data.map((item, ind) => (
        <div key={ind} className="trendview">
          {item[0].map((result, ind) => {
            let className = "";

            if (result < 2) className = "red-circle";
            else if (result >= 2 && result < 10) className = "green-circle";
            else if (result >= 10 && result < 100) className = "yellow-circle";
            else if (result >= 100) className = "sky-circle";
            else className = "empty-circle";

            return <div key={ind} className={className} />;
          })}
          <span style={{ width: "200px", textAlign: "center" }}>{item[1]}</span>
          <span style={{ width: "50px", textAlign: "center" }}>{item[2]}</span>
          <span style={{ width: "200px", textAlign: "center" }}>{item[3]}</span>
          {item[4].map((result, ind) => {
            let className = "";

            if (result < 2) className = "red-circle";
            else if (result >= 2 && result < 10) className = "green-circle";
            else if (result >= 10 && result < 100) className = "yellow-circle";
            else if (result >= 100) className = "sky-circle";
            else className = "empty-circle";

            return <div key={ind} className={className} />;
          })}
        </div>
      ))}
    </>
  );
}

export function TempMoonTrendView({ data }) {
  return (
    <>
      {data.map((item, ind) => (
        <div key={ind} className="trendview">
          {item.map((result, ind) => {
            let className = "";

            if (result < 2) className = "red-circle";
            else if (result >= 2 && result < 10) className = "green-circle";
            else if (result >= 10) className = "yellow-circle";
            else className = "empty-circle";

            return <div key={ind} className={className} />;
          })}
        </div>
      ))}
    </>
  );
}
