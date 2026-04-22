import { type UserId, type TeamId, type ProjectId, type TaskId, type CommentId, type FileId, type SprintId, UserRole, ProjectStatus, ProjectPriority, TaskStatus, NotificationType, WebhookEvent, type UserStatus, type FileType, type SortOrder, type HttpMethod, type ThemeMode, type Timestamps, type Pagination, type Position, type User, type UserProfile, type UserPreferences, type LoginRequest, type LoginResponse, type AuthToken, type CreateUserRequest, type UpdateUserRequest, type Team, type TeamMember, type InviteRequest, type Project, type ProjectSummary, type CreateProjectRequest, type Label, type Task, type CreateTaskRequest, type UpdateTaskRequest, type Sprint, type Milestone, type Comment, type Reaction, type Attachment, type UploadResponse, type Notification, type AuditLog, type TaskMetrics, type Analytics, type ApiError, type ValidationError, type ApiResponse, type PaginatedResponse, type SearchResult, type SearchResponse, type Webhook, type Integration } from "../types/api"

export const mockUserId: UserId = "argumentum"

export const mockTeamId: TeamId = "cedo"

export const mockProjectId: ProjectId = "demoror"

export const mockTaskId: TaskId = "ut"

export const mockCommentId: CommentId = "vobis"

export const mockFileId: FileId = "tener"

export const mockSprintId: SprintId = "vesica"

export const mockUserRole: UserRole = UserRole.Admin

export const mockProjectStatus: ProjectStatus = ProjectStatus.Completed

export const mockProjectPriority: ProjectPriority = ProjectPriority.Critical

export const mockTaskStatus: TaskStatus = TaskStatus.InProgress

export const mockNotificationType: NotificationType = NotificationType.DueDateReminder

export const mockWebhookEvent: WebhookEvent = WebhookEvent.MemberAdded

export const mockUserStatus: UserStatus = "active"

export const mockFileType: FileType = "image"

export const mockSortOrder: SortOrder = "desc"

export const mockHttpMethod: HttpMethod = "GET"

export const mockThemeMode: ThemeMode = "system"

export const mockTimestamps: Timestamps = {
  createdAt: "2026-04-21T08:43:37.030Z",
  updatedAt: "2026-04-21T10:17:21.943Z"
}

export const mockPagination: Pagination = {
  page: 77,
  pageSize: 97,
  totalCount: 26,
  totalPages: 85,
  hasNext: true,
  hasPrev: true
}

export const mockPosition: Position = {
  x: 36,
  y: 18
}

export const mockUser: User = {
  createdAt: "2026-04-21T22:58:12.550Z",
  updatedAt: "2026-04-22T00:19:41.881Z",
  id: "7a083705-0c48-45f4-acae-a73ac43d92f0",
  email: "Gerhard_Donnelly73@yahoo.com",
  name: "Billy King",
  username: "Sonny30",
  avatarUrl: "https://puzzling-bunkhouse.org",
  role: UserRole.Guest,
  status: "suspended",
  timezone: "America/Blanc-Sablon",
  locale: "ko-KR"
}

export const mockUserProfile: UserProfile = {
  createdAt: "2026-04-21T19:06:26.421Z",
  updatedAt: "2026-04-21T13:13:23.577Z",
  id: "81fa1606-bd62-48f6-8bca-8baf3b1b7ef6",
  email: "Alize.Wisozk73@hotmail.com",
  name: "Caleb Bernier",
  username: "Armand_Medhurst6",
  avatarUrl: "https://dry-borrowing.org",
  role: UserRole.Owner,
  status: "suspended",
  timezone: "Asia/Ulaanbaatar",
  locale: "fr-FR",
  company: "Hills, Weimann and Streich",
  website: "https://proud-tuba.org",
  preferences: {
    theme: "dark",
    emailNotifications: true,
    pushNotifications: true,
    weeklyDigest: false,
    language: "ja"
  }
}

export const mockUserPreferences: UserPreferences = {
  theme: "dark",
  emailNotifications: true,
  pushNotifications: true,
  weeklyDigest: true,
  language: "ja"
}

export const mockLoginRequest: LoginRequest = {
  email: "Lelah.Ward@hotmail.com",
  password: "3Yc6wRF2ABhgGo5"
}

