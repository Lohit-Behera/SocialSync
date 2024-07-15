import React, { useState, useEffect, useRef } from "react";
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
  const [isAtTop, setIsAtTop] = useState(false);
  const [totalPages, setTotalPages] = useState(2);
  const [currentPage, setCurrentPage] = useState(1);
  const [scroll, setScroll] = useState(false);
  const [complete, setComplete] = useState(false);

  const bottom = useRef(null);

  const scrollToBottom = () => {
    if (bottom.current) {
      bottom.current.scrollIntoView({ block: "end" });
    }
  };

  const websocket = useRef(null);
  const userInfo = useSelector((state) => state.user.userInfo);
  const initialMessage =
    useSelector((state) => state.chat.initialMessage) || [];
  const initialMessageStatus = useSelector(
    (state) => state.chat.initialMessageStatus
  );
  const allMessagesData = useSelector((state) => state.chat.allMessage) || {};
  const allMessageStatus = useSelector((state) => state.chat.allMessageStatus);
  const allMessageError = useSelector((state) => state.chat.allMessageError);

  useEffect(() => {
    setMessages([]);
    scrollToBottom();
    dispatch(resetInitialMessage());
    dispatch(resetAllMessage());
  }, []);

  useEffect(() => {
    if (initialMessageStatus === "succeeded") {
      const chatMassages = [...initialMessage].reverse();
      setMessages([...chatMassages].concat(messages));
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
      const chatMassages = [...allMessagesData.massages].reverse();
      setMessages([...chatMassages].concat(messages));
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

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY === 0) {
        setIsAtTop(true);
      } else {
        setIsAtTop(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    if (isAtTop) {
      if (currentPage < totalPages && !complete) {
        dispatch(
          fetchAllMassage({
            roomName: roomName,
            keyword: `?page=${currentPage + 1}`,
          })
        );
      }
    }
  }, [isAtTop]);

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
          {complete && <p className="text-center">No more messages</p>}
          <div className="space-y-4 min-h-[80vh] mb-4">
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
          <div className="flex justify-center bottom-0 my-4 gap-3 p-3">
            <Input
              className="w-[80%] md:w-full mt-0.5 bg-secondary rounded-full"
              type="text"
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
          <div ref={bottom}></div>
        </>
      )}
    </>
  );
};

export default Chat;
