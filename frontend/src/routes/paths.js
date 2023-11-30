// ----------------------------------------------------------------------

function path(root, sublink) {
  return `${root}${sublink}`;
}

const ROOTS_AUTH = '/auth';
const ROOTS_DASHBOARD = '/dashboard';

// ----------------------------------------------------------------------

export const PATH_AUTH = {
  root: ROOTS_AUTH,
  login: path(ROOTS_AUTH, '/login'),
  register: path(ROOTS_AUTH, '/register'),
  loginUnprotected: path(ROOTS_AUTH, '/login-unprotected'),
  registerUnprotected: path(ROOTS_AUTH, '/register-unprotected'),
  verify: path(ROOTS_AUTH, '/verify'),
  resetPassword: path(ROOTS_AUTH, '/reset-password'),
  newPassword: path(ROOTS_AUTH, '/new-password'),
  policyAgreement: path(ROOTS_AUTH, '/policy-agreement'),
};

export const PATH_PAGE = {
  comingSoon: '/coming-soon',
  maintenance: '/maintenance',
  pricing: '/pricing',
  payment: '/payment',
  about: '/about-us',
  contact: '/contact-us',
  faqs: '/faqs',
  page403: '/403',
  page404: '/404',
  page500: '/500',
  components: '/components',
};

