import React from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Profile from "@/components/Profile";

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
    <>
      {userDetailsStatus === "loading" || userDetailsStatus === "idle" ? (
        <div>Loading...</div>
      ) : userDetailsStatus === "failed" ? (
        <div>Error</div>
      ) : (
        <Profile user={userDetails} />
      )}
    </>
  );
}

export default ProfilePage;
