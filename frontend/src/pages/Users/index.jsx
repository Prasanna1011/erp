import {
  API_BASE_URL,
  API_DELETE_USER,
  API_GET_POSITIONS,
  API_GET_USERS,
  API_STATUS_TOGGLE,
  API_TECHNOLOGY_POST_GET,
  API_USER_STATUS_TOGGLE,
  API_GET_USER_BY_ID,
  API_USER_DOWNLOAD_CSV,
  API_GET_ROLE_PERMSSIONS_DATA,
} from "Apis/api";
import React, { useState, useRef, useEffect } from "react";
import axios from "axios";

import { Link } from "react-router-dom";
import {
  Row,
  Col,
  Card,
  CardBody,
  FormGroup,
  Button,
  Label,
  Input,
  Container,
  FormFeedback,
  Form,
  Table,
  Modal,
} from "reactstrap";
import warningImage from "../../assets/images/warning/warning.png";
import { toast } from "react-toastify";

import GetAuthToken, { getUsername } from "TokenImport/GetAuthToken";
import { TablePagination } from "@mui/material";
import { DNA } from "react-loader-spinner";



const Users = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  const [usersData, setUsersData] = useState([]);
  const [technologyData, setTechnologyData] = useState([]);
  const [positionData, setPositionData] = useState([]);
  const [deleteDataById, setdeleteDataById] = useState(null);

  const [deletePopup, setDeletePopup] = useState(false);
  const [isStatusDisable, setIsStatusDisable] = useState(false);
  const [userDataById, setUserDataById] = useState();

  const [modal_center, setmodal_center] = useState(false);
  const [loading, setLoading] = useState(false)
  const [permissions, setPermissions] = useState()

  document.title = "User | TechAstha"

  useEffect(() => {
    getUsers();
    getTechnologies();
    getPosition();
  }, []);
  const config = GetAuthToken();

  const searchInputRef = useRef(null);

  const handleSearch = () => {
    try {
      const searchData = usersData.filter((item) => {
        const searchString = `${item?.firstname}${item?.phone_no} ${item?.select_position_id} ${item?.company_email_id}${item?.d_o_b} ${item?.status} `; // Add more properties as needed
        return searchString.toLowerCase().includes(searchQuery.toLowerCase());
      });
      setFilteredData(searchData);
    } catch (error) {
      console.log(error);
    }

  };
  // Delete popup Modal Start
  function deletePopupFun() {
    setDeletePopup(!deletePopup);
  }

  // Search Filter End

  const getUsers = async () => {
    try {
      setLoading(true)
      const { data } = await axios.get(API_GET_USERS, config);
      setUsersData(data.data);
      setLoading(false)
    } catch (error) {
      console.log(error);
    }
  };
  const getTechnologies = async () => {
    try {
      const { data } = await axios.get(API_TECHNOLOGY_POST_GET, config);
      setTechnologyData(data.data);
    } catch (error) {
      console.log(error);
    }
  };

  // get Positions Data  start
  const getPosition = async () => {
    try {
      const { data } = await axios.get(API_GET_POSITIONS, config);
      setPositionData(data.data);
    } catch (error) {
      console.log(error);
    }
  };
  const deleteUserById = async () => {
    try {
      // console.log(deleteDataById, "user id")
      await axios.delete(`${API_DELETE_USER}${deleteDataById}/`, config);
      toast.success(`User with ID ${deleteDataById} has been deleted`, {
        position: "top-center",
        autoClose: 3000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
      // alert(`User with ID ${id} has been deleted`)
      setUsersData((prevUsers) =>
        prevUsers?.filter((user) => user?.id !== deleteDataById)
      );
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("something went wrong", {
        position: "top-center",
        autoClose: 3000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
    }
  };

  const downloadCsv = async () => {
    try {
      const { data } = await axios.get(API_USER_DOWNLOAD_CSV, config, {
        responseType: "blob",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const blob = new Blob([data], { type: "application/csv" });

      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = `UsersData.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toggleExportData();
    } catch (error) {
      console.log("Error downloading file:", error);
    }
  };

  const statusToggle = async (id) => {
    try {
      // Find the user by id
      const filteredUser = usersData?.find((user) => user?.id === id);


      // Confirm the status change with a popup
      const confirmed = window.confirm(
        `Are you sure you want to change the status?`
      );

      // If the user confirms, proceed with the status change
      if (confirmed) {
        const data = { status: !filteredUser?.status };

        await axios.post(`${API_USER_STATUS_TOGGLE}${id}/`, data, config);
        getUsers();
      }
    } catch (error) {
      console.error("Error toggling user status:", error);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const getPositionName = (ID) => {
    const name = positionData.find((r) => r.position_id === ID);
    return name ? name.position_name : "Unknown Position";
  };
  const getContact = (ID) => {
    const filteredData = usersData.filter((item) => item.id === ID);
    if (filteredData.length > 0) {
      const contact = (
        <>
          {filteredData[0]?.personal_email_id} <br />
          {filteredData[0]?.phone_no} <br />
          DOB - {filteredData[0]?.d_o_b} <br />
          DOJ - {filteredData[0]?.date_of_joing}
        </>
      );

      return contact;
    } else {
      console.log("No contact found for the given ID");
      return null;
    }
  };
  const getTimeInCompany = (dateString) => {
    const currentDate = new Date(); // Current date

    // Convert the input date string to a Date object
    const joinDate = new Date(dateString);

    // Calculate the difference in milliseconds between the current date and the joining date
    const timeDifference = currentDate - joinDate;

    // Calculate years, months, and days from the time difference
    const years = Math.floor(timeDifference / (365.25 * 24 * 60 * 60 * 1000));
    const months = Math.floor(
      (timeDifference % (365.25 * 24 * 60 * 60 * 1000)) /
      (30.44 * 24 * 60 * 60 * 1000)
    );
    const days = Math.floor(
      (timeDifference % (30.44 * 24 * 60 * 60 * 1000)) / (24 * 60 * 60 * 1000)
    );
    const total_time = (
      <>
        {/* Joining Date: {joinDate.toDateString()} <br /> */}
        Years: {years} <br />
        Months: {months}
        <br />
        Days: {days}
      </>
    );

    return total_time;
  };

  const getUserById = async (id) => {
    try {
      setmodal_center(!modal_center);
      const { data } = await axios.get(`${API_GET_USER_BY_ID}${id}/`, config);
      setUserDataById(data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchUserPermissions = async () => {
    try {
      const { data } = await axios.get(API_GET_ROLE_PERMSSIONS_DATA, config);
      setPermissions(data?.select_user_role_id?.permissions)
    } catch (error) {
      console.error("Error fetching permissions:", error);
    }
  };

  useEffect(() => {
    handleSearch();
  }, [searchQuery, usersData]);

  useEffect(() => {
    fetchUserPermissions()
  }, [])

  const rolePermissions = permissions && permissions?.filter(eachPermission => eachPermission.module_name === "User");
  const allPermissions = [].concat(...(rolePermissions || []));

  return (
    <>
      <div className="page-content">
        <Container fluid={true}>
          <Modal isOpen={modal_center} size="xl" centered>
            <div className="modal-header">
              <h4 className="modal-title mt-0">User Details</h4>
              <button
                type="button"
                onClick={() => {
                  setmodal_center(false);
                }}
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <Row>
                <Col xl={6}>
                  <h5 className="text-dark mt-2 mb-2">Persoanl Details</h5>
                  <h6>
                    Name:{" "}
                    {userDataById &&
                      `${userDataById?.firstname} ${userDataById?.middlename} ${userDataById?.lastname}`}
                  </h6>
                  <h6>
                    Personal Email:{" "}
                    {userDataById && userDataById?.personal_email_id}
                  </h6>
                  <h6>
                    Comapny Email:{" "}
                    {userDataById && userDataById?.company_email_id}
                  </h6>
                  <h6>Skype Id: {userDataById && userDataById?.skype_id}</h6>
                  <h6>Phone Number: {userDataById && userDataById?.phone_no}</h6>
                  <h6>PAN Number: {userDataById && userDataById?.pan_no}</h6>
                  <h6>
                    Current Address:{" "}
                    {userDataById && userDataById?.current_address}
                  </h6>
                  <h6>
                    Permanent Address:{" "}
                    {userDataById && userDataById?.permanent_address}
                  </h6>
                  <h6>Date Of Birth: {userDataById && userDataById?.d_o_b}</h6>
                  <h6>
                    Blood Group: {userDataById && userDataById?.blood_group}
                  </h6>
                  <h6>Gender: {userDataById && userDataById?.gender}</h6>
                  <h6>
                    Emergency Contact Name:{" "}
                    {userDataById && userDataById?.emergency_contact_name}
                  </h6>
                  <h6>
                    Emergency Contact Number:{" "}
                    {userDataById && userDataById?.emergency_phone_no}
                  </h6>
                  <h6>
                    Relation With Emergency Contact:{" "}
                    {userDataById &&
                      userDataById?.relation_with_emergency_phone_no_id}
                  </h6>
                  <h6>
                    Reference Name:{" "}
                    {userDataById && userDataById?.reference_name}
                  </h6>
                  <h6>
                    Reference Email:{" "}
                    {userDataById && userDataById?.reference_email}
                  </h6>
                  <h6>
                    Reference Contact:{" "}
                    {userDataById && userDataById?.reference_contact}
                  </h6>
                  <h6>
                    Reference Contact:{" "}
                    {userDataById && userDataById?.reference_designation}
                  </h6>
                </Col>
                <Col xl={6}>
                  <h5 className="text-dark mt-2 mb-2">Reporting</h5>
                  <h6>
                    Date Of Joining:{" "}
                    {userDataById && userDataById?.date_of_joing}
                  </h6>
                  <h6>
                    Date Of Resignation:{" "}
                    {userDataById && userDataById?.date_of_resignation}
                  </h6>
                  <h6>
                    Date Of Relieving:{" "}
                    {userDataById && userDataById?.date_of_reliving}
                  </h6>
                  <h5 className="text-dark mt-2 mb-2">Employee Education</h5>
                  <h6>
                    Last Degree:{" "}
                    {userDataById && userDataById?.last_degree_cretificate}
                  </h6>
                  <h6>
                    Last Qualificaion Year:{" "}
                    {userDataById && userDataById?.last_qualification_year}
                  </h6>
                  <h6>
                    University:{" "}
                    {userDataById && userDataById?.last_university_name}
                  </h6>
                  <h6>
                    Last Qualification CGPA:{" "}
                    {userDataById && userDataById?.last_qualification_cgpa}
                  </h6>
                  <h5 className="text-dark mt-2 mb-2">Login Information</h5>
                  <h6>Username: {userDataById && userDataById?.username}</h6>
                  <h6>Password: {userDataById && userDataById?.password}</h6>
                  <h6>IP Address: {userDataById && userDataById?.ip_address}</h6>
                  <h6>Is Remote: {userDataById && userDataById?.is_remote}</h6>
                  <h5 className="text-dark mt-2 mb-2">Employee Documents</h5>
                  <div>
                    <a
                      href={`${API_BASE_URL}${userDataById && userDataById?.aadhar_card
                        }`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Aadhar Card
                    </a>
                  </div>
                  <div>
                    <a
                      href={`${API_BASE_URL}${userDataById && userDataById?.pan_card
                        }`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Pan Card
                    </a>
                  </div>
                  <div>
                    <a
                      href={`${API_BASE_URL}${userDataById &&
                        userDataById?.last_qualification_certificate
                        }`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Last Qualification Card
                    </a>
                    <div>
                    <a
                      href={`${API_BASE_URL}${userDataById &&
                        userDataById?.work_experience_certificate
                        }`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Experience Certificate
                    </a>
                    </div>
                    <div>
                    <a
                      href={`${API_BASE_URL}${userDataById &&
                        userDataById?.work_experience_reiving_letter
                        }`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Releaving Letter
                    </a>
                    </div>
                    <div>
                    <a
                      href={`${API_BASE_URL}${userDataById &&
                        userDataById?.work_experience_salary_slip
                        }`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Salary Slip 
                    </a>
                    </div>
                  </div>
                </Col>
              </Row>
            </div>
          </Modal>
          <Row>
            <Col xl={12}>
              <Card>
                <CardBody className="d-flex justify-content-between">
                  <h3>Users</h3>
                  <div>
                    {allPermissions && allPermissions.find((eachItem) => eachItem.method_name === "Export") && (
                      <Button
                        className="px-4 m-1"
                        color="secondary"
                        onClick={downloadCsv}
                      >
                        Export
                      </Button>)}
                    {allPermissions && allPermissions.find((eachItem) => eachItem.method_name === "Add") && (
                      <Link to="/ta-user-add">
                        <Button className="px-4 m-1" color="primary">
                          Create
                        </Button>
                      </Link>)}
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>

          <div className="d-flex mb-3 justify-content-center">
            <input
              className="rounded-4 w-25 border-0 shadow-sm  bg-body-tertiary rounded px-3 "
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              ref={searchInputRef}
            />
            {searchQuery.length >= 1 ? (
              <Button
                className="btn btn-sm "
                onClick={() => {
                  const input = searchInputRef.current;
                  if (input) {
                    input.select();
                    document.execCommand("cut");
                  }
                }}
              >
                <i className="fas fa-times"></i>
              </Button>
            ) : (
              <Button className=" btn btn-sm " onClick={handleSearch}>
                <i className="fas fa-search"></i>
              </Button>
            )}
          </div>

          {/*  Search filter*/}

          {/* table  */}
          <Row>
            <Col xl={12}>
              <Card className="pb-5">
                <CardBody>
                  {loading === true ? (<div
                    className="d-flex align-items-center justify-content-center"
                    style={{ height: "100vh" }}
                  >
                    <DNA
                      height={100}
                      width={100}
                      radius={9}
                      color="green"
                      ariaLabel="loading"
                      wrapperClass="custom-loader-wrapper"
                    />
                  </div>) : (<div className="table-responsive">
                    <Table className="align-middle ">
                      <thead className="table-light">
                        <tr>
                          <th className="text-center">No.</th>
                          <th className="text-center">Profile</th>
                          <th className="text-center">Name</th>
                          <th className="text-center">Contact</th>
                          <th className="text-center">Role Name</th>
                          <th className="text-center">Designation</th>
                          <th className="text-center">Time in Techastha</th>
                          <th className="text-center">Status</th>
                          {allPermissions && allPermissions.some(eachItem => eachItem.method_name === "Update" || eachItem.method_name === "Delete" || eachItem.method_name === "View") && (
                            <th className="text-center">Actions</th>
                          )}
                        </tr>
                      </thead>

                      <tbody className="">
                        {(searchQuery
                          ? filteredData
                          : usersData &&
                          usersData.slice(
                            page * rowsPerPage,
                            page * rowsPerPage + rowsPerPage
                          )
                        ).map((item, index) => (
                          <tr key={item?.id}>
                            <th scope="row" className="text-center">
                              {index + 1}
                            </th>
                            <td className="text-center">
                              <img
                                className="rounded-circle avatar-sm"
                                src={`${API_BASE_URL}${item?.choose_profile_picture}`}
                                alt={item?.choose_profile_picture}
                              />
                            </td>
                            <td className="text-center">
                              {item?.firstname} {item?.lastname}{" "}
                            </td>

                            <td className="text-center">
                              {getContact(item?.id)}
                            </td>
                            <td className="text-center">
                              {item?.select_user_role_name}
                            </td>

                            <td className="text-center">
                              {getPositionName(item?.select_position_id)}
                            </td>
                            <td className="text-center">
                              {getTimeInCompany(item?.date_of_joing)}
                            </td>
                            <td className="text-center">
                              {item?.status === true ? (
                                <Button
                                  type="button"
                                  className="btn btn-success btn-sm "
                                  onClick={() => statusToggle(item?.id)}
                                  disabled={isStatusDisable}
                                >
                                  <i className="bx bx-check-double font-size-16 align-middle me-2"></i>
                                  Active
                                </Button>
                              ) : (
                                <Button
                                  type="button"
                                  className="btn btn-danger btn-sm"
                                  onClick={() => statusToggle(item?.id)}
                                  disabled={isStatusDisable}
                                >
                                  <i className="bx bx-block font-size-16 align-middle me-2"></i>{" "}
                                  InActive
                                </Button>
                              )}
                            </td>


                            {allPermissions && allPermissions.some(eachItem => eachItem.method_name === "Update" || eachItem.method_name === "Delete" || eachItem.method_name === "View") && (
                              <td className="text-center">
                                <div className="flex">
                                  {allPermissions && allPermissions.find((eachItem) => eachItem.method_name === "Update") && (
                                    <Link to={`/ta-user-edit/${item?.id}`}>
                                      <Button
                                        color="warning"
                                        className="btn  btn-sm me-2"
                                      >
                                        <i className="fas fa-pen-fancy"></i>
                                      </Button>
                                    </Link>)}
                                  {allPermissions && allPermissions.find((eachItem) => eachItem.method_name === "View") && (
                                    <button
                                      className="btn btn-primary btn-sm m-1"
                                      onClick={() => getUserById(item?.id)}
                                    >
                                      <i className="fas fa-eye"></i>
                                    </button>)}
                                  {allPermissions && allPermissions.find((eachItem) => eachItem.method_name === "Delete") && (
                                    <Button
                                      color="danger"
                                      className="btn btn-warning btn-sm ms-2"
                                      onClick={() => {
                                        setdeleteDataById(item?.id);
                                        deletePopupFun();
                                      }}
                                    >
                                      <i className="fas fa-trash-alt"></i>
                                    </Button>)}
                                </div>
                              </td>)}
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>)}

                </CardBody>
                <TablePagination
                  className=" d-flex justfy-content-start"
                  rowsPerPageOptions={[10, 25, 50, 100]}
                  component="div"
                  count={usersData.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </Card>
            </Col>
          </Row>
          {/* table finsh */}
        </Container>
        {/* Delete Popup Modal start */}

        <Modal
          isOpen={deletePopup}
          toggle={() => {
            deletePopupFun();
          }}
          centered
        >
          <div className="modal-header">
            <h5 className="modal-title mt-0">Delete User</h5>
            <button
              type="button"
              onClick={() => {
                deletePopupFun();
              }}
              className="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div
            className="modal-body"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img
              src={warningImage}
              alt="Warning"
              className="img-fluid"
              style={{ height: "100px" }}
            />
            <p>Are you sure you want to delete Role?</p>
          </div>

          <div className="modal-footer">
            <Button
              color="danger"
              className="btn btn-warning  ms-2 px-4"
              onClick={() => {
                deleteUserById(); //
                deletePopupFun(); // Close the modal
              }}
            >
              Confirm Delete
            </Button>
            <Button
              color="secondary"
              className="btn btn-secondary  ms-2 px-5"
              onClick={() => {
                deletePopupFun(); // Close the modal without deleting
              }}
            >
              Cancel
            </Button>
          </div>
        </Modal>
      </div>
    </>
  );
};

export default Users;
