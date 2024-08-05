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

function EditPostLoader() {
  return (
    <div className="w-[95%] md:w-[85%] lg:w-[75%] mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex flex-col justify-center space-y-5">
            <Skeleton className="w-32 h-8 mt-4 mx-auto" />
            <Skeleton className="w-full h-[30rem]" />
          </CardTitle>
          <CardDescription>
            <Skeleton className="w-28 h-5" />
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Skeleton className="w-full h-80 mx-auto" />
          <Skeleton className="w-32 h-5 mt-6" />
        </CardContent>
        <CardFooter className="flex flex-col">
          <Skeleton className="w-full h-80 mb-6" />
        </CardFooter>
      </Card>
    </div>
  );
}

export default EditPostLoader;
