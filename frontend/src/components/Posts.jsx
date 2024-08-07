import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, UserMinus, UserPlus } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import VideoPlayer from "./VideoPlayer";
import CustomImage from "./CustomImage";

function Posts({
  post = {},
  bgColor = "",
  following = {},
  handleFollow,
  loadingUser,
  followStatus,
  userInfo,
}) {
  const navigate = useNavigate();
  const [activeVideoId, setActiveVideoId] = useState(null);

  if (!post || !post.id || userInfo === null) {
    return <p className="text-center">No posts</p>;
  }

  return (
    <Card key={post.id} className={bgColor}>
      <CardHeader>
        {handleFollow && (
          <CardTitle className="flex justify-between">
            <div className="flex space-x-2">
              <Link to={`/profile/${post.user}`}>
                <Avatar>
                  <AvatarImage src={post.profile_image} />
                  <AvatarFallback>P</AvatarFallback>
                </Avatar>
              </Link>
              <Link to={`/profile/${post.user}`}>
                <h3 className="text-base md:text-lg font-semibold mt-2 md:mt-0.5 lg:mt-1 hover:underline">
                  {post.user_name}
                </h3>
              </Link>
            </div>
            {post.user === userInfo.id ? null : (
              <Button
                className="text-xs md:text-sm"
                size="sm"
                variant={
                  following.includes(post.user) ? "secondary" : "default"
                }
                onClick={() =>
                  handleFollow(
                    post.user,
                    following.includes(post.user) ? "Unfollowing" : "Following"
                  )
                }
                disabled={
                  loadingUser === post.user && followStatus === "loading"
                }
              >
                {following.includes(post.user) ? (
                  <UserMinus />
                ) : loadingUser === post.user && followStatus === "loading" ? (
                  <>
                    <Loader2 className="animate-spin" />
                  </>
                ) : (
                  <UserPlus />
                )}
              </Button>
            )}
          </CardTitle>
        )}
      </CardHeader>
      <CardContent>
        {post.type === "video" && (
          <VideoPlayer
            videoSrc={post.video}
            hight="h-auto md:h-60 rounded-lg"
            videoId={post.id}
            isActive={activeVideoId === post.id}
            setActiveVideoId={setActiveVideoId}
            thumbnailSrc={post.thumbnail}
            glow="20"
          />
        )}
        {post.type === "image" && (
          <Link to={`/post/${post.id}`}>
            <CustomImage src={post.image} alt="image" className="" />
          </Link>
        )}
        <Link to={`/post/${post.id}`}>
          <p
            className={`${
              post.type === "text" ? "line-clamp-[8]" : "line-clamp-1"
            } text-xs md:text-sm lg:text-base mt-2 hover:underline`}
          >
            {post.content}
          </p>
        </Link>
        {post.type === "video" && (
          <div className="flex justify-end">
            <Button size="sm" onClick={() => navigate(`/post/${post.id}`)}>
              Details
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default Posts;
