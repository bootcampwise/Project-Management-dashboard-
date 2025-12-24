import React from 'react';
import Sidebar from '../sidebar/Sidebar';
import { Badge, Button, Dropdown } from '../../components/ui';
import { Menu, Search, Filter, ArrowUpDown, Plus, Calendar, MessageSquare, Paperclip, FileText, Layout, List } from 'lucide-react';
import TaskDetailModal from '../../components/task/TaskDetailModal';
import CreateTaskModal from '../../components/task/CreateTaskModal';
import BoardColumn from '../../components/projectBoard/BoardColumn';
import { useTasksPage } from './hooks/useTasksPage';
import { DragDropContext } from '@hello-pangea/dnd';
import { taskClasses } from './taskStyle';

const Tasks: React.FC = () => {
  const {
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
    handleUpdateTask,
    closeTaskDetail,
    closeCreateTaskModal,
    handleToggleColumn,
    handleHideColumn,
    handleShowColumn,
    handleDragEnd,
    getTasksByStatus,
  } = useTasksPage();

  return (
    <div className={taskClasses.container}>

      <Button
        variant="ghost"
        className={taskClasses.menuButton(sidebarOpen)}
        onClick={() => setSidebarOpen(true)}
      >
        <Menu size={22} />
      </Button>

      {/* Sidebar */}
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main content */}
      <main className={taskClasses.main(activeView)}>
        <div className={taskClasses.mainContent(sidebarOpen)}>
          {/* Header */}
          <div className={taskClasses.headerWrapper}>
            <h1 className={taskClasses.headerTitle}>Tasks</h1>

            {/* Toolbar */}
            <div className={taskClasses.toolbar}>
              {/* Left: View Tabs */}
              <div className={taskClasses.viewTabsWrapper}>
                <Button
                  variant="ghost"
                  onClick={() => setActiveView('kanban')}
                  className={taskClasses.viewTab(activeView === 'kanban')}
                >
                  <Layout size={16} />
                  Kanban
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => setActiveView('list')}
                  className={taskClasses.viewTab(activeView === 'list')}
                >
                  <List size={16} />
                  List
                </Button>
              </div>

              {/* Right: Actions */}
              <div className={taskClasses.actionsWrapper}>
                <div className={taskClasses.searchButton}>
                  <Search size={16} className={taskClasses.searchIcon} />
                  <span className={taskClasses.searchText}>Search</span>
                </div>
                <Button
                  variant="secondary"
                  className={taskClasses.filterButton}
                  leftIcon={<Filter size={16} />}
                >
                  Filters
                </Button>
                <Button
                  variant="secondary"
                  className={taskClasses.filterButton}
                  leftIcon={<ArrowUpDown size={16} />}
                >
                  Sort by
                </Button>
                <Button
                  variant="primary"
                  onClick={() => handleOpenCreateTask()}
                  className={taskClasses.newTaskButton}
                  leftIcon={<Plus size={16} />}
                >
                  New Task
                </Button>
              </div>
            </div>
          </div>

          {/* Kanban Board */}
          {activeView === 'kanban' ? (
            <DragDropContext onDragEnd={handleDragEnd}>
              <div className={taskClasses.kanbanWrapper}>
                <div className={taskClasses.kanbanBoard}>
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
                        onAddTask={(status) => handleOpenCreateTask(status)}
                        onToggle={() => handleToggleColumn(col.id)}
                        onHide={() => handleHideColumn(col.id)}
                      />
                    </div>
                  ))}

                  {/* Add Section Button & Dropdown */}
                  <div className={taskClasses.addSectionWrapper}>
                    <Dropdown
                      align="right"
                      trigger={
                        <Button
                          variant="ghost"
                          className={taskClasses.addSectionButton}
                          leftIcon={<Plus size={16} />}
                        >
                          <span>Add section</span>
                        </Button>
                      }
                      items={
                        hiddenColumns.length > 0
                          ? hiddenColumns.map(col => ({
                            key: col.id,
                            label: (
                              <div className="flex items-center gap-2">
                                <div className={taskClasses.columnDot(col.color)}></div>
                                {col.title}
                              </div>
                            ),
                            onClick: () => handleShowColumn(col.id),
                          }))
                          : [
                            {
                              key: 'empty',
                              custom: true,
                              label: (
                                <div className={taskClasses.addSectionEmpty}>
                                  All sections visible
                                </div>
                              )
                            }
                          ]
                      }
                    />
                  </div>
                </div>
              </div>
            </DragDropContext>
          ) : (
            /* List View */
            <div className={taskClasses.listWrapper}>
              <div className={taskClasses.listContainer}>
                {/* Table Header */}
                <div className={taskClasses.listHeader}>
                  <div>Task Name</div>
                  <div>Project</div>
                  <div>Assignee</div>
                  <div>Due Date</div>
                  <div>Priority</div>
                  <div>Status</div>
                </div>

                {/* Table Rows */}
                <div className={taskClasses.listBody}>
                  {columns.flatMap((column) =>
                    getTasksByStatus(column.id).map((task) => (
                      <div
                        key={task.id}
                        onClick={() => handleTaskClick(task)}
                        className={taskClasses.listRow}
                      >
                        {/* Task Name */}
                        <div>
                          <div className={taskClasses.taskName}>{task.title || task.name}</div>
                          {task.description && (
                            <div className={taskClasses.taskDescription}>{task.description}</div>
                          )}
                          {/* Stats */}
                          <div className={taskClasses.taskStats}>
                            {typeof task.subtasks === 'number' && task.subtasks > 0 && (
                              <div className={taskClasses.taskStat}>
                                <FileText size={11} />
                                <span>{task.subtasks}</span>
                              </div>
                            )}
                            {(typeof task.comments === 'number' ? task.comments : task.comments?.length || 0) > 0 && (
                              <div className={taskClasses.taskStat}>
                                <MessageSquare size={11} />
                                <span>{typeof task.comments === 'number' ? task.comments : task.comments?.length}</span>
                              </div>
                            )}
                            {(typeof task.attachments === 'number' ? task.attachments : task.attachments?.length || 0) > 0 && (
                              <div className={taskClasses.taskStat}>
                                <Paperclip size={11} />
                                <span>{typeof task.attachments === 'number' ? task.attachments : task.attachments?.length}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Project */}
                        <div className={taskClasses.projectName}>
                          {typeof task.project === 'string' ? task.project : task.project?.name || '-'}
                        </div>

                        {/* Assignee */}
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
                                (assignee.name || 'U').charAt(0).toUpperCase()
                              )}
                            </div>
                          ))}
                        </div>

                        {/* Due Date */}
                        <div className={taskClasses.dueDateWrapper}>
                          {task.dueDate ? (
                            <>
                              <Calendar size={12} />
                              <span>
                                {new Date(task.dueDate).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric'
                                })}
                              </span>
                            </>
                          ) : (
                            <span className={taskClasses.dueDateEmpty}>-</span>
                          )}
                        </div>

                        {/* Priority */}
                        <div>
                          {task.priority && (
                            <Badge variant={
                              task.priority === "URGENT" || task.priority === "HIGH" ? "danger" :
                                task.priority === "MEDIUM" ? "warning" :
                                  task.priority === "LOW" ? "success" : "default"
                            }>
                              {task.priority.charAt(0) + task.priority.slice(1).toLowerCase()}
                            </Badge>
                          )}
                        </div>

                        {/* Status */}
                        <div className={taskClasses.statusWrapper}>
                          <div
                            className={taskClasses.statusDot}
                            style={{ backgroundColor: column.color }}
                          />
                          <span className={taskClasses.statusText}>{column.title}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Task Detail Modal */}
      <TaskDetailModal
        isOpen={!!selectedTask}
        onClose={closeTaskDetail}
        task={selectedTask}
        onEdit={handleEditTask}
      />

      {/* Create Task Modal */}
      <CreateTaskModal
        isOpen={isCreateTaskModalOpen}
        initialStatus={modalInitialStatus}
        onClose={closeCreateTaskModal}
        onCreate={handleCreateTask}
        task={taskToEdit}
        onUpdate={handleUpdateTask}
      />
    </div>
  );
};

export default Tasks;
