import React from "react";

const FormField = ({
  LabelName,
  placeholder,
  inputType,
  value,
  handleChange,
  maxLength,
  isTextArea,
  errorMessage,
}) => {
  return (
    <label className="flex-1 w-full flex flex-col">
      {LabelName && (
        <span className="font-epilogue font-medium text-[14px] leading-[22px] text-[#808191] mb-[10px]">
          {`${LabelName}`}
        </span>
      )}
      {isTextArea ? (
        <textarea
          required
          value={value}
          onChange={handleChange}
          rows={10}
          cols={30}
          maxLength={1000}
          placeholder={placeholder}
          className="py-[15px] sm:px-[25px] px-[15px] outline-none border-[1px] border-[#3a3a43] bg-transparent font-epilogue text-[#3a3a43] text-[14px] placeholder:text-[#4b5264] rounded-[10px] sm:min-w-[300px]"
        />
      ) : (
        <input
          required
          value={value}
          onChange={handleChange}
          type={inputType}
          step={LabelName == "Stock *" ? "1.0" : "0.1"}
          min="0"
          maxLength={maxLength}
          placeholder={placeholder}
          className="py-[15px] sm:px-[25px] px-[15px] outline-none border-[1px] border-[#3a3a43] bg-transparent font-epilogue text-[#3a3a43] text-[14px] placeholder:text-[#4b5264] rounded-[10px] sm:min-w-[300px]"
        />
      )}
      {errorMessage != undefined && errorMessage.length > 0 && (
        <span className="font-epilogue font-medium text-[14px] leading-[22px] text-[#d56262] mb-[10px]">
          ERROR: {errorMessage}
        </span>
      )}
    </label>
  );
};

export default FormField;
