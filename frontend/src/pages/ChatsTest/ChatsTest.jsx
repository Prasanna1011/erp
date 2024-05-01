import React, { useEffect, useState, useRef, useSyncExternalStore } from "react";

import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { each, isEmpty, map } from "lodash";
import "./chats.css"
import moment from "moment";
import {
  Button,
  Card,
  Col,
  Container,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Form,
  FormFeedback,
  FormGroup,
  Input,
  InputGroup,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Nav,
  NavItem,
  NavLink,
  Row,
  TabContent,
  TabPane,
  UncontrolledDropdown,
  UncontrolledTooltip,
} from "reactstrap";
import classnames from "classnames";
import maintanence from "../../assets/images/coming-soon.svg";
import * as Yup from "yup";
import Select from "react-select";
//Import Scrollbar
import PerfectScrollbar from "react-perfect-scrollbar";
import "react-perfect-scrollbar/dist/css/styles.css";
import EmojiPicker from 'emoji-picker-react';

//Import Breadcrumb
import Breadcrumbs from "components/Common/Breadcrumb";
import avatar1 from "../../assets/images/users/avatar-1.jpg";
import file from "../../assets/images/fileImage.png"
import chatsImage from "../../assets/images/error-img.png"
import groupsImage from "../../assets/images/verification-img.png"

import {
  // addMessage as onAddMessage,
  getChats as onGetChats,
  getContacts as onGetContacts,
  getGroups as onGetGroups,
  // getMessages as onGetMessages,
} from "store/actions";
import GetAuthToken from "TokenImport/GetAuthToken";
//redux
import { useSelector, useDispatch } from "react-redux";
import {
  API_CREATE_GROUP,
  API_GET_CHAT_HISTORY,
  API_POST_PERSONAL_CHAT_GROUP,
  API_CHATS_ONLINE_STATUS,
  API_CHATS_PROFILE_PICTURE,
  ws_server,
  API_BASE_URL,
  API_CHATS_ATTACHMENTS,
  API_GROUP_NAME_PIC_UPDATE,
} from "Apis/api";
import axios from "axios";
import { Formik } from "formik";
import { toast } from "react-toastify";
import AddAndRemoveFromGroup from "./AddAndRemoveFromGroup";

const validationSchema = Yup.object().shape({
  group_name: Yup.string().required("Name is required"),
  members: Yup.array()
    .min(1, "Select at least one member")
    .required("Select members is required"),
});

