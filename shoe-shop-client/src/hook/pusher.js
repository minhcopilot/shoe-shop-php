import Pusher from "pusher-js";
import Echo from "laravel-echo";

let echo = null;

export const initPusher = () => {
  echo = new Echo({
    broadcaster: "pusher",
    key: process.env.REACT_APP_PUSHER_APP_KEY,
    cluster: process.env.REACT_APP_PUSHER_CLUSTER,
    forceTLS: true,
    encrypted: true,
    auth: {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    },
  });

  return echo;
};

export const subscribeToChatChannel = (callback) => {
  if (!echo) {
    echo = initPusher();
  }

  return echo.channel("chat").listen(".message.sent", (data) => {
    callback(data.message);
  });
};

export const disconnectPusher = () => {
  if (echo) {
    echo.disconnect();
  }
};