export const mockLoginResponse: LoginResponse = {
  accessToken: "TISvQ0SsgxPfSRRmm8OWZ7dy7BiVnDqKllQd9r7F",
  refreshToken: "lXpJvfCDfefdQ55xn7rnIOmbF5vpvUHW7bmyh3Hl",
  expiresIn: 53,
  user: {
    createdAt: "2026-04-22T02:20:50.065Z",
    updatedAt: "2026-04-21T08:28:17.711Z",
    id: "1763b8b1-de4a-47cf-a491-4d74c5ec1b56",
    email: "Emie10@hotmail.com",
    name: "Duane Runolfsdottir I",
    username: "Antonia.Mueller36",
    role: UserRole.Member,
    status: "pending",
    timezone: "Europe/Monaco",
    locale: "ja-JP"
  }
}

export const mockAuthToken: AuthToken = {
  token: "dIBpIsf1AkJmPTkzgh4Pp2rjEq595M98tQ8I9lBC",
  expiresAt: "2026-04-21T16:30:33.111Z",
  scope: [
    "provident",
    "appono",
    "civis"
  ]
}

export const mockCreateUserRequest: CreateUserRequest = {
  email: "Wilfredo.Daugherty@yahoo.com",
  name: "Chelsea Sporer",
  username: "Caesar28",
  role: UserRole.Owner,
  password: "2Cu23HjPGd1pXHi"
}

export const mockUpdateUserRequest: UpdateUserRequest = {
  name: "Paula Wiegand",
  company: "Parker and Sons",
  website: "https://darling-thermostat.info/",
  phone: "(697) 570-5188 x1217",
  jobTitle: "Investor Integration Developer"
}

export const mockTeam: Team = {
  createdAt: "2026-04-21T18:06:07.548Z",
  updatedAt: "2026-04-22T05:11:24.826Z",
  id: "cfc0fd18-1f40-42e7-b106-f13fffdd078b",
  name: "Gregg Smith-Mertz IV",
  slug: "laborum-admoveo",
  description: "Dignissimos crepusculum accedo paulatim terga ulterius absorbeo temptatio vero.",
  avatarUrl: "https://blushing-playground.name",
  memberCount: 97,
  plan: "enterprise"
}

export const mockTeamMember: TeamMember = {
  userId: "e03e7ed6-258a-4336-82a6-05e76f8747c3",
  teamId: "8d46bc61-4292-4d88-b141-aafa35f88640",
  role: UserRole.Guest,
  joinedAt: "2026-04-21T12:35:53.315Z",
  user: {
    createdAt: "2026-04-21T19:16:12.199Z",
    updatedAt: "2026-04-22T02:04:03.230Z",
    id: "286e173c-2cc6-42e0-80b1-44e6e6506f8b",
    email: "Roosevelt44@yahoo.com",
    name: "Saul Runolfsdottir",
    username: "Lilliana_Runolfsdottir",
    role: UserRole.Member,
    status: "pending",
    timezone: "America/Montevideo",
    locale: "ja-JP"
  }
}

export const mockInviteRequest: InviteRequest = {
  email: "Lia_Stark99@yahoo.com",
  role: UserRole.Admin,
  teamId: "b96d0980-f95a-480b-b1e8-3059b0c17bc8"
}

export const mockProject: Project = {
  createdAt: "2026-04-22T03:32:34.715Z",
  updatedAt: "2026-04-21T23:25:37.478Z",
  id: "92c99ca4-e124-4acc-8a52-8b830a23225a",
  name: "Charlene Toy",
  status: ProjectStatus.Active,
  priority: ProjectPriority.Critical,
  teamId: "3a251705-ec90-4e91-831f-8942a26671ce",
  ownerId: "d51858f4-58de-4951-b6b7-793e9df5a131",
  dueDate: "2026-04-22T05:23:41.092Z",
  color: "turquoise",
  isPublic: true,
  taskCount: 27,
  memberIds: [
    "vorago",
    "surgo",
    "aurum"
  ]
}

export const mockProjectSummary: ProjectSummary = {
  id: "fa103192-cd0d-450c-8938-c0ca033a78ef",
  name: "Austin Goodwin",
  status: ProjectStatus.Archived,
  priority: ProjectPriority.Medium,
  color: "silver"
}

export const mockCreateProjectRequest: CreateProjectRequest = {
  name: "Franklin Waters",
  status: ProjectStatus.OnHold,
  priority: ProjectPriority.Critical,
  teamId: "d7158426-c23c-44a4-a542-9a27f5a34bdf",
  ownerId: "b4162653-b860-4849-b27b-1b67a27f53cf",
  color: "silver",
  isPublic: false,
  memberIds: [
    "stipes"
  ]
}

