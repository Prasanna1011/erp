import React, { useEffect, useState } from "react";

// Import Editor
import ReactQuill, { Quill, editor } from "react-quill";
import "react-quill/dist/quill.snow.css";

//Import Date Picker
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { toast } from "react-toastify";
import {
  Row,
  Col,
  Card,
  CardBody,
  FormGroup,
  Button,
  CardTitle,
  CardSubtitle,
  Label,
  Input,
  Container,
  FormFeedback,
  Form,
} from "reactstrap";
// Formik validation
import * as Yup from "yup";
import { useFormik } from "formik";
import GetAuthToken from "TokenImport/GetAuthToken";
import axios from "axios";
import { API_ADD_PROJECT, API_CREATE_TASK, API_GET_PROJECTS, GET_DEVELOPERS_IN_PROJECT, GET_FILTER_TASK_API } from "Apis/api";
import { useNavigate } from "react-router-dom";

const TasksCreate = () => {
  const [projectsData, setProjectsData] = useState();
  const [selectedProject, setSelectedProject] = useState();
  const [selectedProjectId, setSelectedProjectId] = useState();
  const [developersInProject, setDevelopersInProject] = useState();
  const config = GetAuthToken();
  const navigate = useNavigate();
  // Form validation
  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      project: "",
      title: "",
      module: "",
      start_date: "",
      end_date: "",
      due_time: "",
      priority: "",
      description: "",
      assign_to: "",
      review_by: "",
      selectFiles: "",
      status: "Todo",
    },
    validationSchema: Yup.object({
      project: Yup.string().required("Please Select Project."),
      title: Yup.string().required("Please Enter Task Title."),
      module: Yup.string().required("Please Enter Module Name."),
      start_date: Yup.string().required("Please Enter Task Start Date."),
      end_date: Yup.string().required("Please Enter Task End Date."),
      due_time: Yup.string().required("Please Enter Task End Time."),
      priority: Yup.string().required("Please Select Priority."),
      description: Yup.string()
    .transform((originalValue, originalObject) => {
      // Convert HTML content to plain text
      const strippedValue = originalValue.replace(/<[^>]*>/g, "").trim();
      // Update the original object with the transformed value
      return strippedValue;
    })
    .min(1, "Please Enter Task Description."),
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
        const { data } = await axios.post(API_CREATE_TASK, formData, config);
        toast.success(`Task Created Successfully`, {
          position: "top-center",
          autoClose: 3000,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        });
        navigate("/tasks-list");
      } catch (error) {
        toast.error("something went wrong", {
          position: "top-center",
          autoClose: 3000,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        });
      }
    },
  });


  document.title = "Add Task | TechAstha";
  

  const getProjects = async () => {
    try {
      const { data } = await axios.get(GET_FILTER_TASK_API, config);
      setProjectsData(data);
    } catch (error) {
      console.log(error);
    }
  };

  
  useEffect(() => {
    if (selectedProjectId) {
      const getDevelopers = async () => {
        try {
          const { data } = await axios.get(
            `${GET_DEVELOPERS_IN_PROJECT}${selectedProjectId}/`,
            config
          );
          setDevelopersInProject(data);
        } catch (error) {
          console.log(error);
        }
      };
      getDevelopers();
    }
  }, [selectedProjectId]);

  useEffect(() => {
    getProjects();
  }, []);


  const priorityOptions = [
    {
      id: 1,
      priority: "Highest",
    },
    { id: 2, priority: "High" },
    { id: 3, priority: "Medium" },
    { id: 4, priority: "Low" },
  ];

  return (
    <>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Tasks" breadcrumbItem="Create Task" />

          <Row>
            <Col lg="12">
              <Card>
                <CardBody>
                  <CardTitle className="mb-4">Create New Task</CardTitle>
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
                            <option value="" disabled>
                              Select Project
                            </option>
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
                          <Label htmlFor="validationCustom02">Task Title</Label>
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
                            name="due_time"
                            placeholder="Enter Task End Time"
                            type="time"
                            className="form-control"
                            id="validationCustom05"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.due_time || ""}
                            invalid={
                              validation.touched.due_time &&
                              validation.errors.due_time
                                ? true
                                : false
                            }
                          />
                          {validation.touched.due_time &&
                          validation.errors.due_time ? (
                            <FormFeedback type="invalid">
                              {validation.errors.due_time}
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
                              priorityOptions.map((priority) => (
                                <option
                                  key={priority.id}
                                  value={priority.priority}
                                >
                                  {priority.priority}
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
                              validation.setFieldTouched("description", true)
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
                            <option value="" disabled>
                              Select Member
                            </option>
                            {developersInProject&&developersInProject?.map(
                                (project) => (
                                  <option key={project.id} value={project.id}>
                                    {`${project.firstname}${" "}${
                                      project.lastname
                                    }`}
                                  </option>
                                )
                              )}
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
                            <option value="" disabled>
                              Select Member
                            </option>
                            {developersInProject&&developersInProject?.map(
                                (project) => (
                                  <option key={project.id} value={project.id}>
                                    {`${project.firstname}${" "}${
                                      project.lastname
                                    }`}
                                  </option>
                                )
                              )}
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
                      Submit form
                    </Button>
                  </Form>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default TasksCreate;
