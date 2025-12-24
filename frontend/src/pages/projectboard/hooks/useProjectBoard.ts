import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import {
  setActiveProject,
  setActiveTab,
  setCreateModalOpen,
  setTeamModalOpen,
  setTemplateLibraryOpen,
} from "../../../store/slices/projectSlice";
import { fetchTasks } from "../../../store/slices/taskSlice";
import { setSidebarOpen } from "../../../store/slices/uiSlice";
import { setSelectedTask } from "../../../store/slices/taskSlice";
import { Layout, Table, Calendar, List } from "lucide-react";
import type {
  Task,
  CreateProjectPayload,
  CreateTaskPayload,
} from "../../../types";
import { createTask, updateTask } from "../../../store/slices/taskSlice";
import {
  deleteProject,
  createProject,
  fetchProjects,
} from "../../../store/slices/projectSlice";

export const useProjectBoard = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // Selectors
  const { sidebarOpen } = useAppSelector((state) => state.ui);
  const {
    projects,
    activeProject,
    activeTab,
    isCreateModalOpen,
    isTeamModalOpen,
    isTemplateLibraryOpen,
  } = useAppSelector((state) => state.project);
  const { tasks, selectedTask } = useAppSelector((state) => state.task);

  // Local State
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState(false);
  const [isAddEventModalOpen, setIsAddEventModalOpen] = useState(false);
  const [modalInitialStatus, setModalInitialStatus] = useState<
    string | undefined
  >(undefined);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);

  // Header Dropdown States
  const [isProjectDropdownOpen, setIsProjectDropdownOpen] = useState(false);
  const [isMenuDropdownOpen, setIsMenuDropdownOpen] = useState(false);

  // Effects
  useEffect(() => {
    dispatch(fetchTasks());
    dispatch(fetchProjects());
  }, [dispatch]);

  useEffect(() => {
    if (projectId) {
      const proj = projects.find((p) => p.id === projectId);
      if (proj && proj.id !== activeProject?.id) {
        dispatch(setActiveProject(proj));
      }
    } else if (!activeProject && projects.length > 0) {
      dispatch(setActiveProject(projects[0]));
    }
  }, [projectId, projects, activeProject, dispatch]);

  const tabs = [
    { id: "Board", icon: Layout },
    { id: "Table", icon: Table },
    { id: "Calendar", icon: Calendar },
    { id: "Timeline", icon: List },
  ];

  // Derived State
  const projectTasks = tasks.filter((task) => {
    if (typeof task.project === "string")
      return task.project === activeProject?.name;
    return task.project?.id === activeProject?.id;
  });

  // Handlers
  const handleCreateProject = async (data: CreateProjectPayload) => {
    console.log("Create Project Data:", data);
    try {
      // @ts-ignore
      await dispatch(createProject(data)).unwrap();
      dispatch(setCreateModalOpen(false));
      // Project created successfully - just close the modal, don't open team modal
    } catch (e) {
      console.error("Failed to create project", e);
      throw e;
    }
  };

  const handleOpenTemplateLibrary = () => {
    dispatch(setCreateModalOpen(false));
    dispatch(setTemplateLibraryOpen(true));
  };

  const handleSelectTemplate = () => {
    dispatch(setTemplateLibraryOpen(false));
    dispatch(setCreateModalOpen(true));
  };

  const handleSwitchProject = (p: (typeof projects)[0]) => {
    dispatch(setActiveProject(p));
    setIsProjectDropdownOpen(false);
    navigate(`/project/${p.id}`);
  };

  const handleEditTask = (task: Task) => {
    console.log("ProjectBoard: handleEditTask called", task);
    setTaskToEdit(task);
    dispatch(setSelectedTask(null));
    setIsCreateTaskModalOpen(true);
  };

  const handleTableTaskClick = (tableTask: {
    id: string;
    name: string;
    assignee: { name: string; avatar?: string };
    dueDate: string;
    labels: { text: string; color: string; bg: string }[];
    comments?: number;
    attachments?: number;
  }) => {
    const task: Task = {
      id: tableTask.id,
      name: tableTask.name,
      project: activeProject?.name || "Default Project",
      subtasks: 0,
      status: "IN_PROGRESS",
      priority: "MEDIUM",
      startDate: new Date().toISOString().split("T")[0],
      endDate: tableTask.dueDate,
      dueDate: tableTask.dueDate,
      labels: tableTask.labels,
      assignee: tableTask.assignee,
      comments: tableTask.comments,
      attachments: tableTask.attachments,
    };
    dispatch(setSelectedTask(task));
  };

  const handleAddTask = (status: string) => {
    setModalInitialStatus(status);
    setIsCreateTaskModalOpen(true);
  };

  const handleOpenAddEvent = () => {
    console.log("Opening Add Event Modal");
    setIsAddEventModalOpen(true);
  };

  const handleCreateTask = async (task: CreateTaskPayload) => {
    try {
      const finalProjectId = task.projectId || activeProject?.id;
      if (finalProjectId) {
        // @ts-ignore
        await dispatch(
          createTask({ ...task, projectId: finalProjectId })
        ).unwrap();
        setIsCreateTaskModalOpen(false);
      }
    } catch (error) {
      console.error("Failed to create task", error);
    }
  };

  const handleUpdateTask = async (id: string, data: CreateTaskPayload) => {
    try {
      // @ts-ignore
      await dispatch(updateTask({ id, data })).unwrap();
      setIsCreateTaskModalOpen(false);
      setTaskToEdit(null);
    } catch (error) {
      console.error("Failed to update task", error);
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!id) return;
    try {
      // @ts-ignore
      await dispatch(deleteProject(id)).unwrap();
      navigate("/");
    } catch (error) {
      console.error("Failed to delete project", error);
    }
  };

  return {
    // Data
    projects,
    activeProject,
    projectTasks, // Filtered tasks
    selectedTask,
    tabs,
    projectId,

    // UI States
    sidebarOpen,
    activeTab,
    isCreateModalOpen,
    isTeamModalOpen,
    isTemplateLibraryOpen,
    isSearchOpen,
    isCreateTaskModalOpen,
    isAddEventModalOpen,
    modalInitialStatus,
    taskToEdit,
    isProjectDropdownOpen,
    isMenuDropdownOpen,

    // Setters (if needed directly)
    setSidebarOpen: (open: boolean) => dispatch(setSidebarOpen(open)),
    setActiveTab: (tab: string) => dispatch(setActiveTab(tab)),
    setIsCreateModalOpen: (open: boolean) => dispatch(setCreateModalOpen(open)),
    setIsTeamModalOpen: (open: boolean) => dispatch(setTeamModalOpen(open)),
    setIsTemplateLibraryOpen: (open: boolean) =>
      dispatch(setTemplateLibraryOpen(open)),
    setIsSearchOpen,
    setIsCreateTaskModalOpen,
    setIsAddEventModalOpen,
    setIsProjectDropdownOpen,
    setIsMenuDropdownOpen,
    setSelectedTask: (task: Task | null) => dispatch(setSelectedTask(task)),
    setTaskToEdit,

    // Handlers
    handleCreateProject,
    handleOpenTemplateLibrary,
    handleSelectTemplate,
    handleSwitchProject,
    handleEditTask,
    handleTableTaskClick,
    handleAddTask,
    handleOpenAddEvent,
    handleCreateTask,
    handleUpdateTask,
    handleDeleteProject,
  };
};
