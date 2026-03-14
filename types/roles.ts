export type UserRole = "student" | "trainer" | "admin";

export interface Permission {
  action: "read" | "write" | "delete" | "manage";
  resource: "lessons" | "users" | "reports" | "system_settings" | "assignments";
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  permissions: Permission[];
  avatarUrl?: string;
}

// Define standard permissions for each role
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  student: [
    { action: "read", resource: "lessons" },
    { action: "read", resource: "reports" }, // Can read own reports
  ],
  trainer: [
    { action: "read", resource: "lessons" },
    { action: "read", resource: "users" }, // Can read assigned students
    { action: "read", resource: "reports" }, // Can read student reports
    { action: "manage", resource: "assignments" }, // Can assign lessons/remedials
  ],
  admin: [
    { action: "manage", resource: "lessons" }, // Can create/edit curriculum
    { action: "manage", resource: "users" }, // Can add/remove users and trainers
    { action: "manage", resource: "reports" }, // Global analytics
    { action: "manage", resource: "system_settings" },
  ],
};

export const MOCK_USERS: Record<UserRole, User> = {
  student: {
    id: "stu-1",
    name: "Alex Student",
    email: "alex@example.com",
    role: "student",
    permissions: ROLE_PERMISSIONS.student,
  },
  trainer: {
    id: "trn-1",
    name: "Sarah Trainer",
    email: "sarah@example.com",
    role: "trainer",
    permissions: ROLE_PERMISSIONS.trainer,
  },
  admin: {
    id: "adm-1",
    name: "Mike Admin",
    email: "mike@example.com",
    role: "admin",
    permissions: ROLE_PERMISSIONS.admin,
  },
};
