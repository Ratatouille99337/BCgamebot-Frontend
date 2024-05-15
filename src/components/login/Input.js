import React from "react";

// load assets
import "../pages/css/input.scss";

const Input = ({
  type,
  placeholder,
  labelName,
  style = {},
  className,
  value,
  handleUpdate,
}) => {
  return (
    <div className="form-input">
      <input
        className={className}
        type={type}
        style={style}
        placeholder={placeholder}
        value={value}
        onChange={(e) => {
          handleUpdate(e.target.value);
        }} 
      />
    </div>
  );
};

export default Input;
