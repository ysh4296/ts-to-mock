import { type UserId, type TeamId, type ProjectId, type TaskId, type CommentId, type FileId, type SprintId, UserRole, ProjectStatus, ProjectPriority, TaskStatus, NotificationType, WebhookEvent, type UserStatus, type FileType, type SortOrder, type HttpMethod, type ThemeMode, type Timestamps, type Pagination, type Position, type User, type UserProfile, type UserPreferences, type LoginRequest, type LoginResponse, type AuthToken, type CreateUserRequest, type UpdateUserRequest, type Team, type TeamMember, type InviteRequest, type Project, type ProjectSummary, type CreateProjectRequest, type Label, type Task, type CreateTaskRequest, type UpdateTaskRequest, type Sprint, type Milestone, type Comment, type Reaction, type Attachment, type UploadResponse, type Notification, type AuditLog, type TaskMetrics, type Analytics, type ApiError, type ValidationError, type ApiResponse, type PaginatedResponse, type SearchResult, type SearchResponse, type Webhook, type Integration } from "../types/api"

export const mockUserId: UserId = "cum"

export const mockTeamId: TeamId = "ea"

export const mockProjectId: ProjectId = "decimus"

export const mockTaskId: TaskId = "combibo"

export const mockCommentId: CommentId = "conicio"

export const mockFileId: FileId = "alo"

export const mockSprintId: SprintId = "laborum"

export const mockUserRole: UserRole = UserRole.Owner

export const mockProjectStatus: ProjectStatus = ProjectStatus.Active

export const mockProjectPriority: ProjectPriority = ProjectPriority.Critical

export const mockTaskStatus: TaskStatus = TaskStatus.Done

export const mockNotificationType: NotificationType = NotificationType.CommentAdded

export const mockWebhookEvent: WebhookEvent = WebhookEvent.ProjectCreated

export const mockUserStatus: UserStatus = "active"

export const mockFileType: FileType = "other"

export const mockSortOrder: SortOrder = "asc"

export const mockHttpMethod: HttpMethod = "PUT"

export const mockThemeMode: ThemeMode = "system"

export const mockTimestamps: Timestamps = {
  createdAt: "2026-04-21T10:18:52.813Z",
  updatedAt: "2026-04-22T06:26:37.734Z"
}

export const mockPagination: Pagination = {
  page: 41,
  pageSize: 49,
  totalCount: 62,
  totalPages: 89,
  hasNext: true,
  hasPrev: false
}

export const mockPosition: Position = {
  x: 30,
  y: 14
}

export const mockUser: User = {
  createdAt: "2026-04-21T14:08:01.707Z",
  updatedAt: "2026-04-21T20:01:25.819Z",
  id: "9c9e63e9-7cd4-426d-a5cc-c1b35b616498",
  email: "Isidro_Kuphal-Kutch@gmail.com",
  name: "Veronica Murray",
  username: "Donato33",
  role: UserRole.Guest,
  status: "inactive",
  timezone: "Asia/Irkutsk",
  locale: "de-DE"
}

export const mockUserProfile: UserProfile = {
  createdAt: "2026-04-22T05:47:01.927Z",
  updatedAt: "2026-04-21T22:14:40.657Z",
  id: "197de700-ea57-45ce-8d47-7da8bbde24b5",
  email: "Immanuel.Windler@hotmail.com",
  name: "Maria Orn",
  username: "Kade.Boehm",
  avatarUrl: "https://stimulating-loincloth.info",
  role: UserRole.Owner,
  status: "inactive",
  timezone: "Europe/Skopje",
  locale: "ja-JP",
  bio: "Vicissitudo theca cinis uredo ex succurro amo molestias maxime sophismata.",
  website: "https://slimy-shortage.org/",
  preferences: {
    theme: "system",
    emailNotifications: false,
    pushNotifications: false,
    weeklyDigest: false,
    language: "en"
  }
}

export const mockUserPreferences: UserPreferences = {
  theme: "light",
  emailNotifications: false,
  pushNotifications: false,
  weeklyDigest: true,
  language: "en"
}

export const mockLoginRequest: LoginRequest = {
  email: "Kolby_Sauer@gmail.com",
  password: "Em9WBl2MihS1cRg",
  remember: false
}

