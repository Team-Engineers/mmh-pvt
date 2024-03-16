import Squares2X2Icon from "@heroicons/react/24/outline/Squares2X2Icon";
import CircleStackIcon from "@heroicons/react/24/outline/CircleStackIcon";
import PhoneArrowUpRightIcon from "@heroicons/react/24/outline/PhoneArrowUpRightIcon";

import DocumentArrowUpIcon from "@heroicons/react/24/outline/DocumentArrowUpIcon";

import SparklesIcon from "@heroicons/react/24/outline/SparklesIcon";
import RocketLaunchIcon from "@heroicons/react/24/outline/RocketLaunchIcon";

import UserGroupIcon from "@heroicons/react/24/outline/UserGroupIcon";

import UserPlusIcon from "@heroicons/react/24/outline/UserPlusIcon";
import BoltIcon from "@heroicons/react/24/outline/BoltIcon";

// import GlobeAltIcon from "@heroicons/react/24/outline/GlobeAltIcon";

import LockOpenIcon from "@heroicons/react/24/outline/LockOpenIcon";
// import BanknotesIcon from "@heroicons/react/24/outline/BanknotesIcon";

import CheckBadgeIcon from "@heroicons/react/24/outline/CheckBadgeIcon";
// import ArrowsPointingOutIcon from "@heroicons/react/24/outline/ArrowsPointingOutIcon";

// import AdjustmentsHorizontalIcon from "@heroicons/react/24/outline/AdjustmentsHorizontalIcon";

import BuildingOffice2Icon from "@heroicons/react/24/outline/BuildingOffice2Icon";
import CurrencyRupeeIcon from "@heroicons/react/24/outline/CurrencyRupeeIcon";
// import GlobeAsiaAustraliaIcon from "@heroicons/react/24/outline/GlobeAsiaAustraliaIcon";

import QuestionMarkCircleIcon from "@heroicons/react/24/outline/QuestionMarkCircleIcon";
import {
  ArchiveBoxArrowDownIcon,
  FireIcon,
  FolderPlusIcon,
  PhoneXMarkIcon,
  ShieldCheckIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";

const iconClasses = `h-6 w-6`;
const submenuIconClasses = `h-5 w-5`;
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

const routes = [];

if (user?.approvedAt && !isAdmin && user?.role?.includes("HR")) {
  routes.push(
    {
      path: "/app/userLeads",
      icon: <PhoneArrowUpRightIcon className={iconClasses} />,
      name: "Today's Leads",
    },
    {
      path: "/app/allCategory",
      icon: <BuildingOffice2Icon className={submenuIconClasses} />,
      name: "All Category",
    },
    {
      path: "/app/openedAccList/PENDING",
      icon: <ArchiveBoxArrowDownIcon className={submenuIconClasses} />,
      name: "Pending Account List",
    },
    {
      path: "/app/openedAccList/COMPLETED",
      icon: <CheckBadgeIcon className={submenuIconClasses} />,
      name: "Completed Account List",
    },
    {
      path: "/app/openedAccList/APPROVED",
      icon: <ShieldCheckIcon className={submenuIconClasses} />,
      name: "Approved Account List",
    },
    {
      path: "/app/settings-profile",
      icon: <UserCircleIcon className={submenuIconClasses} />,
      name: "Profile Details",
    },
    {
      path: "/app/salaryReceived",
      icon: <CurrencyRupeeIcon className={submenuIconClasses} />,
      name: "Salary Received",
    },
    {
      path: "/app/previousLeads",
      icon: <PhoneXMarkIcon className={iconClasses} />,
      name: "Previous Leads",
    },
    {
      path: "/app/closedLeads",
      icon: <FireIcon className={iconClasses} />,
      name: "Closed Leads",
    }
  );
}

if (user?.approvedAt && !isAdmin && user?.role?.includes("TL")) {
  routes.push(
    {
      path: "/app/notAssigned",
      icon: <CircleStackIcon className={iconClasses} />,
      name: "Leads in Stock",
    },
    {
      path: "/app/reset-password",
      icon: <LockOpenIcon className={submenuIconClasses} />,
      name: "Reset Password",
    },
    {
      path: "/app/teamMembers",
      icon: <UserGroupIcon className={submenuIconClasses} />,
      name: "HR List",
    },
    {
      path: "/app/activeMembers",
      icon: <BoltIcon className={submenuIconClasses} />,
      name: "Today Present HR",
    }
  );
}

if (isAdmin) {
  routes.push(
    {
      path: "/app/totalAssignedLeads",
      icon: <Squares2X2Icon className={iconClasses} />,
      name: "Not Used Leads",
    },
    {
      path: "/app/uploadLeads",
      icon: <DocumentArrowUpIcon className={iconClasses} />,
      name: "Upload Leads",
    },
    {
      path: "/app/notAssigned",
      icon: <CircleStackIcon className={iconClasses} />,
      name: "Fresh Leads",
    },

    // {
    //   path: "/app/websiteLeads",
    //   icon: <GlobeAltIcon className={iconClasses} />,
    //   name: "Website Leads",
    // },

    {
      path: "/app/reset-password",
      icon: <LockOpenIcon className={submenuIconClasses} />,
      name: "Reset Password",
    },
    {
      path: "/app/activeMembers",
      icon: <BoltIcon className={submenuIconClasses} />,
      name: "Present HR",
    },

    {
      path: "/app/addAccount",
      icon: <FolderPlusIcon className={submenuIconClasses} />,
      name: "Add Account",
    },

    {
      path: "/app/allCategory",
      icon: <BuildingOffice2Icon className={submenuIconClasses} />,
      name: "All Category",
    },

    {
      path: "/app/openedAccount/PENDING",
      icon: <ArchiveBoxArrowDownIcon className={submenuIconClasses} />,
      name: "Pending Account",
    },

    {
      path: "/app/openedAccount/APPROVED",
      icon: <ShieldCheckIcon className={submenuIconClasses} />,
      name: "Approved Account",
    },
    {
      path: "/app/openedAccount/COMPLETED",
      icon: <CheckBadgeIcon className={submenuIconClasses} />,
      name: "Completed Account",
    },

    {
      path: "/app/teamLeaders",
      icon: <RocketLaunchIcon className={submenuIconClasses} />,
      name: "Team Leaders List",
    },
    {
      path: "/app/teamMembers",
      icon: <UserGroupIcon className={submenuIconClasses} />,
      name: "HR List",
    },

    {
      path: "/app/todayAssignedLeads",
      icon: <SparklesIcon className={iconClasses} />,
      name: "Today Assigned Leads",
    },

    {
      path: "/app/notApproved",
      icon: <QuestionMarkCircleIcon className={submenuIconClasses} />,
      name: "Not Approved HR",
    },
    {
      path: "/app/addTL",
      icon: <UserPlusIcon className={submenuIconClasses} />,
      name: "Add Team Leader",
    },
    {
      path: "/app/salaryDistributed",
      icon: <CurrencyRupeeIcon className={submenuIconClasses} />,
      name: "Salary Distributed",
    },
    {
      path: "/app/calledLeads",
      icon: <PhoneArrowUpRightIcon className={iconClasses} />,
      name: "Called Leads",
    },
    {
      path: "/app/closedLeads",
      icon: <FireIcon className={iconClasses} />,
      name: "Closed Leads",
    }
  );
}

export default routes;
