import toast from "react-hot-toast";
import { docArray, imageArray, ImageDocArray } from "./CommonArray";
import { useUserProfile } from "../Store/Selectors/Auth/Auth_Selector";

export const handleChangeImage = (event, setFieldValue, name, fileType = "image") => {
    const file = event.target.files[0];
    const allowedTypes = fileType === "doc" ? docArray : fileType === "imageDoc" ? ImageDocArray : imageArray;

    if (!allowedTypes.includes(file?.type)) {
        toast.error("Invalid file type. Please upload a valid file.");
        return;
    }
    setFieldValue(name, file);
    const reader = new FileReader();
    reader.readAsDataURL(file);
}

export const handleDeleteImage = (setFieldValue, name) => {
    setFieldValue(name, "");
}

export const toTitleCase = (str) => { return str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()); };

export const downloadImage = async (filePath, fileName) => {
    if (!filePath) {
        toast.error("No file available to view.");
        return;
    }

    const fileUrl = filePath
    const a = document.createElement("a");
    a.style.display = "none";
    document.body.appendChild(a);
    a.href = fileUrl;
    a.target = "_blank";
    a.download = fileName;
    a.click();
    window.URL.revokeObjectURL(fileUrl);
    a.remove();
}

export const useCheckPermissionByPage = (pageName, permissionType) => {
    try {
        const userData = useUserProfile();
        if (
            pageName == "Export Data" ||
            pageName == "Download Data" ||
            (pageName == "Assignment Permission" && !permissionType)
        ) {
            if (pageName == "Export Data") {
                if (userData?.Data?.roleid?.is_exports) {
                    return true;
                } else {
                    return false;
                }
            } else if (pageName == "Download Data") {
                if (userData?.Data?.roleid?.is_download) {
                    return true;
                } else {
                    return false;
                }
            } else if (pageName == "Assignment Permission") {
                if (userData?.Data?.roleid?.is_assignment) {
                    return true;
                } else {
                    return false;
                }
            }
        } else {
            if (userData?.Data?.roleid?.permissions?.length > 0) {
                const decodedPermissions = userData?.Data?.roleid?.permissions;
                let count = 0;
                decodedPermissions.forEach((item) => {
                    if (item.displayname === pageName && item[permissionType]) {
                        count++;
                    }
                });

                if (count > 0) {
                    return true;
                } else {
                    return false;
                }
            }
        }
        return false;
    } catch (error) {
        console.error("Permission check failed:", error);
        return false;
    }
};

