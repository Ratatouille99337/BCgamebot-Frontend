import React from "react";

// load assets
import "../pages/css/button.scss";

const Button = ({
  type = "button",
  text,
  link = "#",
  style = {},
  className,
  action,
}) => {
  return (
    <div className={className} style={style}>
      {type === "link" ? (
        <a href={link} rel="noreferrer">
          <div className="img"></div>
          {text}
        </a>
      ) : (
        <button type={type} onClick={action}>
          {text}
        </button>
      )}
    </div>
  );
};

export default Button;
