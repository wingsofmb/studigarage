export enum UserRoles {
  PUBLIC = 'PUBLIC', // Don't think yet we will need public role because visitors does not create accounts.
  EMPLOYEE = 'EMPLOYEE',
  ADMIN = 'ADMIN',
}

export const UserRoleMapping: { [key in UserRoles]: number } = {
  [UserRoles.PUBLIC]: 1,
  [UserRoles.EMPLOYEE]: 2,
  [UserRoles.ADMIN]: 3,
};
