import React from "react";
import { useState, useEffect, lazy, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchReSendVerifyEmail,
  fetchUserUpdate,
  resetUserUpdate,
  fetchForgetPasswordSubmit,
  resetForgetPasswordSubmit,
} from "@/features/UserSlice";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "react-toastify";
import UpdateProfileLoader from "@/components/Loader/UpdateProfileLoader";
import { CloudUpload, Pencil, RefreshCcw, X } from "lucide-react";
import CustomImage from "@/components/CustomImage";
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

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [editFirstName, setEditFirstName] = useState(false);
  const [editLastName, setEditLastName] = useState(false);

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
      setProfileImage(userDetails.profile_image);
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
    if (
      firstName === userDetails.first_name &&
      lastName === userDetails.last_name &&
      !profileImage
    ) {
      toast.warning("Please update at least one field");
    } else {
      const updatePromise = dispatch(
        fetchUserUpdate({
          id: userDetails.id,
          first_name: firstName,
          last_name: lastName,
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

  const handleChangePassword = () => {
    const changePasswordPromise = dispatch(
      fetchForgetPasswordSubmit({
        type: "change",
        email: userDetails.email,
      })
    ).unwrap();
    toast.promise(changePasswordPromise, {
      pending: "Sending password change link...",
      success: "Password change link sent successfully",
      error: "Failed to send password change link",
    });
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
            <div className="grid gap-2">
              <Label htmlFor="userName">User Name</Label>
              <p id="userName" className="text-base md:text-lg font-semibold">
                {userDetails.user_name}
              </p>
            </div>
            <div className="grid gap-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="first-name">First name</Label>
                  {editFirstName ? (
                    <div className="flex justify-between space-x-1 md:space-x-2">
                      <Input
                        id="first-name"
                        placeholder="First Name"
                        onChange={(e) => setFirstName(e.target.value)}
                        value={firstName || ""}
                      />
                      <Button
                        className="my-auto"
                        variant="secondary"
                        size="icon"
                        onClick={() => setEditFirstName(false)}
                      >
                        <X />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex justify-between space-x-1 md:space-x-2">
                      <p
                        id="first-name"
                        className="text-base md:text-lg font-semibold"
                      >
                        {userDetails.first_name}
                      </p>
                      <Button
                        className="my-auto"
                        variant="secondary"
                        size="icon"
                        onClick={() => setEditFirstName(true)}
                      >
                        <Pencil />
                      </Button>
                    </div>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="last-name">Last name</Label>
                  {editLastName ? (
                    <div className="flex justify-between space-x-1 md:space-x-2">
                      <Input
                        className="my-auto"
                        id="last-name"
                        placeholder="Last Name"
                        onChange={(e) => setLastName(e.target.value)}
                        value={lastName || ""}
                      />
                      <Button
                        className="my-auto"
                        variant="secondary"
                        size="icon"
                        onClick={() => setEditLastName(false)}
                      >
                        <X />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex justify-between space-x-1 md:space-x-2">
                      <p
                        id="last-name"
                        className="text-base md:text-lg font-semibold"
                      >
                        {userDetails.last_name}
                      </p>
                      <Button
                        className="my-auto"
                        variant="secondary"
                        size="icon"
                        onClick={() => setEditLastName(true)}
                      >
                        <Pencil />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <p id="email" className="text-base md:text-lg font-semibold">
                  {userDetails.email}
                </p>
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
                {profileImage && profileImage instanceof File && (
                  <CustomImage noUrl src={URL.createObjectURL(profileImage)} />
                )}
              </div>
              <Button onClick={handleChangePassword} className="w-full">
                <RefreshCcw className="mr-2 h-4 md:h-5 w-4 md:w-5" />
                Change Password
              </Button>
              <Button onClick={updateHandler} className="w-full">
                <CloudUpload className="mr-2 h-4 md:h-5 w-4 md:w-5" />
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
