import React from "react";
import { Skeleton } from "../ui/skeleton";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";

function PostLoader(profile = false) {
  return (
    <div className="w-[95%] md:w-[90%] lg:w-[85%] mx-auto mb-6 mt-6 md:mt-8 ">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 12 }).map((_, index) => (
          <Card key={index} className={`${profile && "bg-background"}`}>
            <CardHeader>
              {!profile && (
                <CardTitle className="flex justify-between">
                  <div className="flex space-x-2">
                    <Skeleton className="w-11 h-11 rounded-full" />
                    <Skeleton className="w-24 h-5 mt-2 md:mt-0.5 lg:mt-1" />
                  </div>
                  <Skeleton className="w-11 h-9 " />
                </CardTitle>
              )}
            </CardHeader>
            <CardContent>
              <Skeleton className="w-full h-56" />
            </CardContent>
            <CardFooter>
              <Skeleton className="w-full h-5" />
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default PostLoader;