const ChatsTest = () => {
  document.title = "Chat | TechAstha - Internal Chat System";
  const config = GetAuthToken();
  const dispatch = useDispatch();

  const { contacts, chats, groups } = useSelector((state) => ({
    chats: state.ChatsReducers.chats,
    groups: state.ChatsReducers.groups,
    contacts: state.ChatsReducers.contacts,
    // messages: state.chat.messages,
  }));

  const [messageBox, setMessageBox] = useState(null);
  const [currentRoomId, setCurrentRoomId] = useState(1);
  const [currentUser, setCurrentUser] = useState({
    name: "",
    isActive: true,
    currentUserId: "",
  });
  const [menu1, setMenu1] = useState(false);
  const [search_Menu, setsearch_Menu] = useState(false);
  const [settings_Menu, setsettings_Menu] = useState(false);
  const [other_Menu, setother_Menu] = useState(false);
  const [activeTab, setactiveTab] = useState("1");
  const [Chat_Box_User_Status, setChat_Box_User_Status] =
    useState("Active Now");
  const [curMessage, setcurMessage] = useState("");
  const [chatId, setChatId] = useState();
  const [chatMessages, setChatMessages] = useState();
  const [Chat_Box_Username, setChat_Box_Username] = useState();
  const [selectedUser, setSelectedUser] = useState();
  const [socket, setSocket] = useState(null);
  const [currentMessage, setCurrentMessage] = useState();
  const [modal, setModal] = useState(false);
  const [groupChatClicked, setGroupChatClicked] = useState();
  const [addOrRemoveMembers, setAddOrRemoveMembers] = useState();
  const [viewProfile, setViewProfile] = useState();
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [onlineStatusDropdownOpen, setOnlineStatusDropdownOpen] = useState(false);
  const [loggedChatUserInfo, setLoggedChatUserInfo] = useState()
  const [receiverId, setReceiverId] = useState()
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedGroupChat, setSelectedGroupChat] = useState()
  const [groupNameChangeClicked, setGroupNameClicked] = useState(false)
  const [newGroupName, setNewGroupName] = useState("")
  const [filteredContacts, setFilteredContacts] = useState();

  useEffect(() => {
    if (contacts) {
      setFilteredContacts(contacts);
    }
  }, [contacts]);


  const handleAttachmentFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    handleAttachmentUpload(event.target.files[0]);
  };

  const handleAttachmentUpload = async (file) => {
    if (file) {
      const formData = new FormData();
      formData.append('attachment', file);
      formData.append('sender_id', currentUser && currentUser.currentUserId);
      formData.append('receiver_id', receiverId && receiverId);
      formData.append('group_id', chatId && chatId);
      formData.append('text', "Attachment");
      try {
        const response = await axios.post(API_CHATS_ATTACHMENTS, formData, config);
        if (response.status) {
          const { data: chatHistoryData } = await axios.get(
            `${API_GET_CHAT_HISTORY}${chatId}/`,
            config
          );

          // setChatMessages((prevMessages) => [...prevMessages, ...chatHistoryData]);
          setChatMessages(chatHistoryData)
        }
      } catch (error) {
        console.log(error);
      }
    }
  };





  const inputRef = useRef(null);
  const fileInputRef = useRef(null);


  const handleClick = () => {
    fileInputRef.current.click();
  };

  const handleGroupFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("group_picture", file);
      formData.append("group_name", selectedGroupChat?.display_name)
      try {
        const { data } = await axios.put(`${API_GROUP_NAME_PIC_UPDATE}${chatId}/`, formData, config)
        toggleTab("2");
        dispatch(onGetGroups());
        setChatId();
        toast.success(`Profile Picture Changed Successfully`, {
          position: "top-center",
          autoClose: 3000,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        });
      } catch (error) {
        toast.error(`There was an issue while changing profile picure`, {
          position: "top-center",
          autoClose: 3000,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        });
      }
    }
  }

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("profile_picture", file);
      formData.append("name", loggedChatUserInfo?.user?.name);
      try {
        const { data } = await axios.put(API_CHATS_PROFILE_PICTURE, formData, config)
        getProfilePictures()
        toast.success(`Profile Picture Changed Successfully`, {
          position: "top-center",
          autoClose: 3000,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        });
      } catch (error) {
        toast.error(`There was an issue while changing profile picure`, {
          position: "top-center",
          autoClose: 3000,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        });
      }
    }
  };

  const isChatSelected = chatId !== undefined;


  const getProfilePictures = async () => {
    try {
      const { data } = await axios.get(API_CHATS_PROFILE_PICTURE, config)
      setLoggedChatUserInfo(data)
    } catch (error) {
      console.log(error);
    }
  }

  // useEffect(() => {
  // dispatch(onGetChats());
  // dispatch(onGetGroups());
  // dispatch(onGetContacts());
  // dispatch(onGetMessages(currentRoomId));
  // }, [onGetChats, onGetGroups, onGetContacts, onGetMessages, currentRoomId]);

  useEffect(() => {
    dispatch(onGetContacts());
    dispatch(onGetGroups());
    dispatch(onGetChats());
    getProfilePictures()
  }, [onGetContacts, onGetChats, onGetGroups,]);

  useEffect(() => {
    if (!isEmpty(chatMessages)) scrollToBottom();
  }, [chatMessages]);

  // const toggleNotification = () => {
  // setnotification_Menu(!notification_Menu)
  // }

  //Toggle Chat Box Menus
  const toggleSearch = () => {
    setsearch_Menu(!search_Menu);
  };

  const toggleSettings = () => {
    setsettings_Menu(!settings_Menu);
  };

  const toggleOther = () => {
    setother_Menu(!other_Menu);
  };

  const toggleTab = (tab) => {
    if (activeTab !== tab) {
      setactiveTab(tab);
    }
  };

  const toggleModal = () => {
    setModal(!modal);
  };

  const toggleDropdown = () => setOnlineStatusDropdownOpen(prevState => !prevState);

  const handleSelectOption = async (option) => {
    const dataToSend = {
      status: option
    }
    try {
      const { data } = await axios.put(API_CHATS_ONLINE_STATUS, dataToSend, config)
      getProfilePictures()
      toast.success(`Status Updated Succesfully`, {
        position: "top-center",
        autoClose: 3000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
    } catch (error) {
      toast.error(`There was an issue while updating status`, {
        position: "top-center",
        autoClose: 3000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
    }
  }

  //Use For Chat Box
  const userChatOpen = (id, name, status, roomId) => {
    // setChat_Box_Username(name);
    setCurrentRoomId(roomId);
    dispatch(onGetMessages(roomId));
  };

  const addMessage = () => {
    if (socket) {
      const messageData = {
        message: currentMessage,
        sender_id: currentUser.currentUserId,
      };
      socket.send(JSON.stringify(messageData));
      setCurrentMessage("");
      dispatch(onGetChats());
      dispatch(onGetGroups());
    }
  };

  const scrollToBottom = () => {
    if (messageBox) {
      messageBox.scrollTop = messageBox.scrollHeight + 1000;
    }
  };

  const onKeyPress = (e) => {
    const { key } = e;
    if (key === "Enter") {
      addMessage();
    }
  };

  const handleEmojiClick = (event) => {
    const emoji = event ? event.emoji : '';
    if (!currentMessage) {
      setCurrentMessage(emoji);
    } else {
      setCurrentMessage(currentMessage + emoji);
    }

    setShowEmojiPicker(false);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };






  //serach recent user
  const searchUsers = () => {
    var input, filter, ul, li, a, i, txtValue;
    input = document.getElementById("search-user");
    filter = input.value.toUpperCase();
    ul = document.getElementById("recent-list");
    li = ul.getElementsByTagName("li");
    for (i = 0; i < li.length; i++) {
      a = li[i].getElementsByTagName("a")[0];
      txtValue = a.textContent || a.innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        li[i].style.display = "";
      } else {
        li[i].style.display = "none";
      }
    }
  };




  const searchGroups = () => {
    var input, filter, ul, li, a, i, txtValue;
    input = document.getElementById("search-groups"); // Change this ID accordingly
    filter = input.value.toUpperCase();
    ul = document.getElementsByClassName("group-tab")[0]; // Assuming there's only one group-tab, change index if there are multiple
    li = ul.getElementsByTagName("li");
    for (i = 0; i < li.length; i++) {
      a = li[i].getElementsByTagName("h5")[0]; // Change this to target the appropriate element containing the group name
      txtValue = a.textContent || a.innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        li[i].style.display = "";
      } else {
        li[i].style.display = "none";
      }
    }
  };


  const [deleteMsg, setDeleteMsg] = useState("");
  const toggle_deleMsg = (ele) => {
    setDeleteMsg(!deleteMsg);
    ele.closest("li").remove();
  };

  const copyMsg = (ele) => {
    var copyText = ele
      .closest(".conversation-list")
      .querySelector("p").innerHTML;
    navigator.clipboard.writeText(copyText);
  };

  const OptionUsers =
    contacts &&
    contacts.map((i) => {
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
      toggleTab("2");
      dispatch(onGetGroups());
    } catch (error) {
      console.log(error);
    }
  };


  useEffect(() => {
    try {
      const userString = localStorage.getItem("authUser");

      if (userString) {
        const userObject = JSON.parse(userString);

        setCurrentUser((prevUser) => ({
          ...prevUser,
          name: userObject && userObject.data.name,
          currentUserId: userObject && userObject.data.auth_user_id,
        }));
      } else {
        console.log("User Object not found in localStorage");
      }
    } catch (error) {
      console.error("Error in useEffect:", error);
    }
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
              ...prevMessages,
              receivedMessage,
            ]);

            // scrollToBottom();
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

  const connectGroupChatRoom = async (group) => {
    try {
      setSelectedGroupChat(group)
      setChat_Box_Username(group.display_name);
      setChatId(group.id);
      setChatMessages([]);
      setGroupChatClicked(true);
      const { data: chatHistoryData } = await axios.get(
        `${API_GET_CHAT_HISTORY}${group.id}/`,
        config
      );

      // Display chat history and live messages
      setChatMessages((prevMessages) => [...prevMessages, ...chatHistoryData]);
    } catch (error) {
      console.log(error);
    }
  };

  const connectChatRoom = async (contact) => {
    const payload = {
      receiver_id: contact?.id,
    };
    try {
      const { data: responseData } = await axios.post(
        API_POST_PERSONAL_CHAT_GROUP,
        payload,
        config
      );
      // setChatId(responseData.data.id);
      dispatch(onGetChats());
      setSelectedUser(contact.id);
      setChat_Box_Username(contact.name);
      setGroupChatClicked(false);
      setChatMessages([]);
      toggleTab("1")

      if (responseData.message === "Personal Chat aleady exist") {
        toast.success(`Chat exist, Start Chatting From Recent Chats`, {
          position: "top-center",
          autoClose: 3000,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        });
      }

      if (responseData.data.id) {
        try {
          const { data: chatHistoryData } = await axios.get(
            `${API_GET_CHAT_HISTORY}${responseData.data.id}/`,
            config
          );

          setChatMessages((prevMessages) => [
            ...prevMessages,
            ...chatHistoryData,
          ]);
        } catch (error) {
          console.error("Error fetching chat history:", error);
        }
      }
    } catch (error) {
      console.error("Error connecting to user group:", error);
    }
  };

  const handleViewGroupClick = () => {
    setViewProfile("Group");
  };

  const handleViewProfileClick = () => {
    setViewProfile("Personal");
  };


  const openAttachment = (url) => {
    window.open(url, '_blank');
  };




  function getRandomSoftColor() {
    const softColors = [
      '#B7E3F8', // Light Sky Blue
      '#C8FACD', // Light Green
      '#FFD6E2', // Light Pink
      '#B8E0F8', // Light Blue
      '#D4F1D4', // Light Green
      '#B9E3F8', // Light Blue
      '#FFE8CC', // Light Orange
      '#FFECDB', // Light Peach
      '#FFD3B6', // Light Apricot
      '#F7CCFF', // Light Purple
      '#FFF1CC', // Light Yellow
      '#D1F0D1', // Light Mint
      '#FCECFF', // Light Lavender
      '#F0F3FF', // Light Periwinkle
      '#FFD1E6'  // Light Coral
    ]; // Soft colors

    return softColors[Math.floor(Math.random() * softColors.length)];
  }



  function getRandomDarkColor() {
    const darkColors = [
      '#007BA7', // Cerulean Blue
      '#2E8B57', // Sea Green
      '#9932CC', // Dark Orchid
      '#8B4513', // Saddle Brown
      '#8B008B', // Dark Magenta
      '#8B0000', // Dark Red
      '#8A2BE2', // Blue Violet
      '#800080', // Purple
      '#556B2F', // Dark Olive Green
      '#2F4F4F', // Dark Slate Gray
      '#A52A2A', // Brown
      '#FF4500', // Orange Red
      '#800000', // Maroon
      '#DAA520', // Golden Rod
      '#FF8C00'  // Dark Orange
    ]; // Brighter Dark colors

    return darkColors[Math.floor(Math.random() * darkColors.length)];
  }



  const onGroupNameSubmitClick = async () => {
    const dataToSend = {
      group_name: newGroupName
    };

    if (!newGroupName || newGroupName === "") {
      toast.error(`Fill in New Group Name First`, {
        position: "top-center",
        autoClose: 3000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
      return;
    }

    try {
      const { data } = await axios.put(`${API_GROUP_NAME_PIC_UPDATE}${chatId}/`, dataToSend, config);
      toggleTab("2");
      dispatch(onGetGroups());
      setChatId();
      setGroupNameClicked(false);
      setNewGroupName("")
      toast.success(`Group Name Changed Successfully`, {
        position: "top-center",
        autoClose: 3000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
    } catch (error) {
      toast.error(`There was an issue while changing Group Name`, {
        position: "top-center",
        autoClose: 3000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
    }
  };


  const searchContacts = (event) => {
    const filter = event.target.value.toUpperCase();
    const filteredContacts = contacts.filter(contact =>
      contact.name.toUpperCase().includes(filter)
    );
    setFilteredContacts(filteredContacts);
  };


  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <AddAndRemoveFromGroup
            props={{
              view: viewProfile,
              groupId: chatId,
              selectedUser: selectedUser,
              chats: chats,
              groups: groups,
              contacts: contacts,
              currentUser: currentUser,
              setViewProfile,
            }}
          />
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
                  <ModalHeader toggle={toggleModal}>
                    Create Group Chat
                  </ModalHeader>
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
          <Breadcrumbs title="TechAstha" breadcrumbItem="Chat" />

          <Row>
            <Col lg="12">
              <div className="d-lg-flex">
                <div className="chat-leftsidebar me-lg-4">
                  <div>
                    <div className="py-4 border-bottom top-card" >
                      <div className="d-flex">
                        <div className="me-3">
                          {loggedChatUserInfo && loggedChatUserInfo?.user?.profile_picture === null ? (<h5 className="p-3 bg-primary rounded-circle text-light">{loggedChatUserInfo.user.name
                            .split("")
                            .slice(0, 2)
                            .map((char) => char.toUpperCase())
                            .join("")}</h5>) : (<img
                              src={`${API_BASE_URL}${loggedChatUserInfo && loggedChatUserInfo?.user?.profile_picture}`}
                              className="rounded-circle"
                              style={{ height: "50px", width: "50px" }}
                              alt="Profile Picture"
                            />)}

                        </div>

                        <Dropdown isOpen={onlineStatusDropdownOpen} toggle={toggleDropdown} className="d-flex">

                          <DropdownMenu>
                            <DropdownItem onClick={() => handleSelectOption("Active")}><i className="fas fa-circle text-success me-2"></i>Active</DropdownItem>
                            <DropdownItem onClick={() => handleSelectOption("Away")}><i className="fas fa-clock text-warning me-2"></i>Away</DropdownItem>
                            <DropdownItem onClick={() => handleSelectOption("DND")}><i className="fas fa-ban text-danger me-2"></i> DND</DropdownItem>
                            <DropdownItem onClick={() => handleSelectOption("Invisible")}><i className="fas fa-eye-slash text-secondary me-2"></i>Invisible</DropdownItem>
                          </DropdownMenu>
                        </Dropdown>
                        <div className="flex-grow-1 ">
                          <h5 className="font-size-18 mt-0 mb-1 ">
                            {currentUser.name}
                          </h5>
                          <div className="d-flex">
                            <p className="text-muted mb-0" style={{ cursor: "pointer" }} onClick={() => setOnlineStatusDropdownOpen(!onlineStatusDropdownOpen)}>
                              <>
                                {loggedChatUserInfo && (() => {
                                  switch (loggedChatUserInfo?.status) {
                                    case "Active":
                                      return <i className="mdi mdi-circle text-success align-middle me-2" />;
                                    case "Away":
                                      return <i className="fas fa-clock text-warning me-2"></i>;
                                    case "DND":
                                      return <i className="fas fa-ban text-danger me-2"></i>;
                                    case "Invisible":
                                      return <i className="fas fa-eye-slash text-secondary me-2"></i>;
                                    default:
                                      return null;
                                  }
                                })()}
                              </>
                              <span className="text-primary me-3">Set a Status</span>
                            </p>
                            <div>
                              <input
                                ref={fileInputRef}
                                type="file"
                                style={{ display: 'none' }}
                                onChange={handleFileChange}
                              />
                              <p className="text-primary" onClick={handleClick} style={{ cursor: "pointer" }}>
                                Change profile picture
                              </p>
                            </div>
                          </div>
                        </div>

                      </div>
                    </div>


                    <div className="chat-leftsidebar-nav mt-3">
                      <Nav pills justified>
                        <NavItem>
                          <NavLink
                            className={classnames({
                              active: activeTab === "1",
                            })}
                            onClick={() => {
                              toggleTab("1");
                              setChatId();
                              setCurrentMessage()
                            }}
                          >
                            <i className="bx bx-chat font-size-20 d-sm-none" />
                            <span className="d-none d-sm-block">Chat</span>
                          </NavLink>
                        </NavItem>
                        <NavItem>
                          <NavLink
                            className={classnames({
                              active: activeTab === "2",
                            })}
                            onClick={() => {
                              toggleTab("2");
                              setChatId();
                              setCurrentMessage()
                            }}
                          >
                            <i className="bx bx-group font-size-20 d-sm-none" />
                            <span className="d-none d-sm-block">Groups</span>
                          </NavLink>
                        </NavItem>
                        <NavItem>
                          <NavLink
                            className={classnames({
                              active: activeTab === "3",
                            })}
                            onClick={() => {
                              toggleTab("3");
                              setChatId();
                              setCurrentMessage()
                            }}
                          >
                            <i className="bx bx-book-content font-size-20 d-sm-none" />
                            <span className="d-none d-sm-block">Contacts</span>
                          </NavLink>
                        </NavItem>
                      </Nav>
                      <TabContent activeTab={activeTab} className="py-4">

                        <TabPane tabId="1">
                          <div className="recent-tab">

                            <h5 className="font-size-14 m-3 mb-0">Recent Chats</h5>
                            <div className="search-box chat-search-box py-4">
                              <div className="position-relative">
                                <Input
                                  onKeyUp={searchUsers}
                                  id="search-user"
                                  type="text"
                                  className="form-control"
                                  placeholder="Search..."
                                />
                                <i className="bx bx-search-alt search-icon" />
                              </div>
                            </div>
                            <ul
                              className="list-unstyled chat-list"
                              id="recent-list"
                            >
                              <PerfectScrollbar style={{ height: "43vh" }}>
                                {chats && chats.length > 0 ? (chats &&
                                  chats.map((chat, index) => (
                                    <li
                                      key={index}

                                      // onClick={() => {
                                      //   connectChatRoom(
                                      //     chat?.members?.filter(
                                      //       (eachMember) =>
                                      //         eachMember.id !==
                                      //         currentUser.currentUserId
                                      //     )[0]
                                      //   );
                                      //   const activeChatElement = document.querySelector('.active');
                                      //   if (activeChatElement) {
                                      //     activeChatElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                      //   }
                                      //   setChatId(chat.id)
                                      //   setSelectedGroupChat(chat)
                                      //   setReceiverId(chat?.members?.filter(
                                      //     (eachMember) =>
                                      //       eachMember.id !==
                                      //       currentUser.currentUserId
                                      //   )[0]?.id);
                                      // }}
                                      onClick={() => {
                                        connectChatRoom(
                                          chat?.members?.filter(
                                            (eachMember) =>
                                              eachMember.id !== currentUser.currentUserId
                                          )[0]
                                        );
                                        setChatId(chat.id);
                                        setSelectedGroupChat(chat);
                                        setReceiverId(
                                          chat?.members?.filter(
                                            (eachMember) =>
                                              eachMember.id !== currentUser.currentUserId
                                          )[0]?.id
                                        );

                                      }}


                                      className={
                                        selectedUser ===
                                          chat?.members?.filter(
                                            (eachMember) =>
                                              eachMember?.id !==
                                              currentUser.currentUserId
                                          )[0]?.id
                                          ? "active"
                                          : ""
                                      }
                                    >
                                      <Link
                                        to="#"

                                      >
                                        <div className="d-flex">


                                          <div className="position-relative me-3">

                                            {chat.display_picture ? (
                                              <img src={`${API_BASE_URL}${chat?.display_picture}`} alt="DP" className="rounded-circle" style={{ height: "50px", width: "50px" }} />
                                            ) : (
                                              <span className="avatar-title rounded-circle" style={{
                                                height: "50px",
                                                width: "50px",
                                                backgroundColor: getRandomSoftColor(),
                                                color: getRandomDarkColor(),
                                                boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
                                                fontWeight: "700",
                                                fontSize: "15px"
                                              }}>
                                                {chat?.display_name.split("")[0].toUpperCase() + chat?.display_name.split("")[1].toUpperCase()}
                                              </span>
                                            )}


                                            <div className="position-absolute" style={{ bottom: "-4px", right: "-9px" }}>
                                              <i className={chat && (() => {
                                                switch (chat.display_status) {
                                                  case "Active":
                                                    return "mdi mdi-circle text-success align-middle me-2";
                                                  case "Away":
                                                    return "fas fa-clock text-warning me-2";
                                                  case "DND":
                                                    return "fas fa-ban text-danger me-2";
                                                  case "Invisible":
                                                    return "me-4";
                                                  default:
                                                    return null;
                                                }
                                              })()} />
                                            </div>
                                          </div>


                                          <div className="flex-grow-1 overflow-hidden">
                                            <h5 className="text-truncate font-size-14 mb-1">
                                              {chat.display_name}
                                            </h5>
                                            <p className="text-truncate mb-0 me-2" style={{ width: "50%", overflow: "hidden" }}>
                                              {
                                                chat?.last_message
                                                  ? (chat.last_message.message.split(" ")[0] +
                                                    (chat.last_message.message.split(" ")[1]
                                                      ? " " + chat.last_message.message.split(" ")[1].slice(0, 8) + " " + "..."
                                                      : ""))
                                                  : "Start Chatting!"
                                              }

                                            </p>
                                          </div>
                                          <div className="font-size-11 d-flex flex-column">
                                            {chat?.last_message ? (
                                              <React.Fragment>
                                                <span>{new Date(chat.last_message.date).toLocaleDateString()}</span>
                                                <span>{new Date(chat.last_message.date).toLocaleTimeString(undefined, {
                                                  hour: '2-digit',
                                                  minute: '2-digit'
                                                })}</span>
                                              </React.Fragment>
                                            ) : ""}

                                          </div>

                                        </div>
                                      </Link>
                                    </li>
                                  ))) : <div
                                    style={{
                                      height: "100%",
                                      width: "100%",
                                      display: "flex",
                                      flexDirection: "column",
                                      alignItems: "center",
                                      justifyContent: "center",
                                    }}
                                  >
                                  <img
                                    src={chatsImage}
                                    alt=""
                                    className="img-fluid mx-auto d-block"
                                    style={{ height: "80%", width: "100%" }}
                                  />
                                  <p style={{ fontSize: "15px", fontWeight: "bold" }}>
                                    Select a Contact to see chats
                                  </p>
                                </div>}

                              </PerfectScrollbar>
                            </ul>
                          </div>
                        </TabPane>

                        <TabPane tabId="2">
                          <div className="group-tab">
                            <h5 className="font-size-14 m-3 mb-0">Recent Group Chats</h5>
                            <div className="search-box chat-search-box py-4">
                              <div className="position-relative">
                                <Input
                                  onKeyUp={searchGroups}
                                  id="search-groups"
                                  type="text"
                                  className="form-control"
                                  placeholder="Search..."
                                />
                                <i className="bx bx-search-alt search-icon" />
                              </div>
                            </div>
                            <ul className="list-unstyled chat-list">
                              <PerfectScrollbar style={{ height: "43vh" }}>
                                {groups && groups.length > 0 ? (groups &&
                                  groups.map((group, index) => (
                                    <li key={index}>
                                      <Link
                                        to="#"
                                        // onClick={() => {
                                        // userChatOpen(
                                        // group.id,
                                        // group.name,
                                        // group.status,
                                        // Math.floor(Math.random() * 100)
                                        // );
                                        // }}
                                        onClick={() =>
                                          connectGroupChatRoom(group)
                                        }
                                      >
                                        <div className="d-flex align-items-center">
                                          {/* <div className="avatar-xs me-3">
                                            <span className="avatar-title rounded-circle bg-primary bg-soft text-primary">
                                              {group.image}
                                            </span>
                                          </div> */}
                                          {group.display_picture ? (
                                            <div className=" align-self-center me-3 ms-1">
                                              <span className="avatar-title rounded-circle bg-primary bg-soft text-primary">
                                                <img src={`${API_BASE_URL}${group?.display_picture}`} alt="DP" className="rounded-circle"
                                                  style={{ height: "50px", width: "50px" }} />
                                              </span>
                                            </div>
                                          ) : (
                                            <div className=" align-self-center me-3">
                                              <span className="avatar-title rounded-circle" style={{
                                                height: "50px",
                                                width: "50px",
                                                backgroundColor: getRandomSoftColor(),
                                                color: getRandomDarkColor(),
                                                boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
                                                fontWeight: "700",
                                                fontSize: "15px"
                                              }}>
                                                {group?.display_name
                                                  .split("")[0]
                                                  .toUpperCase() + group?.display_name
                                                    .split("")[1]
                                                    .toUpperCase()}
                                              </span>
                                            </div>
                                          )}

                                          <div className="flex-grow-1">
                                            <h5 className="font-size-14 mb-0">
                                              {group.group_name}
                                            </h5>
                                            <p className="text-truncate mb-0 me-2">
                                              {group?.last_message ? group.last_message.message : "Start Chatting!"}
                                            </p>
                                          </div>
                                          <div className="font-size-11 d-flex flex-column">
                                            {group?.last_message ? (
                                              <React.Fragment>
                                                <span>{new Date(group.last_message.date).toLocaleDateString()}</span>
                                                <span>{new Date(group.last_message.date).toLocaleTimeString(undefined, {
                                                  hour: '2-digit',
                                                  minute: '2-digit'
                                                })}</span>
                                              </React.Fragment>
                                            ) : ""}

                                          </div>
                                        </div>
                                      </Link>
                                    </li>
                                  ))) : (<div
                                    style={{
                                      height: "100%",
                                      width: "100%",
                                      display: "flex",
                                      flexDirection: "column",
                                      alignItems: "center",
                                      justifyContent: "center",
                                    }}
                                  >
                                    <img
                                      src={groupsImage}
                                      alt=""
                                      className="img-fluid mx-auto d-block"
                                      style={{ height: "80%", width: "100%" }}
                                    />
                                    <p style={{ fontSize: "15px", fontWeight: "bold" }}>
                                      Join a Group to start messaging
                                    </p>
                                  </div>)}

                              </PerfectScrollbar>
                            </ul>
                          </div>
                        </TabPane>

                        <TabPane tabId="3">
                          <button
                            className="btn btn-primary w-100 mb-2"
                            onClick={toggleModal}
                          >
                            Create Group
                          </button>


                          <div className="contacts-tab p-3" >
                            <h5 className="font-size-14 m-2 mb-0">Contacts</h5>
                            <div className="search-box chat-search-box py-4">
                              <div className="position-relative">
                                <Input
                                  onChange={(event) => searchContacts(event)}
                                  id="search-contacts"
                                  type="text"
                                  className="form-control"
                                  placeholder="Search..."
                                />
                                <i className="bx bx-search-alt search-icon" />
                              </div>
                            </div>
                            <PerfectScrollbar style={{ height: "40vh" }}>
                              {filteredContacts &&
                                filteredContacts.filter(contact => contact.id != currentUser?.currentUserId).map((contact) => (
                                  <div
                                    key={"test_" + contact.id}
                                    className="d-flex"
                                    onClick={() => {
                                      connectChatRoom(contact);
                                      toggleTab("1");
                                      dispatch(onGetChats());
                                      setReceiverId(contact?.id)
                                    }}
                                  >
                                    {contact.profile_picture ? <div className="avatar-xs mt-4 me-2 mb-0 pb-0">
                                      <img src={`${API_BASE_URL}${contact.profile_picture}`} style={{ height: "50px", width: "50px" }} alt="image" className="rounded-circle" />
                                    </div>
                                      : <div className="avatar-xs mt-4 me-2 mb-0 pb-0">
                                        <span className="avatar-title rounded-circle" style={{
                                          height: "50px",
                                          width: "50px",
                                          backgroundColor: getRandomSoftColor(),
                                          color: getRandomDarkColor(),
                                          boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
                                          fontWeight: "700",
                                          fontSize: "15px"
                                        }}>
                                          {contact.name
                                            .split("")[0]
                                            .toUpperCase() + contact.name
                                              .split("")[1]
                                              .toUpperCase()}
                                        </span>
                                      </div>}


                                    <ul className="list-unstyled chat-list w-100 m-3 mb-0 p-0 pt-1">
                                      <li>
                                        <Link to="#">
                                          <h5 className="font-size-15 mb-0" style={{ fontWeight: '500' }}>
                                            {contact.name.charAt(0).toUpperCase() + contact.name.slice(1)}
                                          </h5>
                                        </Link>
                                      </li>
                                    </ul>

                                  </div>
                                ))}
                            </PerfectScrollbar>
                          </div>
                        </TabPane>
                      </TabContent>
                    </div>
                  </div>
                </div>
                {isChatSelected == true ? (
                  // <div className="w-100 user-chat">
                  <div className="w-100 user-chat" style={{ height: "100%" }}>
                    <Card>
                      <div className="p-4 border-bottom ">
                        <Row>
                          <Col md="4" xs="9" className="d-flex">
                            {selectedGroupChat?.is_personal ? (
                              selectedGroupChat?.display_picture ? (
                                <div className="align-self-center me-3 ">
                                  <span className="avatar-title rounded-circle bg-primary bg-soft text-primary">
                                    <img
                                      src={`${API_BASE_URL}${selectedGroupChat?.display_picture}`}
                                      alt="DP"
                                      className="rounded-circle"
                                      style={{ height: "50px", width: "50px" }}
                                    />
                                  </span>
                                </div>
                              ) : (
                                <div className=" align-self-center  me-3 ">
                                  <span className="avatar-title rounded-circle" style={{
                                    height: "50px",
                                    width: "50px",
                                    backgroundColor: getRandomSoftColor(),
                                    color: getRandomDarkColor(),
                                    boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
                                    fontWeight: "700",
                                    fontSize: "15px"
                                  }}>
                                    {selectedGroupChat?.display_name
                                      .split("")[0]
                                      .toUpperCase() + selectedGroupChat?.display_name
                                        .split("")[1]
                                        .toUpperCase()}
                                  </span>
                                </div>
                              )
                            ) : (
                              selectedGroupChat?.display_picture ? (
                                <div className="align-self-center me-3 ">
                                  <span className="avatar-title rounded-circle bg-primary bg-soft text-primary">
                                    <img
                                      src={`${API_BASE_URL}${selectedGroupChat?.display_picture}`}
                                      alt="DP"
                                      className="rounded-circle"
                                      style={{ height: "50px", width: "50px" }}
                                    />
                                  </span>
                                </div>
                              ) : (
                                <div className=" align-self-center  me-3">
                                  <span className="avatar-title rounded-circle" style={{
                                    height: "50px",
                                    width: "50px",
                                    backgroundColor: getRandomSoftColor(),
                                    color: getRandomDarkColor(),
                                    boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
                                    fontWeight: "700",
                                    fontSize: "15px"
                                  }}>
                                    {selectedGroupChat?.display_name
                                      .split("")[0]
                                      .toUpperCase() + selectedGroupChat?.display_name
                                        .split("")[1]
                                        .toUpperCase()}
                                  </span>
                                </div>
                              )
                            )}

                            <div className="d-flex flex-column">


                              {selectedGroupChat?.is_personal == true ? (<h5 className="font-size-15 mb-1">
                                {Chat_Box_Username && Chat_Box_Username}
                              </h5>) : (groupNameChangeClicked == true ? <div className="d-flex"><Input placeholder="Enter New Group Name" onChange={(e) => setNewGroupName(e.target.value)} required /> <button className="btn btn-sm btn-primary ms-1" onClick={onGroupNameSubmitClick}>SAVE</button></div> : <h5 className="font-size-15 mb-1">
                                {Chat_Box_Username && Chat_Box_Username}
                              </h5>)}


                              {selectedGroupChat?.is_personal == true ? <i className={selectedGroupChat && (() => {
                                switch (selectedGroupChat.display_status) {
                                  case "Active":
                                    return { className: "mdi mdi-circle text-success align-middle me-2 ", text: "Active Now" };
                                  case "Away":
                                    return { className: "fas fa-clock text-warning me-2 ", text: "Away" };
                                  case "DND":
                                    return { className: "fas fa-ban text-danger me-2 ", text: "Do Not Disturb" };
                                  case "Invisible":
                                    return { className: "me-4 ", text: "Invisible" };
                                  default:
                                    return { className: null, text: null };
                                }
                              })()?.className}>
                                {selectedGroupChat && (() => {
                                  switch (selectedGroupChat.display_status) {
                                    case "Active":
                                      return "Active Now";
                                    case "Away":
                                      return "Away";
                                    case "DND":
                                      return "Do Not Disturb";
                                    case "Invisible":
                                      return "Invisible";
                                    default:
                                      return null;
                                  }
                                })()}
                              </i>
                                : <div className="d-flex w-100"><input
                                  ref={fileInputRef}
                                  type="file"
                                  style={{ display: 'none' }}
                                  onChange={handleGroupFileChange}
                                />
                                  <p className="text-primary m-1" style={{ fontSize: "10px", cursor: "pointer", width: "75px" }} onClick={handleClick}>Change picture</p><p className="text-primary m-1" style={{ fontSize: "10px", width: "75px", cursor: "pointer" }} onClick={() => setGroupNameClicked(!groupNameChangeClicked)}>Change Name</p></div>}</div>
                            {/* <p className="text-muted mb-0">
                              <i
                                className={
                                  Chat_Box_User_Status === "Active Now"
                                    ? "mdi mdi-circle text-success align-middle me-2"
                                    : Chat_Box_User_Status === "intermediate"
                                      ? "mdi mdi-circle text-warning align-middle me-1"
                                      : "mdi mdi-circle align-middle me-1"
                                }
                              />
                              {Chat_Box_User_Status}
                            </p> */}
                          </Col>
                          <Col md="8" xs="3">
                            <ul className="list-inline user-chat-nav text-end mb-0">
                              {/* <li className="list-inline-item d-none d-sm-inline-block">
                                <Dropdown
                                  className="me-1"
                                  isOpen={search_Menu}
                                  toggle={toggleSearch}
                                >
                                  <DropdownToggle
                                    className="btn nav-btn"
                                    tag="a"
                                  >
                                    <i className="bx bx-search-alt-2" />
                                  </DropdownToggle>
                                  <DropdownMenu className="dropdown-menu-md">
                                    <Form className="p-3">
                                      <FormGroup className="m-0">
                                        <InputGroup>
                                          <Input
                                            type="text"
                                            className="form-control"
                                            placeholder="Search Messages ..."
                                            onChange={(event) =>}
                                            aria-label="Recipient's username"
                                          />
                                        
                                          <Button color="primary" type="submit">
                                            <i className="mdi mdi-magnify" />
                                          </Button>
                                      
                                        </InputGroup>
                                      </FormGroup>
                                    </Form>
                                  </DropdownMenu>
                                </Dropdown>
                              </li> */}
                              <li className="list-inline-item d-none d-sm-inline-block">
                                <Dropdown
                                  isOpen={settings_Menu}
                                  toggle={toggleSettings}
                                  className="me-1"
                                >
                                  <DropdownToggle
                                    className="btn nav-btn"
                                    tag="a"
                                  >
                                    <i className="bx bx-cog" />
                                  </DropdownToggle>
                                  {groupChatClicked === true ? (
                                    <DropdownMenu>
                                      <DropdownItem
                                        href="#"
                                        onClick={handleViewGroupClick}
                                      >
                                        View Group
                                      </DropdownItem>
                                    </DropdownMenu>
                                  ) : (
                                    <DropdownMenu>
                                      <DropdownItem
                                        href="#"
                                        onClick={handleViewProfileClick}
                                      >
                                        View Profile
                                      </DropdownItem>
                                    </DropdownMenu>
                                  )}
                                </Dropdown>
                              </li>


                            </ul>
                          </Col>
                        </Row>
                      </div>

                      <div>
                        <div className="chat-conversation p-3">
                          <ul className="list-unstyled">
                            <PerfectScrollbar
                              style={{ height: "470px" }}
                              containerRef={(ref) => setMessageBox(ref)}
                            >

                              {chatMessages &&
                                chatMessages.map((message, index) => (

                                  <li
                                    key={index}
                                    className={
                                      message?.sender?.id ==
                                        currentUser.currentUserId ||
                                        message?.sender_id ==
                                        currentUser.currentUserId
                                        ? "text-end"
                                        : ""
                                    }
                                  >
                                    <div className="conversation-list">

                                      <div className="d-flex">
                                        {message?.sender?.profile_picture || message?.profile_picture ? (
                                          <img
                                            src={`${API_BASE_URL}${message?.sender ? message.sender.profile_picture : message.profile_picture}`}
                                            alt="img"
                                            className="rounded-circle me-1 mt-2"
                                            style={{ height: "40px", width: "40px" }}
                                          />
                                        ) : (

                                          <div className="avatar-xs mt-2 me-3 mb-0 pb-0">
                                            <span className="avatar-title rounded-circle" style={{
                                              height: "40px",
                                              width: "40px",
                                              backgroundColor: getRandomSoftColor(),
                                              color: getRandomDarkColor(),
                                              boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
                                              fontWeight: "700",
                                              fontSize: "15px"
                                            }}>
                                              {message?.name ? message?.name?.split("")[0].toUpperCase() + message?.name?.split("")[1].toUpperCase() : message.sender.name.split("")[0].toUpperCase() + message.sender.name.split("")[1].toUpperCase()}
                                            </span>
                                          </div>
                                        )}
                                        <div className="ctext-wrap">
                                          <div className="conversation-name">
                                            {message?.sender?.name ||
                                              message?.name}
                                          </div>
                                          {message?.attachment ? (
                                            <div>
                                              {message.attachment && message.attachment.match(/\.(jpeg|jpg|gif|png)$/) !== null ? (
                                                <div className="d-flex flex-column">
                                                  <img src={`${API_BASE_URL}${message.attachment}`} alt="Attachment" style={{ width: '200px', height: '200px', borderRadius: "10px", marginBottom: "5px" }} />
                                                  <button className="btn btn-sm btn-primary" onClick={() => openAttachment(`${API_BASE_URL}${message.attachment}`)}>
                                                    View
                                                  </button>
                                                </div>
                                              ) : (
                                                <div className="d-flex flex-column">
                                                  <img
                                                    src={file}
                                                    alt="File"
                                                    style={{
                                                      width: '150px',
                                                      height: '100px',
                                                      marginBottom: '5px'
                                                    }}
                                                  />
                                                  <button className="btn btn-sm btn-primary" onClick={() => openAttachment(`${API_BASE_URL}${message.attachment}`)}>
                                                    View
                                                  </button>
                                                </div>
                                              )}
                                            </div>

                                          ) : (
                                            <p style={{ width: "auto", maxWidth: "30vw" }}>{message?.message}</p>
                                          )}



                                          {message?.date ? (
                                            <p className="chat-time mb-0">
                                              <i className="bx bx-check-double fs-4 text-primary align-middle me-1"></i>{" "}
                                              {new Date(
                                                message.date
                                              ).toLocaleTimeString("en-US", {
                                                hour: "numeric",
                                                minute: "numeric",
                                                hour12: true,
                                              })}
                                            </p>
                                          ) : (
                                            <p className="chat-time mb-0">
                                              <i className="bx bx-check-double fs-4 text-primary align-middle me-1"></i>{" "}
                                              {new Date(
                                                message.timestamp
                                              ).toLocaleTimeString("en-US", {
                                                hour: "numeric",
                                                minute: "numeric",
                                                hour12: true,
                                              })}
                                            </p>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  </li>

                                ))}
                              {/* {messages &&
map(messages, message => (
<li
key={"test_k" + message.id}
className={
message.sender === currentUser.name
? "right"
: ""
}
>
<div className="conversation-list">
<UncontrolledDropdown>
<DropdownToggle
href="#"
tag="a" className="dropdown-toggle"
>
<i className="bx bx-dots-vertical-rounded" />
</DropdownToggle>
<DropdownMenu>
<DropdownItem onClick={(e) => copyMsg(e.target)} href="#">
Copy
</DropdownItem>
<DropdownItem href="#">
Save
</DropdownItem>
<DropdownItem href="#">
Forward
</DropdownItem>
<DropdownItem onClick={(e) => toggle_deleMsg(e.target)} href="#">
Delete
</DropdownItem>

</DropdownMenu>
</UncontrolledDropdown>
<div className="ctext-wrap">
<div className="conversation-name">
{message.sender}
</div>
<p>{message.message}</p>
<p className="chat-time mb-0"><i className="bx bx-time-five align-middle me-1"></i> {message.time}</p>
</div>
</div>
</li>
))} */}
                            </PerfectScrollbar>
                          </ul>
                        </div>
                        <div className="p-3 chat-input-section">
                          <Row>
                            <Col>
                              <div className="position-relative">
                                <input
                                  type="text"
                                  value={currentMessage}
                                  onKeyPress={onKeyPress}
                                  onChange={(e) =>
                                    setCurrentMessage(e.target.value)
                                  }
                                  className="form-control chat-input"
                                  placeholder="Enter Message..."
                                  ref={inputRef}
                                />
                                <div className="chat-input-links">
                                  <ul className="list-inline mb-0">
                                    <li className="list-inline-item">
                                      <Link to="#" onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
                                        <i className="mdi mdi-emoticon-happy-outline me-1" id="Emojitooltip" />
                                      </Link>
                                    </li>
                                    <li className="list-inline-item">
                                      <input
                                        type="file"
                                        id="fileInput"
                                        style={{ display: 'none' }}
                                        onChange={handleAttachmentFileChange}
                                      />
                                      <i
                                        className="mdi mdi-file-document-outline"
                                        id="Filetooltip"
                                        onClick={() => {
                                          document.getElementById('fileInput').click();
                                        }}
                                      />
                                      <UncontrolledTooltip placement="top" target="Filetooltip">
                                        Attachments
                                      </UncontrolledTooltip>
                                    </li>
                                  </ul>
                                </div>
                                {showEmojiPicker && (
                                  <div style={{ position: 'absolute', bottom: '50px', left: '0' }}>
                                    <EmojiPicker onEmojiClick={handleEmojiClick} disableAutoFocus={true} width={inputRef.current.offsetWidth} height="400px" />
                                  </div>
                                )}
                              </div>
                            </Col>
                            <Col className="col-auto">
                              <Button
                                type="button"
                                color="primary"
                                onClick={addMessage}
                                className="btn btn-primary btn-rounded chat-send w-md "
                              >
                                <span className="d-none d-sm-inline-block me-2">
                                  Send
                                </span>{" "}
                                <i className="mdi mdi-send" />
                              </Button>
                            </Col>
                          </Row>
                        </div>
                      </div>
                    </Card>
                  </div>
                ) : (
                  <div
                    style={{
                      height: "85vh",
                      width: "100vw",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <div className="d-flex align-items-center">
                      <div>
                        {loggedChatUserInfo && loggedChatUserInfo?.user?.profile_picture === null ? (<h3 className="p-3 rounded-circle d-flex align-items-center justify-content-center bg-primary text-light" style={{ height: "70px", width: "70px", boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)", fontSize: "25px", fontWeight: "600" }}>{loggedChatUserInfo.user.name
                          .split("")
                          .slice(0, 2)
                          .map((char) => char.toUpperCase())
                          .join("")}</h3>) : (<img
                            src={`${API_BASE_URL}${loggedChatUserInfo && loggedChatUserInfo?.user?.profile_picture}`}
                            className="rounded-circle"
                            style={{ height: "80px", width: "80px" }}
                            alt="Profile Picture"
                          />)}

                      </div>
                      <h1 style={{ fontSize: "35px", fontWeight: "700" }} className="text-dark me-2 ms-2 mt-2">
                        Welcome, <span style={{ fontSize: "35px", fontWeight: "700", }} className="text-dark">{loggedChatUserInfo && loggedChatUserInfo.user ? loggedChatUserInfo.user.name + "!" : ''}</span>
                      </h1>

                    </div>

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
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};


export default ChatsTest;
