import React, { useState, useEffect, useRef } from "react";
import { ws_server } from "Apis/api";
import {
  Row,
  Col,
  Modal,
  ModalHeader,
  ModalFooter,
  ModalBody,
  Button,
  FormGroup,
  CardBody,
  CardTitle,
  Container,
  FormFeedback,
  Input,
  Label,
} from "reactstrap";
import axios from "axios";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import {
  API_GET_CHAT_USERS_LIST,
  API_POST_PERSONAL_CHAT_GROUP,
  API_GET_CHAT_HISTORY,
  API_CREATE_GROUP,
  API_GROUP_LIST_GET,
} from "Apis/api";
import GetAuthToken from "TokenImport/GetAuthToken";
import "./ChatComponent.css";
import maintanence from "../../assets/images/coming-soon.svg";
import Select from "react-select";
import { toast } from "react-toastify";

const validationSchema = Yup.object().shape({
  group_name: Yup.string().required("Name is required"),
  members: Yup.array()
    .min(1, "Select at least one member")
    .required("Select members is required"),
});

const ChatComponent = ({ group_id, user_id }) => {
  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [chatUsers, setChatUsers] = useState();
  const [chatId, setChatId] = useState();
  const [selectedUser, setSelectedUser] = useState();
  const [userId, setUserId] = useState();
  const [socket, setSocket] = useState(null);
  const [chatHistory, setChatHistory] = useState([]);
  const [loggedInUser, setLoggedInUser] = useState();
  const [groupChatsClicked, setGroupChatsClicked] = useState(false);
  const [personalChatsClicked, setPersonalChatsClicked] = useState(true);
  const [modal, setModal] = useState(false);
  const [groupList, setGroupList] = useState();

  console.log("groupList", groupList);
  console.log("socket", socket);

  const OptionUsers =
    chatUsers &&
    chatUsers.map((i) => {
      return {
        value: i.id,
        label: i.name,
      };
    });

  const initialValues = {
    group_name: "",
    members: [],
  };

  const onSubmit = async (values, actions) => {
    try {
      const { data } = await axios.post(API_CREATE_GROUP, values, config);
      toggleModal();
      actions.resetForm();
      toast.success(`Group Created Successfully`, {
        position: "top-center",
        autoClose: 3000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
    } catch (error) {
      console.log(error);
    }
  };

  const toggleModal = () => {
    setModal(!modal);
  };

  const config = GetAuthToken();

  const chatContainerRef = useRef(null);

  useEffect(() => {
    const fetchUserId = () => {
      if (localStorage.getItem("authUser")) {
        const obj = JSON.parse(localStorage.getItem("authUser"));
        setLoggedInUser(obj.data.name);
        setUserId(obj.data.user_id);
        console.log("UserId set:", obj.data.user_id);
      }
    };

    fetchUserId();
  }, []);

  const getUsersData = async () => {
    try {
      const { data } = await axios.get(API_GET_CHAT_USERS_LIST, config);
      setChatUsers(data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchData = async () => {
    try {
      const { data } = await axios.get(API_GROUP_LIST_GET, config);
      setGroupList(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUsersData();
    fetchData();
  }, []);

  useEffect(() => {
    if (chatId) {
      const newSocket = new WebSocket(`${ws_server}/ws/chat/${chatId}/`);
      setSocket(newSocket);

      newSocket.addEventListener("open", (event) => {
        console.log("WebSocket connection opened:", event);
      });

      newSocket.addEventListener("error", (error) => {
        console.error("WebSocket error:", error);
      });

      newSocket.addEventListener("close", (event) => {
        console.log("WebSocket connection closed:", event);
      });

      newSocket.addEventListener("message", (event) => {
        try {
          const receivedMessage = JSON.parse(event.data);

          if (!receivedMessage.sender) {
            setChatMessages((prevMessages) => [
              receivedMessage,
              ...prevMessages,
            ]);

            scrollToBottom();
          }
        } catch (error) {
          console.error("Error parsing WebSocket message:", error);
        }
      });

      return () => {
        newSocket.close();
      };
    }
  }, [chatId]);

  useEffect(() => {
    scrollToBottom();
  }, []);

  const sendMessage = () => {
    if (socket) {
      const messageData = {
        message: message,
        sender_id: selectedUser,
      };
      socket.send(JSON.stringify(messageData));
      setMessage("");
      scrollToBottom();
    }
  };

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = 0;
    }
  };

  const scrollToTop = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = 0;
    }
  };

  useEffect(() => {
    scrollToTop();
  }, []);

  const connectUserGroup = async (eachUser) => {
    console.log("eachUser", eachUser);
    const payload = {
      receiver_id: eachUser.id,
    };
    try {
      const { data: responseData } = await axios.post(
        API_POST_PERSONAL_CHAT_GROUP,
        payload,
        config
      );
      setChatId(responseData.data.id);
      setSelectedUser(eachUser.id);

      // Clear previous messages when switching users
      setChatMessages([]);

      if (responseData.data.id) {
        try {
          const { data: chatHistoryData } = await axios.get(
            `${API_GET_CHAT_HISTORY}${responseData.data.id}/`,
            config
          );

          // Display chat history and live messages
          setChatMessages((prevMessages) => [
            ...prevMessages,
            ...chatHistoryData,
          ]);

          scrollToBottom();
          console.log("Chat History", chatHistoryData);
        } catch (error) {
          console.error("Error fetching chat history:", error);
        }
      }
    } catch (error) {
      console.error("Error connecting to user group:", error);
    }
  };

  const renderMessage = (msg, sender) => {
    const isLiveMessage = !msg.sender;

    if (isLiveMessage) {
      const isSenderLoggedInUser = msg.sender_id === userId;
      return (
        <div
          key={msg.id}
          className={`message ${isSenderLoggedInUser ? "received" : "sent"}`}
          style={{ textAlign: isSenderLoggedInUser ? "left" : "right" }}
        >
          {msg && msg.message}
        </div>
      );
    } else {
      const isSenderLoggedInUser = sender && sender.id === userId;
      return (
        <div
          key={msg.id}
          className={`message ${isSenderLoggedInUser ? "received" : "sent"}`}
          style={{ textAlign: isSenderLoggedInUser ? "left" : "right" }}
        >
          {msg && msg.message}
        </div>
      );
    }
  };

  const isChatSelected = chatId !== undefined;

  const ChatContainer = () => (
    <div id="chat-container" className="chat-container" ref={chatContainerRef}>
      {chatHistory
        .concat(chatMessages)
        .map((msg, index) => renderMessage(msg, msg.sender))}
    </div>
  );

  const InputBox = () => {
    const inputRef = useRef(null);


    useEffect(() => {
      // Focus on the input element whenever the message state changes
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, [message]);

    const handleKeyPress = (e) => {
      if (e.key === "Enter") {
        sendMessage();
        scrollToBottom(); // Scroll to top when Enter key is pressed
      }
    };

    return (
      <>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message..."
          style={{
            width: "85%",
            height: "40px",
            margin: "10px",
            background: "#C1C1C1",
            border: "none",
            padding: "5px",
            borderRadius: "10px",
          }}
          ref={inputRef}
        />

        <button
          onClick={sendMessage}
          className="btn btn-primary"
          style={{ height: "40px", margin: "10px" }}
        >
          Send
        </button>
      </>
    );
  };

  return (
    <div className="page-content">
      <Modal isOpen={modal} toggle={toggleModal} centered>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {({
            values,
            errors,
            touched,
            setFieldValue,
            handleBlur,
            handleSubmit,
          }) => (
            <Form onSubmit={handleSubmit}>
              <ModalHeader toggle={toggleModal}>Create Group Chat</ModalHeader>
              <ModalBody>
                <FormGroup>
                  <Label for="name">Group Name</Label>
                  <Input
                    type="text"
                    name="group_name"
                    id="name"
                    value={values.group_name}
                    onChange={(e) =>
                      setFieldValue("group_name", e.target.value)
                    }
                    invalid={errors.group_name && touched.group_name}
                  />
                  {errors.group_name && touched.group_name && (
                    <FormFeedback>{errors.group_name}</FormFeedback>
                  )}
                </FormGroup>
                <FormGroup>
                  <Label for="members">Select Members</Label>
                  {/* Use the Select component for multi-select */}
                  <Select
                    id="members"
                    name="members"
                    isMulti
                    value={OptionUsers.filter((user) =>
                      values.members.includes(user.value)
                    )}
                    options={OptionUsers}
                    onChange={(selectedOptions) =>
                      setFieldValue(
                        "members",
                        selectedOptions
                          ? selectedOptions.map((option) => option.value)
                          : []
                      )
                    }
                    onBlur={handleBlur}
                  />
                  {errors.members && touched.members && (
                    <FormFeedback>{errors.members}</FormFeedback>
                  )}
                </FormGroup>
              </ModalBody>
              <ModalFooter>
                <Button color="primary" type="submit">
                  Create
                </Button>{" "}
                <Button color="secondary" onClick={toggleModal}>
                  Cancel
                </Button>
              </ModalFooter>
            </Form>
          )}
        </Formik>
      </Modal>
      <Row>
        <Col lg={4}>
          <div
            style={{
              height: "85vh",
              overflow: "auto",
            }}
          >
            <div className="text-center">
              <button
                style={{ width: "47%", margin: "2px" }}
                className={
                  personalChatsClicked === true
                    ? "btn btn-primary"
                    : "btn btn-secondary"
                }
                onClick={() => {
                  setPersonalChatsClicked(true);
                  setGroupChatsClicked(false);
                }}
              >
                Chats
              </button>

              <button
                style={{ width: "47%", margin: "2px" }}
                className={
                  groupChatsClicked === true
                    ? "btn btn-primary"
                    : "btn btn-secondary"
                }
                onClick={() => {
                  setGroupChatsClicked(true);
                  setPersonalChatsClicked(false);
                }}
              >
                Group Chats
              </button>
            </div>
            {personalChatsClicked === true ? (
              chatUsers &&
              chatUsers.map((eachUser) => (
                <h5
                  key={eachUser.id}
                  value={eachUser.id}
                  className={`p-2 m-2 ${
                    selectedUser === eachUser.id ? "bg-success" : "bg-primary"
                  } text-light`}
                  style={{
                    cursor: "pointer",
                    borderRadius: "5px",
                  }}
                  onClick={() => connectUserGroup(eachUser)}
                >
                  {eachUser.name}
                </h5>
              ))
            ) : (
              <div>
                <div className="text-center">
                  <button
                    className="btn btn-secondary"
                    style={{ width: "96%", margin: "4px" }}
                    onClick={toggleModal}
                  >
                    Create Group
                  </button>
                </div>
                {groupList &&
                  groupList.map((group) => (
                    <h5
                      key={group.id}
                      value={group.id}
                      className={`p-2 m-2 ${
                        selectedUser === group.id ? "bg-success" : "bg-primary"
                      } text-light`}
                      style={{
                        cursor: "pointer",
                        borderRadius: "5px",
                      }}
                      onClick={() => connectUserGroup(group)}
                    >
                      {group.display_name}
                    </h5>
                  ))}
              </div>
            )}
          </div>
        </Col>
        <Col lg={8}>
          {isChatSelected ? (
            <ChatContainer />
          ) : (
            <div
              style={{
                height: "85vh",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <img
                src={maintanence}
                alt=""
                className="img-fluid mx-auto d-block"
                style={{ height: "60vh" }}
              />
              <p style={{ fontSize: "20px", fontWeight: "bold" }}>
                Select a chat to start messaging
              </p>
            </div>
          )}

          {isChatSelected && <InputBox />}
        </Col>
      </Row>
    </div>
  );
};

export default ChatComponent;
