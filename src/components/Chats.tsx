import { useEffect, useState } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase-client";
import useWindowSize from "react-use/lib/useWindowSize";
import Confetti from "react-confetti";
import { Message, NewMessage } from "../types/collection";
import defaultAvatar from "../assets/avatar.png";
import { IoMdLogOut } from "react-icons/io";
import { IoIosSend } from "react-icons/io";
import { ChatMessage } from ".";

interface ChatsProps {
  session: Session;
}

export const Chats = ({ session }: ChatsProps) => {
  const user = session.user as User;
  const { width, height } = useWindowSize();
  const [messages, setMessages] = useState<Message[]>();
  const [waitTime, setWaitTime] = useState<number>(0);
  const [isSending, setIsSending] = useState<boolean>(false);
  const [messageToSend, setMessageToSend] = useState<string>("");

  const userName =
    user.user_metadata.preferred_username ||
    user.user_metadata.name ||
    user.email;

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await supabase.from("Chat").select("*");
      setMessages(data ?? []);
    };
    scrollToBottom(false);
    fetchData();

    const channel = supabase
      .channel("Chat")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
        },
        () => {
          fetchData();
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, []);

  const scrollToBottom = (smooth: boolean = true) => {
    setTimeout(() => {
      const chatBody = document.getElementById("chat-body");
      if (chatBody) {
        chatBody.scroll({
          top: chatBody.scrollHeight,
          behavior: smooth ? "smooth" : "auto",
        });
      }
    }, 500);
  };

  const handleSendMessage = async () => {
    if (isSending || waitTime > 0) {
      return;
    }

    setIsSending(true);
    const newMessage: NewMessage = {
      user_name: userName,
      message_content: messageToSend,
      user_avatar_url: user.user_metadata.avatar_url || null,
      user_id: user.id,
      provider: user.app_metadata.provider || null,
    };

    const { error } = await supabase.from("Chat").insert([newMessage]);

    if (error) {
      alert(JSON.stringify(error));
    } else {
      setMessageToSend("");
      scrollToBottom();
      setIsSending(false);

      setWaitTime(3);
      const timer = setInterval(() => {
        setWaitTime((prevWaitTime) => prevWaitTime - 1);
      }, 1000);

      setTimeout(() => {
        clearInterval(timer);
        setWaitTime(0);
      }, 3000);
    }
  };

  return (
    <div className="h-screen">
      <Confetti width={width} height={height} numberOfPieces={100} />
      <div className="flex w-full relative z-[2] items-center justify-center h-100">
        <div className="w-[90%] sm:w-[75%] md:w-[60%]">
          <div className="flex flex-col h-screen w-full rounded-xl bg-[#00000066]">
            {/* Header */}
            <div className="chat-header bg-[#00000008] px-4 py-3">
              <div className="flex justify-between items-center">
                <div className="flex">
                  <div className="relative w-[70px] h-[70px]">
                    <img
                      src={user.user_metadata.avatar_url || defaultAvatar}
                      alt="profile-image"
                      className="rounded-full border-[1.5px] border-[#f5f6fa]"
                    />
                    <span className="absolute w-[15px] h-[15px] bg-[#4cd137] rounded-[50%] bottom-[0.2em] right-[0.4em] border-[1.5px]"></span>
                  </div>
                  <div className="my-auto ms-3">
                    <span className="text-lg text-white">{userName}</span>
                    <p className="text-[10px] text-[#ffffff80]">
                      {messages?.length || "0"} Messages
                    </p>
                  </div>
                </div>
                <div
                  className="text-3xl text-red-500 cursor-pointer"
                  onClick={() => supabase.auth.signOut()}
                >
                  <IoMdLogOut />
                </div>
              </div>
            </div>
            {/* Body */}
            <div className="chat-body p-4 overflow-y-auto" id="chat-body">
              {messages &&
                messages
                  .sort((a, b) => a.id - b.id) // Sort the messages by ID in ascending order
                  .map((message: Message) => (
                    <ChatMessage
                      key={message.id}
                      message={message}
                      iscurrentuser={user.id === message.user_id ? true : false}
                    />
                  ))}

              {/* <div className="flex justify-start mb-4">
                <div className="h-[40px] w-[40px]">
                  <img
                    src="https://static.turbosquid.com/Preview/001292/481/WV/_D.jpg"
                    className="h-[40px] w-[40px] rounded-full border-[1.5px] border-[#f5f6fa]"
                  />
                </div>
                <div className="relative text-sm text-black p-2 rounded-[25px] my-auto ms-2 bg-[#82ccdd]">
                  Hi, how are you samim?
                  <span className="absolute text-[#ffffff80] text-[10px] bottom-[-18px] left-0">
                    8:40 AM, Today
                  </span>
                </div>
              </div>
              <div className="flex justify-end mb-4">
                <div className="relative text-sm text-black p-2 rounded-[25px] my-auto me-2 bg-[#78e08f]">
                  Hi Khalid i am good tnx how about you?
                  <span className="absolute text-[#ffffff80] text-[10px] bottom-[-18px] right-0">
                    8:55 AM, Today
                  </span>
                </div>
                <div className="h-[40px] w-[40px]">
                  <img
                    src="https://static.turbosquid.com/Preview/001292/481/WV/_D.jpg"
                    className="h-[40px] w-[40px] rounded-full border-[1.5px] border-[#f5f6fa]"
                  />
                </div>
              </div> */}
            </div>
            {/* Footer */}
            <div className="chat-footer bg-[#00000008] px-4 py-3 mt-auto">
              <div className="relative flex items-stretch w-full">
                <textarea
                  name="message"
                  value={messageToSend}
                  onChange={(e) => setMessageToSend(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                  disabled={isSending || waitTime > 0}
                  className="w-full text-sm bg-[#0000004d] text-white py-2 px-3 h-[50px] rounded-tl-xl rounded-bl-xl overflow-y-auto border-0 focus:outline-0 focus:shadow-none"
                  placeholder={
                    waitTime > 0
                      ? `Wait ${waitTime} seconds`
                      : "Type a message..."
                  }
                />
                <div
                  className={`flex items-center justify-center w-[50px] text-2xl bg-[#0000004d] rounded-tr-xl rounded-br-xl border-l-[1px] border-gray-500 ${
                    isSending ||
                    waitTime > 0 ||
                    messageToSend.length > 255 ||
                    messageToSend.length <= 0
                      ? "text-gray-500 cursor-not-allowed"
                      : "text-white cursor-pointer"
                  }`}
                  onClick={handleSendMessage}
                >
                  <IoIosSend />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
