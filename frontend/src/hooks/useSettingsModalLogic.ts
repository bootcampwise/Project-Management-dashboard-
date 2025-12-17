import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { RootState, AppDispatch } from "../store";
import { updateUserProfile, signOut } from "../store/slices/authSlice";
import { supabase } from "../lib/supabase";

export const useSettingsModalLogic = (
  initialTab: string,
  onClose: () => void
) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);

  const [activeTab, setActiveTab] = useState("Profile");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: "",
    jobTitle: "",
    department: "Product Design",
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
        department: user.department || "Product Design",
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
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from("avatars").getPublicUrl(filePath);
      console.log("Generated Avatar URL:", publicUrl);

      const publicUrlWithTimestamp = `${publicUrl}?t=${new Date().getTime()}`;
      await dispatch(updateUserProfile({ avatar: publicUrlWithTimestamp }));
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
      await dispatch(updateUserProfile({ avatar: null }));
    } catch (error) {
      console.error("Error removing avatar:", error);
    }
  };

  const handleSave = () => {
    dispatch(
      updateUserProfile({
        name: formData.name,
        jobTitle: formData.jobTitle,
        department: formData.department,
        hasCompletedOnboarding: true,
      })
    );
    onClose();
    // Redirect to dashboard if this was part of onboarding?
    // The dashboard useEffect will handle the "openOnboarding" state cleanup,
    // but if we want to force a refresh/navigation we could.
    // For now, closing the modal is sufficient as the user is already on the dashboard.
  };

  const handleLogout = async () => {
    await dispatch(signOut());
    onClose();
    navigate("/login");
  };

  return {
    user,
    activeTab,
    formData,
    uploading,
    fileInputRef,
    handleTabChange,
    handleInputChange,
    handlePhotoUpload,
    handleRemovePhoto,
    handleSave,
    handleLogout,
  };
};