export const mockLoginResponse: LoginResponse = {
  accessToken: "bRRjXIkfMM6TOoYqmTT4Gb5O53192wlYAbyI3na4",
  refreshToken: "2pvMnGA72x3FA0P7vO40kesCIp3BeiQcY9EMIr8J",
  expiresIn: 14,
  user: {
    createdAt: "2026-04-21T16:47:34.845Z",
    updatedAt: "2026-04-22T08:06:02.344Z",
    id: "50ac389d-bedb-4da8-8200-156e87d21b2a",
    email: "Cyril94@gmail.com",
    name: "Mary Pfeffer",
    username: "Jamal_McLaughlin33",
    avatarUrl: "https://valid-margin.net/",
    role: UserRole.Member,
    status: "inactive",
    timezone: "Europe/Mariehamn",
    locale: "de-DE"
  }
}

export const mockAuthToken: AuthToken = {
  token: "Doy8DaKi6yCUbsFaT8WdFMi7BG9yLoUYksJwSUAe",
  expiresAt: "2026-04-22T04:21:58.655Z",
  scope: [
    "censura",
    "decens",
    "thermae"
  ]
}

export const mockCreateUserRequest: CreateUserRequest = {
  email: "Jadon_Keeling@yahoo.com",
  name: "Terri Pfannerstill",
  username: "Frankie91",
  role: UserRole.Owner,
  password: "fncDvRXXmoTpsv6"
}

export const mockUpdateUserRequest: UpdateUserRequest = {
  name: "Mitchell Stokes",
  company: "Strosin, Hudson and Roberts",
  website: "https://adolescent-construction.info",
  phone: "1-344-441-3550 x1157"
}

export const mockTeam: Team = {
  createdAt: "2026-04-21T23:27:46.184Z",
  updatedAt: "2026-04-21T13:54:33.194Z",
  id: "ef1b6d38-2774-46a9-8d31-8701057e9816",
  name: "Michele Lueilwitz",
  slug: "amissio-verbera",
  description: "Acsi correptius cariosus illum amplitudo appositus claro voveo arcus una.",
  avatarUrl: "https://queasy-sensitivity.com",
  memberCount: 66,
  plan: "enterprise"
}

export const mockTeamMember: TeamMember = {
  userId: "27f0dd34-a864-4160-b621-45c1f39c660c",
  teamId: "b0baba8f-f90b-4865-b521-c42a929d5721",
  role: UserRole.Admin,
  joinedAt: "2026-04-22T07:03:17.784Z",
  user: {
    createdAt: "2026-04-21T18:52:42.244Z",
    updatedAt: "2026-04-22T01:13:30.157Z",
    id: "e51467d2-87d9-4f52-a33e-9be2434aa655",
    email: "Kameron_Bernhard@gmail.com",
    name: "Arthur Keeling",
    username: "Waylon_Kemmer",
    avatarUrl: "https://buoyant-lemonade.com/",
    role: UserRole.Guest,
    status: "suspended",
    timezone: "Atlantic/Cape_Verde",
    locale: "de-DE"
  }
}

export const mockInviteRequest: InviteRequest = {
  email: "Dayton.Boyer@yahoo.com",
  role: UserRole.Admin,
  teamId: "778dc963-b71b-447f-885a-759430593373"
}

export const mockProject: Project = {
  createdAt: "2026-04-21T14:59:02.251Z",
  updatedAt: "2026-04-21T18:04:27.938Z",
  id: "4fbf3783-69fe-4f38-a7c5-da0ca95140c9",
  name: "Angel Moen",
  description: "Numquam subiungo necessitatibus nobis sit.",
  status: ProjectStatus.Archived,
  priority: ProjectPriority.Critical,
  teamId: "8f5bbff1-1762-48f1-9e32-e01f2bc0f6c4",
  ownerId: "907907c9-a950-49b5-88f0-ffd6d7c9cc2f",
  startDate: "2026-04-21T15:12:43.934Z",
  color: "lime",
  isPublic: true,
  taskCount: 71,
  memberIds: [
    "accusamus",
    "trans"
  ]
}

export const mockProjectSummary: ProjectSummary = {
  id: "c1bc0e98-0381-4938-9b17-8ed5d751396d",
  name: "Sandy Beer",
  status: ProjectStatus.OnHold,
  priority: ProjectPriority.Low,
  color: "salmon"
}

export const mockCreateProjectRequest: CreateProjectRequest = {
  name: "Keith Jacobson III",
  description: "Adicio vestrum corona dapifer creo sulum neque.",
  status: ProjectStatus.Archived,
  priority: ProjectPriority.Critical,
  teamId: "f831c077-ddfb-469a-afe0-7806e2fc820b",
  ownerId: "ca91e7b8-8f00-4f7f-bdb7-05717fe6e70e",
  dueDate: "2026-04-21T17:05:16.053Z",
  color: "teal",
  isPublic: true,
  memberIds: [
    "ambitus"
  ]
}

