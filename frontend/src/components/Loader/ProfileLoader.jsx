import React from "react";
import { Skeleton } from "../ui/skeleton";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import PostLoader from "./PostLoader";

function ProfileLoader() {
  return (
    <div className="w-[96%] md:w-[80%] lg:w-[70%] mx-auto mt-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between">
            <div className="flex space-x-2">
              <Skeleton className="w-14 h-14 rounded-full" />
              <Skeleton className="w-24 h-5 mt-4" />
            </div>
            <Skeleton className="w-20 h-9" />
          </CardTitle>
          <CardDescription>
            <Skeleton className="w-32 h-3" />
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3">
            <div className="flex flex-col space-y-2">
              <Skeleton className="w-28 h-5 mx-auto" />
              <Skeleton className="w-14 h-5 mx-auto" />
            </div>
            <div className="flex flex-col space-y-2">
              <Skeleton className="w-28 h-5 mx-auto" />
              <Skeleton className="w-14 h-5 mx-auto" />
            </div>
            <div className="flex flex-col space-y-2">
              <Skeleton className="w-28 h-5 mx-auto" />
              <Skeleton className="w-14 h-5 mx-auto" />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <PostLoader profile bgColor="bg-muted" />
        </CardFooter>
      </Card>
    </div>
  );
}

export default ProfileLoader;
