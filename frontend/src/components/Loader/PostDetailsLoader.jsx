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

function PostDetailsLoader() {
  return (
    <div className="w-[90%] md:w-[80%] lg:w-[70%] mx-auto">
      <Card className="my-10">
        <CardHeader>
          <CardTitle className="flex justify-between ">
            <div className="flex space-x-2">
              <Skeleton className="w-14 h-14 rounded-full" />
              <Skeleton className="w-24 h-5 mt-4" />
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="w-full md:w-[80%] lg:w-[70%] mx-auto h-96" />
          <Skeleton className="w-[70%] h-5" />
        </CardContent>
        <CardFooter>
          <div className="flex justify-between w-full">
            <div className="flex space-x-2">
              <Skeleton className="w-28 h-3" />
            </div>
            <div className="flex space-x-2">
              <Skeleton className="w-10 h-10 " />
              <Skeleton className="w-10 h-10 " />
              <Skeleton className="w-10 h-10 " />
            </div>
          </div>
        </CardFooter>
        <div className="mb-6 px-6 ">
          <Skeleton className="w-20 h-5 mx-auto mb-4" />
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="flex flex-col space-y-3 bg-background w-full rounded-lg p-4"
              >
                <div className="flex space-x-2">
                  <Skeleton className="w-14 h-14 rounded-full" />
                  <Skeleton className="w-24 h-4 mt-4" />
                </div>
                <Skeleton className="w-full h-5" />
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}

export default PostDetailsLoader;
