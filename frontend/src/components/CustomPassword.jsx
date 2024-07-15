import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Eye, EyeOff } from "lucide-react";

function CustomPassword({ id, label, placeholder, change, forget }) {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className="grid gap-2">
      <div className="flex items-center">
        <Label className="" htmlFor={id}>
          {label}
        </Label>
        {forget && (
          <Link
            href="/forgot-password"
            className="ml-auto inline-block text-sm underline"
          >
            Forgot your password?
          </Link>
        )}
      </div>
      <div className="flex h-9 w-full rounded-md border border-input bg-transparent shadow-sm transition-colors placeholder:text-muted-foreground focus-within:ring-1 ring-ring">
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
          className="px-1 py-1 cursor-pointer"
        >
          {showPassword ? <EyeOff /> : <Eye />}
        </span>
      </div>
    </div>
  );
}

export default CustomPassword;
