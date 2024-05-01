// import React, { useState, useRef, useEffect } from "react";
// import { Link } from "react-router-dom";
// import {
//   Row,
//   Col,
//   Card,
//   CardBody,
//   FormGroup,
//   Button,
//   Label,
//   Input,
//   Container,
//   FormFeedback,
//   Form,
//   Table,
// } from "reactstrap";
// import GetAuthToken from "TokenImport/GetAuthToken";
// import axios from "axios";
// import {
//   API_ADD_PROJECT,
//   API_GET_PROJECTS,
//   API_GET_PAGINATED_PROJECTS_DATA,
//   API_PROJECT_STATUS_TOGGLE,
//   API_DELETE_PROJECT,
//   API_PROJECT_DOWNLOAD_CSV,
//   API_GET_ROLE_PERMSSIONS_DATA,
//   API_GET_USERS,
// } from "Apis/api";
// import { toast } from "react-toastify";
// import { DNA } from "react-loader-spinner";

// const Projects = () => {
//   const [projectsData, setProjectsData] = useState([]);
//   const [isStatusDisable, setIsStatusDisable] = useState(false);
//   const [nextPage, setNextPage] = useState(null);
//   const [previousPage, setPreviousPage] = useState(null);
//   const [pageNumber, setPageNumber] = useState(1);
//   const [pageSize, setPageSize] = useState(10);
//   const [searchClientName, setSearchClientName] = useState("");
//   const [searchMemberName, setSearchMemberName] = useState("");
//   const [searchProjectName, setSearchProjectName] = useState("");
//   const [searchProjectId, setSearchProjectId] = useState("");
//   const [searchStatus, setSearchStatus] = useState("");
//   const [filterBy, setFilterBy] = useState(false);
//   const [visiblePageNumbers, setVisiblePageNumbers] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [permissions, setPermissions] = useState();
//   const [userData, setUserData] = useState()

//   const config = GetAuthToken();

//   const getUsers = async () => {
//     try {
//       const { data } = await axios.get(API_GET_USERS, config);
//       setUserData(data.data);
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   const getProjectsData = async () => {
//     try {
//       setLoading(true);
//       const { data } = await axios.get(
//         `${API_GET_PAGINATED_PROJECTS_DATA}?client_name=${searchClientName}&name=${searchProjectName}&project_id=${searchProjectId}&developers=${encodeURIComponent(
//           JSON.stringify(searchMemberName)
//         )}&status=${searchStatus}&page=${pageNumber}&page_size=${pageSize}`,
//         config
//       );
//       setProjectsData(data.results);
//       setNextPage(data.next);
//       setPreviousPage(data.previous);
//       const totalPages = Math.ceil(data.count / pageSize);

//       let startPage = Math.max(1, pageNumber - 1);
//       let endPage = Math.min(totalPages, startPage + 2);

//       if (endPage - startPage < 2) {
//         startPage = Math.max(1, endPage - 2);
//       }

//       setVisiblePageNumbers(
//         [...Array(endPage - startPage + 1)].map((_, index) => startPage + index)
//       );
//       setLoading(false);
//     } catch (error) {
//       console.log(error);
//       setLoading(false);
//     }
//   };

//   const handleNextPage = () => {
//     if (nextPage) {
//       setPageNumber(pageNumber + 1);
//     }
//   };

//   const handlePreviousPage = () => {
//     if (previousPage) {
//       setPageNumber(pageNumber - 1);
//     }
//   };

//   const handlePageSizeChange = (e) => {
//     const newSize = Number(e.target.value);
//     setPageSize(newSize);
//     setPageNumber(1);
//   };

//   const statusToggle = async (id) => {
//     try {
//       const filteredProject = projectsData.find((el) => el.id == id);
//       console.log("filteredProject", filteredProject);
//       const data = { status: !filteredProject.status };

//       await axios.post(`${API_PROJECT_STATUS_TOGGLE}${id}/`, data, config);
//       getProjectsData();
//     } catch (error) {
//       console.error("Error toggling user status:", error);
//     }
//   };

//   const downloadCsv = async () => {
//     try {
//       const { data } = await axios.get(API_PROJECT_DOWNLOAD_CSV, config, {
//         responseType: "blob",
//         headers: {
//           "Content-Type": "application/json",
//         },
//       });

//       const blob = new Blob([data], { type: "application/csv" });

//       const link = document.createElement("a");
//       link.href = window.URL.createObjectURL(blob);
//       link.download = `ProjectsData.csv`;
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);

