// ─── Primitives & IDs ────────────────────────────────────────────────────────

export type UserId    = string
export type TeamId    = string
export type ProjectId = string
export type TaskId    = string
export type CommentId = string
export type FileId    = string
export type SprintId  = string

// ─── Enums ───────────────────────────────────────────────────────────────────

export enum UserRole {
  Owner  = "owner",
  Admin  = "admin",
  Member = "member",
  Guest  = "guest",
}

export enum ProjectStatus {
  Active    = "active",
  Archived  = "archived",
  Completed = "completed",
  OnHold    = "on_hold",
}

export enum ProjectPriority {
  Critical = "critical",
  High     = "high",
  Medium   = "medium",
  Low      = "low",
}

export enum TaskStatus {
  Backlog    = "backlog",
  Todo       = "todo",
  InProgress = "in_progress",
  InReview   = "in_review",
  Done       = "done",
  Cancelled  = "cancelled",
}

export enum NotificationType {
  Mention        = "mention",
  Assignment     = "assignment",
  StatusChange   = "status_change",
  DueDateReminder = "due_date_reminder",
  CommentAdded   = "comment_added",
}

export enum WebhookEvent {
  TaskCreated   = "task.created",
  TaskUpdated   = "task.updated",
  TaskDeleted   = "task.deleted",
  ProjectCreated = "project.created",
  MemberAdded   = "member.added",
}

// ─── Union types ─────────────────────────────────────────────────────────────

export type UserStatus   = "active" | "inactive" | "suspended" | "pending"
export type FileType     = "image" | "document" | "spreadsheet" | "video" | "other"
export type SortOrder    = "asc" | "desc"
export type HttpMethod   = "GET" | "POST" | "PUT" | "PATCH" | "DELETE"
export type ThemeMode    = "light" | "dark" | "system"

// ─── Shared primitives ───────────────────────────────────────────────────────

export interface Timestamps {
  createdAt: string
  updatedAt: string
}

export interface Pagination {
  page:       number
  pageSize:   number
  totalCount: number
  totalPages: number
  hasNext:    boolean
  hasPrev:    boolean
}

export interface Position {
  x: number
  y: number
}

// ─── User & Auth ─────────────────────────────────────────────────────────────

export interface User extends Timestamps {
  id:        UserId
  email:     string
  name:      string
  username:  string
  avatarUrl?: string
  role:      UserRole
  status:    UserStatus
  timezone:  string
  locale:    string
}

export interface UserProfile extends User {
  bio?:         string
  company?:     string
  website?:     string
  phone?:       string
  jobTitle?:    string
  preferences:  UserPreferences
}

export interface UserPreferences {
  theme:              ThemeMode
  emailNotifications: boolean
  pushNotifications:  boolean
  weeklyDigest:       boolean
  language:           string
}

export interface LoginRequest {
  email:    string
  password: string
  remember?: boolean
}

export interface LoginResponse {
  accessToken:  string
  refreshToken: string
  expiresIn:    number
  user:         User
}

export interface AuthToken {
  token:     string
  expiresAt: string
  scope:     string[]
}

export type CreateUserRequest = Pick<User, "email" | "name" | "username" | "role"> & {
  password: string
}

export type UpdateUserRequest = Partial<Pick<UserProfile, "name" | "bio" | "company" | "website" | "phone" | "jobTitle">>

// ─── Team ────────────────────────────────────────────────────────────────────

export interface Team extends Timestamps {
  id:          TeamId
  name:        string
  slug:        string
  description?: string
  avatarUrl?:  string
  memberCount: number
  plan:        "free" | "pro" | "enterprise"
}

export interface TeamMember {
  userId:   UserId
  teamId:   TeamId
  role:     UserRole
  joinedAt: string
  user:     User
}

export interface InviteRequest {
  email:  string
  role:   UserRole
  teamId: TeamId
}

// ─── Project ─────────────────────────────────────────────────────────────────

export interface Project extends Timestamps {
  id:          ProjectId
  name:        string
  description?: string
  status:      ProjectStatus
  priority:    ProjectPriority
  teamId:      TeamId
  ownerId:     UserId
  startDate?:  string
  dueDate?:    string
  color:       string
  isPublic:    boolean
  taskCount:   number
  memberIds:   UserId[]
}

export type ProjectSummary = Pick<Project, "id" | "name" | "status" | "priority" | "color">

export type CreateProjectRequest = Omit<Project, "id" | "createdAt" | "updatedAt" | "taskCount">

