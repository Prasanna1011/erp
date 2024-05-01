import { API_ADD_MEMBERS_TO_GROUP, API_BASE_URL, API_REMOVE_MEMBERS_FROM_GROUP } from "Apis/api";
import axios from "axios";
import { chats } from "common/data";
import React, { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { Modal, ModalBody } from "reactstrap";
import GetAuthToken from "TokenImport/GetAuthToken";
import { useDispatch } from 'react-redux';

import {
  getGroups as onGetGroups,
} from "store/actions";

const AddAndRemoveFromGroup = ({ props }) => {
  const dispatch = useDispatch()
  const config = GetAuthToken();
  const { view, selectedUser, groupId, chats, groups, setViewProfile, contacts } = props;
  const [perosnalModal, setPersonalModal] = useState();
  const [groupModal, setGroupModal] = useState();
  const [onAddMemberToGroupClicked, setOnAddMembersToGroupClicked] = useState()
  const [filterMembersToAdd, setFilterMembersToAdd] = useState([]);



  const removeMemberFromGroup = async (id) => {
    const deleteId = {
      member_id: id,
    };

    try {
      const { data } = await axios.post(
        `${API_REMOVE_MEMBERS_FROM_GROUP}${groupId}/`,
        deleteId,
        config
      );
      dispatch(onGetGroups());
      toast.success("Removed From Group Successfully", {
        position: "top-center",
        autoClose: 3000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
    } catch (error) {
      toast.error("Something went wrong while removing from group", {
        position: "top-center",
        autoClose: 3000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
    }
  };

  const addMembersToGroup = async(id) => {
    const addId = {
      members: [id],
    };

    try {
      const { data } = await axios.post(
        `${API_ADD_MEMBERS_TO_GROUP}${groupId}/`,
        addId,
        config
      );
      dispatch(onGetGroups());
      toast.success("Added To Group Successfully", {
        position: "top-center",
        autoClose: 3000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
    } catch (error) {
      toast.error("Something went wrong while adding to group", {
        position: "top-center",
        autoClose: 3000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
    }
  }

  const selectedUserChats =
    chats &&
    selectedUser &&
    chats.filter((eachChat) => {
      if (eachChat.members) {
        return eachChat.members.some((eachMember) => {
          return eachMember.id === selectedUser;
        });
      }
      return false;
    });



const selectedGroupChats = useMemo(() => {
  return groups && groups.filter(eachGroup => eachGroup.id === groupId);
}, [groups, groupId]);

useEffect(() => {
  if (onAddMemberToGroupClicked) {
    const filteredMembers = contacts.filter(eachContact =>
      !selectedGroupChats[0]?.members.map(member => member.id).includes(eachContact.id)
    );
    setFilterMembersToAdd(filteredMembers);
  }
}, [onAddMemberToGroupClicked, contacts, selectedGroupChats]);


  useEffect(() => {
    if (view === "Personal") {
      setGroupModal(false);
      setPersonalModal(true);
    } else if (view === "Group") {
      setPersonalModal(false);
      setGroupModal(true);
    }
  }, [view]);

  if (view === "Personal") {
    return (
      <Modal isOpen={perosnalModal} centered>
        <div className="modal-header">
          <h5 className="modal-title mt-0 ">Profile Details</h5>
          <button
            type="button"
            onClick={() => {
              setPersonalModal(false);
              setViewProfile();
            }}
            className="close"
            data-dismiss="modal"
            aria-label="Close"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <ModalBody>
          <div>
            <div className="bg-primary p-3">
              <div className="d-flex align-items-center justify-content-center">
                <img
                  src={`${API_BASE_URL}${selectedUserChats[0]?.display_picture}`}
                  alt="Profile"
                  style={{
                    height: "100px",
                    width: "100px",
                    borderRadius: "50px",
                  }}
                />
              </div>
            </div>
            <h4 className="text-center m-2">
              {selectedUserChats[0]?.display_name}
            </h4>
          </div>
        </ModalBody>
      </Modal>
    );
  } else if (view === "Group") {
    return (
      <Modal isOpen={groupModal} centered>
        <div className="modal-header">
          <h5 className="modal-title mt-0">Group Details</h5>
          <button
            type="button"
            onClick={() => {
              setGroupModal(false);
              setViewProfile();
            }}
            className="close"
            data-dismiss="modal"
            aria-label="Close"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <ModalBody>
          <div>
            <div className="bg-primary p-3 rounded">
              <div className="d-flex align-items-center justify-content-center">
                <img
                  src={`${API_BASE_URL}${selectedGroupChats[0]?.display_picture}`}
                  alt="Profile"
                  style={{
                    height: "100px",
                    width: "100px",
                    borderRadius: "50px",
                  }}
                />
              </div>
            </div>
            <h4 className="text-center m-2">
              {selectedGroupChats[0]?.display_name}
            </h4>
            <div>
              <div className="d-flex flex-column">
                <button className="btn btn-secondary w-100" onClick={() => setOnAddMembersToGroupClicked(!onAddMemberToGroupClicked)}>Add Members</button>
                {onAddMemberToGroupClicked && <div style={{ height: "250px", overflow: "auto" }}>
                  <hr style={{ borderTop: "1px solid #ccc" }} />
                  {filterMembersToAdd &&
                    filterMembersToAdd.map((eachMember, index) => (
                      <div key={index}>
                        <div className="d-flex align-items-center justify-content-between">
                          <h6>{eachMember.name}</h6>
                          <button
                            className="btn btn-sm btn-primary"
                            onClick={() => addMembersToGroup(eachMember?.id)}
                            
                          >
                            Add Member
                          </button>
                        </div>
                        <hr style={{ borderTop: "1px solid #ccc" }} />
                      </div>
                    ))}
                </div>}
                <h5 className="mt-2 mb-0">Group Members</h5>
                <div style={{ height: "250px", overflow: "auto" }}>
                  <hr style={{ borderTop: "1px solid #ccc" }} />
                  {selectedGroupChats &&
                    selectedGroupChats[0]?.members.map((eachMember, index) => (
                      <div key={index}>
                        <div className="d-flex align-items-center justify-content-between">
                          <h6>{eachMember.name}</h6>
                          <button
                            className="btn btn-sm btn-primary"
                            onClick={() => removeMemberFromGroup(eachMember?.id)}
                          >
                            Remove
                          </button>
                        </div>
                        <hr style={{ borderTop: "1px solid #ccc" }} />
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </ModalBody>
      </Modal>
    );
  } else {
    return null; // or handle other cases as needed
  }
};

export default AddAndRemoveFromGroup;