//       toggleExportData();
//     } catch (error) {
//       console.log("Error downloading file:", error);
//     }
//   };

//   const handleProjectDelete = async (id) => {
//     try {
//       const { data } = await axios.delete(
//         `${API_DELETE_PROJECT}${id}/`,
//         config
//       );
//       getProjectsData();
//       toast.success(`Project has been deleted`, {
//         position: "top-center",
//         autoClose: 3000,
//         closeOnClick: true,
//         pauseOnHover: true,
//         draggable: true,
//         theme: "light",
//       });
//     } catch (error) {
//       console.log(error);
//       toast.error("something went wrong", {
//         position: "top-center",
//         autoClose: 3000,
//         closeOnClick: true,
//         pauseOnHover: true,
//         draggable: true,
//         theme: "light",
//       });
//     }
//   };

//   const fetchUserPermissions = async () => {
//     try {
//       const { data } = await axios.get(API_GET_ROLE_PERMSSIONS_DATA, config);
//       setPermissions(data?.select_user_role_id?.permissions);
//     } catch (error) {
//       console.error("Error fetching permissions:", error);
//     }
//   };

//   useEffect(() => {
//     fetchUserPermissions();
//     getUsers()
//   }, []);

//   const rolePermissions =
//     permissions &&
//     permissions?.filter(
//       (eachPermission) => eachPermission.module_name === "Projects"
//     );
//   const allPermissions = [].concat(...(rolePermissions || []));

//   useEffect(() => {
//     getProjectsData();
//   }, [
//     pageNumber,
//     pageSize,
//     searchClientName,
//     searchProjectName,
//     searchProjectId,
//     searchMemberName,
//     searchStatus,
//     filterBy,
//   ]);

//   return (
//     <>
//       <div className="page-content">
//         <Container fluid={true}>
//           <Row>
//             <Col xl={12}>
//               <Card>
//                 <CardBody className="d-flex justify-content-between">
//                   <h3>Projects</h3>
//                   <div>
//                     <Button
//                       className="px-4 me-2"
//                       color="warning"
//                       onClick={() => setFilterBy(!filterBy)}
//                     >
//                       Filter
//                     </Button>
//                     {allPermissions &&
//                       allPermissions.find(
//                         (eachItem) => eachItem.method_name === "Export"
//                       ) && (
//                         <Button
//                           className="px-4 me-2"
//                           color="secondary"
//                           onClick={downloadCsv}
//                         >
//                           Export
//                         </Button>
//                       )}
//                     {allPermissions &&
//                       allPermissions.find(
//                         (eachItem) => eachItem.method_name === "Add"
//                       ) && (
//                         <Link to="/ta-project-add">
//                           <Button className="px-4" color="primary">
//                             Create
//                           </Button>
//                         </Link>
//                       )}
//                   </div>
//                 </CardBody>
//               </Card>
//             </Col>
//           </Row>

//           <Row className={filterBy === true ? "" : "d-none"}>
//             <Col xl={12}>
//               <Card>
//                 <CardBody className="d-flex align-items-center justify-content-start">
//                   <div className="me-2">
//                     <label className="text-bold text-dark">
//                       Filter By Project :
//                     </label>
//                     <Input
//                       type="search"
//                       onChange={(e) => setSearchProjectName(e.target.value)}
//                       placeholder="Enter Project"
//                     />
//                   </div>
//                   <div className="me-2">
//                     <label className="text-bold text-dark">
//                       Filter By Client :
//                     </label>
//                     <Input
//                       type="search"
//                       onChange={(e) => setSearchClientName(e.target.value)}
//                       placeholder="Enter Client"
//                     />
//                   </div>
//                   <div className="me-2">
//                     <label className="text-bold text-dark">
//                       Filter By Developer :
//                     </label>
//                     <Input
//                       type="select"
//                       onChange={(e) => setSearchMemberName(e.target.value)}
//                       placeholder="Select Developer"
//                     >
//                       <option value="">---Select Developer</option>
//                       {userData&&userData.map((eachItem, index) => (
//                         <option key={index} value={eachItem.id}>{eachItem.firstname + " " + eachItem.lastname}</option>
//                       ))}
//                     </Input>
//                   </div>
//                 </CardBody>
//               </Card>
//             </Col>
//           </Row>

