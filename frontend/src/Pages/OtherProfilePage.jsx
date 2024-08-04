import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchUserDetailsUnknown } from "@/features/UserSlice";
import Profile from "@/components/Profile";
import ProfileLoader from "@/components/Loader/ProfileLoader";

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
    <>
      {userDetailsUnknownStatus === "loading" ||
      userDetailsUnknownStatus === "idle" ? (
        <ProfileLoader />
      ) : userDetailsUnknownStatus === "failed" ? (
        <p>Error</p>
      ) : (
        <Profile user={userDetailsUnknown} />
      )}
    </>
  );
}

export default OtherProfile;
