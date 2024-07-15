import { Moon, Sun } from "lucide-react";
import { useDispatch } from "react-redux";
import { toggleMode } from "@/features/ModeSlice";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useTheme } from "./theme-provider";

function DarkModeToggle({ className = "" }) {
  const dispatch = useDispatch();
  const { setTheme } = useTheme();

  const handleLightMode = () => {
    setTheme("light");
    dispatch(toggleMode("light"));
  };
  const handleDarkMode = () => {
    setTheme("dark");
    dispatch(toggleMode("dark"));
  };

  const handleSystemMode = () => {
    setTheme("system");
    dispatch(toggleMode("system"));
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className={className} variant="ghost" size="icon">
          <Sun className="rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleLightMode}>Light</DropdownMenuItem>
        <DropdownMenuItem onClick={handleDarkMode}>Dark</DropdownMenuItem>
        <DropdownMenuItem onClick={handleSystemMode}>System</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default DarkModeToggle;