//           <Row>
//             <Col xl={12}>
//               <Card className="pb-5">
//                 <CardBody>
//                   {loading === true ? (
//                     <div
//                       className="d-flex align-items-center justify-content-center"
//                       style={{ height: "100vh" }}
//                     >
//                       <DNA
//                         height={100}
//                         width={100}
//                         radius={9}
//                         color="green"
//                         ariaLabel="loading"
//                         wrapperClass="custom-loader-wrapper"
//                       />
//                     </div>
//                   ) : (
//                     <div className="table-responsive">
//                       <Table className="align-middle ">
//                         <thead className="table-light">
//                           <tr>
//                             <th className="text-center">No.</th>
//                             <th className="text-center">Project Name</th>
//                             <th className="text-center">Team members</th>
//                             <th className="text-center">Client Name</th>
//                             <th className="text-center">Status</th>
//                             {allPermissions &&
//                               allPermissions.some(
//                                 (eachItem) =>
//                                   eachItem.method_name === "Update" ||
//                                   eachItem.method_name === "Delete"
//                               ) && <th className="text-center">Actions</th>}
//                           </tr>
//                         </thead>

//                         <tbody>
//                           {projectsData &&
//                             projectsData.map((item, index) => (
//                               <tr key={item?.id}>
//                                 <th scope="row" className="text-center">
//                                   {index + 1}
//                                 </th>
//                                 <td className="text-center">{item?.name}</td>
//                                 <td className="text-center">
//                                   {item?.developers
//                                     .map((eachItem) => eachItem?.firstname)
//                                     .join(", ")}
//                                 </td>
//                                 <td className="text-center">
//                                   {item?.select_client?.client_name }
//                                 </td>
//                                 <td className="text-center">
//                                   {item?.status === true ? (
//                                     <Button
//                                       type="button"
//                                       className="btn btn-success btn-sm "
//                                       onClick={() => statusToggle(item.id)}
//                                       // disabled={isStatusDisable}
//                                     >
//                                       <i className="bx bx-check-double font-size-16 align-middle me-2"></i>
//                                       Active
//                                     </Button>
//                                   ) : (
//                                     <Button
//                                       type="button"
//                                       className="btn btn-danger btn-sm"
//                                       onClick={() => statusToggle(item.id)}
//                                       // disabled={isStatusDisable}
//                                     >
//                                       <i className="bx bx-block font-size-16 align-middle me-2"></i>
//                                       InActive
//                                     </Button>
//                                   )}
//                                 </td>
//                                 {allPermissions &&
//                                   allPermissions.some(
//                                     (eachItem) =>
//                                       eachItem.method_name === "Update" ||
//                                       eachItem.method_name === "Delete"
//                                   ) && (
//                                     <td className="text-center">
//                                       {allPermissions &&
//                                         allPermissions.find(
//                                           (eachItem) =>
//                                             eachItem.method_name === "Update"
//                                         ) && (
//                                           <Link
//                                             to={`/ta-project-edit/${item.id}`}
//                                           >
//                                             <Button
//                                               color="warning"
//                                               className="btn  btn-sm m-2"
//                                             >
//                                               <i className="fas fa-pen-fancy"></i>
//                                             </Button>
//                                           </Link>
//                                         )}
//                                       {allPermissions &&
//                                         allPermissions.find(
//                                           (eachItem) =>
//                                             eachItem.method_name === "Delete"
//                                         ) && (
//                                           <Button
//                                             color="danger"
//                                             className="btn  btn-sm m-2"
//                                             onClick={() =>
//                                               handleProjectDelete(item?.id)
//                                             }
//                                           >
//                                             <i className="fas fa-trash"></i>
//                                           </Button>
//                                         )}
//                                     </td>
//                                   )}
//                               </tr>
//                             ))}
//                         </tbody>
//                       </Table>
//                     </div>
//                   )}
//                 </CardBody>
//                 <div className="d-flex justify-content-between">
//                   <div>
//                     <span className=" text-dark ms-4 me-1">Showing</span>
//                     <select
//                       onChange={(e) => handlePageSizeChange(e)}
//                       style={{ height: "20px", marginTop: "4px" }}
//                       defaultValue={pageSize}
//                     >
//                       <option value={5}>5</option>
//                       <option value={10} selected>
//                         10
//                       </option>
//                       <option value={15}>15</option>
//                       <option value={25}>25</option>
//                       <option value={100}>100</option>
//                     </select>
//                     <span className=" text-dark m-1">Items per page</span>
//                   </div>
//                   <div>
//                     <button
//                       className="btn btn-sm btn-primary m-1"
//                       onClick={handlePreviousPage}
//                     >
//                       Previous
//                     </button>
//                     {visiblePageNumbers.map((page) => (
//                       <button
//                         key={page}
//                         className={`btn btn-sm btn-primary m-1 ${
//                           page === pageNumber ? "active" : ""
//                         }`}
//                         onClick={() => setPageNumber(page)}
//                       >
//                         {page}
//                       </button>
//                     ))}
//                     <button
//                       className="btn btn-sm btn-primary m-1 me-4"
//                       onClick={handleNextPage}
//                     >
//                       Next
//                     </button>
//                   </div>
//                 </div>
//               </Card>
//             </Col>
//           </Row>
//         </Container>
//       </div>
//     </>
//   );
// };