export const PATH_DASHBOARD = {
  root: ROOTS_DASHBOARD,
  kanban: path(ROOTS_DASHBOARD, '/kanban'),
  calendar: path(ROOTS_DASHBOARD, '/calendar'),
  fileManager: path(ROOTS_DASHBOARD, '/files-manager'),
  permissionDenied: path(ROOTS_DASHBOARD, '/permission-denied'),
  blank: path(ROOTS_DASHBOARD, '/blank'),
  general: {
    app: path(ROOTS_DASHBOARD, '/app'),
    ecommerce: path(ROOTS_DASHBOARD, '/ecommerce'),
    analytics: path(ROOTS_DASHBOARD, '/analytics'),
    leave: path(ROOTS_DASHBOARD, '/leave'),
    banking: path(ROOTS_DASHBOARD, '/banking'),
    booking: path(ROOTS_DASHBOARD, '/booking'),
    file: path(ROOTS_DASHBOARD, '/file'),
  },
  mail: {
    root: path(ROOTS_DASHBOARD, '/mail'),
    all: path(ROOTS_DASHBOARD, '/mail/all'),
  },
  chat: {
    root: path(ROOTS_DASHBOARD, '/chat'),
    new: path(ROOTS_DASHBOARD, '/chat/new'),
    view: (name) => path(ROOTS_DASHBOARD, `/chat/${name}`),
  },
  employee: {
    root: path(ROOTS_DASHBOARD, '/employee'),
    new: path(ROOTS_DASHBOARD, '/employee/new'),
    list: path(ROOTS_DASHBOARD, '/employee'),
    cards: path(ROOTS_DASHBOARD, '/employee/cards'),
    profile: path(ROOTS_DASHBOARD, '/employee/profile'),
    account: path(ROOTS_DASHBOARD, '/employee/account'),
    edit: (empId) => path(ROOTS_DASHBOARD, `/employee/${empId}/edit`),
    demoEdit: path(ROOTS_DASHBOARD, `/employee/reece-chung/edit`),
  },
  policy: {
    policyNewAdd: path(ROOTS_DASHBOARD, '/policy/policyNewAdd'),
    policyList: path(ROOTS_DASHBOARD, '/policy/policyList'),
    generalPolicyList: path(ROOTS_DASHBOARD, '/policy/generalPolicyList'),
    list: path(ROOTS_DASHBOARD, '/policy/list'),
    allList: path(ROOTS_DASHBOARD, '/policy/all-policies'),
  },
  employeeAppraisal: {
    employeeAppraisalList: path(ROOTS_DASHBOARD, '/employeeAppraisal/employeeAppraisalList'),
    list: path(ROOTS_DASHBOARD, '/employeeAppraisal/list'),
  },

  holiday: {
    root: path(ROOTS_DASHBOARD, '/holiday'),
    list: path(ROOTS_DASHBOARD, '/holiday/list'),
    branch: path(ROOTS_DASHBOARD, '/holiday/all-branch'),
  },
  designation: {
    root: path(ROOTS_DASHBOARD, '/designation'),
    list: path(ROOTS_DASHBOARD, '/designation'),
    new: path(ROOTS_DASHBOARD, '/designation/new'),
    edit: (id) => path(ROOTS_DASHBOARD, `/designation/${id}/edit`),
    view: (id) => path(ROOTS_DASHBOARD, `/designation/${id}/view`),
  },
  leaveSetting: {
    root: path(ROOTS_DASHBOARD, '/leave-setting'),
    list: path(ROOTS_DASHBOARD, '/leave-setting/list'),
  },
  project: {
    projectNewAdd: path(ROOTS_DASHBOARD, '/project/projectNewAdd'),
    projectList: path(ROOTS_DASHBOARD, '/project/projectList'),
    list: path(ROOTS_DASHBOARD, '/project/list'),
  },

  leaveManagement: {
    root: path(ROOTS_DASHBOARD, '/leave-management'),
    list: path(ROOTS_DASHBOARD, '/leave-management/list'),
  },
  timeSheetManagement: {
    root: path(ROOTS_DASHBOARD, '/timeSheet-management'),
    list: path(ROOTS_DASHBOARD, '/timeSheet-management/employee'),
  },
  eCommerce: {
    root: path(ROOTS_DASHBOARD, '/e-commerce'),
    shop: path(ROOTS_DASHBOARD, '/e-commerce/shop'),
    list: path(ROOTS_DASHBOARD, '/e-commerce/list'),
    checkout: path(ROOTS_DASHBOARD, '/e-commerce/checkout'),
    new: path(ROOTS_DASHBOARD, '/e-commerce/product/new'),
    view: (name) => path(ROOTS_DASHBOARD, `/e-commerce/product/${name}`),
    edit: (name) => path(ROOTS_DASHBOARD, `/e-commerce/product/${name}/edit`),
    demoEdit: path(ROOTS_DASHBOARD, '/e-commerce/product/nike-blazer-low-77-vintage/edit'),
    demoView: path(ROOTS_DASHBOARD, '/e-commerce/product/nike-air-force-1-ndestrukt'),
  },
  invoice: {
    root: path(ROOTS_DASHBOARD, '/invoice'),
    list: path(ROOTS_DASHBOARD, '/invoice/list'),
    new: path(ROOTS_DASHBOARD, '/invoice/new'),
    view: (id) => path(ROOTS_DASHBOARD, `/invoice/${id}`),
    edit: (id) => path(ROOTS_DASHBOARD, `/invoice/${id}/edit`),
    demoEdit: path(ROOTS_DASHBOARD, '/invoice/e99f09a7-dd88-49d5-b1c8-1daf80c2d7b1/edit'),
    demoView: path(ROOTS_DASHBOARD, '/invoice/e99f09a7-dd88-49d5-b1c8-1daf80c2d7b5'),
  },
  blog: {
    root: path(ROOTS_DASHBOARD, '/blog'),
    posts: path(ROOTS_DASHBOARD, '/blog/posts'),
    new: path(ROOTS_DASHBOARD, '/blog/new'),
    view: (title) => path(ROOTS_DASHBOARD, `/blog/post/${title}`),
    demoView: path(ROOTS_DASHBOARD, '/blog/post/apply-these-7-secret-techniques-to-improve-event'),
  },
};

export const PATH_DOCS = {
  root: 'https://docs.minimals.cc',
  changelog: 'https://docs.minimals.cc/changelog',
};

export const PATH_ZONE_ON_STORE = 'https://mui.com/store/items/zone-landing-page/';

export const PATH_MINIMAL_ON_STORE = 'https://mui.com/store/items/minimal-dashboard/';

export const PATH_FREE_VERSION = 'https://mui.com/store/items/minimal-dashboard-free/';

export const PATH_FIGMA_PREVIEW =
  'https://www.figma.com/file/rWMDOkMZYw2VpTdNuBBCvN/%5BPreview%5D-Minimal-Web.26.11.22?node-id=0%3A1&t=ya2mDFiuhTXXLLF1-1';
