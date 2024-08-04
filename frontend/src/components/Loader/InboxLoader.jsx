import React from "react";
import { Skeleton } from "../ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function InboxLoader() {
  return (
    <div className="w-[90%] md:w-[85%] lg:w-[80%] mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-center">
            <Skeleton className="w-24 h-7 " />
          </CardTitle>
        </CardHeader>
        <CardContent>
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="md:w-[95%] mx-auto flex justify-between bg-background p-4 rounded-lg my-4"
            >
              <div className=" flex space-x-2 ">
                <Skeleton className="w-10 h-10 md:w-16 md:h-16 rounded-full" />
                <div className="flex flex-col space-y-1 md:space-y-3">
                  <Skeleton className="w-20 md:w-24 h-3" />
                  <Skeleton className="w-24 md:w-32 h-3" />
                  <Skeleton className="w-28 md:w-40 h-3" />
                </div>
              </div>
              <Skeleton className="w-7 md:w-10 h-7 md:h-10 my-auto" />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

export default InboxLoader;
