import React from "react";

const Switch = ({ checked, onCheckedChange }) => {
  return (
    <label className="relative inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onCheckedChange(e.target.checked)}
        className="sr-only"
      />
      <span
        className={`w-11 h-6 bg-gray-200 rounded-full ${
          checked ? "bg-blue-500" : ""
        }`}
      ></span>
      <span
        className={`absolute left-0 w-4 h-4 bg-white rounded-full transition-transform transform ${
          checked ? "translate-x-5" : ""
        }`}
      ></span>
    </label>
  );
};

export { Switch };
