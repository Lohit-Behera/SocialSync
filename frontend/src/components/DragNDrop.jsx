import React, { useState } from "react";
import { Label } from "../components/ui/label";
import { Input } from "@/components/ui/input";
import { ImageUp, Video } from "lucide-react";

const DragNDrop = ({
  className,
  handleDrop,
  uploadHandler,
  isDragging,
  setIsDragging,
  type,
}) => {
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const target = e.target;
    const relatedTarget = e.relatedTarget || e.toElement;
    if (!target.contains(relatedTarget)) {
      setIsDragging(false);
    }
  };

  return (
    <Label
      htmlFor="imageInput"
      id="imageLabel"
      onDrop={(e) => handleDrop(e)}
      onDragEnter={(e) => handleDragEnter(e)}
      onDragOver={(e) => handleDragOver(e)}
      onDragLeave={(e) => handleDragLeave(e)}
      className={`${className} w-full h-80 border-4 ${
        isDragging &&
        "bg-muted border-dashed border-gray-300 dark:border-gray-700 border-8 "
      } flex-col justify-center items-center rounded-md text-sm md:text-lg cursor-pointer`}
    >
      <div
        className="flex flex-col justify-center items-center "
        onDragLeave={(e) => e.stopPropagation()}
      >
        {type === "image" ? (
          <ImageUp
            className={`w-8 md:w-12 h-8 md:h-12 mx-auto mb-4 ${
              isDragging && "animate-bounce"
            }`}
          />
        ) : (
          <Video
            className={`w-8 md:w-12 h-8 md:h-12 mx-auto mb-4 ${
              isDragging && "animate-bounce"
            }`}
          />
        )}
        {isDragging ? (
          <p>Drop the image here</p>
        ) : (
          <p className="flex flex-col">
            <span className="text-primary underline font-bold cursor-pointer text-center">
              Click Here
            </span>
            <span>&nbsp; or Drag and Drop the {type} here to upload</span>
          </p>
        )}
      </div>
      <Input
        type="file"
        id="imageInput"
        name="image"
        className="hidden"
        accept={`${type}/*`}
        onChange={uploadHandler}
      />
    </Label>
  );
};

export default DragNDrop;