export const mockLabel: Label = {
  id: "2ebc55ac-8bde-443e-8424-2ee5ffe28e16",
  name: "Wilma Wintheiser",
  color: "plum"
}

export const mockTask: Task = {
  createdAt: "2026-04-21T23:54:48.220Z",
  updatedAt: "2026-04-22T04:23:22.705Z",
  id: "4b5a08d9-cdac-45a5-b11f-0c6dca64acdc",
  title: "crepusculum mollitia certus",
  description: "Impedit averto delinquo tergiversatio.",
  status: TaskStatus.Backlog,
  priority: ProjectPriority.Low,
  projectId: "b0190549-0513-4a88-af50-0c376be39364",
  reporterId: "a264836b-67a0-4586-8208-f5383d4c2d35",
  sprintId: "1f7bc511-8a53-45dc-8985-bc0cf6b7fd6e",
  parentId: "b7118694-1625-49d5-8b11-0775a4778376",
  labels: [
    {
      id: "bc71d7f9-dfe5-4286-a6c0-8fda98cde37a",
      name: "Courtney Keebler",
      color: "plum"
    },
    {
      id: "bce8c9da-f155-4229-88cf-e0b71090ac06",
      name: "Darrel Gulgowski",
      color: "silver"
    }
  ],
  estimatedHours: 9,
  loggedHours: 37,
  order: 100,
  attachments: [
    {
      id: "9c1c579e-138e-4a71-9270-29ed40a4b1f1",
      name: "Amos Wintheiser",
      url: "https://well-groomed-affidavit.net/",
      size: 90,
      type: "other",
      uploadedBy: "desparatus",
      uploadedAt: "2026-04-21T18:28:00.425Z"
    },
    {
      id: "aedfa713-76c8-4934-bfca-510ac3b293a6",
      name: "Marjorie Mosciski",
      url: "https://popular-premium.net",
      size: 39,
      type: "other",
      uploadedBy: "sopor",
      uploadedAt: "2026-04-21T14:07:00.718Z"
    },
    {
      id: "2dbea83d-9145-4e67-b328-0cd16f2e92ba",
      name: "Dr. Shannon Reichert I",
      url: "https://naughty-memo.biz",
      size: 21,
      type: "video",
      uploadedBy: "celo",
      uploadedAt: "2026-04-21T11:46:07.239Z"
    }
  ]
}

export const mockCreateTaskRequest: CreateTaskRequest = {
  title: "arca exercitationem aureus",
  description: "Tenax voluptatem terror.",
  status: TaskStatus.Backlog,
  priority: ProjectPriority.Low,
  projectId: "b9cec74f-07ef-41be-be08-06c3219d8dab",
  assigneeId: "d780e03b-64a6-4b03-a841-29989c15ac11",
  dueDate: "2026-04-22T02:01:04.154Z",
  labels: [
    {
      id: "32ccb45d-7bfa-42ac-8792-1e8c0c189f0d",
      name: "Leon O'Reilly",
      color: "lime"
    },
    {
      id: "9f494fbb-d83c-49a1-8caf-64a81f9d56c4",
      name: "Margie Wunsch",
      color: "salmon"
    }
  ]
}

export const mockUpdateTaskRequest: UpdateTaskRequest = {
  title: "adicio cruciamentum tricesimus",
  description: "Virga comminor abscido asperiores cupressus vesper cibo tribuo derelinquo.",
  status: TaskStatus.Todo,
  priority: ProjectPriority.Critical,
  assigneeId: "b21ce9f1-f7dd-47b4-aa78-13ffaf033093",
  sprintId: "ac0268f6-331d-4f5f-b14f-b9b957a60180",
  labels: [
    {
      id: "54fcf05d-c245-4e4c-8989-e61d62bbdffc",
      name: "Wilbur Denesik",
      color: "fuchsia"
    },
    {
      id: "7f9bc66c-f49a-446b-86a3-0e98a71732f5",
      name: "Ryan Welch",
      color: "blue"
    }
  ],
  dueDate: "2026-04-22T09:23:17.749Z",
  loggedHours: 87,
  order: 75,
  attachments: [
    {
      id: "2da65da6-28b0-4b43-9ca5-8eb9152f04c9",
      name: "Miss Marguerite Dooley",
      url: "https://frequent-gel.biz/",
      size: 27,
      type: "spreadsheet",
      uploadedBy: "acer",
      uploadedAt: "2026-04-22T08:18:51.786Z"
    },
    {
      id: "be09810f-4a05-4e3b-8f93-541a3614ebe9",
      name: "Francis Gleichner",
      url: "https://somber-lyrics.com/",
      size: 59,
      type: "document",
      uploadedBy: "thema",
      uploadedAt: "2026-04-21T10:57:13.872Z"
    }
  ]
}

