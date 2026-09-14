export const MainMenu = [
  {
    displayname: "Users",
    route: "users",
    isOpen: false,
    view: false,
    icon: "icon-user-fill",
  },
  {
    displayname: "Products",
    route: "products",
    isOpen: false,
    view: false,
    icon: "icon-user-fill",
  },
  {
    displayname: "Categories",
    route: "categories",
    isOpen: false,
    view: false,
    icon: "icon-master",
  },
  {
    displayname: "Plan Subscription",
    route: "",
    isOpen: false,
    view: true,
    isAlwaysVisible: true,
    icon: "icon-user-fill",
  },
  // {
  //   displayname: "Support Ticket",
  //   route: "support-ticket",
  //   isOpen: false,
  //   view: false,
  //   icon: "icon-headphones-fill",
  // },
  {
    displayname: "Master",
    route: "",
    isOpen: false,
    view: true,
    isAlwaysVisible: true,
    icon: "icon-master",
  },
  {
    displayname: "Admin Setup",
    route: "",
    isOpen: false,
    view: false,
    icon: "icon-master",
  },

];

export const InMenu = [
  {
    displayname: "All Plans",
    route: "plans-subscription",
    mainMenu: "Plan Subscription",
    view: true,
    isAlwaysVisible: true,
  },
  {
    displayname: "Subscribed Users",
    route: "plans-subscription/subscribers",
    mainMenu: "Plan Subscription",
    view: true,
    isAlwaysVisible: true,
  },
  {
    displayname: "GST Management",
    route: "master/gst",
    mainMenu: "Master",
    view: true,
    isAlwaysVisible: true,
  },
  {
    displayname: "Admins",
    route: "admin",
    mainMenu: "Admin Setup",
  },
  {
    displayname: "Role & Permissions",
    route: "role-permission",
    mainMenu: "Admin Setup",
  },
];

export const imageArray = [
  "image/webp",
  "image/png",
  "image/jpeg",
  "image/gif",
  "image/bmp",
  "image/vnd.microsoft.icon",
  "image/tiff",
  "image/svg+xml",
];
export const excelArray = [
  "application/ms-excel",
  "application/vnd.ms-excel",
  "application/vnd.oasis.opendocument.spreadsheet",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
]

export const docArray = [
  "application/zip",
  "text/plain",
  "application/vnd.rar",
  "application/pdf",
  "text/csv",
  "application/msword",
  "application/vnd.ms-excel",
  "application/vnd.ms-powerpoint",
  "application/x-tar",
  "application/vnd.oasis.opendocument.presentation",
  "application/vnd.oasis.opendocument.spreadsheet",
  "application/vnd.oasis.opendocument.text",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/x-7z-compressed",
  "application/octet-stream",
  "application/ms-excel",
  "text/html"
];

export const ImageDocArray = [
  "image/webp",
  "image/png",
  "image/jpeg",
  "image/gif",
  "image/bmp",
  "image/vnd.microsoft.icon",
  "image/tiff",
  "image/svg+xml",
  "application/zip",
  "text/plain",
  "application/vnd.rar",
  "application/pdf",
  "text/csv",
  "application/msword",
  "application/vnd.ms-excel",
  "application/vnd.ms-powerpoint",
  "application/x-tar",
  "application/vnd.oasis.opendocument.presentation",
  "application/vnd.oasis.opendocument.spreadsheet",
  "application/vnd.oasis.opendocument.text",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/x-7z-compressed",
  "application/octet-stream",
  "application/ms-excel",
  "text/html"
]

export const Status = [
  { id: 1, value: "", label: "All" },
  { id: 2, value: "true", label: "Active" },
  { id: 3, value: "false", label: "In Active" },
];