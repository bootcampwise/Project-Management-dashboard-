import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  useGetSessionQuery,
  useUpdateProfileMutation,
  useLogoutMutation,
  useGetAllUsersQuery,
} from "../../../store/api/authApiSlice";
import { useGetAllTeamsQuery } from "../../../store/api/teamApiSlice";
import { useUploadFileMutation } from "../../../store/api/storageApiSlice";
import { useTheme } from "../../../theme/useTheme";
import { showToast, getErrorMessage } from "../../../components/ui";
import { useAppSelector, useAppDispatch } from "../../../store/hooks";
import { setTimeFormat } from "../../../store/uiSlice";

export const useSettingsModalLogic = (
  initialTab: string,
  onClose: () => void,
) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { data: user } = useGetSessionQuery();
  const { data: allUsers = [] } = useGetAllUsersQuery();
  const { data: teams = [] } = useGetAllTeamsQuery();
  const [uploadFile] = useUploadFileMutation();
  const [updateProfile] = useUpdateProfileMutation();
  const [logout] = useLogoutMutation();
  const { theme, setTheme } = useTheme();
  const currentTimeFormat = useAppSelector((state) => state.ui.timeFormat);

  const [activeTab, setActiveTab] = useState("Profile");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [pendingTheme, setPendingTheme] = useState<"light" | "dark">(theme);
  const [pendingTimeFormat, setPendingTimeFormat] = useState<"12h" | "24h">(
    currentTimeFormat,
  );

  const [formData, setFormData] = useState({
    name: "",
    jobTitle: "",
    department: "",
  });

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        jobTitle: user.jobTitle || "",
        department: user.department || "",
      });
    }
  }, [user]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id === "fullName" ? "name" : id]: value,
    }));
  };

  const handlePhotoUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    try {
      setUploading(true);
      const file = event.target.files?.[0];
      if (!file) return;

      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random()}.${fileExt}`;

      const result = await uploadFile({
        bucket: "avatars",
        path: fileName,
        file,
      }).unwrap();

      const publicUrlWithTimestamp = `${
        result.publicUrl
      }?t=${new Date().getTime()}`;
      await updateProfile({ avatar: publicUrlWithTimestamp });
    } catch (error) {
      console.error("Error uploading avatar:", error);
      if (error instanceof Error) {
        alert(`Error uploading avatar: ${error.message}`);
      } else {
        alert("Error uploading avatar!");
      }
    } finally {
      setUploading(false);
    }
  };

  const handleRemovePhoto = async () => {
    try {
      await updateProfile({ avatar: undefined });
    } catch (error) {
      console.error("Error removing avatar:", error);
    }
  };

  const handleSave = async () => {
    try {
      await updateProfile({
        name: formData.name,
        jobTitle: formData.jobTitle,
        department: formData.department,
        hasCompletedOnboarding: true,
      }).unwrap();

      if (pendingTheme !== theme) {
        setTheme(pendingTheme);
      }
      if (pendingTimeFormat !== currentTimeFormat) {
        dispatch(setTimeFormat(pendingTimeFormat));
      }

      showToast.success("Settings saved successfully");
      onClose();
    } catch (error) {
      showToast.error(`Failed to save settings. ${getErrorMessage(error)}`);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      showToast.success("Logged out successfully");
      onClose();
      navigate("/login");
    } catch (error) {
      showToast.error("Failed to logout");
      console.error(error);
    }
  };

  return {
    user,
    allUsers,
    activeTab,
    formData,
    uploading,
    fileInputRef,
    teams,
    pendingTheme,
    setPendingTheme,
    pendingTimeFormat,
    setPendingTimeFormat,
    handleTabChange,
    handleInputChange,
    handlePhotoUpload,
    handleRemovePhoto,
    handleSave,
    handleLogout,
  };
};
