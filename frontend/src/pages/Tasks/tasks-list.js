import React, { useEffect, useState } from "react";
import { useDrop, useDrag } from "react-dnd";
import ReactQuill, { Quill, editor } from "react-quill";
import "react-quill/dist/quill.snow.css";
import {
  Badge,
  Button,
  Card,
  CardBody,
  CardTitle,
  Col,
  Container,
  Form,
  FormFeedback,
  FormGroup,
  Input,
  Label,
  Modal,
  Row,
} from "reactstrap";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Breadcrumbs } from "@mui/material";
import { Link } from "react-router-dom";
import axios from "axios";
import GetAuthToken from "TokenImport/GetAuthToken";
import { toast } from "react-toastify";
import {
  API_ADD_PROJECT,
  API_CREATE_TASK,
  API_DELETE_TASKS,
  API_TASK_STATUS_UPDATE,
  API_UPDATE_TASK,
  API_GET_TASK_LIST,
  API_BASE_URL,
  API_GET_PROJECTS,
  API_TASK_PAUSE_OR_RESUME,
  API_GET_TASK_LIST_WITH_FILTERS,
  API_TASK_COMMENT,
  API_TASK_ACTIVITY,
  GET_FILTER_TASK_API,
  GET_DEVELOPERS_IN_PROJECT,
} from "Apis/api";
import { useFormik } from "formik";
import * as Yup from "yup";
import { DNA } from "react-loader-spinner";

const style = {
  minHeight: "200px",
  width: "30%",
  border: "1px solid #ddd",
  borderRadius: "4px",
  padding: "8px",
};

const titleStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "18px",
  background: "#556EE6",
  color: "white",
  height: "40px",
  marginBottom: "20px",
};

