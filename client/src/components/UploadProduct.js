import React, { useState } from "react";
import close from "../assets/close.svg";
import FormField from "./FormField";
import { options } from "../constants";
import { checkIfImage } from "../utils";
import { ethers } from "ethers";
import { abi, contractAddresses } from "../constants";

const UploadProduct = ({ toggleUpload, decentralazon, provider }) => {
  const [form, setForm] = useState({
    name: "",
    category: "",
    description: "",
    image: "",
    price: 0,
    rating: 0,
    stock: 0,
  });
  const [targetm, setTargetm] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");
  const [hasError, setHasError] = useState(true);
  const [errorMessagePrice, setErrorMessagePrice] = useState("");
  const [errorMessageStock, setErrorMessageStock] = useState("");
  const [errorMessageName, setErrorMessageName] = useState("");
  const [errorMessageImage, setErrorMessageImage] = useState("");
  const [errorMessageCategory, setErrorMessageCategory] = useState(
    "Please select the category that you're interested in. ❗️"
  );
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !hasError &&
      (errorMessageCategory == undefined || errorMessageCategory.length <= 0) &&
      (errorMessagePrice == undefined || errorMessagePrice.length <= 0) &&
      (errorMessageImage == undefined || errorMessageImage.length <= 0) &&
      (errorMessageName == undefined || errorMessageName.length <= 0) &&
      (errorMessageStock == undefined || errorMessageStock.length <= 0)
    ) {
      setIsLoading(true);
      try {
        const signer = await provider.getSigner();
        const transaction = await decentralazon
          .connect(signer)
          .list(
            form.name,
            form.category,
            form.description,
            form.image,
            targetm,
            form.rating,
            form.stock
          );
        await transaction.wait();
        setIsLoading(false);
        toggleUpload = false;
      } catch (error) {
        console.log(error);
        setIsLoading(false);
      }

      // await createCampaign({
      //   onSuccess: handleSucess,
      //   onError: (error) =>
      //     alert(
      //       `Your transaction failed.⚠️ Please try again. 🔁 Error: ${error.message}`
      //     ),
      // });
    }
  };
  const handleFormFeildChange = (fieldName, e) => {
    setForm({ ...form, [fieldName]: e.target.value });
  };
  const handleChangedropdown = async (event) => {
    if (selectedOption == undefined || selectedOption.length < 0) {
      setErrorMessageCategory(
        "Please select the category that you're interested in. ❗️"
      );
      setHasError(true);
    } else {
      setErrorMessageCategory("");
      setHasError(false);
    }
    setForm({ ...form, ["category"]: event.target.value.toString() });
    await setSelectedOption(event.target.value.toString());
  };
  return (
    <div className="product">
      <div className="product__details">
        <form
          onSubmit={handleSubmit}
          className="w-full  flex flex-col gap-[30px] overflow-y-auto h-full"
        >
          <div className="flex flex-wrap gap-[40px]">
            <FormField
              LabelName="Product Name *"
              placeholder="Samsung Galaxy smartphones"
              inputType="text"
              maxLength={30}
              value={form.name}
              errorMessage={errorMessageName}
              handleChange={(e) => {
                const pattern = /^[a-zA-Z]+( [a-zA-Z]+)*$/;

                if (!pattern.test(e.target.value)) {
                  setErrorMessageName(
                    "Space in starting and end , Special characters and Numbers 🚫 are not allowed in name "
                  );
                  setHasError(true);
                } else {
                  setErrorMessageName("");
                  setHasError(false);
                }

                handleFormFeildChange("name", e);
              }}
            />
          </div>
          <FormField
            LabelName="Description *"
            placeholder="write your Description about the product"
            isTextArea
            value={form.description}
            handleChange={(e) => {
              handleFormFeildChange("description", e);
            }}
          />
          <div className="flex flex-wrap gap-[40px]">
            <FormField
              LabelName="Price *"
              placeholder="0.05 ETH"
              inputType="number"
              value={form.price}
              errorMessage={errorMessagePrice}
              handleChange={async (e) => {
                const pattern = /^[1-9]\d{0,11}$|^0\.\d{3,4}$|^0$/;
                if (
                  e.target.value > 0 &&
                  e.target.value <= 10000 &&
                  e.target.value.length < 7
                ) {
                  setErrorMessagePrice("");
                  setHasError(false);
                  setTargetm(ethers.parseEther(e.target.value));
                } else {
                  if (
                    e.target.value > 10000 ||
                    !pattern.test(e.target.value) ||
                    e.target.value == 0
                  ) {
                    setErrorMessagePrice(
                      "Price 🎯 should be greater than 0 and less than 10,000 also digit length is must not greater than 5 "
                    );
                    setHasError(true);
                    setTargetm(0);
                  } else {
                    setErrorMessagePrice("");
                    setHasError(false);
                    setTargetm(ethers.parseEther(e.target.value));
                  }
                }
                handleFormFeildChange("price", e);
              }}
            />
            <label className="flex-1 w-full flex flex-col">
              <span className="font-epilogue font-medium text-[14px] leading-[22px] text-[#808191] mb-[10px]">
                Product Category *
              </span>
              <select
                value={selectedOption}
                onChange={handleChangedropdown}
                className="py-[15px] sm:px-[25px] px-[15px] outline-none border-[1px] border-[#3a3a43] bg-transparent font-epilogue text-[#3a3a43] text-[14px] placeholder:text-[#4b5264] rounded-[10px] sm:min-w-[300px]"
              >
                {options.map((option) => (
                  <option
                    key={option.label}
                    value={option.label}
                    className="font-epilogue font-medium text-[14px] bg-[#1c1c24] leading-[22px] text-[#808191] mb-[10px] "
                  >
                    {option.label}
                  </option>
                ))}
              </select>
              {errorMessageCategory != undefined &&
                errorMessageCategory.length > 0 && (
                  <span className="font-epilogue font-medium text-[14px] leading-[22px] text-[#d56262] mb-[10px]">
                    ERROR: {errorMessageCategory}
                  </span>
                )}
            </label>
            <FormField
              LabelName="Stock *"
              placeholder="10"
              inputType="number"
              value={form.stock}
              errorMessage={errorMessageStock}
              handleChange={async (e) => {
                if (e.target.value <= 0) {
                  setErrorMessageStock("⚠️ Stock must be greater than 0 ");

                  setHasError(true);
                } else {
                  setErrorMessageStock("");
                  setHasError(false);
                }

                handleFormFeildChange("stock", e);
              }}
            />
          </div>
          <div className="flex flex-wrap gap-[40px]">
            <FormField
              LabelName="Product Image *"
              placeholder="Place image URL of your Product"
              inputType="url"
              value={form.image}
              errorMessage={errorMessageImage}
              handleChange={(e) => {
                handleFormFeildChange("image", e);
                checkIfImage(e.target.value, async (exists) => {
                  if (exists) {
                    setHasError(false);
                    setErrorMessageImage("");
                  } else {
                    setErrorMessageImage(
                      `The image URL you entered is not valid.⚠️ Please enter a valid image URL. 🖼️`
                    );

                    setHasError(true);
                  }
                });
              }}
            />
          </div>
          <button
            type="submit"
            className="nav__connect h-[50px]"
            disabled={hasError}
            opacity={0.5}
          >
            Submit
          </button>
        </form>

        <button onClick={toggleUpload} className="product__close">
          <img src={close} alt="Close" />
        </button>
      </div>
    </div>
  );
};

export default UploadProduct;
