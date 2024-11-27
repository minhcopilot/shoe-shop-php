import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Paper,
  Avatar,
  InputBase,
  IconButton,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import AdminLayout from "../../../component/admin/AdminLayout/AdminLayout";
import { Helmet } from "react-helmet-async";
import SearchIcon from "@material-ui/icons/Search";
import SendIcon from "@material-ui/icons/Send";
import { useSelector } from "react-redux";
import { subscribeToChatChannel, disconnectPusher } from "../../../hook/pusher";

const useStyles = makeStyles((theme) => ({
  container: {
    position: "relative",
    marginLeft: 300,
    padding: 20,
    backgroundColor: "#f5f6fa",
    display: "flex",
    flexDirection: "row",
    height: "calc(100vh - 80px)",
  },
  header: {
    padding: theme.spacing(2),
    borderBottom: "1px solid #e0e0e0",
    backgroundColor: "#fff",
    position: "sticky",
    top: 0,
    zIndex: 1,
  },
  searchBox: {
    padding: theme.spacing(1, 2),
    backgroundColor: "#f5f5f5",
    borderRadius: 20,
    display: "flex",
    alignItems: "center",
    margin: theme.spacing(1, 2),
  },
  searchInput: {
    border: "none",
    backgroundColor: "transparent",
    width: "100%",
    marginLeft: theme.spacing(1),
    "&:focus": {
      outline: "none",
    },
  },
  chatList: {
    flex: 1,
    overflow: "auto",
    backgroundColor: "#fff",
  },
  chatItem: {
    padding: theme.spacing(1, 2),
    cursor: "pointer",
    "&:hover": {
      backgroundColor: "#f5f5f5",
    },
    borderRadius: 0,
    boxShadow: "none",
  },
  userInfo: {
    display: "flex",
    alignItems: "center",
    width: "100%",
  },
  avatar: {
    marginRight: theme.spacing(2),
  },
  messageInfo: {
    flex: 1,
  },
  userName: {
    fontWeight: 500,
    fontSize: "0.95rem",
  },
  lastMessage: {
    color: "#65676B",
    fontSize: "0.9rem",
    marginTop: theme.spacing(0.5),
  },
  timestamp: {
    color: "#65676B",
    fontSize: "0.75rem",
    marginLeft: "auto",
  },
  unreadIndicator: {
    width: 8,
    height: 8,
    borderRadius: "50%",
    backgroundColor: "#0084ff",
    marginLeft: theme.spacing(1),
  },
  root: {
    display: "flex",
    flexDirection: "column",
    height: "100vh",
  },
  chatListContainer: {
    width: "350px",
    borderRight: "1px solid #e0e0e0",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#fff",
  },
  chatWindow: {
    flex: 1,
    height: "100%",
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#fff",
  },
  messageContainer: {
    flex: 1,
    padding: theme.spacing(2),
    overflow: "auto",
    backgroundColor: "#fff",
    display: "flex",
    flexDirection: "column",
    overflowX: "hidden",
  },
  messageWrapper: {
    display: "flex",
    marginBottom: theme.spacing(1),
    width: "100%",
    "& .MuiTypography-root": {
      fontSize: "0.9rem",
    },
  },
  sentMessageWrapper: {
    justifyContent: "flex-end",
  },
  receivedMessageWrapper: {
    justifyContent: "flex-start",
  },
  message: {
    padding: theme.spacing(1, 2),
    borderRadius: 20,
    maxWidth: "70%",
    wordBreak: "break-word",
    whiteSpace: "pre-wrap",
    overflowWrap: "break-word",
  },
  sentMessage: {
    backgroundColor: "#0084ff",
    color: "white",
    borderTopRightRadius: 4,
  },
  receivedMessage: {
    backgroundColor: "#e4e6eb",
    color: "black",
    borderTopLeftRadius: 4,
  },
  inputContainer: {
    padding: theme.spacing(2),
    borderTop: "1px solid #e0e0e0",
    backgroundColor: "#fff",
    display: "flex",
    alignItems: "flex-end",
    gap: theme.spacing(1),
  },
  messageInput: {
    flex: 1,
    padding: theme.spacing(1.5),
    borderRadius: 20,
    backgroundColor: "#f0f0f0",
    "& .MuiInputBase-input": {
      padding: theme.spacing(0.5, 1),
      maxHeight: "80px",
      overflowY: "auto",
      lineHeight: "20px",
      "&::-webkit-scrollbar": {
        width: "8px",
      },
      "&::-webkit-scrollbar-track": {
        background: "transparent",
      },
      "&::-webkit-scrollbar-thumb": {
        background: "#bdbdbd",
        borderRadius: "4px",
      },
    },
  },
  sendButton: {
    minWidth: 40,
    width: 40,
    height: 40,
    borderRadius: "50%",
  },
}));

