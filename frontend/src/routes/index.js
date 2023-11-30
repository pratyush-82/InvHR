import { Navigate, useRoutes } from 'react-router-dom';
// auth
import GuestGuard from '../auth/GuestGuard';
// layouts
import CompactLayout from '../layouts/compact';
import DashboardLayout from '../layouts/dashboard';
// config
import { PATH_AFTER_LOGIN } from '../config-global';
//
import {
  // Auth
  LoginPage,
  RegisterPage,
  VerifyCodePage,
  NewPasswordPage,
  ResetPasswordPage,
  PolicyAgreementPage,
  // Dashboard: General
  GeneralAppPage,
  GeneralFilePage,
  GeneralBankingPage,
  GeneralBookingPage,
  GeneralEcommercePage,
  GeneralAnalyticsPage,
  // Dashboard: Employee
  EmployeeListPage,
  EmployeeCreatePage,
  EmployeeEditPage,
  // Dashboard: User
  UserListPage,
  UserEditPage,
  UserCreatePage,
  UserAccountPage,
  // Dashboard: Holiday
  HolidayListPage,
  HolidayBranchList,
  // Dashboard: leave
  LeaveSettingPage,
  LeavePage,
  LeaveManagementListPage,
  // Dashboard: Designation
  DesignationListPage,
  DesignationCreatePage,
  DesignationEditPage,
  DesignationViewPage,
  EmployeeProfilePage,
  // Dashboard: Policy
  PolicyNewAdd,
  PolicyListPage,
  GeneralPolicyListPage,
  PoliciesListPage,
  // Dashboard: Ecommerce
  EcommerceShopPage,
  EcommerceCheckoutPage,
  EcommerceProductListPage,
  EcommerceProductEditPage,
  EcommerceProductCreatePage,
  EcommerceProductDetailsPage,
  // Dashboard: Invoice
  InvoiceListPage,
  InvoiceDetailsPage,
  InvoiceCreatePage,
  InvoiceEditPage,
  // Dashboard: Blog
  BlogPostsPage,
  BlogPostPage,
  BlogNewPostPage,
  // Dashboard: FileManager
  FileManagerPage,
  // Dashboard: App
  ChatPage,
  MailPage,
  CalendarPage,
  KanbanPage,
  //
  BlankPage,
  PermissionDeniedPage,
  //
  Page500,
  Page403,
  Page404,
  ComingSoonPage,
  MaintenancePage,
  //
  ComponentsOverviewPage,
  FoundationColorsPage,
  FoundationTypographyPage,
  FoundationShadowsPage,
  FoundationGridPage,
  FoundationIconsPage,
  //
  MUIAccordionPage,
  MUIAlertPage,
  MUIAutocompletePage,
  MUIAvatarPage,
  MUIBadgePage,
  MUIBreadcrumbsPage,
  MUIButtonsPage,
  MUICheckboxPage,
  MUIChipPage,
  MUIDataGridPage,
  MUIDialogPage,
  MUIListPage,
  MUIMenuPage,
  MUIPaginationPage,
  MUIPickersPage,
  MUIPopoverPage,
  MUIProgressPage,
  MUIRadioButtonsPage,
  MUIRatingPage,
  MUISliderPage,
  MUIStepperPage,
  MUISwitchPage,
  MUITablePage,
  MUITabsPage,
  MUITextFieldPage,
  MUITimelinePage,
  MUITooltipPage,
  MUITransferListPage,
  MUITreesViewPage,
  //
  DemoAnimatePage,
  DemoCarouselsPage,
  DemoChartsPage,
  DemoCopyToClipboardPage,
  DemoEditorPage,
  DemoFormValidationPage,
  DemoImagePage,
  DemoLabelPage,
  DemoLightboxPage,
  DemoMapPage,
  DemoMegaMenuPage,
  DemoMultiLanguagePage,
  DemoNavigationBarPage,
  DemoOrganizationalChartPage,
  DemoScrollbarPage,
  DemoSnackbarPage,
  DemoTextMaxLinePage,
  DemoUploadPage,
  DemoMarkdownPage,
  ProjectNewAdd,
  ProjectListPage,
  EmployeeAppraisalListPage,
  TimeSheetManagementPage,
} from './elements';
import MyAuthGuard from '../auth/MyAuthGuard';

