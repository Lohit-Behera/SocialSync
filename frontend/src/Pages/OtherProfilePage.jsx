import React, { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchUserDetailsUnknown } from "@/features/UserSlice";
import Profile from "@/components/Profile";

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
        <p>Loading...</p>
      ) : userDetailsUnknownStatus === "failed" ? (
        <p>Error</p>
      ) : (
        <Profile user={userDetailsUnknown} />
      )}
    </>
  );
}

export default OtherProfile;
