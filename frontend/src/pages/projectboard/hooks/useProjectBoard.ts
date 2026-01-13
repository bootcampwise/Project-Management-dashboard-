import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import {
  setActiveProject,
  setActiveTab,
  setCreateProjectModalOpen,
  setTeamModalOpen,
  setTemplateLibraryOpen,
  setSidebarOpen,
  setSelectedTask,
} from "../../../store/uiSlice";
import { LayoutGrid, Table2, Calendar, Layers } from "lucide-react";
import type {
  Task,
  CreateProjectPayload,
  CreateTaskPayload,
} from "../../../types";
import {
  saveLastProjectId,
  getLastProjectId,
} from "../../../utils/projectStorage";

import {
  useGetProjectsQuery,
  useCreateProjectMutation,
  useDeleteProjectMutation,
  useUpdateProjectMutation,
} from "../../../store/api/projectApiSlice";
import {
  useGetTasksQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
} from "../../../store/api/taskApiSlice";
import { useGetSessionQuery } from "../../../store/api/authApiSlice";
import { useGetTeamsQuery } from "../../../store/api/teamApiSlice";

export const useProjectBoard = () => {
  const { projectId: routeProjectId } = useParams();
  const [searchParams] = useSearchParams();
  const queryProjectId = searchParams.get("projectId");
  const projectId = routeProjectId || queryProjectId;
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const {
    sidebarOpen,
    activeProject,
    activeTab,
    isCreateProjectModalOpen,
    isTeamModalOpen,
    isTemplateLibraryOpen,
    selectedTask,
  } = useAppSelector((state) => state.ui);
  const { data: projects = [], isLoading: projectsLoading } =
    useGetProjectsQuery();
  const { data: tasks = [] } = useGetTasksQuery();
  const { data: user, isLoading: sessionLoading } = useGetSessionQuery();
  const { data: teams = [] } = useGetTeamsQuery();
  const [createProject] = useCreateProjectMutation();
  const [deleteProject] = useDeleteProjectMutation();
  const [updateProject] = useUpdateProjectMutation();
  const [createTask] = useCreateTaskMutation();
  const [updateTask] = useUpdateTaskMutation();
  const [deleteTask] = useDeleteTaskMutation();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState(false);
  const [isAddEventModalOpen, setIsAddEventModalOpen] = useState(false);
  const [modalInitialStatus, setModalInitialStatus] = useState<
    string | undefined
  >(undefined);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const [isProjectDropdownOpen, setIsProjectDropdownOpen] = useState(false);
  const [isMenuDropdownOpen, setIsMenuDropdownOpen] = useState(false);
  const projectDropdownRef = useRef<HTMLDivElement>(null);
  const menuDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        projectDropdownRef.current &&
        !projectDropdownRef.current.contains(event.target as Node)
      ) {
        setIsProjectDropdownOpen(false);
      }
      if (
        menuDropdownRef.current &&
        !menuDropdownRef.current.contains(event.target as Node)
      ) {
        setIsMenuDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    dispatch(setSelectedTask(null));
  }, [dispatch]);

  useEffect(() => {
    if (sessionLoading || projectsLoading || projects.length === 0) return;
    const userId = user?.id;
    if (projectId) {
      const proj = projects.find((p) => p.id === projectId);
      if (proj && proj.id !== activeProject?.id) {
        dispatch(setActiveProject(proj));
        saveLastProjectId(proj.id, userId);
      }
      return;
    }
    const lastProjectId = getLastProjectId(userId);
    if (lastProjectId) {
      const lastProject = projects.find((p) => p.id === lastProjectId);
      if (lastProject && lastProject.id !== activeProject?.id) {
        dispatch(setActiveProject(lastProject));
        return;
      }
    }
    if (!activeProject) {
      dispatch(setActiveProject(projects[0]));
      saveLastProjectId(projects[0].id, userId);
    }
  }, [
    projectId,
    projects,
    projectsLoading,
    sessionLoading,
    user,
    activeProject,
    dispatch,
  ]);

  useEffect(() => {
    if (activeProject?.id && user?.id) {
      saveLastProjectId(activeProject.id, user.id);
    }
  }, [activeProject?.id, user?.id]);

  const tabs = [
    { id: "Board", icon: LayoutGrid },
    { id: "Table", icon: Table2 },
    { id: "Calendar", icon: Calendar },
    { id: "Timeline", icon: Layers },
  ];

  const projectTasks = tasks.filter((task) => {
    if (typeof task.project === "string")
      return task.project === activeProject?.name;
    return task.project?.id === activeProject?.id;
  });

  const handleCreateProject = async (data: CreateProjectPayload) => {
    try {
      await createProject(data).unwrap();
      dispatch(setCreateProjectModalOpen(false));
    } catch (e) {
      console.error("Failed to create project", e);
      throw e;
    }
  };

  const handleOpenTemplateLibrary = () => {
    dispatch(setCreateProjectModalOpen(false));
    dispatch(setTemplateLibraryOpen(true));
  };

  const handleSelectTemplate = () => {
    dispatch(setTemplateLibraryOpen(false));
    dispatch(setCreateProjectModalOpen(true));
  };

  const handleSwitchProject = (p: (typeof projects)[0]) => {
    dispatch(setActiveProject(p));
    setIsProjectDropdownOpen(false);
    navigate(`/project/${p.id}`);
  };

  const handleEditTask = (task: Task) => {
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
    setIsAddEventModalOpen(true);
  };

  const handleCreateTask = async (task: CreateTaskPayload) => {
    try {
      const finalProjectId = task.projectId || activeProject?.id;
      if (finalProjectId) {
        await createTask({ ...task, projectId: finalProjectId }).unwrap();
        setIsCreateTaskModalOpen(false);
      }
    } catch (error) {
      console.error("Failed to create task", error);
    }
  };

  const handleUpdateTask = async (id: string, data: CreateTaskPayload) => {
    try {
      await updateTask({ id, data }).unwrap();
      setIsCreateTaskModalOpen(false);
      setTaskToEdit(null);
    } catch (error) {
      console.error("Failed to update task", error);
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!id) return;
    try {
      await deleteProject(id).unwrap();
      navigate("/");
    } catch (error) {
      console.error("Failed to delete project", error);
    }
  };

  const handleDeleteTask = async (task: Task) => {
    if (!task.id) return;
    try {
      await deleteTask(String(task.id)).unwrap();
    } catch (error) {
      console.error("Failed to delete task", error);
    }
  };

  const handleUpdateProjectStatus = async (status: string) => {
    if (!activeProject?.id) return;
    try {
      const result = await updateProject({
        id: activeProject.id,
        data: { status },
      }).unwrap();
      dispatch(setActiveProject(result));
    } catch (error) {
      console.error("Failed to update project status", error);
    }
  };

  return {
    user,
    projects,
    teams,
    hasTeams: teams.length > 0,
    activeProject,
    projectTasks,
    selectedTask,
    tabs,
    projectId,
    isLoading: projectsLoading || sessionLoading,
    tasksLoading: !tasks.length && projectsLoading,
    sidebarOpen,
    activeTab,
    isCreateModalOpen: isCreateProjectModalOpen,
    isTeamModalOpen,
    isTemplateLibraryOpen,
    isSearchOpen,
    isCreateTaskModalOpen,
    isAddEventModalOpen,
    modalInitialStatus,
    taskToEdit,
    isProjectDropdownOpen,
    isMenuDropdownOpen,
    projectDropdownRef,
    menuDropdownRef,

    setSidebarOpen: (open: boolean) => dispatch(setSidebarOpen(open)),
    setActiveTab: (tab: string) => dispatch(setActiveTab(tab)),
    setIsCreateModalOpen: (open: boolean) =>
      dispatch(setCreateProjectModalOpen(open)),
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
    handleDeleteTask,
    handleUpdateProjectStatus,
  };
};
