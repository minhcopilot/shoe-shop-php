import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  IconButton,
  Fab,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { BiSend } from "react-icons/bi";
import { IoClose } from "react-icons/io5";
import { FaRobot } from "react-icons/fa";
const useStyles = makeStyles((theme) => ({
  chatContainer: {
    position: "fixed",
    bottom: 20,
    left: 20,
    width: 350,
    height: 500,
    zIndex: 1000,
    borderRadius: 10,
    display: "flex",
    flexDirection: "column",
  },
  chatHeader: {
    backgroundColor: theme.palette.primary.main,
    color: "white",
    padding: "10px 20px",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  toggleButton: {
    position: "fixed",
    bottom: 20,
    left: 20,
    zIndex: 1000,
    width: 63,
    height: 63,
  },
  closeButton: {
    padding: 8,
    color: "white",
    "&:hover": {
      backgroundColor: "rgba(255, 255, 255, 0.1)",
    },
  },
  messagesContainer: {
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
  message: {
    marginBottom: 10,
    padding: 10,
    borderRadius: 8,
    maxWidth: "80%",
  },
  userMessage: {
    backgroundColor: theme.palette.primary.main,
    color: "white",
    marginLeft: "auto",
  },
  systemMessage: {
    backgroundColor: "#f1f1f1",
    marginRight: "auto",
  },
  inputContainer: {
    display: "flex",
    padding: "10px 20px",
    borderTop: "1px solid #ccc",
    backgroundColor: "white",
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    flex: 1,
    marginRight: 10,
    "& .MuiOutlinedInput-root": {
      "& textarea": {
        maxHeight: "100px",
        minHeight: "20px",
        overflowY: "auto",
        lineHeight: "1.5",
        resize: "none",
      },
    },
  },
  timestamp: {
    fontSize: "0.8em",
    color: "#666",
    marginTop: 4,
  },
  sendButton: {
    minWidth: "40px",
    width: "40px",
    height: "40px",
    padding: 0,
    borderRadius: "8px",
  },
}));

const ChatBot = () => {
  const classes = useStyles();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = {
      content: input,
      role: "user",
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch(
        process.env.REACT_APP_CHATBOT_API_URL + "/chatbot",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            content: input,
            chatHistory: messages,
          }),
          credentials: "include",
        }
      );

      const data = await response.json();

      setMessages((prev) => [
        ...prev,
        {
          content: data.replyContent,
          role: "system",
          timestamp: data.timestamp,
        },
      ]);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <>
      {isOpen ? (
        <Paper className={classes.chatContainer} elevation={3}>
          <Box className={classes.chatHeader}>
            <Typography variant="h6">Chatbot hỗ trợ tư vấn</Typography>
            <IconButton
              className={classes.closeButton}
              onClick={() => setIsOpen(false)}
            >
              <IoClose />
            </IconButton>
          </Box>

          <Box className={classes.messagesContainer}>
            {messages.map((message, index) => (
              <Box
                key={index}
                className={`${classes.message} ${
                  message.role === "user"
                    ? classes.userMessage
                    : classes.systemMessage
                }`}
              >
                <Typography>{message.content}</Typography>
                <Typography className={classes.timestamp}>
                  {new Date(message.timestamp).toLocaleTimeString()}
                </Typography>
              </Box>
            ))}
            {loading && (
              <Box className={`${classes.message} ${classes.systemMessage}`}>
                <Typography>Đang trả lời...</Typography>
              </Box>
            )}
            <div ref={messagesEndRef} />
          </Box>

          <form onSubmit={handleSubmit} className={classes.inputContainer}>
            <TextField
              className={classes.input}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Nhập câu hỏi của bạn..."
              disabled={loading}
              variant="outlined"
              size="small"
              multiline
              maxRows={3}
              minRows={1}
            />
            <Button
              className={classes.sendButton}
              type="submit"
              disabled={loading}
              variant="contained"
              color="primary"
              endIcon={<BiSend />}
            />
          </form>
        </Paper>
      ) : (
        <Fab
          color="primary"
          className={classes.toggleButton}
          onClick={() => setIsOpen(true)}
        >
          <FaRobot size={28} />
        </Fab>
      )}
    </>
  );
};

export default ChatBot;
