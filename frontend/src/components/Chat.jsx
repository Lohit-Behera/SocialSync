import React, { useState, useEffect, useRef, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchAllMassage,
  fetchInitialMessage,
  resetInitialMessage,
  resetAllMessage,
} from "@/features/ChatSlice";
import moment from "moment";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Loader2, Send } from "lucide-react";

const Chat = ({ roomName }) => {
  const dispatch = useDispatch();

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [totalPages, setTotalPages] = useState(2);
  const [currentPage, setCurrentPage] = useState(1);
  console.log(`currentPage: ${currentPage}, totalPages: ${totalPages}`);

  const [scroll, setScroll] = useState(false);
  const [complete, setComplete] = useState(false);
  const [noMorePost, setNoMorePost] = useState(false);

  const scrollToBottom = () => {
    const scrollableHeight = document.documentElement.scrollHeight;
    window.scrollTo({
      top: scrollableHeight,
      behavior: "smooth",
    });
  };

  const websocket = useRef(null);
  const userInfo = useSelector((state) => state.user.userInfo);
  const initialMessage =
    useSelector((state) => state.chat.initialMessage) || {};
  const initialMessageStatus = useSelector(
    (state) => state.chat.initialMessageStatus
  );
  const allMessagesData = useSelector((state) => state.chat.allMessage) || {};
  const allMessageStatus = useSelector((state) => state.chat.allMessageStatus);
  const allMessageError = useSelector((state) => state.chat.allMessageError);

  useEffect(() => {
    const scrollableHeight = document.documentElement.scrollHeight;
    window.scrollTo({
      top: scrollableHeight,
    });
    setMessages([]);
    dispatch(resetInitialMessage());
    dispatch(resetAllMessage());
  }, []);

  useEffect(() => {
    if (initialMessageStatus === "succeeded") {
      const firstMessage = initialMessage.messages || [];
      console.log(firstMessage);

      const chatMessages = [...firstMessage].reverse();
      setMessages([...chatMessages].concat(messages));
      setTotalPages(initialMessage.total_pages);
      setCurrentPage(initialMessage.current_page);
      setScroll(true);
    } else if (initialMessageStatus === "failed") {
      setMessages([]);
    } else if (initialMessageStatus === "idle") {
      dispatch(fetchInitialMessage(roomName));
    }
  }, [roomName, dispatch, initialMessageStatus]);

  useEffect(() => {
    if (allMessageStatus === "succeeded") {
      setTotalPages(allMessagesData.total_pages);
      setCurrentPage(allMessagesData.current_page);
      const chatMessages = [...allMessagesData.messages].reverse();
      setMessages([...chatMessages].concat(messages));
    } else if (allMessageStatus === "failed") {
      if (allMessageError === "Invalid page.") {
        setComplete(true);
      }
      setTotalPages(2);
      setCurrentPage(1);
    }
  }, [roomName, dispatch, allMessageStatus]);

  useEffect(() => {
    scrollToBottom();
  }, [scroll]);

  const handleScroll = useCallback(() => {
    const scrollY = window.scrollY;
    if (scrollY === 0) {
      if (currentPage === totalPages) {
        setNoMorePost(true);
      } else if (currentPage < totalPages) {
        dispatch(
          fetchAllMassage({
            roomName: roomName,
            keyword: `?page=${currentPage + 1}`,
          })
        );
      }
    }
  }, [currentPage, totalPages, dispatch]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  useEffect(() => {
    websocket.current = new WebSocket(
      `ws://localhost:8000/ws/chat/${roomName}/`
    );

    websocket.current.onopen = () => {
      console.log("Connected to websocket");
    };

    websocket.current.onmessage = (e) => {
      const data = JSON.parse(e.data);
      setMessages((prev) => [...prev, data]);
      scrollToBottom();
    };

    websocket.current.onerror = (e) => {
      console.error("WebSocket error:", e);
    };

    websocket.current.onclose = (e) => {
      console.log("WebSocket closed:", e);
    };

    return () => {
      websocket.current.close();
    };
  }, [roomName, userInfo]);

  const sendMessage = () => {
    if (newMessage === "") {
      alert("Please enter a message");
    } else {
      const [senderId, receiverId] = roomName.split("_");

      websocket.current.send(
        JSON.stringify({
          message: newMessage,
          sender_id: userInfo.id,
          receiver_id: senderId === userInfo.id ? receiverId : senderId,
        })
      );
      setNewMessage("");
    }
  };

  return (
    <>
      {initialMessageStatus === "loading" || initialMessageStatus === "idle" ? (
        <p>Loading...</p>
      ) : initialMessageStatus === "failed" ? (
        <p>Something went wrong</p>
      ) : (
        <>
          {allMessageStatus === "loading" && (
            <Loader2 className="animate-spin mx-auto my-4 w-12 h-12" />
          )}
          {(complete || noMorePost) && (
            <p className="text-center">No more messages</p>
          )}
          <div className="space-y-4 min-h-[80vh] mb-10">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex flex-col ${
                  msg.sender === userInfo.id ? "justify-end" : "justify-start"
                } `}
              >
                <div
                  className={`flex gap-2 ${
                    msg.sender === userInfo.id ? "justify-end" : "justify-start"
                  }`}
                >
                  <p
                    className={`flex max-w-[70%] break-words bg-secondary p-2 rounded-lg `}
                    style={{ wordBreak: "break-word" }}
                  >
                    {msg.message}
                  </p>
                </div>
                <em
                  className={`text-xs text-muted-foreground ${
                    msg.sender === userInfo.id ? "text-right" : ""
                  }`}
                >
                  {moment(msg.timestamp).fromNow()}
                </em>
              </div>
            ))}
          </div>
          <div className="flex sticky mx-auto bg-background/50 backdrop-blur bottom-0 gap-3 p-3 rounded-full">
            <Input
              className="w-[80%] md:w-full mt-0.5 bg-secondary rounded-full"
              type="text"
              placeholder="Type a message"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <Button
              className="rounded-full mt-1 md:mt-0"
              size="icon"
              onClick={sendMessage}
            >
              <Send className="mr-1 w-5 h-5 md:w-auto md:h-auto" />
            </Button>
          </div>
        </>
      )}
    </>
  );
};

export default Chat;
