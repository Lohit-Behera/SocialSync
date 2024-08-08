import React from "react";
import { useState, useEffect, lazy, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchReSendVerifyEmail,
  fetchUserUpdate,
  resetUserUpdate,
} from "@/features/UserSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "react-toastify";
import UpdateProfileLoader from "@/components/Loader/UpdateProfileLoader";

const CustomPassword = lazy(() => import("@/components/CustomPassword"));
const ServerErrorPage = lazy(() => import("./Error/ServerErrorPage"));

function UpdateProfilePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userInfo = useSelector((state) => state.user.userInfo);
  const userDetails = useSelector((state) => state.user.userDetails) || {};
  const userUpdateStatus = useSelector((state) => state.user.userUpdateStatus);
  const reSendVerifyEmailStatus = useSelector(
    (state) => state.user.reSendVerifyEmailStatus
  );

  const [userName, setUserName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    if (userUpdateStatus === "succeeded") {
      dispatch(resetUserUpdate());
    } else if (userUpdateStatus === "failed") {
      dispatch(resetUserUpdate());
    }
  }, [userUpdateStatus]);

  useEffect(() => {
    if (!userInfo) {
      navigate("/login");
    } else {
      setFirstName(userDetails.first_name);
      setLastName(userDetails.last_name);
      setEmail(userDetails.email);
      setProfileImage(userDetails.profile_image);
      setUserName(userDetails.user_name);
    }
  }, [userInfo, userDetails, userUpdateStatus]);

  useEffect(() => {
    if (reSendVerifyEmailStatus === "succeeded") {
      dispatch(resetUserUpdate());
    } else if (reSendVerifyEmailStatus === "failed") {
      dispatch(resetUserUpdate());
    }
  }, [reSendVerifyEmailStatus]);

  const imageHandler = (e) => {
    const file = e.target.files[0];
    if (file.type.startsWith("image/")) {
      setProfileImage(file);
    } else {
      toast.warning("Please select an image file");
    }
  };

  const updateHandler = (e) => {
    if (password !== confirmPassword) {
      toast.warning("Passwords do not match");
    } else {
      const updatePromise = dispatch(
        fetchUserUpdate({
          id: userDetails.id,
          first_name: firstName,
          last_name: lastName,
          email: email,
          password: password,
          profile_image: profileImage,
        })
      ).unwrap();
      toast.promise(updatePromise, {
        pending: "Updating profile...",
        success: "Profile updated successfully",
        error: "Failed to update profile",
      });
    }
  };

  const sendVerifyEmailHandler = () => {
    const sendVerifyEmailPromise = dispatch(fetchReSendVerifyEmail()).unwrap();
    toast.promise(sendVerifyEmailPromise, {
      pending: "Sending verification email...",
      success: "Verification email sent successfully",
      error: "Failed to send verification email",
    });
  };

  return (
    <Suspense fallback={<UpdateProfileLoader />}>
      {userUpdateStatus === "loading" ? (
        <UpdateProfileLoader />
      ) : userUpdateStatus === "failed" ? (
        <ServerErrorPage />
      ) : (
        <div className="w-[95%] md:w-[85%] lg:w-[70%] my-6 mx-auto  border-2 rounded-lg bg-card">
          <div className="flex-col mx-6 my-4 space-y-2">
            <Avatar className="w-24 h-24 mx-auto">
              <AvatarImage src={userDetails.profile_image} />
              <AvatarFallback>P</AvatarFallback>
            </Avatar>
            <p className="text-base lg:text-lg text-center">
              Name: {userDetails.first_name} {userDetails.last_name}
            </p>
            <p className="text-base lg:text-lg text-center">
              Email: {userDetails.email}
            </p>
            <p className="text-base lg:text-lg text-center">
              Verified: {userDetails.is_verified ? "Yes" : "No"}{" "}
              {!userDetails.is_verified && (
                <Button onClick={sendVerifyEmailHandler} size="sx">
                  Verify
                </Button>
              )}
            </p>
          </div>
          <div className="mx-6 my-4 space-y-4">
            <h1 className="text-lg md:text-2xl font-bold text-center my-4 ">
              Update Profile
            </h1>
            <h3 className="text-center">
              if you don't want to change image or password just leave it blank
            </h3>
            <div className="grid gap-2">
              <Label htmlFor="userName">User Name</Label>
              <Input
                id="userName"
                placeholder="User Name"
                required
                value={userName || ""}
                onChange={(e) => setUserName(e.target.value)}
              />
            </div>
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="first-name">First name</Label>
                  <Input
                    id="first-name"
                    placeholder="First Name"
                    onChange={(e) => setFirstName(e.target.value)}
                    value={firstName || ""}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="last-name">Last name</Label>
                  <Input
                    id="last-name"
                    placeholder="Last Name"
                    onChange={(e) => setLastName(e.target.value)}
                    value={lastName || ""}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Email"
                  onChange={(e) => setEmail(e.target.value)}
                  value={email || ""}
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
              <Button onClick={updateHandler} className="w-full">
                Update
              </Button>
            </div>
          </div>
        </div>
      )}
    </Suspense>
  );
}

export default UpdateProfilePage;