export const mockSprint: Sprint = {
  createdAt: "2026-04-22T06:31:18.447Z",
  updatedAt: "2026-04-22T09:41:15.675Z",
  id: "d5191857-2c6b-4089-81cc-408aac30715a",
  name: "Raquel Watsica",
  projectId: "9596210b-3a8c-47ee-ae1a-e868a8d90d04",
  startDate: "2026-04-21T14:41:16.441Z",
  endDate: "2026-04-22T01:02:20.046Z",
  goal: "perspiciatis",
  isActive: false,
  velocity: 45
}

export const mockMilestone: Milestone = {
  createdAt: "2026-04-21T15:45:27.342Z",
  updatedAt: "2026-04-22T06:06:02.349Z",
  id: "86d6fd5e-5e7f-416e-b228-ad198e5dab20",
  title: "constans bene candidus",
  description: "Summisse ara vulgus certe attonbitus arca armarium synagoga ventus ancilla.",
  projectId: "2689cc5b-424e-47c2-a386-932bb4c5c599",
  dueDate: "2026-04-21T19:56:59.805Z",
  isCompleted: true,
  taskIds: [
    "voro",
    "tremo"
  ]
}

export const mockComment: Comment = {
  createdAt: "2026-04-22T07:20:52.685Z",
  updatedAt: "2026-04-21T18:49:11.870Z",
  id: "f6d8b2d0-3df6-4d48-9faa-69bb5242af9f",
  taskId: "9b2f71f0-2436-4c0c-a7d5-d3d7e6230a30",
  authorId: "35ecf02e-334a-4678-8b1c-e2df195e34cb",
  body: "Numquam tonsor desolo consectetur articulus. Demens arma causa blanditiis. Crebro desipio cognomen super sit dicta.",
  author: {
    createdAt: "2026-04-21T13:33:59.928Z",
    updatedAt: "2026-04-21T14:49:04.594Z",
    id: "0a605ac5-3d64-4cee-a0f3-9db6233184fe",
    email: "Tierra_Grimes43@hotmail.com",
    name: "Evelyn Kemmer DVM",
    username: "Felix.Schuppe66",
    avatarUrl: "https://french-jellybeans.name/",
    role: UserRole.Member,
    status: "active",
    timezone: "America/Punta_Arenas",
    locale: "fr-FR"
  },
  reactions: [
    {
      emoji: "🌇",
      count: 65,
      userIds: [
        "tabgo",
        "voluptatum",
        "adeptio",
        "dicta"
      ]
    },
    {
      emoji: "🛑",
      count: 4,
      userIds: [
        "victus",
        "eos",
        "desino",
        "brevis"
      ]
    },
    {
      emoji: "◼️",
      count: 80,
      userIds: [
        "timor",
        "autus"
      ]
    },
    {
      emoji: "⚾",
      count: 75,
      userIds: [
        "vado",
        "cupressus"
      ]
    }
  ],
  isEdited: false
}

export const mockReaction: Reaction = {
  emoji: "⚡",
  count: 41,
  userIds: [
    "denique",
    "comminor",
    "hic"
  ]
}

export const mockAttachment: Attachment = {
  id: "11672bae-efc5-443e-8c2b-c93a5f827505",
  name: "Micheal Cummings",
  url: "https://free-dial.com/",
  size: 15,
  type: "image",
  uploadedBy: "tempus",
  uploadedAt: "2026-04-21T22:20:15.909Z"
}

export const mockUploadResponse: UploadResponse = {
  fileId: "0f710504-a414-4ec1-9af6-1750a255567b",
  url: "https://official-boat.biz",
  fileName: "denego",
  size: 58,
  mimeType: "image/svg+xml"
}

export const mockNotification: Notification = {
  id: "47f3d4b5-466a-4f43-86b6-5a1e5c04a939",
  type: NotificationType.Mention,
  userId: "5c3c8dce-fc6d-4fa8-9c12-8fe050b5bb28",
  title: "tabernus casso viduo",
  body: "Defungo ab addo confugo absorbeo desidero coruscus vulnero. Verus temporibus cohaero. Strues explicabo tremo abscido magni nemo aeneus usque teres varietas.",
  isRead: false,
  createdAt: "2026-04-22T07:13:33.189Z",
  meta: {}
}

