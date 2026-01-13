export const canEditTask = (
  isTeamMember: boolean,
  _isTaskCreator: boolean,
): boolean => {
  return isTeamMember;
};

export const canDeleteTask = (
  isTeamMember: boolean,
  _isTaskCreator: boolean,
): boolean => {
  return isTeamMember;
};

export const canCreateTask = (isTeamMember: boolean): boolean => {
  return isTeamMember;
};

export const canPerformActions = (isTeamMember: boolean): boolean => {
  return isTeamMember;
};

export const permissions = {
  canEditTask,
  canDeleteTask,
  canCreateTask,
  canPerformActions,
};

export default permissions;
