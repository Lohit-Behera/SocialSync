import React, { lazy, Suspense } from "react";
import { useEffect, useRef, useState } from "react";
import { Outlet, ScrollRestoration } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchUserDetails } from "./features/UserSlice";
import { fetchGetFollow } from "./features/UserFollowSlice";
import { fetchOnlineStatus } from "./features/ChatSlice";
import { setWebSocketNotificationDisconnected } from "./features/WebSocketSlice";
import { ErrorBoundary } from "react-error-boundary";
import Loader from "./components/Loader/Loader";
import Navigation from "./components/Navigation";
import { socketUrl } from "./features/Proxy";

const ServerErrorPage = lazy(() => import("./Pages/Error/ServerErrorPage"));
const SomethingWentWrong = lazy(() =>
  import("./Pages/Error/SomethingWentWrong")
);

function Layout() {
  const dispatch = useDispatch();

  const userInfo = useSelector((state) => state.user.userInfo);
  const userDetailsStatus = useSelector(
    (state) => state.user.userDetailsStatus
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
        `${socketUrl}/ws/notifications/?token=${userInfo.token}`
      );
      websocket.current.onopen = () => {
        dispatch(setWebSocketNotificationDisconnected(false));
      };

      websocket.current.onmessage = (event) => {
        const data = JSON.parse(event.data);
        setOnlineStatus(data.massage);
      };

      websocket.current.onclose = (e) => {
        dispatch(setWebSocketNotificationDisconnected(true));
      };

      return () => {
        if (websocket.current) {
          websocket.current.close();
        }
      };
    }
  }, [userInfo]);

  return (
    <Suspense fallback={<Loader />}>
      <Navigation />
      <div className="md:ml-[55px] mt-14 md:mt-0">
        {userDetailsStatus === "loading" ? (
          <Loader />
        ) : userDetailsStatus === "failed" ? (
          <ServerErrorPage />
        ) : (
          <ErrorBoundary fallback={<SomethingWentWrong />}>
            {location.pathname !== "/chat/:id" && <ScrollRestoration />}
            <Outlet />
          </ErrorBoundary>
        )}
      </div>
    </Suspense>
  );
}

export default Layout;
