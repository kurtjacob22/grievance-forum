import React from "react";
import {
  Avatar,
  Text,
  useMantineTheme,
  Badge,
  ActionIcon,
} from "@mantine/core";
import { showNotification, updateNotification } from "@mantine/notifications";
import { IconTrash, IconCheck, IconX } from "@tabler/icons";
import { PORT } from "../Globals";
import axios from "axios";

function User({
  publisher,
  isAnonymous,
  email,
  isAdmin,
  isCurrentUserAdmin,
  hideTrashAndBadge,
  previewOnly,
  postId,
  tags,
  setIsVisible,
}) {
  const theme = useMantineTheme();
  const avatarColors = [
    "red",
    "pink",
    "grape",
    "violet",
    "indigo",
    "blue",
    "cyan",
    "teal",
    "green",
    "lime",
    "yellow",
    "orange",
  ];

  const generateRandomColor = () => {
    return avatarColors[Math.floor(Math.random() * avatarColors.length)];
  };

  const deleteBtn = () => {
    if (!previewOnly) {
      showNotification({
        id: "load-data",
        loading: true,
        title: "Deleting",
        message: "Please Wait!",
        autoClose: false,
        disallowClose: true,
      });

      deletePost();
    }
  };

  const deletePost = () => {
    axios
      .post(`${PORT}/deletePost`, {
        postId: postId,
        userId: localStorage.getItem("email"),
        tags: tags,
      })
      .then(() => {
        setTimeout(() => {
          updateNotification({
            id: "load-data",
            color: "teal",
            title: "Success!",
            message: "Post has been Deleted",
            icon: <IconCheck size={16} />,
            autoClose: 2000,
          });
        }, 3000);

        setIsVisible(true);
      })
      .catch((error) => {
        console.log(error.message);
        setTimeout(() => {
          updateNotification({
            id: "load-data",
            color: "red",
            title: "Error!!",
            message: error.message,
            icon: <IconX size={16} />,
            autoClose: 2000,
          });
        }, 3000);
      });
  };

  // const deleteVotedPost = () => {};
  // const deleteTagCount = () => {};

  return (
    <div style={{ display: "flex", flexDirection: "row" }}>
      <Avatar src={null} alt={publisher} color={generateRandomColor()}>
        {isAnonymous ? "H" : email.toUpperCase()[0] + publisher[0]}
      </Avatar>
      <Text
        style={{
          fontSize: "1rem",
          fontWeight: "bold",
          marginLeft: "0.563rem",
        }}
      >
        {isAnonymous ? "HARONYMOUS" : publisher}
        <Text
          style={{
            fontSize: "0.750rem",
            color:
              theme.colorScheme === "dark" ? theme.colors.gray[6] : "#747678",
            position: "relative",
            top: "-0.438rem",
          }}
        >
          {isAnonymous ? "" : email}
        </Text>
      </Text>
      {hideTrashAndBadge ? (
        ""
      ) : (
        <>
          {isAnonymous ? (
            <Badge style={{ marginLeft: "5px" }} color="red">
              secret
            </Badge>
          ) : (
            <Badge
              style={{ marginLeft: "5px" }}
              color={isAdmin ? "blue" : "green"}
            >
              {isAdmin ? "Admin" : "Student"}
            </Badge>
          )}
        </>
      )}
      {hideTrashAndBadge ? (
        ""
      ) : (
        <div style={{ margin: "auto", marginRight: "1rem" }}>
          {localStorage.getItem("email") === email || isCurrentUserAdmin ? (
            <ActionIcon>
              <IconTrash onClick={deleteBtn} />
            </ActionIcon>
          ) : (
            <></>
          )}
        </div>
      )}
    </div>
  );
}

export default User;
