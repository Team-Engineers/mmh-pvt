// All components mapping with path for internal routes

import { lazy } from "react";
const SalaryDistributed = lazy(() =>
  import("../features/settings/salaryDistributed/SalaryDistributed")
);

const Welcome = lazy(() => import("../pages/protected/Welcome"));
const Page404 = lazy(() => import("../pages/protected/404"));
const Leads = lazy(() => import("../pages/protected/Leads"));
const OpenLeads = lazy(() => import("../pages/protected/OpenLeads"));
const AllLinks = lazy(() => import("../features/user/Account/AllLinks"));
const SubmitAccount = lazy(() =>
  import("../features/user/Account/SubmitAccount")
);
const OpenedAccList = lazy(() =>
  import("../features/user/Account/OpenedAccList")
);
const SalaryReceived = lazy(() =>
  import("../features/user/Account/SalaryReceived")
);
const ClosedLeads = lazy(() => import("../pages/protected/ClosedLeads"));
const NotCalledLeads = lazy(() => import("../pages/protected/NotCalledLeads"));

const ResetPasswordHR = lazy(() =>
  import("../features/user/teamLeader/ResetPasswordHR")
);

const TeamLeaderPresentHR = lazy(() =>
  import("../features/settings/team/TeamLeaderPresentHR")
);
const HRList = lazy(() => import("../features/user/teamLeader/HRList"));
const AssignLeadsHR = lazy(() =>
  import("../features/user/teamLeader/AssignLeadsHR")
);
const PresentHR = lazy(() => import("../features/user/teamLeader/PresentHR"));

const TotalAssignedLeads = lazy(() =>
  import("../pages/protected/TotalAssignedLeads")
);

const WebsiteLeads = lazy(() => import("../pages/protected/WebsiteLeads"));

const Team = lazy(() => import("../pages/protected/Team"));
const TeamLeaders = lazy(() => import("../pages/protected/TeamLeaders"));
const TeamLeaderHR = lazy(() => import("../pages/protected/TeamLeaderHR"));
const AddTL = lazy(() => import("../pages/protected/AddTL"));

const ProfileSettings = lazy(() =>
  import("../pages/protected/ProfileSettings")
);
const ForgotPassword = lazy(() => import("../pages/protected/ForgotPassword"));
const DematAccount = lazy(() => import("../pages/protected/DematAccount"));
const AllDematAccount = lazy(() =>
  import("../features/settings/dematAccount/AllDematAccount")
);

const EditBankDetails = lazy(() =>
  import("../features/settings/dematAccount/EditBankDetails")
);

const Category = lazy(() =>
  import("../features/settings/dematAccount/Category")
);

const OpenedAccount = lazy(() =>
  import("../features/settings/dematAccount/OpenedAccount")
);

const ApprovedAccount = lazy(() =>
  import("../features/settings/dematAccount/ApprovedAccount")
);

const ActiveMembers = lazy(() => import("../pages/protected/ActiveMembers"));
const NotApprovedMembers = lazy(() =>
  import("../pages/protected/NotApprovedMembers")
);
const UserTodayLeads = lazy(() => import("../pages/protected/UserTodayLeads"));
const TodayAssignedLeads = lazy(() =>
  import("../pages/protected/TodayAssignedLeads")
);

const UserClosedLeads = lazy(() =>
  import("../pages/protected/UserClosedLeads")
);
const UserPreviousLeads = lazy(() =>
  import("../pages/protected/UserPreviousLeads")
);
const isAdmin = localStorage.getItem("isAdmin") === "true";

let user;
const userString = localStorage.getItem("user");
if (userString !== null && userString !== undefined) {
  try {
    user = JSON.parse(userString);
  } catch (error) {
    console.error("Error parsing JSON:", error);
    localStorage.clear();
  }
} else {
  localStorage.clear();
}

const routes = [
  {
    path: "/welcome",
    component: Welcome,
  },

  {
    path: "/settings-profile",
    component: ProfileSettings,
  },
  {
    path: "/404",
    component: Page404,
  },
];

if (isAdmin && user?.role?.includes("ADMIN")) {
  routes.push(
    {
      path: "/reset-password",
      component: ForgotPassword,
    },
    {
      path: "/activeMembers",
      component: ActiveMembers,
    },
    {
      path: "/websiteLeads",
      component: WebsiteLeads,
    },
    {
      path: "/calledLeads",
      component: NotCalledLeads,
    },
    {
      path: "/totalAssignedLeads",
      component: TotalAssignedLeads,
    },
    {
      path: "/todayAssignedLeads",
      component: TodayAssignedLeads,
    },
    {
      path: "/teamMembers",
      component: Team,
    },
    {
      path: "/teamLeaders",
      component: TeamLeaders,
    },
    {
      path: `/teamLeaderHR/:teamLeaderId`,
      component: TeamLeaderHR,
    },

    {
      path: `/presentTeamLeaderHR/:teamLeaderId`,
      component: TeamLeaderPresentHR,
    },

    {
      path: "/addAccount",
      component: DematAccount,
    },
    {
      path: "/allCategory",
      component: Category,
    },
    {
      path: "/allCategory/:category",
      component: AllDematAccount,
    },
    {
      path: "/openedAccount/:status",
      component: OpenedAccount,
    },
    {
      path: "/addTL",
      component: AddTL,
    },
    {
      path: "/salaryDistributed",
      component: SalaryDistributed,
    },
    {
      path: "/uploadLeads",
      component: Leads,
    },
    {
      path: "/notAssigned",
      component: OpenLeads,
    },
    {
      path: "/salaryReceived",
      component: SalaryReceived,
    },
    {
      path: "/closedLeads",
      component: ClosedLeads,
    },
    {
      path: "/notApproved",
      component: NotApprovedMembers,
    },
    {
      path: "/edit/:commissionId",
      component: EditBankDetails,
    },
  );
} else if (user?.role?.includes("HR")) {
  routes.push(
    {
      path: "/userLeads",
      component: UserTodayLeads,
    },
    {
      path: "/allCategory",
      component: Category,
    },
    {
      path: "/allCategory/:category",
      component: AllLinks,
    },
    {
      path: "/openedAccList/:status",
      component: OpenedAccList,
    },
    {
      path: "/approvedAccount",
      component: ApprovedAccount,
    },
    {
      path: "/salaryReceived",
      component: SalaryReceived,
    },
    {
      path: "/createForm/:id",
      component: SubmitAccount,
    },
    {
      path: "/closedLeads",
      component: UserClosedLeads,
    },

    {
      path: "/previousLeads",
      component: UserPreviousLeads,
    }
  );
} else if (user?.role?.includes("TL")) {
  routes.push(
    {
      path: "/notAssigned",
      component: AssignLeadsHR,
    },

    {
      path: "/reset-password",
      component: ResetPasswordHR,
    },

    {
      path: "/teamMembers",
      component: HRList,
    },
    {
      path: "/activeMembers",
      component: PresentHR,
    }
  );
} else if (user?.role?.includes("VENDOR")) {
  routes.push(
    {
      path: "/allCategory",
      component: Category,
    },
    {
      path: "/allCategory/:category",
      component: AllDematAccount,
    },
    {
      path: "/edit/:commissionId",
      component: EditBankDetails,
    },
    
    {
      path: "/addAccount",
      component: DematAccount,
    },
  );
}

export default routes;