export const mockLabel: Label = {
  id: "227f3744-fab1-4cc8-af35-c548b6c9ddd5",
  name: "Henry Witting",
  color: "lime"
}

export const mockTask: Task = {
  createdAt: "2026-04-21T19:51:26.656Z",
  updatedAt: "2026-04-22T05:07:44.092Z",
  id: "a53c43e3-609a-4355-8c6f-0e977b9cb78c",
  title: "commodi iure tribuo",
  description: "Tui trans architecto tempora conturbo urbs.",
  status: TaskStatus.Backlog,
  priority: ProjectPriority.Critical,
  projectId: "7d6be616-8a8e-40b4-9ad4-c42ec397946c",
  assigneeId: "c0c98987-c384-41f2-b8b3-d26b94400924",
  reporterId: "37711176-5624-4781-a3ff-3b2380aa2571",
  sprintId: "5f93bbdb-6400-4546-91a8-c39c18783713",
  parentId: "8f865e69-2e68-4b6c-8f5c-d97dae742eb5",
  labels: [
    {
      id: "3b5d4ce4-a1ca-492e-9436-45944cb5f017",
      name: "Cynthia Bednar",
      color: "lime"
    },
    {
      id: "b89648e3-fea2-4846-bc12-5b6c55bea89e",
      name: "Mr. Guadalupe Hauck",
      color: "pink"
    }
  ],
  dueDate: "2026-04-22T03:08:38.703Z",
  estimatedHours: 45,
  loggedHours: 67,
  order: 32,
  attachments: [
    {
      id: "818d1a5e-19e0-4214-97a6-b222541b906a",
      name: "Bob Goyette",
      url: "https://staid-regret.org",
      size: 84,
      type: "other",
      uploadedBy: "voluntarius",
      uploadedAt: "2026-04-21T09:12:29.003Z"
    }
  ]
}

export const mockCreateTaskRequest: CreateTaskRequest = {
  title: "sapiente delinquo antepono",
  description: "Placeat voluptatem aufero itaque.",
  status: TaskStatus.Done,
  priority: ProjectPriority.Medium,
  projectId: "6c33ba94-3042-49e6-955b-38191bff9413",
  assigneeId: "65123aa2-01ba-4ffa-9bfa-0a48a11f301f",
  labels: [
    {
      id: "bcccc7be-26c4-4c7c-9640-5af6d3a021d2",
      name: "Floyd Murphy",
      color: "indigo"
    },
    {
      id: "e4dca9da-966d-473b-9459-7802c87ce709",
      name: "Elsa Boehm Sr.",
      color: "red"
    },
    {
      id: "7254428c-04ee-41b8-9353-a4a95b04a0ba",
      name: "Laurence Abshire",
      color: "olive"
    },
    {
      id: "aaa2957c-b147-479e-aade-30e2e890afdb",
      name: "Rodney Greenfelder MD",
      color: "indigo"
    }
  ]
}

export const mockUpdateTaskRequest: UpdateTaskRequest = {
  title: "verbum arto utrum",
  description: "Comitatus demoror ultio acquiro caries taedium.",
  status: TaskStatus.Todo,
  priority: ProjectPriority.Critical,
  assigneeId: "e510b98a-e1d6-4f4d-87fd-2551800a8b90",
  parentId: "a3c9955f-3143-483c-9153-b86ad2c2382e",
  labels: [
    {
      id: "8e80074a-47a8-4fe6-bb65-6775c80a1783",
      name: "Tyrone Towne",
      color: "lavender"
    },
    {
      id: "7c43ba0a-310a-4733-8c2c-4d9ea8ac3381",
      name: "Dominic Goyette",
      color: "yellow"
    }
  ],
  dueDate: "2026-04-21T21:53:17.604Z",
  estimatedHours: 28,
  loggedHours: 53,
  order: 11,
  attachments: [
    {
      id: "b5fb7d87-71a6-447a-8437-4f98e0b75437",
      name: "Nathaniel Morissette",
      url: "https://fancy-window.com",
      size: 93,
      type: "document",
      uploadedBy: "summa",
      uploadedAt: "2026-04-21T10:11:38.537Z"
    },
    {
      id: "786b4d67-a9b9-4721-95e2-5ed41dd382d2",
      name: "Melvin Turcotte",
      url: "https://steep-effective.net/",
      size: 5,
      type: "other",
      uploadedBy: "conatus",
      uploadedAt: "2026-04-21T12:49:31.197Z"
    },
    {
      id: "dbdeac48-adeb-4d20-9d12-4623f40fb55f",
      name: "Jessica Oberbrunner",
      url: "https://united-fusarium.biz",
      size: 35,
      type: "video",
      uploadedBy: "coerceo",
      uploadedAt: "2026-04-21T13:23:25.969Z"
    }
  ]
}

