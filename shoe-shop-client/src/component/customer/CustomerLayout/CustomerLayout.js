import React from "react";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import UserChat from "../../Chat/UserChat";
import { useSelector } from "react-redux";

const CustomerLayout = ({ children }) => {
  const user = useSelector((state) => state.auth.user);

  return (
    <>
      <Header />
      <main>{children}</main>
      {user?.id && <UserChat />}
      <Footer />
    </>
  );
};

export default CustomerLayout;
