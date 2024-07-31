import React from "react";
import { useEffect, useRef, useState } from "react";
import { Outlet } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Navigation from "./components/Navigation";
import { fetchUserDetails } from "./features/UserSlice";
import { fetchGetFollow } from "./features/UserFollowSlice";
import { fetchOnlineStatus } from "./features/ChatSlice";

function Layout() {
  const dispatch = useDispatch();

  const userInfo = useSelector((state) => state.user.userInfo);
  const userDetailsStatus = useSelector(
    (state) => state.user.userDetailsStatus
  );
  const getFollowStatus = useSelector(
    (state) => state.userFollow.getFollowStatus
  );

  const [onlineStatus, setOnlineStatus] = useState("");

  useEffect(() => {
    if (userInfo) {
      dispatch(fetchUserDetails(userInfo.id));
      dispatch(fetchGetFollow(userInfo.id));
    }
  }, [userInfo, dispatch]);

  useEffect(() => {
    if (onlineStatus !== "fetch online users status") {
      dispatch(fetchOnlineStatus());
      setOnlineStatus("");
    }
  }, [onlineStatus, dispatch]);

  const websocket = useRef(null);

  useEffect(() => {
    if (userInfo) {
      websocket.current = new WebSocket(
        "ws://localhost:8000/ws/notifications/?token=" + userInfo.token
      );
      websocket.current.onopen = () => {
        console.log("Connected to websocket to notifications");
      };

      websocket.current.onmessage = (event) => {
        const data = JSON.parse(event.data);
        setOnlineStatus(data.massage);
      };

      websocket.current.onclose = (e) => {
        console.log("WebSocket closed:", e);
      };

      return () => {
        if (websocket.current) {
          websocket.current.close();
        }
      };
    }
  }, [userInfo]);

  return (
    <>
      {userDetailsStatus === "loading" ? (
        <div>Loading...</div>
      ) : userDetailsStatus === "failed" ? (
        <div>Error</div>
      ) : (
        <>
          <Navigation />
          <div className="md:ml-[55px] mt-14 md:mt-0">
            <Outlet />
          </div>
        </>
      )}
    </>
  );
}

export default Layout;
