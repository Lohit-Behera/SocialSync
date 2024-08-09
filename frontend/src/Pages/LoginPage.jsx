import React, { useState, useEffect, lazy, Suspense } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  fetchForgetPasswordSubmit,
  fetchLogin,
  resetForgetPasswordSubmit,
} from "@/features/UserSlice";
import { toast } from "react-toastify";
import Loader from "@/components/Loader/Loader";
import WaterFall from "../assets/waterfalls.jpg";

const CustomPassword = lazy(() => import("@/components/CustomPassword"));
const CustomImage = lazy(() => import("@/components/CustomImage"));

function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userInfo = useSelector((state) => state.user.userInfo);
  const forgetPasswordSubmitStatus = useSelector(
    (state) => state.user.forgetPasswordSubmitStatus
  );

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [forgetPassword, setForgetPassword] = useState(false);

  useEffect(() => {
    if (userInfo) {
      navigate("/");
    }
  }, [userInfo, navigate]);

  useEffect(() => {
    if (forgetPasswordSubmitStatus === "succeeded") {
      setForgetPassword(false);
      dispatch(resetForgetPasswordSubmit());
    } else if (forgetPasswordSubmitStatus === "failed") {
      dispatch(resetForgetPasswordSubmit());
    }
  }, [forgetPasswordSubmitStatus]);

  const loginHandler = () => {
    if (!email || !password) {
      toast.warning("Please enter email and password");
    } else {
      const loginPromise = dispatch(
        fetchLogin({
          email: email,
          password: password,
        })
      ).unwrap();
      toast.promise(loginPromise, {
        pending: "Logging in...",
        success: "Logged in successfully",
        error: {
          render({ data }) {
            return `${
              data === "Request failed with status code 401"
                ? "Invalid email or password"
                : "Something went wrong"
            }`;
          },
        },
      });
    }
  };

  const handleForgetPassword = () => {
    if (!email) {
      toast.warning("Please enter email");
    } else {
      const forgetPasswordPromise = dispatch(
        fetchForgetPasswordSubmit({
          email: email,
        })
      ).unwrap();
      toast.promise(forgetPasswordPromise, {
        pending: "Sending password reset link...",
        success: "Password reset link sent successfully",
        error: {
          render({ data }) {
            return `${
              data === "Email not found" ? data : "Something went wrong"
            }`;
          },
        },
      });
    }
  };

  return (
    <Suspense fallback={<Loader />}>
      <div className="w-full lg:grid lg:grid-cols-2 min-h-auto md:min-h-[100vh]">
        <div className="flex items-center justify-center py-12 ">
          <div className="mx-auto grid w-[400px] gap-6 p-6 rounded-lg border-2">
            {forgetPassword ? (
              <>
                <div className="grid gap-2 text-center">
                  <h1 className="text-3xl font-bold">Forget Password</h1>
                  <p className="text-balance text-muted-foreground">
                    Enter your registered email below to change password.
                  </p>
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
                  <Button onClick={handleForgetPassword} className="w-full">
                    Send Link
                  </Button>
                  <Button
                    className="w-full"
                    onClick={() => setForgetPassword(false)}
                  >
                    Login
                  </Button>
                </div>
              </>
            ) : (
              <>
                <div className="grid gap-2 text-center">
                  <h1 className="text-3xl font-bold">Login</h1>
                  <p className="text-balance text-muted-foreground">
                    Enter your email below to login to your account
                  </p>
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
                  <CustomPassword
                    id="password"
                    label="Password"
                    placeholder="Password"
                    forget
                    onClick={() => setForgetPassword(!forgetPassword)}
                    change={(e) => setPassword(e.target.value)}
                  />
                  <Button
                    type="submit"
                    className="w-full"
                    onClick={loginHandler}
                  >
                    Login
                  </Button>
                  <Button variant="outline" className="w-full">
                    Login with Google
                  </Button>
                </div>
                <div className="mt-4 text-center text-sm">
                  Don&apos;t have an account?{" "}
                  <Link to="/signup" className="underline">
                    Sign up
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
        <div className="hidden bg-muted lg:block max-h-[110vh]">
          <a
            href="https://www.pexels.com/photo/waterfalls-surrounded-by-trees-2743287/"
            target="_blank"
          >
            <CustomImage
              src={WaterFall}
              noUrl
              alt="Image"
              width="1920"
              height="1080"
              className="h-full w-full object-cover grayscale hover:filter-none duration-300 ease-in-out"
            />
          </a>
        </div>
      </div>
    </Suspense>
  );
}

export default LoginPage;
