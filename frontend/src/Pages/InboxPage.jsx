import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import moment from "moment";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchUserList, fetchOnlineStatus } from "@/features/ChatSlice";

function InboxPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userList = useSelector((state) => state.chat.userList) || [];
  const userListStatus = useSelector((state) => state.chat.userListStatus);
  const onlineStatus = useSelector((state) => state.chat.onlineStatus) || [];
  const onlineStatusStatus = useSelector(
    (state) => state.chat.onlineStatusStatus
  );

  const [onlineList, setOnlineList] = useState([]);
  const [lastSeenList, setLastSeenList] = useState([]);

  useEffect(() => {
    dispatch(fetchUserList());
    dispatch(fetchOnlineStatus());
  }, [dispatch]);

  useEffect(() => {
    if (onlineStatusStatus === "succeeded") {
      setOnlineList(onlineStatus.map((user) => user.is_online));
      setLastSeenList(onlineStatus.map((user) => user.last_seen));
    }
  }, [onlineStatus, onlineStatusStatus]);
  return (
    <>
      {userListStatus === "loading" || userListStatus === "idle" ? (
        <p>Loading...</p>
      ) : userListStatus === "failed" || onlineStatusStatus === "failed" ? (
        <p>Error</p>
      ) : (
        <div className="w-[90%] md:w-[85%] lg:w-[80%] mx-auto">
          <Card className="my-10">
            <CardHeader>
              <CardTitle className="text-2xl md:text-3xl font-bold text-center">
                Inbox
              </CardTitle>
            </CardHeader>
            <CardContent>
              {userList.length === 0 ? (
                <p className="text-center">
                  You don't have any massages. If you want to send message You
                  must follow someone
                </p>
              ) : (
                <>
                  {userList.map((user, index) => (
                    <div
                      key={user.id}
                      className="md:w-[95%] mx-auto flex justify-between bg-secondary p-4 rounded-lg my-4"
                    >
                      <div className=" flex space-x-2 ">
                        <Link to={`/profile/${user.id}`}>
                          <div className="relative">
                            <Avatar className="w-10 h-10 md:w-16 md:h-16 hover:border-2 border-primary duration-100">
                              <AvatarImage src={user.profile_image} />
                              <AvatarFallback>P</AvatarFallback>
                            </Avatar>
                            {onlineList[index] && (
                              <span className="absolute bottom-0 right-0 block h-4 w-4 rounded-full bg-green-500 border-2 border-white" />
                            )}
                          </div>
                        </Link>
                        <div className="flex flex-col">
                          <Link to={`/profile/${user.id}`}>
                            <p className="text-sm md:text-base font-semibold text-start hover:underline">
                              {user.user_name}
                            </p>
                          </Link>
                          <Link to={`/profile/${user.id}`}>
                            <p className="text-xs md:text-sm text-muted-foreground font-semibold text-start hover:underline">
                              {user.first_name} {user.last_name}
                            </p>
                          </Link>
                          <p className="text-xs md:text-sm text-muted-foreground font-semibold text-start">
                            {onlineList[index] ? "Online" : "Offline"}{" "}
                            {!onlineList[index] &&
                              `Last seen: ${moment(
                                lastSeenList[index]
                              ).fromNow()}`}
                          </p>
                        </div>
                      </div>
                      <Button
                        className="my-auto"
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          navigate(`/chat/${user.id}`);
                        }}
                      >
                        <Send className="w-5 h-5 md:w-auto md:h-auto" />
                      </Button>
                    </div>
                  ))}
                </>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}

export default InboxPage;