// ─── Task ────────────────────────────────────────────────────────────────────

export interface Label {
  id:    string
  name:  string
  color: string
}

export interface Task extends Timestamps {
  id:           TaskId
  title:        string
  description?: string
  status:       TaskStatus
  priority:     ProjectPriority
  projectId:    ProjectId
  assigneeId?:  UserId
  reporterId:   UserId
  sprintId?:    SprintId
  parentId?:    TaskId
  labels:       Label[]
  dueDate?:     string
  estimatedHours?: number
  loggedHours:  number
  order:        number
  attachments:  Attachment[]
}

export type CreateTaskRequest = Pick<Task, "title" | "description" | "status" | "priority" | "projectId" | "assigneeId" | "dueDate" | "labels">

export type UpdateTaskRequest = Partial<Omit<Task, "id" | "createdAt" | "updatedAt" | "reporterId" | "projectId">>

// ─── Sprint ───────────────────────────────────────────────────────────────────

export interface Sprint extends Timestamps {
  id:        SprintId
  name:      string
  projectId: ProjectId
  startDate: string
  endDate:   string
  goal?:     string
  isActive:  boolean
  velocity:  number
}

export interface Milestone extends Timestamps {
  id:          string
  title:       string
  description?: string
  projectId:   ProjectId
  dueDate:     string
  isCompleted: boolean
  taskIds:     TaskId[]
}

// ─── Comment & Reaction ──────────────────────────────────────────────────────

export interface Comment extends Timestamps {
  id:       CommentId
  taskId:   TaskId
  authorId: UserId
  body:     string
  author:   User
  reactions: Reaction[]
  isEdited:  boolean
}

export interface Reaction {
  emoji:   string
  count:   number
  userIds: UserId[]
}

// ─── File & Attachment ────────────────────────────────────────────────────────

export interface Attachment {
  id:         FileId
  name:       string
  url:        string
  size:       number
  type:       FileType
  uploadedBy: UserId
  uploadedAt: string
}

export interface UploadResponse {
  fileId:   FileId
  url:      string
  fileName: string
  size:     number
  mimeType: string
}

// ─── Notification ─────────────────────────────────────────────────────────────

export interface Notification {
  id:        string
  type:      NotificationType
  userId:    UserId
  title:     string
  body:      string
  isRead:    boolean
  createdAt: string
  link?:     string
  meta:      Record<string, string>
}

// ─── Activity & Audit ────────────────────────────────────────────────────────

export interface AuditLog extends Timestamps {
  id:         string
  actorId:    UserId
  action:     string
  resourceId: string
  resourceType: "task" | "project" | "team" | "user"
  diff?:      Record<string, unknown>
  ipAddress:  string
}

// ─── Analytics ───────────────────────────────────────────────────────────────

export interface TaskMetrics {
  total:      number
  byStatus:   Record<string, number>
  byPriority: Record<string, number>
  overdue:    number
  completed:  number
}

export interface Analytics {
  projectId:    ProjectId
  period:       "week" | "month" | "quarter"
  taskMetrics:  TaskMetrics
  velocity:     number
  burndownData: { date: string; remaining: number }[]
}

// ─── API envelope types ───────────────────────────────────────────────────────

export interface ApiError {
  code:    string
  message: string
  details?: ValidationError[]
}

export interface ValidationError {
  field:   string
  message: string
  value?:  string
}

export interface ApiResponse<T = unknown> {
  success: boolean
  data:    T
  error?:  ApiError
  meta?:   Record<string, string>
}

export interface PaginatedResponse<T = unknown> {
  items:      T[]
  pagination: Pagination
}

// ─── Search ──────────────────────────────────────────────────────────────────

export interface SearchResult {
  type:      "task" | "project" | "user" | "comment"
  id:        string
  title:     string
  excerpt?:  string
  url:       string
  score:     number
  highlight: string[]
}

export interface SearchResponse {
  query:   string
  results: SearchResult[]
  total:   number
  took:    number
}

// ─── Webhook & Integration ────────────────────────────────────────────────────

export interface Webhook extends Timestamps {
  id:        string
  teamId:    TeamId
  url:       string
  events:    WebhookEvent[]
  secret:    string
  isActive:  boolean
  lastPingAt?: string
}

export interface Integration extends Timestamps {
  id:        string
  teamId:    TeamId
  provider:  "github" | "gitlab" | "slack" | "jira" | "figma"
  name:      string
  config:    Record<string, string>
  isEnabled: boolean
}
