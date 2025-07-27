
import { NotificationCenter } from "@/components/common/NotificationCenter";
import { CreditBalance } from "@/components/monetization/CreditBalance";
import { useSecureAuth } from "@/features/auth/providers/SecureAuthProvider";
import { Link } from "react-router-dom";
import { ExpandedProfileDropdown } from "./ExpandedProfileDropdown";

export const NavActions = () => {
  const { user } = useSecureAuth();

  if (user) {
    return (
      <div className="flex items-center gap-3 ml-auto">
        <CreditBalance />
        <NotificationCenter />
        <ExpandedProfileDropdown />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <Link to="/auth/signin">
        <button className="cta-themed px-4 py-2 rounded-md text-sm font-medium min-h-[44px]">
          Sign In
        </button>
      </Link>
    </div>
  );
};
