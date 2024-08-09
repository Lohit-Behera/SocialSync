import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "@/features/UserSlice";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  Home,
  Image,
  Send,
  NotebookText,
  Clapperboard,
  PanelLeft,
  LogIn,
  SquarePlus,
  ImageMinus,
} from "lucide-react";
import Logo from "@/assets/Logo.svg";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import DarkModeToggle from "./DarkModeToggle";

function Navigation() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userInfo = useSelector((state) => state.user.userInfo);
  const userDetails = useSelector((state) => state.user.userDetails);
  const profileImage = userDetails ? userDetails.profile_image : "";

  const handleLogout = () => {
    dispatch(logout());
  };
  return (
    <>
      <div className="hidden md:flex">
        <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col backdrop-blur bg-background/70 border-r sm:flex ">
          <nav className="flex flex-col items-center gap-4 px-2">
            <Link to="/" className="mt-2">
              <Avatar className="hover:scale-110 duration-300">
                <AvatarImage src={Logo} noUrl />
                <AvatarFallback>L</AvatarFallback>
              </Avatar>
            </Link>
            {userInfo ? (
              <>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <NavLink to="/">
                        {({ isActive }) => (
                          <Button
                            variant={`${isActive ? "default" : "ghost"}`}
                            size="icon"
                            className={`${
                              !isActive &&
                              "text-muted-foreground transition-colors hover:text-foreground"
                            }`}
                          >
                            <Home />
                          </Button>
                        )}
                      </NavLink>
                    </TooltipTrigger>
                    <TooltipContent side="right">Home</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <NavLink to="/inbox">
                        {({ isActive }) => (
                          <Button
                            variant={`${isActive ? "default" : "ghost"}`}
                            size="icon"
                            className={`${
                              !isActive &&
                              "text-muted-foreground transition-colors hover:text-foreground"
                            }`}
                          >
                            <Send />
                          </Button>
                        )}
                      </NavLink>
                    </TooltipTrigger>
                    <TooltipContent side="right">inbox</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <NavLink to="/text-post">
                        {({ isActive }) => (
                          <Button
                            variant={`${isActive ? "default" : "ghost"}`}
                            size="icon"
                            className={`${
                              !isActive &&
                              "text-muted-foreground transition-colors hover:text-foreground"
                            }`}
                          >
                            <NotebookText />
                          </Button>
                        )}
                      </NavLink>
                    </TooltipTrigger>
                    <TooltipContent side="right">Text</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <NavLink to="/image-post">
                        {({ isActive }) => (
                          <Button
                            variant={`${isActive ? "default" : "ghost"}`}
                            size="icon"
                            className={`${
                              !isActive &&
                              "text-muted-foreground transition-colors hover:text-foreground"
                            }`}
                          >
                            <Image />
                          </Button>
                        )}
                      </NavLink>
                    </TooltipTrigger>
                    <TooltipContent side="right">Image</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <NavLink to="/video-post">
                        {({ isActive }) => (
                          <Button
                            variant={`${isActive ? "default" : "ghost"}`}
                            size="icon"
                            className={`${
                              !isActive &&
                              "text-muted-foreground transition-colors hover:text-foreground"
                            }`}
                          >
                            <Clapperboard />
                          </Button>
                        )}
                      </NavLink>
                    </TooltipTrigger>
                    <TooltipContent side="right">Video</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <NavLink to="/create-post">
                        {({ isActive }) => (
                          <Button
                            variant={`${isActive ? "default" : "ghost"}`}
                            size="icon"
                            className={`${
                              !isActive &&
                              "text-muted-foreground transition-colors hover:text-foreground"
                            }`}
                          >
                            <SquarePlus />
                          </Button>
                        )}
                      </NavLink>
                    </TooltipTrigger>
                    <TooltipContent side="right">Create Post</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </>
            ) : (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <NavLink to="/login">
                      {({ isActive }) => (
                        <Button
                          variant={`${isActive ? "default" : "ghost"}`}
                          size="icon"
                          className={`${
                            !isActive &&
                            "text-muted-foreground transition-colors hover:text-foreground"
                          }`}
                        >
                          <LogIn />
                        </Button>
                      )}
                    </NavLink>
                  </TooltipTrigger>
                  <TooltipContent side="right">Login</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </nav>
          <nav className="mt-auto flex flex-col items-center gap-4 px-2 mb-2">
            <DarkModeToggle />
            {userInfo && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="overflow-hidden rounded-full"
                  >
                    <Avatar>
                      <AvatarImage src={profileImage} />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate(`/profile`)}>
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/update-profile")}>
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/support")}>
                    Support
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </nav>
        </aside>
      </div>
      <header className="fixed inset-x-0 top-0 z-50 backdrop-blur bg-background/50 block md:hidden">
        <nav className="flex justify-between p-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button size="icon" variant="outline">
                <PanelLeft className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[180px]">
              <nav className="grid gap-6 text-lg font-medium">
                <SheetClose asChild>
                  <Link to="/" className="ml-5">
                    <Avatar>
                      <AvatarImage src={Logo} noUrl />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                  </Link>
                </SheetClose>
                {userInfo ? (
                  <>
                    <SheetClose asChild>
                      <NavLink to="/">
                        {({ isActive }) => (
                          <Button
                            variant={`${isActive ? "default" : "ghost"}`}
                            className={`${
                              !isActive &&
                              "text-muted-foreground transition-colors hover:text-foreground"
                            }`}
                          >
                            <Home className="mr-2 h-4 w-4" /> Home
                          </Button>
                        )}
                      </NavLink>
                    </SheetClose>
                    <SheetClose asChild>
                      <NavLink to="/inbox">
                        {({ isActive }) => (
                          <Button
                            variant={`${isActive ? "default" : "ghost"}`}
                            className={`${
                              !isActive &&
                              "text-muted-foreground transition-colors hover:text-foreground"
                            }`}
                          >
                            <Send className="mr-2 h-4 w-4" />
                            inbox
                          </Button>
                        )}
                      </NavLink>
                    </SheetClose>
                    <SheetClose asChild>
                      <NavLink to="/text-post">
                        {({ isActive }) => (
                          <Button
                            variant={`${isActive ? "default" : "ghost"}`}
                            className={`${
                              !isActive &&
                              "text-muted-foreground transition-colors hover:text-foreground"
                            }`}
                          >
                            <NotebookText className="mr-2 h-4 w-4" />
                            Text
                          </Button>
                        )}
                      </NavLink>
                    </SheetClose>
                    <SheetClose asChild>
                      <NavLink to="/image-post">
                        {({ isActive }) => (
                          <Button
                            variant={`${isActive ? "default" : "ghost"}`}
                            className={`${
                              !isActive &&
                              "text-muted-foreground transition-colors hover:text-foreground"
                            }`}
                          >
                            <Image className="mr-2 h-4 w-4" />
                            Image
                          </Button>
                        )}
                      </NavLink>
                    </SheetClose>
                    <SheetClose asChild>
                      <NavLink to="/video-post">
                        {({ isActive }) => (
                          <Button
                            variant={`${isActive ? "default" : "ghost"}`}
                            className={`${
                              !isActive &&
                              "text-muted-foreground transition-colors hover:text-foreground"
                            }`}
                          >
                            <Clapperboard className="mr-2 h-4 w-4" />
                            Video
                          </Button>
                        )}
                      </NavLink>
                    </SheetClose>
                    <SheetClose asChild>
                      <NavLink to="/create-post">
                        {({ isActive }) => (
                          <Button
                            variant={`${isActive ? "default" : "ghost"}`}
                            className={`${
                              !isActive &&
                              "text-muted-foreground transition-colors hover:text-foreground"
                            }`}
                          >
                            <SquarePlus className="mr-2 h-4 w-4" />
                            Create Post
                          </Button>
                        )}
                      </NavLink>
                    </SheetClose>
                  </>
                ) : (
                  <SheetClose asChild>
                    <NavLink to="/login">
                      {({ isActive }) => (
                        <Button
                          variant={`${isActive ? "default" : "ghost"}`}
                          className={`${
                            !isActive &&
                            "text-muted-foreground transition-colors hover:text-foreground"
                          }`}
                        >
                          <LogIn className="mr-2 h-4 w-4" /> Login
                        </Button>
                      )}
                    </NavLink>
                  </SheetClose>
                )}
              </nav>
            </SheetContent>
          </Sheet>
          <div className="flex justify-center space-x-3">
            <DarkModeToggle />
            {userInfo && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="overflow-hidden rounded-full"
                  >
                    <Avatar>
                      <AvatarImage src={profileImage} />
                      <AvatarFallback>L</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => navigate(`/profile/${userInfo.id}`)}
                  >
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/update-profile")}>
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/support")}>
                    Support
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </nav>
      </header>
    </>
  );
}

export default Navigation;
