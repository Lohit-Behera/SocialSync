import React, { useEffect, useState, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchChatRoom } from "@/features/ChatSlice";
import { fetchOtherProfile } from "@/features/UserSlice";
import Chat from "@/components/Chat";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

function ChatPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const chatRoom = useSelector((state) => state.chat.chatRoom) || {};
  const chatRoomStatus = useSelector((state) => state.chat.chatRoomStatus);
  const otherProfile = useSelector((state) => state.user.otherProfile) || {};
  const otherProfileStatus = useSelector(
    (state) => state.user.otherProfileStatus
  );

  useEffect(() => {
    dispatch(fetchChatRoom({ receiver_id: id }));
    dispatch(fetchOtherProfile(id));
  }, [id]);

  return (
    <>
      {chatRoomStatus === "loading" || chatRoomStatus === "idle" ? (
        <p>Loading...</p>
      ) : chatRoomStatus === "failed" ? (
        <p>Error</p>
      ) : (
        <div className="w-full">
          <header className="fixed top-12 md:top-0 z-10 w-full backdrop-blur bg-background/50 md:pt-4">
            <div className=" flex space-x-2">
              <Button
                size="icon"
                variant="ghost"
                onClick={() => navigate(-1)}
                className="md:mt-1"
              >
                <ArrowLeft />
              </Button>
              <Link to={`/profile/${otherProfile.id}`}>
                <Avatar className="w-10 h-10 md:w-12 md:h-12 hover:border-2 border-primary duration-100">
                  <AvatarImage src={otherProfile.profile_image} />
                  <AvatarFallback>P</AvatarFallback>
                </Avatar>
              </Link>
              <div className="flex flex-col">
                <Link to={`/profile/${otherProfile.id}`}>
                  <p className="text-sm md:text-base font-semibold text-center hover:underline">
                    {otherProfile.user_name}
                  </p>
                </Link>
                <Link to={`/profile/${otherProfile.id}`}>
                  <p className="text-xs md:text-sm text-muted-foreground/80 font-semibold text-center hover:underline">
                    {otherProfile.first_name} {otherProfile.last_name}
                  </p>
                </Link>
              </div>
            </div>
          </header>
          <div className="w-[95%] md:w-[85%] lg:w-[80%] mx-auto mt-24 md:mt-16">
            <Chat roomName={chatRoom.name} />
          </div>
        </div>
      )}
    </>
  );
}

export default ChatPage;