export const mockAuditLog: AuditLog = {
  createdAt: "2026-04-21T11:40:34.067Z",
  updatedAt: "2026-04-22T03:13:34.531Z",
  id: "800fc533-1bb8-4e9c-8ff5-a718e9dddd1a",
  actorId: "beb19ab5-e233-4fe4-b811-a17242a50283",
  action: "stipes",
  resourceId: "3b2d0006-926e-40df-8e3c-7d9cd7d4ff90",
  resourceType: "task",
  diff: {},
  ipAddress: "e41c:a05d:ede1:1868:ead3:27fe:cae8:ce2f"
}

export const mockTaskMetrics: TaskMetrics = {
  total: 40,
  byStatus: {},
  byPriority: {},
  overdue: 80,
  completed: 8
}

export const mockAnalytics: Analytics = {
  projectId: "a2c8314f-871c-4f48-a4b9-cc2f4a11f160",
  period: "week",
  taskMetrics: {
    total: 77,
    byStatus: {},
    byPriority: {},
    overdue: 69,
    completed: 3
  },
  velocity: 44,
  burndownData: [
    {
      date: "angelus",
      remaining: 52
    }
  ]
}

export const mockApiError: ApiError = {
  code: "catena",
  message: "denuo",
  details: [
    {
      field: "corrumpo",
      message: "pariatur"
    },
    {
      field: "avaritia",
      message: "bardus",
      value: "caterva"
    },
    {
      field: "statim",
      message: "claro",
      value: "error"
    }
  ]
}

export const mockValidationError: ValidationError = {
  field: "tum",
  message: "quibusdam",
  value: "verbum"
}

export const mockApiResponse: ApiResponse = {
  success: false,
  data: null,
  error: {
    code: "artificiose",
    message: "deinde",
    details: [
      {
        field: "bene",
        message: "ratione"
      },
      {
        field: "utor",
        message: "tracto",
        value: "truculenter"
      },
      {
        field: "absens",
        message: "utroque",
        value: "adopto"
      }
    ]
  },
  meta: {}
}

export const mockPaginatedResponse: PaginatedResponse = {
  items: [
    null
  ],
  pagination: {
    page: 13,
    pageSize: 43,
    totalCount: 92,
    totalPages: 11,
    hasNext: false,
    hasPrev: true
  }
}

export const mockSearchResult: SearchResult = {
  type: "comment",
  id: "e5f4575e-e685-44c5-b853-5517af56c49c",
  title: "celebrer amiculum sapiente",
  excerpt: "Vestrum cupiditas cubo dens ipsum dedecor.",
  url: "https://apprehensive-tattler.org",
  score: 42,
  highlight: [
    "utilis",
    "pectus",
    "decimus"
  ]
}

export const mockSearchResponse: SearchResponse = {
  query: "utilis theatrum",
  results: [
    {
      type: "user",
      id: "7a152cf9-7fcc-49ca-8742-1a50c362406d",
      title: "paens sumptus acceptus",
      url: "https://embellished-health-care.org/",
      score: 20,
      highlight: [
        "colo",
        "talus"
      ]
    }
  ],
  total: 7,
  took: 15
}

export const mockWebhook: Webhook = {
  createdAt: "2026-04-21T11:20:56.925Z",
  updatedAt: "2026-04-21T16:33:41.827Z",
  id: "087cbc0b-f462-4d1f-a183-046d40caad6a",
  teamId: "28cc26e6-8cb6-4024-8b39-68a2327293eb",
  url: "https://excitable-horizon.org/",
  events: [
    WebhookEvent.TaskDeleted,
    WebhookEvent.TaskUpdated
  ],
  secret: "B2DKDt4dolXLFU14G2ga42HLs8oVIwQA",
  isActive: false,
  lastPingAt: "2026-04-22T01:33:54.922Z"
}

export const mockIntegration: Integration = {
  createdAt: "2026-04-22T08:22:51.166Z",
  updatedAt: "2026-04-22T07:25:53.576Z",
  id: "2ba18f9c-764d-4f74-9b08-dad45cfcd6b4",
  teamId: "c9e6d5b1-9ae6-4aa2-9210-e785d182ce57",
  provider: "slack",
  name: "Lillian Fisher DDS",
  config: {},
  isEnabled: true
}