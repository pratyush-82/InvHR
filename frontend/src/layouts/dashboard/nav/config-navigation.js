// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import SvgColor from '../../../components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
);

const ICONS = {
  blog: icon('ic_blog'),
  cart: icon('ic_cart'),
  chat: icon('ic_chat'),
  mail: icon('ic_mail'),
  user: icon('ic_person-outline'),
  file: icon('ic_file'),
  lock: icon('ic_lock'),
  label: icon('ic_label'),
  blank: icon('ic_blank'),
  kanban: icon('ic_kanban'),
  folder: icon('ic_folder'),
  banking: icon('ic_banking'),
  booking: icon('ic_booking'),
  invoice: icon('ic_invoice'),
  calendar: icon('ic_calendar'),
  disabled: icon('ic_disabled'),
  external: icon('ic_external'),
  menuItem: icon('ic_menu_item'),
  ecommerce: icon('ic_ecommerce'),
  analytics: icon('ic_analytics'),
  dashboard: icon('ic_dashboardNew'),
  project: icon('ic_project-outlined'),
  timeSheet: icon('ic_time-sheet'),
  designation: icon('ic_designation'),
  holiday: icon('ic_holiday-village-outline'),
  leave: icon('ic_leave'),
  policy: icon('ic_policy'),
};

const navConfig = [
  // GENERAL
  {
    subheader: 'general',
    items: [
      { title: 'dashboard', path: PATH_DASHBOARD.general.app, icon: ICONS.dashboard },
      { title: 'time sheet', path: PATH_DASHBOARD.calendar, icon: ICONS.timeSheet },
      { title: 'leave', path: PATH_DASHBOARD.general.leave, icon: ICONS.leave },
      { title: 'policies', path: PATH_DASHBOARD.policy.allList, icon: ICONS.policy },
      { title: 'holiday', path: PATH_DASHBOARD.holiday.branch, icon: ICONS.holiday },
    ],
  },
];

const management = { subheader: 'management', items: [] };
if (
  window.checkPermission('project.project.read') ||
  window.checkPermission('timeSheet.timeSheet.read') ||
  window.checkPermission('leave.management.read')
) {
  navConfig.push(management);
}

if (window.checkPermission('project.project.read'))
  management.items.push({
    title: 'project ',
    path: PATH_DASHBOARD.project.projectList,
    icon: ICONS.project,
  });
if (window.checkPermission('timeSheet.timeSheet.read'))
  management.items.push({
    title: 'time sheet',
    path: PATH_DASHBOARD.timeSheetManagement.list,
    icon: ICONS.timeSheet,
  });
if (window.checkPermission('leave.management.read'))
  management.items.push({
    title: 'leave',
    path: PATH_DASHBOARD.leaveManagement.list,
    icon: ICONS.leave,
  });

const human_resource = { subheader: 'human resource', items: [] };
if (
  window.checkPermission('employee.employee.read') ||
  window.checkPermission('designation.designation.read') ||
  window.checkPermission('leave.setting.read') ||
  window.checkPermission('policy.policy.read') ||
  window.checkPermission('holiday.holiday.read')
) {
  navConfig.push(human_resource);
}

if (window.checkPermission('employee.employee.read'))
  human_resource.items.push({
    title: 'employees',
    path: PATH_DASHBOARD.employee.list,
    icon: ICONS.user,
  });
if (window.checkPermission('designation.designation.read'))
  human_resource.items.push({
    title: 'designation',
    path: PATH_DASHBOARD.designation.list,
    icon: ICONS.designation,
  });
if (window.checkPermission('leave.setting.read'))
  human_resource.items.push({
    title: 'leave settings',
    path: PATH_DASHBOARD.leaveSetting.list,
    icon: ICONS.leave,
  });
if (window.checkPermission('policy.policy.read'))
  human_resource.items.push({
    title: 'policy ',
    path: PATH_DASHBOARD.policy.policyList,
    icon: ICONS.policy,
  });
if (window.checkPermission('holiday.holiday.read'))
  human_resource.items.push({
    title: 'holiday',
    path: PATH_DASHBOARD.holiday.list,
    icon: ICONS.holiday,
  });

export default navConfig;
