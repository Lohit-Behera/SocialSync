import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { fetchRegister, resetRegister } from "@/features/UserSlice";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import CustomPassword from "@/components/CustomPassword";
import WaterFall from "../assets/waterfalls.jpg";

function SignupPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userInfo = useSelector((state) => state.user.userInfo);
  const registerStatus = useSelector((state) => state.user.registerStatus);

  useEffect(() => {
    if (userInfo) {
      navigate("/");
    }
  }, [userInfo, navigate]);

  useEffect(() => {
    if (registerStatus === "succeeded") {
      navigate("/login");
      alert("Registration successful");
      dispatch(resetRegister());
    } else if (registerStatus === "failed") {
      alert("Something went wrong!");
      dispatch(resetRegister());
    }
  }, [registerStatus, navigate]);

  const [userName, setUserName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const imageHandler = (e) => {
    const file = e.target.files[0];
    if (file.type.startsWith("image/")) {
      setProfileImage(file);
    } else {
      alert("Please select an image file");
    }
  };

  const submitHandler = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match");
    } else if (!firstName || !lastName || !email || !password) {
      alert("Please enter all fields");
    } else {
      const formData = new FormData();
      formData.append("user_name", userName);
      formData.append("first_name", firstName);
      formData.append("last_name", lastName);
      formData.append("email", email);
      formData.append("profile_image", profileImage);
      formData.append("password", password);

      dispatch(fetchRegister(formData));
    }
  };

  return (
    <div className="w-full lg:grid lg:grid-cols-2 min-h-auto md:min-h-[100vh]">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">Sign Up</h1>
            <p className="text-balance text-muted-foreground">
              Enter your information to create an account
            </p>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="userName">User Name</Label>
            <Input
              id="userName"
              placeholder="User Name"
              required
              onChange={(e) => setUserName(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="first-name">First name</Label>
              <Input
                id="first-name"
                placeholder="First name"
                required
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="last-name">Last name</Label>
              <Input
                id="last-name"
                placeholder="Last name"
                required
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
          </div>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Email"
                required
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="profile-image">Profile Image</Label>
              <input
                type="file"
                name="image"
                id="image-upload"
                accept="image/*"
                label="Upload Image"
                onChange={(e) => imageHandler(e)}
                className="block w-full text-primary font-semibold file:me-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground file:hover:cursor-pointer hover:file:bg-primary/90  file:disabled:opacity-50 file:disabled:pointer-events-none cursor-pointer"
              />
            </div>
            <CustomPassword
              id="password"
              label="Password"
              placeholder="Password"
              change={(e) => setPassword(e.target.value)}
            />
            <CustomPassword
              id="confirm-password"
              label="Confirm Password"
              placeholder="Confirm Password"
              change={(e) => setConfirmPassword(e.target.value)}
            />
            <Button type="submit" className="w-full" onClick={submitHandler}>
              Sign Up
            </Button>
            <Button variant="outline" className="w-full">
              Sign Up with Google
            </Button>
          </div>
          <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <Link to="/login" className="underline">
              Sign in
            </Link>
          </div>
        </div>
      </div>
      <div className="hidden bg-muted lg:block ">
        <a
          href="https://www.pexels.com/photo/waterfalls-surrounded-by-trees-2743287/"
          target="_blank"
        >
          <img
            src={WaterFall}
            alt="Image"
            className="h-full w-full object-cover grayscale hover:grayscale-0 duration-700 ease-in-out"
          />
        </a>
      </div>
    </div>
  );
}

export default SignupPage;
