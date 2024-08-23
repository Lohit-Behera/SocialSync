import React from "react";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";

function CustomPassword({ id, label, placeholder, change, forget, onClick }) {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className="grid gap-2">
      <div className="flex items-center">
        <Label className="" htmlFor={id}>
          {label}
        </Label>
        {forget && (
          <span
            onClick={onClick}
            className="ml-auto inline-block text-sm hover:underline hover:cursor-pointer"
          >
            Forgot your password?
          </span>
        )}
      </div>
      <div className="flex h-9 w-full rounded-md border border-input bg-background shadow-sm transition-colors placeholder:text-muted-foreground focus-within:ring-1 ring-ring">
        <Input
          className=" h-auto border-0 focus-visible:outline-none focus-visible:ring-0 bg-background w-full"
          id={id}
          type={showPassword ? "text" : "password"}
          placeholder={placeholder}
          required
          onChange={change}
        />
        <span
          onClick={() => setShowPassword(!showPassword)}
          className="px-1 py-1 cursor-pointer "
        >
          {showPassword ? <EyeOff /> : <Eye />}
        </span>
      </div>
    </div>
  );
}

export default CustomPassword;
