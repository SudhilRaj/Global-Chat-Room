import { useState } from "react";
import styled from "styled-components";
import { supabase } from "../lib/supabase-client";
import { Message } from "../types/collection";
import { formatChatDate } from "../utils";
import defaultAvatar from "../assets/avatar.png";
import deleteSvg from "../assets/delete.svg";

interface ChatMessageProps {
  message: Message;
  iscurrentuser: boolean;
}

export const ChatMessage = ({ message, iscurrentuser }: ChatMessageProps) => {
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const toggleHover = () => {
    setIsHovered(!isHovered);
  };
  const handleDeleteMessage = async () => {
    try {
      const { error } = await supabase
        .from("Chat")
        .update({ deleted: true })
        .eq("id", message.id);
      if (error) {
        console.error("Error deleting message:", error);
        return;
      }
      console.log("Message deleted successfully!");
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  };

  const username =
    message.provider !== "email"
      ? message.user_name
      : message.user_name !== null &&
        message.user_name.substring(0, 6) +
          "*".repeat(message.user_name.length - 6);
  return (
    <Container
      iscurrentuser={iscurrentuser}
      onMouseEnter={toggleHover}
      onMouseLeave={toggleHover}
    >
      {" "}
      <MessageBubble iscurrentuser={iscurrentuser} isdeleted={message?.deleted}>
        {iscurrentuser && isHovered && !message.deleted && (
          <DeleteButton src={deleteSvg} onClick={handleDeleteMessage} />
        )}

        <Avatar
          src={message.user_avatar_url || defaultAvatar}
          alt="profile-image"
        />
        <div>
          <MessageInfo>
            {message.provider === "github" ? (
              <NameLink href={`https://github.com/${username}`} target="_blank">
                {username}
              </NameLink>
            ) : (
              username
            )}{" "}
            <Timestamp>
              {message.created_at
                ? formatChatDate(new Date(message.created_at))
                : null}
            </Timestamp>
          </MessageInfo>
          <MessageContent>
            {!message.deleted ? (
              message.message_content
            ) : (
              <Deleted>Message Deleted</Deleted>
            )}
          </MessageContent>
        </div>
      </MessageBubble>
    </Container>
  );
};

const Container = styled.div<{ iscurrentuser: boolean }>`
  display: flex;
  justify-content: ${(props) =>
    props.iscurrentuser ? "flex-end" : "flex-start"};
  align-items: center;
  margin-bottom: 16px;
  gap: 6px;
`;

const MessageBubble = styled.div<{
  iscurrentuser: boolean;
  isdeleted: boolean | null;
}>`
  display: flex;
  flex-direction: ${(props) => (props.iscurrentuser ? "row-reverse" : "row")};
  gap: 6px;
  align-items: center;
  background-color: ${(props) => (props.iscurrentuser ? "#487853" : "#5d8c97")};
  color: white;
  border-radius: ${(props) =>
    props.iscurrentuser ? "24px 24px 2px 24px" : "24px 24px 24px 2px"};
  padding: 8px 12px;
  border: 1px solid ${(props) => (props.iscurrentuser ? "#78e08f" : "#82ccdd")};
  opacity: ${(props) => (props.isdeleted ? "0.6" : "1")};
  max-width: 350px;
  background-clip: padding-box;
  box-shadow: 10px 10px 10px rgba(46, 54, 68, 0.03);
  //   border: 2px solid rgba(255, 255, 255, 0.05);
  // box-shadow: 0 4px 14px 2px
  //   ${(props) => (props.iscurrentuser ? "#9436ff48" : "#14ac6848")};
}
`;

const DeleteButton = styled.img`
  width: 24px;
  cursor: pointer;
  transition: 0.3s filter;

  &:hover {
    filter: brightness(0.8) saturate(1.5) hue-rotate(0deg);
  }
`;

const Avatar = styled.img`
  border: 1.5px solid #f5f6fa;
  border-radius: 100%;
  width: 40px;
  margin: 4px;
`;

const MessageInfo = styled.div`
  font-weight: bold;
  margin-right: 4px;
  font-size: 14px;
`;

const Timestamp = styled.span`
  color: #ffffff80;
  font-size: 10px;
  font-weight: 400;
  font-style: italic;
`;

const MessageContent = styled.div`
  font-size: 14px;
  word-break: break-all;
`;

const Deleted = styled.span`
  font-size: 12px;
  font-style: italic;
  color: #de0000;
  text-shadow: 0 0 6px #ff5b5bd9;
`;

const NameLink = styled.a`
  color: white;
  cursor: pointer;
  transition: 0.3s color;
  text-decoration: underline;
  &:hover {
    color: #ff00e6;
  }
`;