// export default Projects;
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Row,
  Col,
  Card,
  CardBody,
  FormGroup,
  Button,
  Input,
  Container,
  Table,
  Modal,
} from "reactstrap";
import GetAuthToken from "TokenImport/GetAuthToken";
import axios from "axios";
import {
  API_ADD_PROJECT,
  API_GET_PROJECTS,
  API_GET_PAGINATED_PROJECTS_DATA,
  API_PROJECT_STATUS_TOGGLE,
  API_DELETE_PROJECT,
  API_PROJECT_DOWNLOAD_CSV,
  API_GET_ROLE_PERMSSIONS_DATA,
  API_GET_USERS,
} from "Apis/api";
import { toast } from "react-toastify";
import { DNA } from "react-loader-spinner";

const Projects = () => {
  const [projectsData, setProjectsData] = useState([]);
  const [isStatusDisable, setIsStatusDisable] = useState(false);
  const [nextPage, setNextPage] = useState(null);
  const [previousPage, setPreviousPage] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchClientName, setSearchClientName] = useState("");
  const [searchMemberName, setSearchMemberName] = useState("");
  const [searchProjectName, setSearchProjectName] = useState("");
  const [searchProjectId, setSearchProjectId] = useState("");
  const [searchStatus, setSearchStatus] = useState("");
  const [filterBy, setFilterBy] = useState(false);
  const [visiblePageNumbers, setVisiblePageNumbers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [permissions, setPermissions] = useState();
  const [userData, setUserData] = useState();
  const [deletePopup, setDeletePopup] = useState(false);
  const [deleteProjectId, setDeleteProjectId] = useState(null);

  const config = GetAuthToken();

  document.title = "Projects | TechAstha"

  const getUsers = async () => {
    try {
      const { data } = await axios.get(API_GET_USERS, config);
      setUserData(data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getProjectsData = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${API_GET_PAGINATED_PROJECTS_DATA}?client_name=${searchClientName}&name=${searchProjectName}&project_id=${searchProjectId}&developers=${searchMemberName}&status=${searchStatus}&page=${pageNumber}&page_size=${pageSize}`,
        config
      );
      setProjectsData(data.results);
      setNextPage(data.next);
      setPreviousPage(data.previous);
      const totalPages = Math.ceil(data.count / pageSize);

      let startPage = Math.max(1, pageNumber - 1);
      let endPage = Math.min(totalPages, startPage + 2);

      if (endPage - startPage < 2) {
        startPage = Math.max(1, endPage - 2);
      }

      setVisiblePageNumbers(
        [...Array(endPage - startPage + 1)].map((_, index) => startPage + index)
      );
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const handleNextPage = () => {
    if (nextPage) {
      setPageNumber(pageNumber + 1);
    }
  };

  const handlePreviousPage = () => {
    if (previousPage) {
      setPageNumber(pageNumber - 1);
    }
  };

  const handlePageSizeChange = (e) => {
    const newSize = Number(e.target.value);
    setPageSize(newSize);
    setPageNumber(1);
  };

  const statusToggle = async (id) => {
    try {
      const filteredProject = projectsData.find((el) => el.id == id);
      const data = { status: !filteredProject.status };

      await axios.post(`${API_PROJECT_STATUS_TOGGLE}${id}/`, data, config);
      getProjectsData();
    } catch (error) {
      console.error("Error toggling user status:", error);
    }
  };

  const downloadCsv = async () => {
    try {
      const { data } = await axios.get(API_PROJECT_DOWNLOAD_CSV, config, {
        responseType: "blob",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const blob = new Blob([data], { type: "application/csv" });

      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = `ProjectsData.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.log("Error downloading file:", error);
    }
  };

  const handleProjectDelete = async (id) => {
    try {
      const { data } = await axios.delete(
        `${API_DELETE_PROJECT}${id}/`,
        config
      );
      getProjectsData();
      toast.success(`Project has been deleted`, {
        position: "top-center",
        autoClose: 3000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
    } catch (error) {
      console.log(error);
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

  const fetchUserPermissions = async () => {
    try {
      const { data } = await axios.get(API_GET_ROLE_PERMSSIONS_DATA, config);
      setPermissions(data?.select_user_role_id?.permissions);
    } catch (error) {
      console.error("Error fetching permissions:", error);
    }
  };

  useEffect(() => {
    fetchUserPermissions();
    getUsers();
  }, []);

  const rolePermissions =
    permissions &&
    permissions?.filter(
      (eachPermission) => eachPermission.module_name === "Projects"
    );
  const allPermissions = [].concat(...(rolePermissions || []));

  useEffect(() => {
    getProjectsData();
  }, [
    pageNumber,
    pageSize,
    searchClientName,
    searchProjectName,
    searchProjectId,
    searchMemberName,
    searchStatus,
    filterBy,
  ]);

  const deletePopupFun = () => {
    setDeletePopup(!deletePopup);
  };

  const handleDeleteConfirmation = () => {
    if (deleteProjectId) {
      handleProjectDelete(deleteProjectId);
      deletePopupFun();
    }
  };

  return (
    <>
      <div className="page-content">
        <Container fluid={true}>
          <Row>
            <Col xl={12}>
              <Card>
                <CardBody className="d-flex justify-content-between">
                  <h3>Projects</h3>
                  <div>
                    <Button
                      className="px-4 me-2"
                      color="warning"
                      onClick={() => setFilterBy(!filterBy)}
                    >
                      Filter
                    </Button>
                    {allPermissions &&
                      allPermissions.find(
                        (eachItem) => eachItem.method_name === "Export"
                      ) && (
                        <Button
                          className="px-4 me-2"
                          color="secondary"
                          onClick={downloadCsv}
                        >
                          Export
                        </Button>
                      )}
                    {allPermissions &&
                      allPermissions.find(
                        (eachItem) => eachItem.method_name === "Add"
                      ) && (
                        <Link to="/ta-project-add">
                          <Button className="px-4" color="primary">
                            Create
                          </Button>
                        </Link>
                      )}
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>

          <Row className={filterBy === true ? "" : "d-none"}>
            <Col xl={12}>
              <Card>
                <CardBody className="d-flex align-items-center justify-content-start">
                  <div className="me-2">
                    <label className="text-bold text-dark">
                      Filter By Project :
                    </label>
                    <Input
                      type="search"
                      onChange={(e) => setSearchProjectName(e.target.value)}
                      placeholder="Enter Project"
                    />
                  </div>
                  <div className="me-2">
                    <label className="text-bold text-dark">
                      Filter By Client :
                    </label>
                    <Input
                      type="search"
                      onChange={(e) => setSearchClientName(e.target.value)}
                      placeholder="Enter Client"
                    />
                  </div>
                  <div className="me-2">
                    <label className="text-bold text-dark">
                      Filter By Developer :
                    </label>
                    <Input
                      type="select"
                      onChange={(e) => setSearchMemberName(e.target.value)}
                      placeholder="Select Developer"
                    >
                      <option value="">---Select Developer</option>
                      {userData &&
                        userData.map((eachItem, index) => (
                          <option key={index} value={eachItem.id}>
                            {eachItem.firstname + " " + eachItem.lastname}
                          </option>
                        ))}
                    </Input>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>

          <Row>
            <Col xl={12}>
              <Card className="pb-5">
                <CardBody>
                  {loading === true ? (
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
                  ) : (
                    <div className="table-responsive">
                      <Table className="align-middle ">
                        <thead className="table-light">
                          <tr>
                            <th className="text-center">No.</th>
                            <th className="text-center">Project Name</th>
                            <th className="text-center">Team members</th>
                            <th className="text-center">Client Name</th>
                            <th className="text-center">Status</th>
                            {allPermissions &&
                              allPermissions.some(
                                (eachItem) =>
                                  eachItem.method_name === "Update" ||
                                  eachItem.method_name === "Delete"
                              ) && <th className="text-center">Actions</th>}
                          </tr>
                        </thead>

                        <tbody>
                          {projectsData &&
                            projectsData.map((item, index) => (
                              <tr key={item?.id}>
                                <th scope="row" className="text-center">
                                  {index + 1}
                                </th>
                                <td className="text-center">{item?.name}</td>
                                <td className="text-center">
                                  {item?.developers
                                    .map((eachItem) => eachItem?.firstname)
                                    .join(", ")}
                                </td>
                                <td className="text-center">
                                  {item?.select_client?.client_name}
                                </td>
                                <td className="text-center">
                                  {item?.status === true ? (
                                    <Button
                                      type="button"
                                      className="btn btn-success btn-sm "
                                      onClick={() => statusToggle(item?.id)}
                                    >
                                      <i className="bx bx-check-double font-size-16 align-middle me-2"></i>
                                      Active
                                    </Button>
                                  ) : (
                                    <Button
                                      type="button"
                                      className="btn btn-danger btn-sm"
                                      onClick={() => statusToggle(item?.id)}
                                    >
                                      <i className="bx bx-block font-size-16 align-middle me-2"></i>
                                      InActive
                                    </Button>
                                  )}
                                </td>
                                {allPermissions &&
                                  allPermissions.some(
                                    (eachItem) =>
                                      eachItem.method_name === "Update" ||
                                      eachItem.method_name === "Delete"
                                  ) && (
                                    <td className="text-center">
                                      {allPermissions &&
                                        allPermissions.find(
                                          (eachItem) =>
                                            eachItem.method_name === "Update"
                                        ) && (
                                          <Link
                                            to={`/ta-project-edit/${item?.id}`}
                                          >
                                            <Button
                                              color="warning"
                                              className="btn  btn-sm m-2"
                                            >
                                              <i className="fas fa-pen-fancy"></i>
                                            </Button>
                                          </Link>
                                        )}
                                      {allPermissions &&
                                        allPermissions.find(
                                          (eachItem) =>
                                            eachItem.method_name === "Delete"
                                        ) && (
                                          <Button
                                            color="danger"
                                            className="btn  btn-sm m-2"
                                            onClick={() => {
                                              setDeleteProjectId(item?.id);
                                              deletePopupFun();
                                            }}
                                          >
                                            <i className="fas fa-trash"></i>
                                          </Button>
                                        )}
                                    </td>
                                  )}
                              </tr>
                            ))}
                        </tbody>
                      </Table>
                    </div>
                  )}
                </CardBody>
                <div className="d-flex justify-content-between">
                  <div>
                    <span className=" text-dark ms-4 me-1">Showing</span>
                    <select
                      onChange={(e) => handlePageSizeChange(e)}
                      style={{ height: "20px", marginTop: "4px" }}
                      defaultValue={pageSize}
                    >
                      <option value={5}>5</option>
                      <option value={10} selected>
                        10
                      </option>
                      <option value={15}>15</option>
                      <option value={25}>25</option>
                      <option value={100}>100</option>
                    </select>
                    <span className=" text-dark m-1">Items per page</span>
                  </div>
                  <div>
                    <button
                      className="btn btn-sm btn-primary m-1"
                      onClick={handlePreviousPage}
                    >
                      Previous
                    </button>
                    {visiblePageNumbers.map((page) => (
                      <button
                        key={page}
                        className={`btn btn-sm btn-primary m-1 ${
                          page === pageNumber ? "active" : ""
                        }`}
                        onClick={() => setPageNumber(page)}
                      >
                        {page}
                      </button>
                    ))}
                    <button
                      className="btn btn-sm btn-primary m-1 me-4"
                      onClick={handleNextPage}
                    >
                      Next
                    </button>
                  </div>
                </div>
              </Card>
            </Col>
          </Row>
        </Container>

        {/* Delete Confirmation Modal */}
        <Modal isOpen={deletePopup} toggle={deletePopupFun} centered>
          <div className="modal-header">
            <h5 className="modal-title">Delete Confirmation</h5>
            <button
              type="button"
              className="btn-close"
              onClick={deletePopupFun}
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            <p>Are you sure you want to delete this project?</p>
          </div>
          <div className="modal-footer">
            <Button color="secondary" onClick={deletePopupFun}>
              Cancel
            </Button>
            <Button color="danger" onClick={handleDeleteConfirmation}>
              Delete
            </Button>
          </div>
        </Modal>
      </div>
    </>
  );
};

export default Projects;
