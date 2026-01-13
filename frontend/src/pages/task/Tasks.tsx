import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  pageVariants,
  reducedPageVariants,
  itemVariants,
  listContainerVariants,
  listItemVariants,
} from "../../utils/motion";
import Sidebar from "../sidebar/Sidebar";
import {
  Badge,
  Button,
  Dropdown,
  KanbanBoardSkeleton,
  TableSkeleton,
  ProjectHeaderSkeleton,
} from "../../components/ui";
import {
  Menu,
  Search,
  Plus,
  Calendar,
  MessageSquare,
  Paperclip,
  FileText,
  Layout,
  List,
} from "lucide-react";
import TaskDetailModal from "../../components/task/TaskDetailModal";
import CreateTaskModal from "../../components/task/CreateTaskModal";
import SearchPopup from "../../components/sidebar/SearchPopup";
import BoardColumn from "../../components/projectBoard/BoardColumn";
import SortControl from "../../components/ui/SortControl";
import FilterControl from "../../components/ui/FilterControl";
import { useTasksPage } from "./hooks/useTasksPage";
import { DragDropContext } from "@hello-pangea/dnd";
import { taskClasses } from "./taskStyle";

const Tasks: React.FC = () => {
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);
  const {
    isLoading,
    sidebarOpen,
    setSidebarOpen,
    activeView,
    setActiveView,
    selectedTask,
    taskToEdit,
    isCreateTaskModalOpen,
    modalInitialStatus,
    columns,
    visibleColumns,
    hiddenColumns,
    handleTaskClick,
    handleOpenCreateTask,
    handleCreateTask,
    handleEditTask,
    handleDeleteTask,
    handleUpdateTask,
    closeTaskDetail,
    closeCreateTaskModal,
    handleToggleColumn,
    handleHideColumn,
    handleShowColumn,
    handleDragEnd,
    getTasksByStatus,
    getAllSortedTasks,
    sortBy,
    setSortBy,
    filterPriority,
    setFilterPriority,
    hasTeams,
  } = useTasksPage();

  const shouldReduceMotion = useReducedMotion();

  if (isLoading) {
    return (
      <div className={taskClasses.container}>
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className={taskClasses.main(activeView)}>
          <div className={taskClasses.mainContent(sidebarOpen)}>
            <ProjectHeaderSkeleton />
            {activeView === "kanban" ? (
              <KanbanBoardSkeleton />
            ) : (
              <TableSkeleton />
            )}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className={taskClasses.container}>
      <Button
        variant="ghost"
        className={taskClasses.menuButton(sidebarOpen)}
        onClick={() => setSidebarOpen(true)}
      >
        <Menu size={22} />
      </Button>

      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className={taskClasses.main(activeView)}>
        <motion.div
          className={taskClasses.mainContent(sidebarOpen)}
          variants={shouldReduceMotion ? reducedPageVariants : pageVariants}
          initial="initial"
          animate="animate"
        >
          <div className={taskClasses.headerWrapper}>
            <h1 className={taskClasses.headerTitle}>Tasks</h1>

            <div className={taskClasses.toolbar}>
              <div className={taskClasses.viewTabsWrapper}>
                <Button
                  variant="ghost"
                  onClick={() => setActiveView("kanban")}
                  className={taskClasses.viewTab(activeView === "kanban")}
                >
                  <Layout size={16} />
                  Kanban
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => setActiveView("list")}
                  className={taskClasses.viewTab(activeView === "list")}
                >
                  <List size={16} />
                  List
                </Button>
              </div>

              <div className={taskClasses.actionsWrapper}>
                <div
                  className={`${taskClasses.searchButton} cursor-pointer hover:bg-gray-100 transition-colors`}
                  onClick={() => setIsSearchOpen(true)}
                >
                  <Search size={16} className={taskClasses.searchIcon} />
                  <span className={taskClasses.searchText}>Search</span>
                </div>
                <FilterControl
                  value={filterPriority}
                  onChange={setFilterPriority}
                  label="Filters"
                  options={[
                    { key: "all", label: "All Priorities", value: null },
                    { key: "urgent", label: "Urgent", value: "URGENT" },
                    { key: "high", label: "High", value: "HIGH" },
                    { key: "medium", label: "Medium", value: "MEDIUM" },
                    { key: "low", label: "Low", value: "LOW" },
                  ]}
                />
                <SortControl
                  value={sortBy}
                  onChange={(value) =>
                    setSortBy(
                      value as
                        | "priority"
                        | "dueDate"
                        | "newest"
                        | "oldest"
                        | "alpha",
                    )
                  }
                  options={[
                    { key: "newest", label: "Newest" },
                    { key: "oldest", label: "Oldest" },
                    { key: "dueDate", label: "Due Date" },
                    { key: "priority", label: "Priority" },
                    { key: "alpha", label: "A-Z" },
                  ]}
                />
                <Button
                  variant="primary"
                  onClick={() => handleOpenCreateTask()}
                  className={taskClasses.newTaskButton}
                  leftIcon={<Plus size={16} />}
                  disabled={!hasTeams}
                  title={!hasTeams ? "Create a team first" : "New Task"}
                >
                  New Task
                </Button>
              </div>
            </div>
          </div>

          {activeView === "kanban" ? (
            <DragDropContext onDragEnd={handleDragEnd}>
              <div className={taskClasses.kanbanWrapper}>
                <motion.div
                  className={taskClasses.kanbanBoard}
                  variants={itemVariants}
                >
                  {visibleColumns.map((col) => (
                    <div
                      key={col.id}
                      className={taskClasses.columnWrapper(col.collapsed)}
                    >
                      <BoardColumn
                        title={col.title}
                        count={getTasksByStatus(col.id).length}
                        color={col.color}
                        tasks={getTasksByStatus(col.id)}
                        status={col.id}
                        collapsed={col.collapsed}
                        onTaskClick={handleTaskClick}
                        onEditTask={handleEditTask}
                        onDeleteTask={handleDeleteTask}
                        onAddTask={
                          hasTeams
                            ? (status) => handleOpenCreateTask(status)
                            : undefined
                        }
                        onToggle={() => handleToggleColumn(col.id)}
                        onHide={() => handleHideColumn(col.id)}
                        visibleFields={{ project: false, label: false }}
                        cardVariant="simple"
                      />
                    </div>
                  ))}

                  <div className={taskClasses.addSectionWrapper}>
                    <Dropdown
                      align="right"
                      trigger={
                        <Button
                          variant="ghost"
                          className={taskClasses.addSectionButton}
                          leftIcon={<Plus size={16} />}
                          disabled={!hasTeams}
                        >
                          <span>Add section</span>
                        </Button>
                      }
                      items={
                        hiddenColumns.length > 0
                          ? hiddenColumns.map((col) => ({
                              key: col.id,
                              label: (
                                <div className="flex items-center gap-2">
                                  <div
                                    className={taskClasses.columnDot(col.color)}
                                  ></div>
                                  {col.title}
                                </div>
                              ),
                              onClick: () => handleShowColumn(col.id),
                            }))
                          : [
                              {
                                key: "empty",
                                custom: true,
                                label: (
                                  <div className={taskClasses.addSectionEmpty}>
                                    All sections visible
                                  </div>
                                ),
                              },
                            ]
                      }
                    />
                  </div>
                </motion.div>
              </div>
            </DragDropContext>
          ) : (
            <div className={taskClasses.listWrapper}>
              <motion.div
                className={taskClasses.listContainer}
                variants={itemVariants}
              >
                <div className={taskClasses.listHeader}>
                  <div>Task Name</div>
                  <div>Project</div>
                  <div>Assignee</div>
                  <div>Due Date</div>
                  <div>Priority</div>
                  <div>Status</div>
                </div>

                <motion.div
                  className={taskClasses.listBody}
                  variants={listContainerVariants}
                  initial="hidden"
                  animate="show"
                >
                  {getAllSortedTasks().map((task) => {
                    const taskColumn = columns.find(
                      (c) => c.id === task.status,
                    ) || { color: "bg-gray-400", title: task.status };
                    return (
                      <motion.div
                        key={task.id}
                        onClick={() => handleTaskClick(task)}
                        className={taskClasses.listRow}
                        variants={listItemVariants}
                      >
                        <div>
                          <div className={taskClasses.taskName}>
                            {task.title || task.name}
                          </div>
                          {task.description && (
                            <div className={taskClasses.taskDescription}>
                              {task.description}
                            </div>
                          )}
                          <div className={taskClasses.taskStats}>
                            {typeof task.subtasks === "number" &&
                              task.subtasks > 0 && (
                                <div className={taskClasses.taskStat}>
                                  <FileText size={11} />
                                  <span>{task.subtasks}</span>
                                </div>
                              )}
                            {(typeof task.comments === "number"
                              ? task.comments
                              : task.comments?.length || 0) > 0 && (
                              <div className={taskClasses.taskStat}>
                                <MessageSquare size={11} />
                                <span>
                                  {typeof task.comments === "number"
                                    ? task.comments
                                    : task.comments?.length}
                                </span>
                              </div>
                            )}
                            {(typeof task.attachments === "number"
                              ? task.attachments
                              : task.attachments?.length || 0) > 0 && (
                              <div className={taskClasses.taskStat}>
                                <Paperclip size={11} />
                                <span>
                                  {typeof task.attachments === "number"
                                    ? task.attachments
                                    : task.attachments?.length}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className={taskClasses.projectName}>
                          {typeof task.project === "string"
                            ? task.project
                            : task.project?.name || "-"}
                        </div>

                        <div className={taskClasses.assigneesWrapper}>
                          {(task.assignees || []).map((assignee, idx) => (
                            <div
                              key={idx}
                              className={taskClasses.assigneeAvatar}
                              title={assignee.name}
                            >
                              {assignee.avatar ? (
                                <img
                                  src={assignee.avatar}
                                  alt={assignee.name}
                                  className={taskClasses.assigneeImage}
                                />
                              ) : (
                                (assignee.name || "U").charAt(0).toUpperCase()
                              )}
                            </div>
                          ))}
                        </div>

                        <div className={taskClasses.dueDateWrapper}>
                          {task.dueDate ? (
                            <>
                              <Calendar size={12} />
                              <span>
                                {new Date(task.dueDate).toLocaleDateString(
                                  "en-US",
                                  {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                  },
                                )}
                              </span>
                            </>
                          ) : (
                            <span className={taskClasses.dueDateEmpty}>-</span>
                          )}
                        </div>

                        <div>
                          {task.priority && (
                            <Badge
                              variant={
                                task.priority === "URGENT" ||
                                task.priority === "HIGH"
                                  ? "danger"
                                  : task.priority === "MEDIUM"
                                    ? "warning"
                                    : task.priority === "LOW"
                                      ? "success"
                                      : "default"
                              }
                            >
                              {task.priority.charAt(0) +
                                task.priority.slice(1).toLowerCase()}
                            </Badge>
                          )}
                        </div>

                        <div className={taskClasses.statusWrapper}>
                          <div
                            className={taskClasses.statusDot}
                            style={{
                              backgroundColor: taskColumn.color.startsWith(
                                "bg-",
                              )
                                ? undefined
                                : taskColumn.color,
                            }}
                          />
                          <span className={taskClasses.statusText}>
                            {taskColumn.title}
                          </span>
                        </div>
                      </motion.div>
                    );
                  })}
                </motion.div>
              </motion.div>
            </div>
          )}
        </motion.div>
      </main>

      <TaskDetailModal
        isOpen={!!selectedTask}
        onClose={closeTaskDetail}
        task={selectedTask}
        onEdit={handleEditTask}
      />

      <CreateTaskModal
        isOpen={isCreateTaskModalOpen}
        initialStatus={modalInitialStatus}
        onClose={closeCreateTaskModal}
        onCreate={handleCreateTask}
        task={taskToEdit}
        onUpdate={handleUpdateTask}
      />

      <SearchPopup
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        showProjects={false}
      />
    </div>
  );
};

export default Tasks;