const AdminChatList = () => {
  const classes = useStyles();
  const admin = useSelector((state) => state.auth.user);
  const [chats, setChats] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedChat, setSelectedChat] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState({});
  const [onlineUsers, setOnlineUsers] = useState(new Set());

  useEffect(() => {
    const subscription = subscribeToChatChannel((message) => {
      if (message.sender_id !== admin.id) {
        setMessages((prev) => {
          const chatId = message.sender_id;
          const currentMessages = prev[chatId] || [];
          return {
            ...prev,
            [chatId]: [
              ...currentMessages,
              {
                id: message.id,
                text: message.content,
                sender: "user",
                timestamp: new Date(message.created_at),
              },
            ].sort((a, b) => a.timestamp - b.timestamp),
          };
        });
      }
    });

    return () => {
      disconnectPusher();
    };
  }, [admin.id]);

  // Lấy danh sách chat khi component mount
  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/chats`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await response.json();

        // Format data cho UI
        const formattedChats = data.map((chat) => ({
          id: chat.user_id,
          userName: chat.user_name,
          lastMessage: chat.last_message,
          timestamp: new Date(chat.last_message_time).toLocaleTimeString(),
          unread: chat.unread_count > 0,
        }));

        setChats(formattedChats);
      } catch (error) {
        console.error("Error fetching chats:", error);
      }
    };

    fetchChats();
  }, []);

  // Load chat history khi chọn một cuộc trò chuyện
  const handleChatClick = async (chat) => {
    setSelectedChat(chat);

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/messages/${chat.id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const chatHistory = await response.json();

      // Sắp xếp tin nhắn theo thời gian
      const sortedMessages = chatHistory
        .map((msg) => ({
          id: msg.id,
          text: msg.content,
          sender: msg.sender_id === admin.id ? "admin" : "user",
          timestamp: new Date(msg.created_at),
        }))
        .sort((a, b) => a.timestamp - b.timestamp);

      setMessages((prev) => ({
        ...prev,
        [chat.id]: sortedMessages,
      }));

      // Đánh dấu tin nhắn đã đọc
      setChats((prev) =>
        prev.map((c) => {
          if (c.id === chat.id) {
            return { ...c, unread: false };
          }
          return c;
        })
      );
    } catch (error) {
      console.error("Error loading chat history:", error);
    }
  };

  const handleSendMessage = async () => {
    if (newMessage.trim() && selectedChat) {
      // Optimistic update - thêm tin nhắn ngay lập tức
      const tempMessage = {
        id: Date.now(), // temporary ID
        text: newMessage,
        sender: "admin",
        timestamp: new Date(),
      };

      setMessages((prev) => ({
        ...prev,
        [selectedChat.id]: [...(prev[selectedChat.id] || []), tempMessage].sort(
          (a, b) => a.timestamp - b.timestamp
        ),
      }));

      setNewMessage(""); // Clear input ngay lập tức

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
              content: newMessage,
              receiver_id: selectedChat.id,
            }),
          }
        );

        if (!response.ok) {
          // Nếu gửi thất bại, rollback tin nhắn
          setMessages((prev) => ({
            ...prev,
            [selectedChat.id]: prev[selectedChat.id].filter(
              (msg) => msg.id !== tempMessage.id
            ),
          }));
        }
      } catch (error) {
        console.error("Error sending message:", error);
        // Rollback nếu có lỗi
        setMessages((prev) => ({
          ...prev,
          [selectedChat.id]: prev[selectedChat.id].filter(
            (msg) => msg.id !== tempMessage.id
          ),
        }));
      }
    }
  };

  // Lọc danh sách chat theo search term
  const filteredChats = chats.filter((chat) =>
    chat.userName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Helmet>
        <title>Reno - Admin Chat</title>
        <meta name="description" content="Admin chat management" />
      </Helmet>
      <AdminLayout>
        <Box className={classes.container}>
          <Box className={classes.chatListContainer}>
            <Box className={classes.header}>
              <Typography variant="h6">Đoạn chat</Typography>
              <Box className={classes.searchBox}>
                <SearchIcon color="action" />
                <InputBase
                  className={classes.searchInput}
                  placeholder="Tìm kiếm trên Messenger"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </Box>
            </Box>

            <List className={classes.chatList}>
              {filteredChats.map((chat) => (
                <Paper
                  key={chat.id}
                  className={classes.chatItem}
                  onClick={() => handleChatClick(chat)}
                >
                  <ListItem disableGutters>
                    <Box className={classes.userInfo}>
                      <Avatar className={classes.avatar}>
                        {chat.userName.charAt(0)}
                        {onlineUsers.has(chat.id) && (
                          <Box
                            className={classes.onlineIndicator}
                            style={{
                              width: 10,
                              height: 10,
                              backgroundColor: "#44b700",
                              borderRadius: "50%",
                              position: "absolute",
                              bottom: 0,
                              right: 0,
                              border: "2px solid white",
                            }}
                          />
                        )}
                      </Avatar>
                      <Box className={classes.messageInfo}>
                        <Typography className={classes.userName}>
                          {chat.userName}
                        </Typography>
                        <Typography className={classes.lastMessage}>
                          {chat.lastMessage}
                        </Typography>
                      </Box>
                      <Box display="flex" alignItems="center">
                        <Typography className={classes.timestamp}>
                          {chat.timestamp}
                        </Typography>
                        {chat.unread && (
                          <Box className={classes.unreadIndicator} />
                        )}
                      </Box>
                    </Box>
                  </ListItem>
                </Paper>
              ))}
            </List>
          </Box>

          {selectedChat ? (
            <Box className={classes.chatWindow}>
              <Box className={classes.header}>
                <Box className={classes.userInfo}>
                  <Avatar className={classes.avatar}>
                    {selectedChat.userName.charAt(0)}
                  </Avatar>
                  <Typography variant="h6">{selectedChat.userName}</Typography>
                </Box>
              </Box>

              <Box className={classes.messageContainer}>
                {messages[selectedChat.id]?.map((message) => (
                  <Box
                    key={message.id}
                    className={`${classes.messageWrapper} ${
                      message.sender === "admin"
                        ? classes.sentMessageWrapper
                        : classes.receivedMessageWrapper
                    }`}
                  >
                    <Typography
                      className={`${classes.message} ${
                        message.sender === "admin"
                          ? classes.sentMessage
                          : classes.receivedMessage
                      }`}
                    >
                      {message.text}
                    </Typography>
                  </Box>
                ))}
              </Box>

              <Box className={classes.inputContainer}>
                <InputBase
                  className={classes.messageInput}
                  multiline
                  rows={1}
                  rowsMax={4}
                  placeholder="Nhập tin nhắn..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                />
                <IconButton
                  onClick={handleSendMessage}
                  color="primary"
                  className={classes.sendButton}
                >
                  <SendIcon />
                </IconButton>
              </Box>
            </Box>
          ) : (
            <Box
              className={classes.chatWindow}
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Typography color="textSecondary">
                Chọn một cuộc trò chuyện để bắt đầu
              </Typography>
            </Box>
          )}
        </Box>
      </AdminLayout>
    </>
  );
};

export default AdminChatList;
