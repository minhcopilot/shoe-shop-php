import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  TextField,
  Typography,
  Paper,
  IconButton,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { BiSend } from "react-icons/bi";
import { IoMdChatboxes } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { subscribeToChatChannel } from "../../hook/pusher";
import MessageSkeleton from "./MessageSkeleton";
import {
  setMessages,
  addMessage,
  removeMessage,
  setChatOpen,
  setChatHistoryLoaded,
  setLoading,
} from "../../redux/slices/chatSlice";
const useStyles = makeStyles((theme) => ({
  chatContainer: {
    position: "fixed",
    bottom: 20,
    right: 20,
    width: 350,
    height: 450,
    zIndex: 1000,
    borderRadius: 10,
  },
  chatHeader: {
    backgroundColor: "#1a202c",
    color: "white",
    padding: "10px 20px",
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  chatBody: {
    height: 350,
    overflowY: "auto",
    padding: 20,
    backgroundColor: "#f5f5f5",
    scrollBehavior: "smooth",
    "&::-webkit-scrollbar": {
      width: "8px",
    },
    "&::-webkit-scrollbar-track": {
      background: "#f1f1f1",
    },
    "&::-webkit-scrollbar-thumb": {
      background: "#888",
      borderRadius: "4px",
    },
  },
  messageContainer: {
    marginBottom: 10,
  },
  message: {
    padding: "8px 15px",
    borderRadius: 20,
    maxWidth: "70%",
    wordWrap: "break-word",
  },
  userMessage: {
    backgroundColor: "#1a202c",
    color: "white",
    marginLeft: "auto",
  },
  adminMessage: {
    backgroundColor: "#e2e8f0",
  },
  inputContainer: {
    display: "flex",
    padding: theme.spacing(1.5, 2),
    backgroundColor: "white",
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    borderTop: "1px solid #e0e0e0",
    alignItems: "center",
    gap: theme.spacing(1),
  },
  input: {
    flex: 1,
    "& .MuiOutlinedInput-root": {
      borderRadius: 20,
      backgroundColor: "#f0f0f0",
      "& fieldset": {
        border: "none",
      },
      display: "flex",
      alignItems: "center",
      padding: "0px",
    },
    "& .MuiOutlinedInput-input": {
      padding: "8px 16px",
      minHeight: "20px",
      maxHeight: "80px",
      lineHeight: "20px",
      margin: 0,
      resize: "none",
      overflowY: "auto",
      "&::-webkit-scrollbar": {
        width: "6px",
      },
      "&::-webkit-scrollbar-track": {
        background: "transparent",
      },
      "&::-webkit-scrollbar-thumb": {
        background: "#bdbdbd",
        borderRadius: "3px",
      },
    },
    "& .MuiOutlinedInput-multiline": {
      padding: 0,
    },
  },
  sendButton: {
    minWidth: 36,
    width: 36,
    height: 36,
    borderRadius: "50%",
    padding: 0,
    backgroundColor: "#0084ff",
    color: "white",
    "&:hover": {
      backgroundColor: "#0073e6",
    },
  },
  chatButton: {
    position: "fixed",
    bottom: 20,
    right: 20,
    backgroundColor: "#1a202c",
    color: "white",
    "&:hover": {
      backgroundColor: "#2d3748",
    },
    width: 60,
    height: 60,
    zIndex: 1000,
  },
  chatIcon: {
    fontSize: 30,
  },
}));

const UserChat = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [message, setMessage] = useState("");
  const chatBodyRef = useRef(null);

  // Lấy state từ Redux thay vì local state
  const { messages, isOpen, chatHistoryLoaded, isLoading } = useSelector(
    (state) => state.chat
  );
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    const subscription = subscribeToChatChannel((message) => {
      if (
        message.sender_id === parseInt(process.env.REACT_APP_SHOP_ADMIN_ID) &&
        message.receiver_id === user.id
      ) {
        const newMessage = {
          content: message.content,
          sender: "admin",
          timestamp: new Date(message.created_at),
        };

        dispatch(addMessage(newMessage));
      }
    });

    return () => {
      if (typeof subscription === 'function') {
        subscription();
      }
    };
  }, [dispatch, user.id]);

  useEffect(() => {
    if (chatBodyRef.current && messages.length > 0) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    const fetchChatHistory = async () => {
      if (chatHistoryLoaded) return;

      dispatch(setLoading(true));
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/messages/${process.env.REACT_APP_SHOP_ADMIN_ID}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const chatHistory = await response.json();

        const formattedMessages = chatHistory
          .map((msg) => ({
            content: msg.content,
            sender: msg.sender_id === user.id ? "user" : "admin",
            timestamp: new Date(msg.created_at),
          }))
          .sort((a, b) => a.timestamp - b.timestamp);

        if (formattedMessages.length === 0) {
          formattedMessages.push({
            content: "Xin chào bạn! Bạn cần giúp gì?",
            sender: "admin",
            timestamp: new Date(),
          });
        }

        dispatch(setMessages(formattedMessages));
        dispatch(setChatHistoryLoaded(true));
      } catch (error) {
        console.error("Error fetching chat history:", error);
      } finally {
        dispatch(setLoading(false));
      }
    };

    if (isOpen && user && !chatHistoryLoaded) {
      fetchChatHistory();
    }
  }, [isOpen, user, chatHistoryLoaded, dispatch]);

  const handleSendMessage = async () => {
    if (message.trim()) {
      const tempMessage = {
        content: message,
        sender: "user",
        timestamp: new Date(),
      };

      dispatch(addMessage(tempMessage));
      setMessage(""); // Clear input

      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/messages`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({
              content: message,
              receiver_id: process.env.REACT_APP_SHOP_ADMIN_ID,
            }),
          }
        );

        if (!response.ok) {
          dispatch(removeMessage(tempMessage));
        }
      } catch (error) {
        console.error("Error sending message:", error);
        dispatch(removeMessage(tempMessage));
      }
    }
  };

  return (
    <>
      {!isOpen ? (
        <IconButton
          className={classes.chatButton}
          onClick={() => dispatch(setChatOpen(true))}
        >
          <IoMdChatboxes className={classes.chatIcon} />
        </IconButton>
      ) : (
        <Paper className={classes.chatContainer} elevation={3}>
          <Box className={classes.chatHeader}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography variant="h6">Chat với shop</Typography>
              <IconButton
                size="small"
                onClick={() => dispatch(setChatOpen(false))}
                style={{ color: "white" }}
              >
                <Typography>✕</Typography>
              </IconButton>
            </Box>
          </Box>

          <Box className={classes.chatBody} ref={chatBodyRef}>
            {isLoading ? (
              <>
                <MessageSkeleton align="left" />
                <MessageSkeleton align="right" />
                <MessageSkeleton align="left" />
              </>
            ) : (
              messages.map((msg, index) => (
                <Box
                  key={index}
                  className={classes.messageContainer}
                  style={{
                    display: "flex",
                    justifyContent:
                      msg.sender === "user" ? "flex-end" : "flex-start",
                  }}
                >
                  <Box
                    className={`${classes.message} ${
                      msg.sender === "user"
                        ? classes.userMessage
                        : classes.adminMessage
                    }`}
                  >
                    <Typography>{msg.content}</Typography>
                  </Box>
                </Box>
              ))
            )}
          </Box>

          <Box className={classes.inputContainer}>
            <TextField
              className={classes.input}
              placeholder="Nhập tin nhắn..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              variant="outlined"
              multiline
              minRows={1}
              maxRows={3}
              InputProps={{
                style: {
                  alignItems: "center",
                },
              }}
            />
            <IconButton
              className={classes.sendButton}
              onClick={handleSendMessage}
            >
              <BiSend />
            </IconButton>
          </Box>
        </Paper>
      )}
    </>
  );
};

export default UserChat;