export const mockSprint: Sprint = {
  createdAt: "2026-04-21T08:46:24.941Z",
  updatedAt: "2026-04-22T03:16:53.549Z",
  id: "1048f732-9b7d-4d65-b59f-8414c978cad5",
  name: "Jenny Bogisich",
  projectId: "3695e48d-1522-45f1-a746-ce6eed5b44f2",
  startDate: "2026-04-22T01:50:43.111Z",
  endDate: "2026-04-22T01:38:17.137Z",
  goal: "comburo",
  isActive: false,
  velocity: 17
}

export const mockMilestone: Milestone = {
  createdAt: "2026-04-21T21:53:43.392Z",
  updatedAt: "2026-04-21T16:20:06.688Z",
  id: "2b8887d3-925a-413e-bcc2-270250b9effd",
  title: "caute vereor baiulus",
  projectId: "004c5c49-da7b-4bc3-8c50-b2e0197d873c",
  dueDate: "2026-04-21T11:05:24.054Z",
  isCompleted: false,
  taskIds: [
    "arma",
    "veritas"
  ]
}

export const mockComment: Comment = {
  createdAt: "2026-04-21T09:57:48.916Z",
  updatedAt: "2026-04-21T21:27:00.370Z",
  id: "8c39cb06-20af-470d-b667-5c4dad7a88fe",
  taskId: "17a4394c-919e-4f48-98ef-4498618813f5",
  authorId: "11a14d05-a65f-44ab-88f0-5a4b3339860c",
  body: "Valetudo adamo creator angustus velum suppono. Adiuvo tenus autem tollo ulterius decipio voluptates defetiscor ullam. Talio celebrer acsi ago stillicidium cimentarius.",
  author: {
    createdAt: "2026-04-21T20:08:42.948Z",
    updatedAt: "2026-04-21T10:56:28.289Z",
    id: "03c528e6-043f-4bdb-8001-e92e83388972",
    email: "Alicia_Murray74@hotmail.com",
    name: "Darren Hyatt",
    username: "Aniyah_Cassin12",
    avatarUrl: "https://colossal-formicarium.info",
    role: UserRole.Member,
    status: "suspended",
    timezone: "America/Noronha",
    locale: "ko-KR"
  },
  reactions: [
    {
      emoji: "🚭",
      count: 93,
      userIds: [
        "conatus"
      ]
    }
  ],
  isEdited: true
}

export const mockReaction: Reaction = {
  emoji: "😥",
  count: 24,
  userIds: [
    "aureus",
    "taedium"
  ]
}

export const mockAttachment: Attachment = {
  id: "460bc3ac-f450-4475-93ca-ceab484cad98",
  name: "Miss Nellie Predovic",
  url: "https://naughty-barley.name",
  size: 91,
  type: "spreadsheet",
  uploadedBy: "perferendis",
  uploadedAt: "2026-04-22T02:19:24.466Z"
}

export const mockUploadResponse: UploadResponse = {
  fileId: "23acc7ee-b7e3-48b1-880c-9f9b00dba751",
  url: "https://stormy-favor.com",
  fileName: "tolero",
  size: 58,
  mimeType: "font/otf"
}

export const mockNotification: Notification = {
  id: "eb41da94-02c3-45cd-90e3-34236efe6583",
  type: NotificationType.CommentAdded,
  userId: "a0cb89ed-5aef-4124-8636-9380e556cc0d",
  title: "tenus confugo una",
  body: "Consuasor ambitus absens cognatus abduco tibi. Statua appositus commodo ait esse abstergo stabilis deludo. Angulus ea vis vesper canonicus.",
  isRead: false,
  createdAt: "2026-04-21T10:27:25.818Z",
  link: "https://kaleidoscopic-sunbonnet.biz",
  meta: {}
}

