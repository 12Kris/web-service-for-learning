import { LogOut, User } from "lucide-react";

import { signOut } from "@/utils/supabase/actions";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";



export function AccountDropdown() {
  const router = useRouter();
  const handleLogout = async () => {
    try {
       await signOut();
        router.push("/");
      
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleProfileClick = async () => {
    try {
      
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
          className="shrink-0 rounded-full bg-white pr-[-20px]"
        >
          <User strokeWidth={3} className="h-5 w-5 " />
          <span className="sr-only">User menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 mr-2">
        <DropdownMenuItem className="" onClick={handleProfileClick}>
          <User />
          <span>Profile</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
