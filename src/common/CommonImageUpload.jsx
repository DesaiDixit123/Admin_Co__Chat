import React, { useEffect, useRef, useState } from "react";
import CameraCapture from "./CameraCapture";
import { handleChangeImage } from "./GlobalFunction";
import { ImageDocArray } from "./CommonArray";


const CommonImageUpload = ({
  fieldName,
  value,
  setFieldValue,
  onChangeCustom,
  children,
  accept = ImageDocArray,
}) => {
  const [openPicker, setOpenPicker] = useState(false);
  const [showCamera, setShowCamera] = useState(false);

  const galleryRef = useRef(null);
  const handleFileSelection = (e) => {
    if (onChangeCustom) {
      onChangeCustom(e, setFieldValue, fieldName);
    } else {
      handleChangeImage(e, setFieldValue, fieldName, "imageDoc");
    }
  };
  useEffect(() => {
    const popup = document.querySelector(".main-registration-popup"); // add class to first popup
    if (openPicker) {
      document.body.style.overflow = "hidden";
      if (popup) popup.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
      if (popup) popup.style.overflowY = "auto";
    }
  }, [openPicker]);
  return (
    <>
      {/* Upload Box */}
      <div onClick={() => !value && setOpenPicker(true)}>
        {children}
      </div>

      {/* Gallery Hidden Input */}
      <input ref={galleryRef} type="file" accept={accept.join(",")} className="hidden" onChange={handleFileSelection} />

      {/* Popup Menu */}
      {openPicker && (
        <div className="fixed inset-0 z-[9999] bg-g1/30 backdrop-blur-sm flex items-center justify-center" onClick={() => setOpenPicker(false)}>
          <div className="bg-white w-full max-w-[542px] rounded-xl lg:rounded-2xl 2xl:rounded-[30px] 
                 px-5 lg:px-7 xl:px-9 py-3.5 lg:py-5 xl:py-7" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-3.5 lg:mb-5">
              <h5 className="text-20 lg:text-24 xl:text-30 text-g1 font-bold">Select Option</h5>
              <span className="icon-close_fill text-red text-[24px] lg:text-[28px] xl:text-[32px]" onClick={() => setOpenPicker(false)}></span>
            </div>
            <h3 className="text-g1 text24 font-semibold"></h3>

            <div className="flex items-center flex-wrap xs:flex-nowrap  xs:space-x-4">
              {/* Open Custom Camera */}
              <button className="btn p-3 bg-primary text-white rounded-lg hover:border-primary w-full xs:w-1/2" onClick={() => { setOpenPicker(false); setShowCamera(true); }}>📷 Take Photo</button>

              {/* Open Gallery */}
              <button className="btn p-3 bg-white border border-primary text-primary hover:bg-primary hover:text-white rounded-lg w-full xs:w-1/2 mt-3 xs:mt-0" onClick={() => { setOpenPicker(false); galleryRef.current.click(); }}>🖼 Choose from Gallery</button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Camera Modal */}
      {showCamera && (<CameraCapture onClose={() => setShowCamera(false)} onCapture={(file) => { setFieldValue(fieldName, file); }} />)}
    </>
  );
};

export default CommonImageUpload;
