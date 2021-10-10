const allRoles = {
  superAdmin: ['*', 'getUsers', 'manageUsers', 'deleteUsers'],
  admin: ['getUsers', 'manageUsers', 'deleteUsers'],
  user: ['getUsers'],
};

export const roles = Object.keys(allRoles);

export const roleRights = new Map(Object.entries(allRoles));
