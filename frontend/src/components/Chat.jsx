import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  lazy,
  Suspense,
} from "react";
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
import { setWebSocketChatDisconnected } from "@/features/WebSocketSlice";
import { toast } from "react-toastify";
import MassageLoader from "./Loader/MassageLoader";
import { socketUrl } from "@/features/Proxy";

const ServerErrorPage = lazy(() => import("../Pages/Error/ServerErrorPage"));

const Chat = ({ roomName }) => {
  const dispatch = useDispatch();

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [totalPages, setTotalPages] = useState(2);
  const [currentPage, setCurrentPage] = useState(1);

  const [scroll, setScroll] = useState(false);
  const [complete, setComplete] = useState(false);
  const [noMorePost, setNoMorePost] = useState(false);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
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
    setMessages([]);
    dispatch(resetInitialMessage());
    dispatch(resetAllMessage());
    scrollToBottom();
  }, [dispatch]);

  useEffect(() => {
    if (initialMessageStatus === "succeeded") {
      const firstMessage = initialMessage.messages || [];
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
    if (scroll) {
      scrollToBottom();
      setScroll(false);
    }
  }, [scroll]);

  const handleScroll = useCallback(() => {
    const scrollY = window.scrollY;
    if (scrollY === 0 && currentPage < totalPages) {
      dispatch(
        fetchAllMassage({
          roomName: roomName,
          keyword: `?page=${currentPage + 1}`,
        })
      );
    } else if (scrollY === 0 && currentPage === totalPages) {
      setNoMorePost(true);
    }
  }, [currentPage, totalPages, dispatch]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  useEffect(() => {
    websocket.current = new WebSocket(`${socketUrl}/ws/chat/${roomName}/`);

    websocket.current.onopen = () => {
      dispatch(setWebSocketChatDisconnected(false));
    };

    websocket.current.onmessage = (e) => {
      const data = JSON.parse(e.data);
      setMessages((prev) => [...prev, data]);
      scrollToBottom();
    };

    websocket.current.onerror = (e) => {};

    websocket.current.onclose = (e) => {
      dispatch(setWebSocketChatDisconnected(true));
    };

    return () => {
      websocket.current.close();
    };
  }, [roomName, userInfo]);

  const sendMessage = () => {
    if (newMessage === "") {
      toast.warn("Please enter a message");
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
      scrollToBottom();
    }
  };

  return (
    <Suspense fallback={<MassageLoader />}>
      {initialMessageStatus === "loading" || initialMessageStatus === "idle" ? (
        <MassageLoader />
      ) : initialMessageStatus === "failed" ? (
        <ServerErrorPage />
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
                    className={`flex max-w-[70%] break-words text-sm md:text-base ${
                      msg.sender === userInfo.id ? "bg-primary" : "bg-secondary"
                    } p-2 rounded-lg `}
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
            <div ref={messagesEndRef} />
          </div>
          <div className="flex sticky mx-auto bg-background/50 backdrop-blur bottom-0 gap-3 p-3 rounded-full">
            <Input
              className="w-[80%] md:w-full mt-0.5 bg-secondary rounded-full"
              type="text"
              placeholder="Type a message"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  sendMessage();
                }
              }}
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
    </Suspense>
  );
};

export default Chat;
