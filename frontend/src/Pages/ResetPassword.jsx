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
import { toast } from "react-toastify";

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
      navigate("/login");
      resetForgetPasswordVerify();
    }
  }, [forgetPasswordVerifyStatus]);

  const handleChangePassword = () => {
    if (password !== confirmPassword) {
      toast.warning("Passwords do not match");
    } else {
      const changePasswordPromise = dispatch(
        fetchForgetPasswordVerify({
          uid: uid,
          token: token,
          password: password,
        })
      ).unwrap();
      toast.promise(changePasswordPromise, {
        pending: "Changing password...",
        success: "Password changed successfully",
        error: "Something went wrong",
      });
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
