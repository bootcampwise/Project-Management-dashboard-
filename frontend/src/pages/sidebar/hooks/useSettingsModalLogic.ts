import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  useGetSessionQuery,
  useUpdateProfileMutation,
  useLogoutMutation,
  useGetAllUsersQuery,
} from "../../../store/api/authApiSlice";
import { useGetTeamsQuery } from "../../../store/api/teamApiSlice";
import { useUploadFileMutation } from "../../../store/api/storageApiSlice";
import { useTheme } from "../../sidebar/hooks/useTheme";

export const useSettingsModalLogic = (
  initialTab: string,
  onClose: () => void
) => {
  const navigate = useNavigate();
  // Get user from RTK Query
  const { data: user } = useGetSessionQuery();
  // Get all users from RTK Query
  const { data: allUsers = [] } = useGetAllUsersQuery();
  // Get teams from RTK Query
  const { data: teams = [] } = useGetTeamsQuery();
  const [uploadFile] = useUploadFileMutation();
  const [updateProfile] = useUpdateProfileMutation();
  const [logout] = useLogoutMutation();
  const { theme, toggleTheme } = useTheme();

  const [activeTab, setActiveTab] = useState("Profile");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id === "fullName" ? "name" : id]: value,
    }));
  };

  const handlePhotoUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    try {
      setUploading(true);
      const file = event.target.files?.[0];
      if (!file) return;

      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random()}.${fileExt}`;

      // Upload using RTK Query
      const result = await uploadFile({
        bucket: "avatars",
        path: fileName,
        file,
      }).unwrap();

      // Update profile with new avatar URL
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

  const handleSave = () => {
    updateProfile({
      name: formData.name,
      jobTitle: formData.jobTitle,
      department: formData.department,
      hasCompletedOnboarding: true,
    });
    onClose();
  };

  const handleLogout = async () => {
    await logout();
    onClose();
    navigate("/login");
  };

  return {
    user,
    allUsers,
    activeTab,
    formData,
    uploading,
    fileInputRef,
    teams,
    theme,
    toggleTheme,
    handleTabChange,
    handleInputChange,
    handlePhotoUpload,
    handleRemovePhoto,
    handleSave,
    handleLogout,
  };
};
