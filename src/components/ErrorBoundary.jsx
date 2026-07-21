import { useState, useEffect } from "react";
import PropTypes from "prop-types";
// import errorImg from "../assets/images/errorImg.jpg";

const ErrorBoundary = ({ children }) => {
  const [hasError, setHasError] = useState(false);
  const refreshPage = () => {
    location.reload();
  };

  useEffect(() => {
    const handleError = (error, errorInfo) => {
      console.error("Error Boundary Caught:", error, errorInfo);
      setHasError(true);
    };

    // Adding error handler on component mount
    window.addEventListener("error", handleError);
    return () => window.removeEventListener("error", handleError);
  }, []);

  if (hasError) {
    return (
      <>
        <div className="w-full h-screen items-center flex justify-center">
          <div className="text-center">
            <div className="mt-7 xl:mt-10 space-y-3">
              <h1 className="font-bold text-30 xl:text-48 text-primary ">Something went wrong.</h1>
              <p className="font-normal text-12 md:text-14 xl:text-16 text-[#64748B] ">Please try{" "}<span className="text-primary">refreshing the page</span> or{" "}<span className="text-primary"> contact support.</span>
              </p>
              <p className="font-normal text-12 md:text-14 xl:text-16 text-[#64748B] ">Please Check Your code and check Errors in Console.</p>
              <div>
                <button type="button" onClick={refreshPage} className="btn_primary mt-10 w-auto border border-primary hover:border-primary">Refresh Page</button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return children;
};

ErrorBoundary.propTypes = {
  children: PropTypes.node,
};

export default ErrorBoundary;
