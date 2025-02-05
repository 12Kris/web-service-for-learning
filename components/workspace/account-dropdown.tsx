import { Github, LifeBuoy, LogOut, Settings, User } from "lucide-react";

import { getUser, logoutUser } from "@/lib/auth/actions";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface AccountDropdownProps {
  name?: string;
}

export function AccountDropdown({ name }: AccountDropdownProps) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      logoutUser();
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleProfileClick = async () => {
    try {
      getUser();
      router.push("/workspace/profile");
    } catch (error) {
      console.error("Navigation failed:", error);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={"default"}
          size="icon"
          className="shrink-0 rounded-full bg-zinc-100"
        >
          <User strokeWidth={3} className="h-5 w-5 " />
          <span className="sr-only">User menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 mr-2">
        <DropdownMenuLabel>{name}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={handleProfileClick}>
            <User />
            <span>Profile</span>
          </DropdownMenuItem>

          <DropdownMenuItem>
            <Settings />
            <span>Settings</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />

        <DropdownMenuItem>
          <Github />
          <span>GitHub</span>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <LifeBuoy />
          <span>Support</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}