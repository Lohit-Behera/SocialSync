import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  resetForgetPasswordVerify,
  fetchForgetPasswordVerify,
} from "@/features/UserSlice";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import CustomPassword from "@/components/CustomPassword";

function ResetPassword() {
  const { uid, token } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const forgetPasswordVerifyStatus = useSelector(
    (state) => state.user.forgetPasswordVerifyStatus
  );

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    if (forgetPasswordVerifyStatus === "succeeded") {
      alert("Password changed successfully");
      navigate("/login");
      resetForgetPasswordVerify();
    } else if (forgetPasswordVerifyStatus === "failed") {
      alert("Password change failed");
    }
  }, [forgetPasswordVerifyStatus]);

  const handleChangePassword = () => {
    if (password !== confirmPassword) {
      alert("Passwords do not match");
    } else {
      dispatch(
        fetchForgetPasswordVerify({
          uid: uid,
          token: token,
          password: password,
        })
      );
    }
  };
  return (
    <div className="grid place-items-center min-h-[80vh]">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Change Password</CardTitle>
          <CardDescription>Enter your new password.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <CustomPassword
              id="password"
              label="Password"
              placeholder="Password"
              change={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <CustomPassword
              id="confirm-password"
              label="Confirm Password"
              placeholder="Confirm Password"
              change={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={handleChangePassword}>
            Change Password
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default ResetPassword;
