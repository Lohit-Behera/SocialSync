import React, { useEffect, lazy, Suspense } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchUserDetailsUnknown } from "@/features/UserSlice";
import ProfileLoader from "@/components/Loader/ProfileLoader";

const Profile = lazy(() => import("@/components/Profile"));
const ServerErrorPage = lazy(() => import("./Error/ServerErrorPage"));

function OtherProfile() {
  const dispatch = useDispatch();
  const { id } = useParams();

  const userDetailsUnknown =
    useSelector((state) => state.user.userDetailsUnknown) || {};
  const userDetailsUnknownStatus = useSelector(
    (state) => state.user.userDetailsUnknownStatus
  );
  const followStatus = useSelector((state) => state.userFollow.followStatus);

  useEffect(() => {
    if (id) {
      if (followStatus === "succeeded" || followStatus === "idle") {
        dispatch(fetchUserDetailsUnknown(id));
      }
      dispatch(fetchUserDetailsUnknown(id));
    }
  }, [id, dispatch, followStatus]);
  return (
    <Suspense fallback={<ProfileLoader />}>
      {userDetailsUnknownStatus === "loading" ||
      userDetailsUnknownStatus === "idle" ? (
        <ProfileLoader />
      ) : userDetailsUnknownStatus === "failed" ? (
        <ServerErrorPage />
      ) : (
        <Profile user={userDetailsUnknown} />
      )}
    </Suspense>
  );
}

export default OtherProfile;