export const mockAuditLog: AuditLog = {
  createdAt: "2026-04-21T09:20:05.718Z",
  updatedAt: "2026-04-22T03:20:55.394Z",
  id: "4484a8d9-419a-4137-aa64-ef173e3e7314",
  actorId: "67721ebc-f014-46c5-a9b4-c574b8a7d549",
  action: "defungo",
  resourceId: "f05dfa09-4358-4617-ac48-d2f86bdbbec1",
  resourceType: "project",
  diff: {},
  ipAddress: "3fe6:cb32:aacc:ae6c:ba2c:0d56:fa0c:e81e"
}

export const mockTaskMetrics: TaskMetrics = {
  total: 83,
  byStatus: {},
  byPriority: {},
  overdue: 11,
  completed: 90
}

export const mockAnalytics: Analytics = {
  projectId: "8a085caa-0632-4bb4-a3e0-d402e0ce5e99",
  period: "quarter",
  taskMetrics: {
    total: 40,
    byStatus: {},
    byPriority: {},
    overdue: 70,
    completed: 68
  },
  velocity: 91,
  burndownData: [
    {
      date: "abeo",
      remaining: 75
    },
    {
      date: "volaticus",
      remaining: 44
    },
    {
      date: "urbanus",
      remaining: 23
    }
  ]
}

export const mockApiError: ApiError = {
  code: "varietas",
  message: "sui"
}

export const mockValidationError: ValidationError = {
  field: "amet",
  message: "barba"
}

export const mockApiResponse: ApiResponse = {
  success: true,
  data: null,
  error: {
    code: "ara",
    message: "fuga"
  },
  meta: {}
}

export const mockPaginatedResponse: PaginatedResponse = {
  items: [
    null,
    null,
    null,
    null
  ],
  pagination: {
    page: 35,
    pageSize: 23,
    totalCount: 86,
    totalPages: 46,
    hasNext: false,
    hasPrev: false
  }
}

export const mockSearchResult: SearchResult = {
  type: "project",
  id: "431b92e6-42d2-4f4e-aae6-13a0eb1a5205",
  title: "caste auxilium tolero",
  excerpt: "Id conculco atrocitas testimonium cornu adulescens aliquid admoveo.",
  url: "https://silly-wood.net/",
  score: 18,
  highlight: [
    "volaticus"
  ]
}

export const mockSearchResponse: SearchResponse = {
  query: "ventito campana",
  results: [
    {
      type: "task",
      id: "85d7f222-b22f-4848-8881-880300ce25ac",
      title: "vorago comedo bene",
      excerpt: "Theologus spiritus custodia caelestis enim enim valeo cupiditate aro capillus.",
      url: "https://familiar-aid.info/",
      score: 91,
      highlight: [
        "coaegresco",
        "tripudio",
        "vox"
      ]
    },
    {
      type: "comment",
      id: "2a894a83-dc0d-4141-aaae-f680186f4698",
      title: "dicta denique cupio",
      url: "https://multicolored-print.net/",
      score: 9,
      highlight: [
        "delicate",
        "tergo",
        "consequatur",
        "ultra"
      ]
    },
    {
      type: "user",
      id: "f17c12aa-61f7-4ab8-aaac-49ebd2f43a6a",
      title: "deorsum turpis statim",
      excerpt: "Vox decumbo modi.",
      url: "https://wise-preoccupation.org/",
      score: 75,
      highlight: [
        "animadverto"
      ]
    }
  ],
  total: 71,
  took: 60
}

export const mockWebhook: Webhook = {
  createdAt: "2026-04-22T07:12:00.707Z",
  updatedAt: "2026-04-21T09:40:11.486Z",
  id: "0a0be035-aaca-40f0-ae72-11eb700d6a00",
  teamId: "4df018af-5546-4c3e-afd7-88f2a54c1422",
  url: "https://complete-newspaper.name/",
  events: [
    WebhookEvent.TaskDeleted
  ],
  secret: "TSPS2orxatdPE4etG79DeFolLWnxht2N",
  isActive: true
}

export const mockIntegration: Integration = {
  createdAt: "2026-04-21T20:30:26.198Z",
  updatedAt: "2026-04-22T07:55:08.923Z",
  id: "36206718-9c76-4097-b097-7af6bd0d500f",
  teamId: "6b105d00-f3de-4f3e-a41e-3ac11c5ff857",
  provider: "gitlab",
  name: "Rita Murphy",
  config: {},
  isEnabled: true
}