// ----------------------------------------------------------------------

export default function Router() {
  return useRoutes([
    // Auth
    {
      path: 'auth',
      children: [
        {
          path: 'login',
          element: (
            <GuestGuard>
              <LoginPage />
            </GuestGuard>
          ),
        },
        {
          path: 'register',
          element: (
            <GuestGuard>
              <RegisterPage />
            </GuestGuard>
          ),
        },
        { path: 'login-unprotected', element: <LoginPage /> },
        { path: 'register-unprotected', element: <RegisterPage /> },
        { path: 'policy-agreement', element: <PolicyAgreementPage /> },

        {
          element: <CompactLayout />,
          children: [
            { path: 'reset-password', element: <ResetPasswordPage /> },
            { path: 'new-password', element: <NewPasswordPage /> },
            { path: 'verify', element: <VerifyCodePage /> },
          ],
        },
      ],
    },

    // Dashboard
    {
      path: 'dashboard',
      element: (
        <MyAuthGuard>
          <DashboardLayout />
        </MyAuthGuard>
      ),
      children: [
        { element: <Navigate to={PATH_AFTER_LOGIN} replace />, index: true },
        { path: 'app', element: <GeneralAppPage /> },
        { path: 'ecommerce', element: <GeneralEcommercePage /> },
        { path: 'leave', element: <LeavePage /> },
        { path: 'analytics', element: <GeneralAnalyticsPage /> },
        { path: 'banking', element: <GeneralBankingPage /> },
        { path: 'booking', element: <GeneralBookingPage /> },
        { path: 'file', element: <GeneralFilePage /> },
        {
          path: 'e-commerce',
          children: [
            { element: <Navigate to="/dashboard/e-commerce/shop" replace />, index: true },
            { path: 'shop', element: <EcommerceShopPage /> },
            { path: 'product/:name', element: <EcommerceProductDetailsPage /> },
            { path: 'list', element: <EcommerceProductListPage /> },
            { path: 'product/new', element: <EcommerceProductCreatePage /> },
            { path: 'product/:name/edit', element: <EcommerceProductEditPage /> },
            { path: 'checkout', element: <EcommerceCheckoutPage /> },
          ],
        },
        {
          path: 'leave-setting',
          children: [
            { element: <Navigate to="/dashboard/leave-setting/list" replace />, index: true },
            { path: 'list', element: <LeaveSettingPage /> },
          ],
        },
        {
          path: 'leave-management',
          children: [
            { element: <Navigate to="/dashboard/leave-management/list" replace />, index: true },
            { path: 'list', element: <LeaveManagementListPage /> },
          ],
        },
        {
          path: 'employee',
          children: [
            { element: <EmployeeListPage />, index: true },
            { path: 'new', element: <EmployeeCreatePage /> },
            { path: ':empId/edit', element: <EmployeeEditPage /> },
            { path: 'profile', element: <EmployeeProfilePage /> },
          ],
        },
        {
          path: 'designation',
          children: [
            { element: <DesignationListPage />, index: true },
            { path: 'new', element: <DesignationCreatePage /> },
            { path: ':id/edit', element: <DesignationEditPage /> },
            { path: ':id/view', element: <DesignationViewPage /> },
          ],
        },
        {
          path: 'holiday',
          children: [
            { element: <Navigate to="/dashboard/holiday/list" replace />, index: true },
            { path: 'list', element: <HolidayListPage /> },
            { path: 'all-branch', element: <HolidayBranchList /> },
          ],
        },
        {
          path: 'timeSheet-management',
          children: [
            {
              element: <Navigate to="/dashboard/timeSheet-management/employee" replace />,
              index: true,
            },
            { path: 'employee', element: <TimeSheetManagementPage /> },
          ],
        },
        {
          path: 'user',
          children: [
            { path: 'list', element: <UserListPage /> },
            { path: 'new', element: <UserCreatePage /> },
            { path: ':name/edit', element: <UserEditPage /> },
            { path: 'account', element: <UserAccountPage /> },
          ],
        },
        {
          path: 'policy',
          children: [
            { path: 'policyList', element: <PolicyListPage /> },
            { path: 'generalPolicyList', element: <GeneralPolicyListPage /> },
            { path: 'policyNewAdd', element: <PolicyNewAdd /> },
            { path: 'all-policies', element: <PoliciesListPage /> },
          ],
        },
        {
          path: 'employeeAppraisal',
          children: [{ path: 'employeeAppraisalList', element: <EmployeeAppraisalListPage /> }],
        },

        {
          path: 'project',
          children: [
            { path: 'projectList', element: <ProjectListPage /> },

            { path: 'projectNewAdd', element: <ProjectNewAdd /> },
          ],
        },

        {
          path: 'invoice',
          children: [
            { element: <Navigate to="/dashboard/invoice/list" replace />, index: true },
            { path: 'list', element: <InvoiceListPage /> },
            { path: ':id', element: <InvoiceDetailsPage /> },
            { path: ':id/edit', element: <InvoiceEditPage /> },
            { path: 'new', element: <InvoiceCreatePage /> },
          ],
        },
        {
          path: 'blog',
          children: [
            { element: <Navigate to="/dashboard/blog/posts" replace />, index: true },
            { path: 'posts', element: <BlogPostsPage /> },
            { path: 'post/:title', element: <BlogPostPage /> },
            { path: 'new', element: <BlogNewPostPage /> },
          ],
        },
        { path: 'files-manager', element: <FileManagerPage /> },
        {
          path: 'mail',
          children: [
            { element: <Navigate to="/dashboard/mail/all" replace />, index: true },
            { path: 'label/:customLabel', element: <MailPage /> },
            { path: 'label/:customLabel/:mailId', element: <MailPage /> },
            { path: ':systemLabel', element: <MailPage /> },
            { path: ':systemLabel/:mailId', element: <MailPage /> },
          ],
        },
        {
          path: 'chat',
          children: [
            { element: <ChatPage />, index: true },
            { path: 'new', element: <ChatPage /> },
            { path: ':conversationKey', element: <ChatPage /> },
          ],
        },
        { path: 'calendar', element: <CalendarPage /> },
        { path: 'kanban', element: <KanbanPage /> },
        { path: 'permission-denied', element: <PermissionDeniedPage /> },
        { path: 'blank', element: <BlankPage /> },
      ],
    },

    // Main Routes
    // {
    //   element: <MainLayout />,
    //   children: [
    //     { element: <HomePage />, index: true },
    //     { path: 'about-us', element: <AboutPage /> },
    //     { path: 'contact-us', element: <Contact /> },
    //     { path: 'faqs', element: <FaqsPage /> },
    //     // Demo Components
    //     {
    //       path: 'components',
    //       children: [
    //         { element: <ComponentsOverviewPage />, index: true },
    //         {
    //           path: 'foundation',
    //           children: [
    //             { element: <Navigate to="/components/foundation/colors" replace />, index: true },
    //             { path: 'colors', element: <FoundationColorsPage /> },
    //             { path: 'typography', element: <FoundationTypographyPage /> },
    //             { path: 'shadows', element: <FoundationShadowsPage /> },
    //             { path: 'grid', element: <FoundationGridPage /> },
    //             { path: 'icons', element: <FoundationIconsPage /> },
    //           ],
    //         },
    //         {
    //           path: 'mui',
    //           children: [
    //             { element: <Navigate to="/components/mui/accordion" replace />, index: true },
    //             { path: 'accordion', element: <MUIAccordionPage /> },
    //             { path: 'alert', element: <MUIAlertPage /> },
    //             { path: 'autocomplete', element: <MUIAutocompletePage /> },
    //             { path: 'avatar', element: <MUIAvatarPage /> },
    //             { path: 'badge', element: <MUIBadgePage /> },
    //             { path: 'breadcrumbs', element: <MUIBreadcrumbsPage /> },
    //             { path: 'buttons', element: <MUIButtonsPage /> },
    //             { path: 'checkbox', element: <MUICheckboxPage /> },
    //             { path: 'chip', element: <MUIChipPage /> },
    //             { path: 'data-grid', element: <MUIDataGridPage /> },
    //             { path: 'dialog', element: <MUIDialogPage /> },
    //             { path: 'list', element: <MUIListPage /> },
    //             { path: 'menu', element: <MUIMenuPage /> },
    //             { path: 'pagination', element: <MUIPaginationPage /> },
    //             { path: 'pickers', element: <MUIPickersPage /> },
    //             { path: 'popover', element: <MUIPopoverPage /> },
    //             { path: 'progress', element: <MUIProgressPage /> },
    //             { path: 'radio-button', element: <MUIRadioButtonsPage /> },
    //             { path: 'rating', element: <MUIRatingPage /> },
    //             { path: 'slider', element: <MUISliderPage /> },
    //             { path: 'stepper', element: <MUIStepperPage /> },
    //             { path: 'switch', element: <MUISwitchPage /> },
    //             { path: 'table', element: <MUITablePage /> },
    //             { path: 'tabs', element: <MUITabsPage /> },
    //             { path: 'textfield', element: <MUITextFieldPage /> },
    //             { path: 'timeline', element: <MUITimelinePage /> },
    //             { path: 'tooltip', element: <MUITooltipPage /> },
    //             { path: 'transfer-list', element: <MUITransferListPage /> },
    //             { path: 'tree-view', element: <MUITreesViewPage /> },
    //           ],
    //         },
    //         {
    //           path: 'extra',
    //           children: [
    //             { element: <Navigate to="/components/extra/animate" replace />, index: true },
    //             { path: 'animate', element: <DemoAnimatePage /> },
    //             { path: 'carousel', element: <DemoCarouselsPage /> },
    //             { path: 'chart', element: <DemoChartsPage /> },
    //             { path: 'copy-to-clipboard', element: <DemoCopyToClipboardPage /> },
    //             { path: 'editor', element: <DemoEditorPage /> },
    //             { path: 'form-validation', element: <DemoFormValidationPage /> },
    //             { path: 'image', element: <DemoImagePage /> },
    //             { path: 'label', element: <DemoLabelPage /> },
    //             { path: 'lightbox', element: <DemoLightboxPage /> },
    //             { path: 'map', element: <DemoMapPage /> },
    //             { path: 'mega-menu', element: <DemoMegaMenuPage /> },
    //             { path: 'multi-language', element: <DemoMultiLanguagePage /> },
    //             { path: 'navigation-bar', element: <DemoNavigationBarPage /> },
    //             { path: 'organization-chart', element: <DemoOrganizationalChartPage /> },
    //             { path: 'scroll', element: <DemoScrollbarPage /> },
    //             { path: 'snackbar', element: <DemoSnackbarPage /> },
    //             { path: 'text-max-line', element: <DemoTextMaxLinePage /> },
    //             { path: 'upload', element: <DemoUploadPage /> },
    //             { path: 'markdown', element: <DemoMarkdownPage /> },
    //           ],
    //         },
    //       ],
    //     },
    //   ],
    // },
    // {
    //   element: <SimpleLayout />,
    //   children: [
    //     { path: 'pricing', element: <PricingPage /> },
    //     { path: 'payment', element: <PaymentPage /> },
    //   ],
    // },
    {
      element: <CompactLayout />,
      children: [
        { path: '/', element: <Navigate to="/auth/login" replace /> },
        { path: 'coming-soon', element: <ComingSoonPage /> },
        { path: 'maintenance', element: <MaintenancePage /> },
        { path: '500', element: <Page500 /> },
        { path: '404', element: <Page404 /> },
        { path: '403', element: <Page403 /> },
      ],
    },
    { path: '*', element: <Navigate to="/404" replace /> },
  ]);
}
