import { ModeToggle } from "@/components/theme-switch-button";
import { MainNav } from "./components/main-nav";
import { Search } from "./components/search";
import TeamSwitcher from "./components/team-switcher";
import { UserNav } from "./components/user-nav";
import MainLogo from "./components/main-logo";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="flex flex-col">
        <div className="border-b">
          <div className="flex h-16 items-center px-4">
            <MainLogo />
            <MainNav className="mx-6" />
            <div className="ml-auto flex items-center space-x-4">
              {/* <Search /> */}
              <ModeToggle />
              <UserNav />
            </div>
          </div>
        </div>
      </div>
      {children}
    </>
  );
}
