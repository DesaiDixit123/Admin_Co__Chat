import React, { useRef, useEffect } from "react";

const CameraCapture = ({ onClose, onCapture }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    async function initCamera() {
      try {
        let stream = await navigator.mediaDevices.getUserMedia({ video: true, });
        videoRef.current.srcObject = stream;
      } catch (error) {
        console.error("Camera Error:", error);
        alert("Camera access blocked or not available");
        onClose();
      }
    }
    initCamera();
  }, []);

  const takePhoto = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0);

    canvas.toBlob((blob) => {
      const file = new File([blob], "photo.jpg", { type: "image/jpeg" });
      onCapture(file);
      onClose();
    });
  };

  return (
    <div className="fixed h-screen inset-0 bg-g1/30 backdrop-blur-sm py-24 px-8 z-50 flex items-center justify-center overflow-y-auto ">
      <div className="bg-white w-full max-w-[542px] rounded-xl lg:rounded-2xl 2xl:rounded-[30px] px-5 lg:px-7 xl:px-9 py-3.5 lg:py-5 xl:py-7 m-auto">
        <video ref={videoRef} autoPlay className="w-full rounded-lg" />
        <canvas ref={canvasRef} className="hidden"></canvas>
        <div className="flex items-center space-x-3 mt-6">
          <button className="btn_primary rounded-lg hover:border-primary" onClick={takePhoto}>Capture</button>
          <button className="btn_secondary border-primary text-primary hover:bg-primary hover:text-white rounded-lg" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default CameraCapture;