const Task = ({
  task,
  onTaskMove,
  onTaskEdit,
  onTaskDelete,
  onTaskClick,
  onPauseOrResume,
}) => {
  const [{ isDragging }, drag] = useDrag({
    type: "TASK",
    item: { id: task.id, status: task.status },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  const handleClick = () => {
    onTaskClick(task.id);
  };

  return (
    <div
      ref={drag}
      style={{
        opacity: isDragging ? 0.5 : 1,
        cursor: "move",
        border: "1px solid #ccc",
        borderRadius: "4px",
        padding: "8px",
        marginBottom: "8px",
        position: "relative",
      }}
    >
      <div className="border-bottom pb-2 mb-1 d-flex justify-content-between">
        <h5
          style={{
            marginBottom: "0px",
            paddingBottom: "0px",
            fontSize: "14px",
            fontWeight: "700",
            color: "#556EE6",
          }}
        >
          {task.title}
        </h5>
        <div style={{ marginBottom: "0px", paddingBottom: "0px" }}>
          {task?.status === "Working" && (
            <>
              {task?.task_activity === true ? (
                <Badge
                  color="light"
                  className="p-1"
                  style={{ cursor: "pointer", marginRight: "8px" }}
                  onClick={() => onPauseOrResume(task)}
                >
                  {" "}
                  <i className="fas fa-pause text-success fs-6"></i>
                </Badge>
              ) : (
                <Badge
                  color="light"
                  className="p-1"
                  style={{ cursor: "pointer", marginRight: "8px" }}
                  onClick={() => onPauseOrResume(task)}
                >
                  <i className="fas fa-play text-warning fs-6"></i>
                </Badge>
              )}
            </>
          )}
          <Badge
            color="light"
            className="p-1"
            style={{ cursor: "pointer", marginRight: "8px" }}
            onClick={() => onTaskEdit(task.id)}
          >
            <i className="fas fa-pen-fancy text-waring fs-6"></i>
          </Badge>
          <Badge
            color="light"
            className="p-1"
            style={{ cursor: "pointer" }}
            onClick={() => onTaskDelete(task.id)}
          >
            <i className="fas fa-trash-alt text-danger fs-6"></i>
          </Badge>
        </div>
      </div>
      <div onClick={handleClick}>
        <Row>
          <Col lg="3">
            <Badge
              color={(() => {
                switch (task.priority) {
                  case "Highest":
                    return "danger";
                  case "High":
                    return "primary";
                  case "Medium":
                    return "warning";
                  case "Low":
                    return "info";
                  default:
                    return "default";
                }
              })()}
            >
              {task.priority}
            </Badge>
            <img
              src={task?.assign_to?.choose_profile_picture}
              alt="image"
              style={{
                height: "30px",
                width: "30px",
                borderRadius: "30px",
                marginTop: "10px",
              }}
            />
          </Col>
          <Col lg="9">
            <p className="m-0 text-dark">Project : {task.project.name}</p>
            <p className="m-0 text-dark">Start Date : {task.start_date}</p>
            <p className="m-0 text-dark">End Date : {task.end_date}</p>
          </Col>
        </Row>
      </div>
    </div>
  );
};

const TaskColumn = ({
  title,
  tasks,
  onTaskMove,
  onTaskEdit,
  onTaskDelete,
  onTaskClick,
  onPauseOrResume,
}) => {
  const [{ isOver }, drop] = useDrop({
    accept: "TASK",
    drop: (item) => {
      onTaskMove(item.id, title);
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  return (
    <div
      ref={drop}
      style={{
        ...style,
        background: isOver ? "#f0f0f0" : "white",
        margin: "5px",
      }}
    >
      <h2 style={titleStyle}>{title}</h2>
      {tasks &&
        tasks?.map((task) => (
          <Task
            key={task.id}
            task={task}
            onTaskMove={onTaskMove}
            onTaskEdit={onTaskEdit}
            onTaskDelete={onTaskDelete}
            onTaskClick={onTaskClick}
            onPauseOrResume={onPauseOrResume}
          />
        ))}
    </div>
  );
};

const AppWithDnD = () => {
  const [taskData, setTaskData] = useState();
  const [projectsData, setProjectsData] = useState();
  const [modal_center, setmodal_center] = useState(false);
  const [modal_center_view_task, setmodal_center_view_task] = useState(false);
  const [editTaskData, setEditTaskData] = useState();
  const [selectedProject, setSelectedProject] = useState();
  const [viewTaskData, setViewTaskData] = useState();
  const [taskId, setTaskId] = useState();
  const [taskActivitySelected, setTaskActivitySelected] = useState(true);
  const [taskCommentsSelected, setTaskCommentsSelected] = useState(false);
  const [commentsAndActivityId, setCommentsAndActivityId] = useState();
  const [searchProject, setSearchProject] = useState("");
  const [searchTaskAssignedTo, setSearchTaskAssignedTo] = useState("");
  const [searchReviewBy, setSearchReviewBy] = useState("");
  const [taskComment, setTaskComment] = useState();
  const [liveComments, setLiveComments] = useState();
  const [taskActivity, setTaskActivity] = useState();
  const [loading, setLoading] = useState();
  const [selectedProjectId, setSelectedProjectId] = useState();
  const [selectedAssignedTo, setSelectedAssignedTo] = useState();
  const [selectedReviewBy, setSelectedReviewBy] = useState();
  const [developersInProject, setDevelopersInProject] = useState();
  const config = GetAuthToken();

  document.title = "Task | TechAstha";


  const getComments = async (taskId) => {
    try {
      const { data } = await axios.get(`${API_TASK_COMMENT}${taskId}/`, config);
      setLiveComments(data);
    } catch (error) {
      console.log(error);
    }
  };

  const submitComment = async () => {
    try {
      if (taskComment) {
        const { data } = await axios.post(
          `${API_TASK_COMMENT}${taskId}/`,
          { message: taskComment },
          config
        );
        getComments(taskId);
        setTaskComment("");
      } else {
        alert("Please write a comment");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleTaskClick = async (taskId) => {
    setmodal_center_view_task(!modal_center_view_task);
    setTaskId(taskId);
    try {
      const { data } = await axios.get(`${API_UPDATE_TASK}${taskId}/`, config);
      setViewTaskData(data.data[0]);

      if (data) {
        try {
          await getComments(taskId);
          const { data } = await axios.get(
            `${API_TASK_ACTIVITY}${taskId}/`,
            config
          );
          setTaskActivity(data);
        } catch (error) {
          console.log(error);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleTaskMove = async (taskId, newStatus) => {
    try {
      const statusData = {
        status: newStatus,
      };
      const { data } = await axios.post(
        `${API_TASK_STATUS_UPDATE}${taskId}/`,
        statusData,
        config
      );
      getTaskData();
      toast.success(`Task Updated Successfully`, {
        position: "top-center",
        autoClose: 500,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
    } catch (error) {
      toast.error("something went wrong", {
        position: "top-center",
        autoClose: 500,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
    }
  };

  const handlePauseOrResume = async (task) => {
    if (task.task_activity === false) {
      try {
        const { data } = await axios.post(
          `${API_TASK_PAUSE_OR_RESUME}${task.id}/`,
          { action: "true" },
          config
        );
        getTaskData();
        toast.success(`Task Started Successfully`, {
          position: "top-center",
          autoClose: 500,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        });
      } catch (error) {
        toast.error(`Failed To Start Task`, {
          position: "top-center",
          autoClose: 500,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        });
      }
    } else {
      try {
        const pauseReason = prompt("Enter reason for pausing the Task:");
        if (pauseReason !== null) {
          const { data } = await axios.post(
            `${API_TASK_PAUSE_OR_RESUME}${task.id}/`,
            { action: "false", close_note: pauseReason },
            config
          );
          getTaskData();
        }
        toast.success(`Task Paused Successfully`, {
          position: "top-center",
          autoClose: 500,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        });
      } catch (error) {
        toast.error(`Failed To Pause Task  `, {
          position: "top-center",
          autoClose: 500,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        });
      }
    }
  };

  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      project: editTaskData && editTaskData?.project,
      title: editTaskData && editTaskData?.title,
      module: editTaskData && editTaskData?.module,
      start_date: editTaskData && editTaskData?.start_date,
      end_date: editTaskData && editTaskData?.end_date,
      taskEndTime: editTaskData && editTaskData?.due_time,
      priority: editTaskData && editTaskData?.priority,
      description: editTaskData && editTaskData?.description,
      assign_to: editTaskData && editTaskData?.assign_to,
      review_by: editTaskData && editTaskData?.review_by,
      selectFiles: "",
      status: editTaskData && editTaskData?.status,
    },
    validationSchema: Yup.object({
      project: Yup.string().required("Please Select Project."),
      title: Yup.string().required("Please Enter Task Title."),
      module: Yup.string().required("Please Enter Module Name."),
      start_date: Yup.string().required("Please Enter Task Start Date."),
      end_date: Yup.string().required("Please Enter Task End Date."),
      taskEndTime: Yup.string().required("Please Enter Task End Time."),
      priority: Yup.string().required("Please Select Priority."),
      description: Yup.mixed().required("Please Enter Task Description."),
      assign_to: Yup.string().required("Please Select Task Assigned To."),
      review_by: Yup.string().required("Please Select Task Review By"),
      selectFiles: Yup.mixed().notRequired(),
    }),
    onSubmit: async (values) => {
      try {
        const formData = new FormData();

        for (const key in values) {
          if (values[key] !== null && values[key] !== undefined) {
            formData.append(key, values[key]);
          }
        }
        const { data } = await axios.post(
          `${API_UPDATE_TASK}${taskId}/`,
          formData,
          config
        );
        getTaskData();
        setmodal_center(false);
        toast.success(`Task Updated Successfully`, {
          position: "top-center",
          autoClose: 3000,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        });
        navigate("/tasks-list");
      } catch (error) {
        console.log(error);
      }
    },
  });

  
  useEffect(() => {
    if (validation?.values?.project) {
      const getDevelopers = async () => {
        try {
          const { data } = await axios.get(
            `${GET_DEVELOPERS_IN_PROJECT}${validation?.values?.project}/`,
            config
          );
          setDevelopersInProject(data);
        } catch (error) {
          console.log(error);
        }
      };
      getDevelopers();
    }
  }, [validation?.values?.project]);

  const handleTaskEdit = async (taskId) => {
    setmodal_center(!modal_center);
    setTaskId(taskId);
    try {
      const { data } = await axios.get(`${API_UPDATE_TASK}${taskId}/`, config);
      setEditTaskData(data?.data[0]);
    } catch (error) {
      console.log(error);
    }
  };

  // const handleTaskDelete = async (taskId) => {
  //   try {
  //     const { data } = await axios.delete(
  //       `${API_DELETE_TASKS}${taskId}/`,
  //       config
  //     );
  //     toast.success(`Task Deleted Successfully`, {
  //       position: "top-center",
  //       autoClose: 1000,
  //       closeOnClick: true,
  //       pauseOnHover: true,
  //       draggable: true,
  //       theme: "light",
  //     });
  //     getTaskData();
  //   } catch (error) {
  //     toast.error("something went wrong", {
  //       position: "top-center",
  //       autoClose: 500,
  //       closeOnClick: true,
  //       pauseOnHover: true,
  //       draggable: true,
  //       theme: "light",
  //     });
  //   }
  // };

  const handleTaskDelete = async (taskId) => {
    const shouldDelete = window.confirm("Are you sure you want to delete this task?");
  
    if (!shouldDelete) {
      return; 
    }
  
    try {
      const { data } = await axios.delete(`${API_DELETE_TASKS}${taskId}/`, config);
      toast.success(`Task Deleted Successfully`, {
        position: "top-center",
        autoClose: 1000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
      getTaskData();
    } catch (error) {
      toast.error("Something went wrong", {
        position: "top-center",
        autoClose: 500,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
    }
  };
  

  const getTaskData = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${API_GET_TASK_LIST_WITH_FILTERS}?project=${searchProject}&assign_to=${searchTaskAssignedTo}&review_by=${searchReviewBy}`,
        config
      );
      setTaskData(data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const getProjects = async () => {
    try {
      const { data } = await axios.get(GET_FILTER_TASK_API, config);
      setProjectsData(data);
    } catch (error) {
      console.log(error);
    }
  };

  const priorityOptions = [
    {
      id: 1,
      priority: "Highest",
    },
    { id: 2, priority: "High" },
    { id: 3, priority: "Medium" },
    { id: 4, priority: "Low" },
  ];

  const handleSearchFilter = () => {
    setSearchProject(selectedProjectId || "");
    setSearchTaskAssignedTo(selectedAssignedTo || "");
    setSearchReviewBy(selectedReviewBy || "");
  };

  const handleClearFilters = () => {
    setSearchProject("");
    setSearchTaskAssignedTo("");
    setSearchReviewBy("");
    setSelectedProjectId("")
    setSelectedAssignedTo("")
    setSearchReviewBy("")
  };

  useEffect(() => {
    getTaskData();
    getProjects();
  }, [searchReviewBy, searchTaskAssignedTo, searchProject]);

  if (loading === true) {
    return (
      <div
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
      </div>
    );
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="page-content">
        <Container fluid>
          <Col lg={6}>
            <Card>
              <>
                <div>
                  {/* View Modal Start */}
                  <Modal isOpen={modal_center_view_task} size="xl" centered>
                    <div className="modal-header">
                      <h5 className="modal-title mt-0">Task Details</h5>
                      <button
                        type="button"
                        onClick={() => {
                          setmodal_center_view_task(false);
                        }}
                        className="close"
                        data-dismiss="modal"
                        aria-label="Close"
                      >
                        <span aria-hidden="true">&times;</span>
                      </button>
                    </div>
                    <div className="modal-body">
                      <Card className=" p-2">
                        <Row>
                          <CardTitle>
                            Task Title :- {viewTaskData && viewTaskData.title}
                          </CardTitle>

                          <Col lg={6}>
                            <Card className="shadow-lg">
                              <CardBody>
                                <h6>
                                  Task Description :-{" "}
                                  {viewTaskData &&
                                    viewTaskData?.description?.replace(
                                      /<\/?[^>]+(>|$)/g,
                                      ""
                                    )}
                                </h6>
                              </CardBody>
                            </Card>
                          </Col>
                          <Col lg={6}>
                            <Card className="shadow-lg">
                              <CardBody>
                                <Row>
                                  <Col lg={6}>
                                    <h6>
                                      Project Name :-{" "}
                                      {viewTaskData &&
                                        viewTaskData?.project_name}
                                    </h6>
                                  </Col>
                                  <Col lg={6}>
                                    <h6>
                                      Task Start Date :-{" "}
                                      {viewTaskData && viewTaskData?.start_date}
                                    </h6>
                                  </Col>
                                </Row>
                                <Row>
                                  <Col lg={6}>
                                    <h6>
                                      Task End Date :-{" "}
                                      {viewTaskData && viewTaskData?.end_date}
                                    </h6>
                                  </Col>
                                  <Col lg={6}>
                                    <h6>
                                      Task Due Time :-{" "}
                                      {viewTaskData && viewTaskData?.due_time}
                                    </h6>
                                  </Col>
                                </Row>
                                <Row>
                                  <Col lg={6}>
                                    <h6>
                                      Task Priority :-{" "}
                                      {viewTaskData && viewTaskData?.priority}
                                    </h6>
                                  </Col>
                                  <Col lg={6}>
                                    <h6>
                                      Task Assigned To :-{" "}
                                      {viewTaskData &&
                                        viewTaskData?.assign_to_name}
                                    </h6>
                                  </Col>
                                </Row>
                                <Row>
                                  <Col lg={6}>
                                    <h6>
                                      Task Review By :-{" "}
                                      {viewTaskData &&
                                        viewTaskData?.review_by_name}
                                    </h6>
                                  </Col>
                                  <Col lg={6}>
                                    <h6>
                                      Task Status :-{" "}
                                      {viewTaskData && viewTaskData?.status}
                                    </h6>
                                  </Col>
                                </Row>
                              </CardBody>
                            </Card>
                          </Col>
                        </Row>
                      </Card>
                      <Card className=" p-2">
                        <div className="d-flex">
                          <CardTitle
                            className={
                              taskActivitySelected
                                ? "btn btn-sm btn-primary m-2 text-light"
                                : "btn btn-sm btn-light m-2 text-dark"
                            }
                            onClick={() => {
                              setTaskActivitySelected(true);
                              setTaskCommentsSelected(false);
                            }}
                          >
                            Task Activity
                          </CardTitle>
                          <CardTitle
                            className={
                              taskCommentsSelected
                                ? "btn btn-sm btn-primary m-2 text-light"
                                : "btn btn-sm btn-light m-2 text-dark"
                            }
                            onClick={() => {
                              setTaskActivitySelected(false);
                              setTaskCommentsSelected(true);
                            }}
                          >
                            Task Comments
                          </CardTitle>
                        </div>
                        <Card className="p-2 shadow-lg">
                          {taskCommentsSelected && taskCommentsSelected ? (
                            <div className="p-2 m-3">
                              <div style={{ height: "30vh", overflow: "auto" }}>
                                {liveComments &&
                                  liveComments?.data?.map((eachComment) => (
                                    <div
                                      key={eachComment?.id}
                                      className="d-flex m-2"
                                    >
                                      <img
                                        src={`${API_BASE_URL}${eachComment?.sender_img}`}
                                        style={{
                                          width: "45px",
                                          height: "45px",
                                          borderRadius: "30px",
                                        }}
                                        alt="Sender Image"
                                      />
                                      <div
                                        style={{
                                          backgroundColor: "#556ee5",
                                          padding: "10px",
                                          display: "flex",
                                          color: "white",
                                          width: "100%",
                                          marginLeft: "10px",
                                          borderRadius: "10px",
                                        }}
                                      >
                                        {eachComment?.message}
                                      </div>
                                    </div>
                                  ))}
                              </div>
                              <div className="d-flex">
                                <Input
                                  type="text"
                                  onChange={(e) =>
                                    setTaskComment(e.target.value)
                                  }
                                />
                                <Button color="primary" onClick={submitComment}>
                                  Submit
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <div
                              className="p-2 m-2"
                              style={{ height: "30vh", overflow: "auto" }}
                            >
                              {" "}
                              <div style={{ height: "30vh", overflow: "auto" }}>
                                {Array.isArray(taskActivity) &&
                                  taskActivity.map((eachComment, index) => (
                                    <div key={index} className="d-flex m-2">
                                      <div>
                                        <i
                                          className="fas fa-comment"
                                          style={{
                                            fontSize: "35px",
                                            color: "blue",
                                          }}
                                        ></i>
                                      </div>
                                      <div
                                        style={{
                                          padding: "10px",
                                          display: "flex",
                                          justifyContent: "space-between",
                                          width: "100%",
                                          marginLeft: "10px",
                                        }}
                                      >
                                        <div>{eachComment?.close_note}</div>
                                        <div>
                                          {eachComment?.end_time && (
                                            <div>
                                              {new Date(
                                                `2000-01-01T${eachComment?.end_time}`
                                              ).toLocaleTimeString([], {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                                hour12: true,
                                              })}
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                              </div>{" "}
                            </div>
                          )}
                        </Card>
                      </Card>
                    </div>
                  </Modal>
                  {/* View Modal End */}
                  <Modal isOpen={modal_center} size="xl" centered>
                    <div className="modal-header">
                      <h5 className="modal-title mt-0">Edit Task</h5>
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
                      <Form
                        className="needs-validation"
                        onSubmit={(e) => {
                          e.preventDefault();
                          validation.handleSubmit();
                          return false;
                        }}
                      >
                        <Row>
                          <Col md="4">
                            <FormGroup className="mb-3">
                              <Label htmlFor="validationCustom01">
                                Select Projects
                              </Label>
                              <Input
                                type="select"
                                name="project"
                                id="validationCustom01"
                                onChange={(e) => {
                                  validation.handleChange(e);
                                  setSelectedProjectId(e.target.value);
                                }}
                                onBlur={validation.handleBlur}
                                value={validation.values.project || ""}
                                invalid={
                                  validation.touched.project &&
                                  validation.errors.project
                                    ? true
                                    : false
                                }
                              >
                                <option value="">Select Project</option>
                                {projectsData &&
                                  projectsData.map((project) => (
                                    <option key={project.id} value={project.id}>
                                      {project.name}
                                    </option>
                                  ))}
                              </Input>
                              {validation.touched.project &&
                              validation.errors.project ? (
                                <FormFeedback type="invalid">
                                  {validation.errors.project}
                                </FormFeedback>
                              ) : null}
                            </FormGroup>
                          </Col>

                          <Col md="8">
                            <FormGroup className="mb-3">
                              <Label htmlFor="validationCustom02">
                                Task Title
                              </Label>
                              <Input
                                name="title"
                                placeholder="Enter Task Title"
                                type="text"
                                className="form-control"
                                id="validationCustom02"
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                value={validation.values.title || ""}
                                invalid={
                                  validation.touched.title &&
                                  validation.errors.title
                                    ? true
                                    : false
                                }
                              />
                              {validation.touched.title &&
                              validation.errors.title ? (
                                <FormFeedback type="invalid">
                                  {validation.errors.title}
                                </FormFeedback>
                              ) : null}
                            </FormGroup>
                          </Col>
                        </Row>
                        <Row>
                          <Col md="12">
                            <FormGroup className="mb-3">
                              <Label htmlFor="validationCustom12">
                                Module Name
                              </Label>
                              <Input
                                name="module"
                                placeholder="Enter Module Name"
                                type="text"
                                className="form-control"
                                id="validationCustom12"
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                value={validation.values.module || ""}
                                invalid={
                                  validation.touched.module &&
                                  validation.errors.module
                                    ? true
                                    : false
                                }
                              />
                              {validation.touched.module &&
                              validation.errors.module ? (
                                <FormFeedback type="invalid">
                                  {validation.errors.module}
                                </FormFeedback>
                              ) : null}
                            </FormGroup>
                          </Col>
                        </Row>
                        <Row>
                          <Col md="3">
                            <FormGroup className="mb-3">
                              <Label htmlFor="validationCustom03">
                                Task Start Date
                              </Label>
                              <Input
                                name="start_date"
                                placeholder="Enter Task Start Date"
                                type="date"
                                className="form-control"
                                id="validationCustom03"
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                value={validation.values.start_date || ""}
                                invalid={
                                  validation.touched.start_date &&
                                  validation.errors.start_date
                                    ? true
                                    : false
                                }
                              />
                              {validation.touched.start_date &&
                              validation.errors.start_date ? (
                                <FormFeedback type="invalid">
                                  {validation.errors.start_date}
                                </FormFeedback>
                              ) : null}
                            </FormGroup>
                          </Col>
                          <Col md="3">
                            <FormGroup className="mb-3">
                              <Label htmlFor="validationCustom04">
                                Task End Date
                              </Label>
                              <Input
                                name="end_date"
                                placeholder="Enter Task End Date"
                                type="date"
                                className="form-control"
                                id="validationCustom04"
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                value={validation.values.end_date || ""}
                                invalid={
                                  validation.touched.end_date &&
                                  validation.errors.end_date
                                    ? true
                                    : false
                                }
                              />
                              {validation.touched.end_date &&
                              validation.errors.end_date ? (
                                <FormFeedback type="invalid">
                                  {validation.errors.end_date}
                                </FormFeedback>
                              ) : null}
                            </FormGroup>
                          </Col>
                          <Col md="3">
                            <FormGroup className="mb-3">
                              <Label htmlFor="validationCustom05">
                                Task End Time
                              </Label>
                              <Input
                                name="taskEndTime"
                                placeholder="Enter Task End Time"
                                type="time"
                                className="form-control"
                                id="validationCustom05"
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                value={validation.values.taskEndTime || ""}
                                invalid={
                                  validation.touched.taskEndTime &&
                                  validation.errors.taskEndTime
                                    ? true
                                    : false
                                }
                              />
                              {validation.touched.taskEndTime &&
                              validation.errors.taskEndTime ? (
                                <FormFeedback type="invalid">
                                  {validation.errors.taskEndTime}
                                </FormFeedback>
                              ) : null}
                            </FormGroup>
                          </Col>
                          <Col md="3">
                            <FormGroup className="mb-3">
                              <Label htmlFor="validationCustom06">
                                Select Priority
                              </Label>
                              <Input
                                name="priority"
                                placeholder="Select priority"
                                type="select"
                                className="form-control"
                                id="validationCustom06"
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                value={validation.values.priority || ""}
                                invalid={
                                  validation.touched.priority &&
                                  validation.errors.priority
                                    ? true
                                    : false
                                }
                              >
                                <option value="" disabled>
                                  Select Priority
                                </option>
                                {priorityOptions &&
                                  priorityOptions?.map((priority) => (
                                    <option
                                      key={priority?.id}
                                      value={priority?.priority}
                                    >
                                      {priority?.priority}
                                    </option>
                                  ))}
                              </Input>
                              {validation.touched.priority &&
                              validation.errors.priority ? (
                                <FormFeedback type="invalid">
                                  {validation.errors.priority}
                                </FormFeedback>
                              ) : null}
                            </FormGroup>
                          </Col>
                        </Row>
                        <Row>
                          <Col md="12">
                            <FormGroup className="mb-3">
                              <Label htmlFor="validationCustom07">
                                Task Description
                              </Label>
                              <ReactQuill
                                theme="snow"
                                name="description"
                                placeholder="Enter Task Description"
                                className="form-control"
                                id="validationCustom07"
                                value={validation.values?.description || ""}
                                onChange={(value) =>
                                  validation.setFieldValue("description", value)
                                }
                                onBlur={() =>
                                  validation.setFieldTouched(
                                    "description",
                                    true
                                  )
                                }
                                invalid={
                                  validation.touched.description &&
                                  validation.errors.description
                                    ? true
                                    : false
                                }
                              />
                              {validation.touched.description &&
                              validation.errors.description ? (
                                <FormFeedback type="invalid">
                                  {validation.errors.description}
                                </FormFeedback>
                              ) : null}
                            </FormGroup>
                          </Col>
                        </Row>
                        <Row>
                          <Col md={6}>
                            <FormGroup className="mb-3">
                              <Label htmlFor="validationCustom08">
                                Task Assigned To
                              </Label>
                              <Input
                                type="select"
                                name="assign_to"
                                placeholder="Select Task Assigned To"
                                className="form-control"
                                id="validationCustom08"
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                value={validation.values.assign_to || ""}
                                invalid={
                                  validation.touched.assign_to &&
                                  validation.errors.assign_to
                                    ? true
                                    : false
                                }
                              >
                                <option value="">
                                  Select Task Assigned To
                                </option>
                                {developersInProject &&
                                  developersInProject.map((project) => (
                                    <option key={project?.id} value={project?.id}>
                                      {`${project?.firstname}${project?.lastname}`}
                                    </option>
                                  ))}
                              </Input>
                              {validation.touched.assign_to &&
                              validation.errors.assign_to ? (
                                <FormFeedback type="invalid">
                                  {validation.errors.assign_to}
                                </FormFeedback>
                              ) : null}
                            </FormGroup>
                          </Col>
                          <Col md={6}>
                            <FormGroup className="mb-3">
                              <Label htmlFor="validationCustom08">
                                Task Review By
                              </Label>
                              <Input
                                name="review_by"
                                placeholder="Select Task Review By"
                                type="select"
                                className="form-control"
                                id="validationCustom09"
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                value={validation.values.review_by || ""}
                                invalid={
                                  validation.touched.review_by &&
                                  validation.errors.review_by
                                    ? true
                                    : false
                                }
                              >
                                <option value="">Select Task Review By</option>
                                {developersInProject &&
                                  developersInProject.map((project) => (
                                    <option key={project?.id} value={project?.id}>
                                      {`${project?.firstname}${project?.lastname}`}
                                    </option>
                                  ))}
                              </Input>
                              {validation.touched.review_by &&
                              validation.errors.review_by ? (
                                <FormFeedback type="invalid">
                                  {validation.errors.review_by}
                                </FormFeedback>
                              ) : null}
                            </FormGroup>
                          </Col>
                        </Row>
                        <Row>
                          <Col md="12">
                            <FormGroup className="mb-3">
                              <Label htmlFor="validationCustom10">
                                Select Files
                              </Label>
                              <Input
                                name="selectFiles"
                                placeholder="Select File"
                                type="file"
                                className="form-control"
                                id="validationCustom10"
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                value={validation.values.selectFiles || ""}
                                invalid={
                                  validation.touched.selectFiles &&
                                  validation.errors.selectFiles
                                    ? true
                                    : false
                                }
                              />
                              {validation.touched.selectFiles &&
                              validation.errors.selectFiles ? (
                                <FormFeedback type="invalid">
                                  {validation.errors.selectFiles}
                                </FormFeedback>
                              ) : null}
                            </FormGroup>
                          </Col>
                        </Row>
                        <Button color="primary" type="submit">
                          Submit
                        </Button>
                      </Form>
                    </div>
                  </Modal>
                </div>
              </>
            </Card>
          </Col>
          <Breadcrumbs title="Tasks" breadcrumbItem="Task List" />
          <Row>
            <Col xl={12}>
              <Card>
                <CardBody className="d-flex justify-content-between">
                  <div>
                    <div className="d-flex">
                      <div className="me-2">
                        <Input
                          type="select"
                          onChange={(e) => setSelectedProjectId(e.target.value)}
                        >
                          <option value="">---Select Project---</option>
                          {projectsData &&
                            projectsData.map((eachItem) => (
                              <option value={eachItem?.id}>
                                {eachItem?.name}
                              </option>
                            ))}
                        </Input>
                      </div>
                      <div className="me-2">
                        <Input
                          type="select"
                          onChange={(e) =>
                            setSelectedAssignedTo(e.target.value)
                          }
                        >
                          <option value="">---Select Assigned To---</option>
                          {developersInProject &&
                            developersInProject?.map((eachItem) => (
                              <option value={eachItem?.id}>
                                {eachItem?.firstname}
                              </option>
                            ))}
                        </Input>
                      </div>
                      <div className="me-2">
                        <Input
                          type="select"
                          onChange={(e) => setSelectedReviewBy(e.target.value)}
                        >
                          <option value="">---Select Review By---</option>
                          {developersInProject &&
                            developersInProject?.map((eachItem) => (
                              <option value={eachItem?.id}>
                                {eachItem?.firstname}
                              </option>
                            ))}
                        </Input>
                      </div>
                      <button
                        className="btn btn-primary me-2"
                        onClick={handleSearchFilter}
                      >
                        Search
                      </button>
                      <button
                        className="btn btn-warning"
                        onClick={handleClearFilters}
                      >
                        Clear Filters
                      </button>
                    </div>
                  </div>
                  <Link to="/tasks-create">
                    <Button className="px-3" color="primary">
                      Create Task
                    </Button>
                  </Link>
                </CardBody>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col md="12">
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-around",
                  padding: "20px",
                }}
              >
                <TaskColumn
                  title="Todo"
                  tasks={
                    taskData &&
                    taskData?.filter((task) => task?.status === "Todo")
                  }
                  onTaskMove={handleTaskMove}
                  onTaskEdit={handleTaskEdit}
                  onTaskDelete={handleTaskDelete}
                  onTaskClick={handleTaskClick}
                />
                <TaskColumn
                  title="Working"
                  tasks={
                    taskData &&
                    taskData?.filter((task) => task?.status === "Working")
                  }
                  onTaskMove={handleTaskMove}
                  onTaskEdit={handleTaskEdit}
                  onTaskDelete={handleTaskDelete}
                  onTaskClick={handleTaskClick}
                  onPauseOrResume={handlePauseOrResume}
                />
                <TaskColumn
                  title="Review"
                  tasks={
                    taskData &&
                    taskData?.filter((task) => task?.status === "Review")
                  }
                  onTaskMove={handleTaskMove}
                  onTaskEdit={handleTaskEdit}
                  onTaskDelete={handleTaskDelete}
                  onTaskClick={handleTaskClick}
                />
                <TaskColumn
                  title="Done"
                  tasks={
                    taskData &&
                    taskData?.filter((task) => task?.status === "Done")
                  }
                  onTaskMove={handleTaskMove}
                  onTaskEdit={handleTaskEdit}
                  onTaskDelete={handleTaskDelete}
                  onTaskClick={handleTaskClick}
                />
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </DndProvider>
  );
};

export default AppWithDnD;
