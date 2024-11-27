import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  IconButton,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { BiSend } from "react-icons/bi";
import { IoMdChatboxes } from "react-icons/io";
import { useSelector } from "react-redux";
import { subscribeToChatChannel, disconnectPusher } from "../../hook/pusher";
const useStyles = makeStyles((theme) => ({
  chatContainer: {
    position: "fixed",
    bottom: 20,
    right: 20,
    width: 350,
    height: 450,
    zIndex: 1000,
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
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const messagesEndRef = useRef(null);
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    const subscription = subscribeToChatChannel((message) => {
      if (message.sender_id === parseInt(process.env.REACT_APP_SHOP_ADMIN_ID)) {
        setMessages((prev) =>
          [
            ...prev,
            {
              content: message.content,
              sender: "admin",
              timestamp: new Date(message.created_at),
            },
          ].sort((a, b) => a.timestamp - b.timestamp)
        );
      }
    });

    return () => {
      disconnectPusher();
    };
  }, [user?.id]);

  useEffect(() => {
    const fetchChatHistory = async () => {
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

        // Format và sắp xếp tin nhắn theo thời gian
        const formattedMessages = chatHistory
          .map((msg) => ({
            content: msg.content,
            sender: msg.sender_id === user.id ? "user" : "admin",
            timestamp: new Date(msg.created_at),
          }))
          .sort((a, b) => a.timestamp - b.timestamp);

        setMessages(formattedMessages);
      } catch (error) {
        console.error("Error fetching chat history:", error);
      }
    };

    if (isOpen && user) {
      fetchChatHistory();
    }
  }, [isOpen, user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (message.trim()) {
      const tempMessage = {
        content: message,
        sender: "user",
        timestamp: new Date(),
      };

      setMessages((prev) =>
        [...prev, tempMessage].sort((a, b) => a.timestamp - b.timestamp)
      );
      setMessage(""); // Clear input ngay lập tức

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
          // Rollback nếu gửi thất bại
          setMessages((prev) => prev.filter((msg) => msg !== tempMessage));
        }
      } catch (error) {
        console.error("Error sending message:", error);
        setMessages((prev) => prev.filter((msg) => msg !== tempMessage));
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <>
      {!isOpen ? (
        <IconButton
          className={classes.chatButton}
          onClick={() => setIsOpen(true)}
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
                onClick={() => setIsOpen(false)}
                style={{ color: "white" }}
              >
                <Typography>✕</Typography>
              </IconButton>
            </Box>
          </Box>

          <Box className={classes.chatBody}>
            {messages.map((msg, index) => (
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
            ))}
            <div ref={messagesEndRef} />
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
