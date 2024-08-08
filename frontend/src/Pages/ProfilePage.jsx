import React from "react";
import { useEffect, lazy, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import ProfileLoader from "@/components/Loader/ProfileLoader";

const Profile = lazy(() => import("@/components/Profile"));
const ServerErrorPage = lazy(() => import("./Error/ServerErrorPage"));

function ProfilePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userInfo = useSelector((state) => state.user.userInfo);
  const userDetails = useSelector((state) => state.user.userDetails) || {};
  const userDetailsStatus = useSelector(
    (state) => state.user.userDetailsStatus
  );

  useEffect(() => {
    if (!userInfo) {
      navigate("/login");
    }
  }, [userInfo, dispatch]);

  return (
    <Suspense fallback={<ProfileLoader />}>
      {userDetailsStatus === "loading" || userDetailsStatus === "idle" ? (
        <ProfileLoader />
      ) : userDetailsStatus === "failed" ? (
        <ServerErrorPage />
      ) : (
        <Profile user={userDetails} />
      )}
    </Suspense>
  );
}

export default ProfilePage;
