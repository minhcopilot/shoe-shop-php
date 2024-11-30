import React from "react";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import UserChat from "../../Chat/UserChat";
import { useSelector } from "react-redux";
import ChatBot from "../../Chat/Chatbot";
const CustomerLayout = ({ children }) => {
  const user = useSelector((state) => state.auth.user);

  return (
    <>
      <Header />
      <main>{children}</main>
      {user?.id && <UserChat />}
      <ChatBot />
      <Footer />
    </>
  );
};

export default CustomerLayout;
