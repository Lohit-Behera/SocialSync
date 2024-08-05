import React from "react";
import { Skeleton } from "../ui/skeleton";

function UpdateProfileLoader() {
  return (
    <div className="w-[95%] md:w-[85%] lg:w-[70%] p-4 mx-auto border-2 rounded-lg mt-6">
      <div className="flex flex-col justify-center space-y-4">
        <Skeleton className="w-24 h-24 rounded-full mx-auto" />
        <Skeleton className="w-48 h-5 mx-auto" />
        <Skeleton className="w-72 md:w-80 h-5 mx-auto" />
        <Skeleton className="w-32 h-5 mx-auto" />
      </div>
      <div className="mt-4 flex flex-col justify-center space-y-4">
        <Skeleton className="w-48 h-8 mx-auto" />
        <Skeleton className="w-full md:w-[28rem] h-5 mx-auto" />
        <Skeleton className="w-full block md:hidden h-5 mx-auto" />
        <Skeleton className="w-24 h-5" />
        <Skeleton className="w-full h-6" />
        <div className="flex justify-between space-x-3">
          <div className="flex flex-col space-y-2 w-1/2">
            <Skeleton className="w-24 h-5" />
            <Skeleton className="w-full h-7" />
          </div>
          <div className="flex flex-col space-y-2 w-1/2">
            <Skeleton className="w-24 h-5" />
            <Skeleton className="w-full h-7" />
          </div>
        </div>
        <Skeleton className="w-20 h-5" />
        <Skeleton className="w-full h-6" />
        <Skeleton className="w-20 h-5" />
        <div className="flex space-x-3">
          <Skeleton className="w-32 h-7" />
          <Skeleton className="w-32 h-5 my-auto" />
        </div>
        <Skeleton className="w-20 h-5" />
        <Skeleton className="w-full h-6" />
        <Skeleton className="w-36 h-5" />
        <Skeleton className="w-full h-6" />
      </div>
    </div>
  );
}

export default UpdateProfileLoader;
