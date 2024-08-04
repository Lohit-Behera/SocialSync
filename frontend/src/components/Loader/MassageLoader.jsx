import React from "react";
import { Skeleton } from "../ui/skeleton";

function MassageLoader() {
  return (
    <div className="w-[95%] md:w-[85%] lg:w-[80%] mx-auto mt-24 md:mt-16 space-y-4">
      <div className="flex justify-end">
        <div className="flex flex-col justify-end space-y-2">
          <Skeleton className="w-60 h-8" />
          <div className="flex justify-end">
            <Skeleton className="w-20 h-3" />
          </div>
        </div>
      </div>
      <div className="flex flex-col space-y-2">
        <Skeleton className="w-96 h-8" />
        <Skeleton className="w-20 h-3" />
      </div>
      <div className="flex flex-col space-y-2">
        <Skeleton className="w-28 h-8" />
        <Skeleton className="w-20 h-3" />
      </div>
      <div className="flex justify-end">
        <div className="flex flex-col justify-end space-y-2">
          <Skeleton className="w-72 h-8" />
          <div className="flex justify-end">
            <Skeleton className="w-20 h-3" />
          </div>
        </div>
      </div>
      <div className="flex flex-col space-y-2">
        <Skeleton className="w-56 h-8" />
        <Skeleton className="w-20 h-3" />
      </div>
      <div className="flex justify-end">
        <div className="flex flex-col justify-end space-y-2">
          <Skeleton className="w-96 h-8" />
          <div className="flex justify-end">
            <Skeleton className="w-20 h-3" />
          </div>
        </div>
      </div>
      <div className="flex justify-end">
        <div className="flex flex-col justify-end space-y-2">
          <Skeleton className="w-32 h-8" />
          <div className="flex justify-end">
            <Skeleton className="w-20 h-3" />
          </div>
        </div>
      </div>
      <div className="flex flex-col space-y-2">
        <Skeleton className="w-28 h-8" />
        <Skeleton className="w-20 h-3" />
      </div>
      <div className="flex flex-col space-y-2">
        <Skeleton className="w-80 h-8" />
        <Skeleton className="w-20 h-3" />
      </div>
      <div className="flex justify-end">
        <div className="flex flex-col justify-end space-y-2">
          <Skeleton className="w-60 h-8" />
          <div className="flex justify-end">
            <Skeleton className="w-20 h-3" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default MassageLoader;
