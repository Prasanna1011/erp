import React, { useState, useRef, useEffect } from "react"
import { Link } from "react-router-dom"
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
} from "reactstrap"
import { TablePagination } from "@mui/material"
import GetAuthToken from "TokenImport/GetAuthToken"
import axios from "axios"
import {
  API_BASE_URL,
  API_RESUME_UPLOAD_DELETE,
  API_RESUME_UPLOAD_GET_POST,
  API_RESUME_GET_ALL,
  API_TECHNOLOGY_POST_GET,
} from "Apis/api"
import { toast } from "react-toastify"
import warningImage from "../../../assets/images/warning/warning.png"
import { DNA } from "react-loader-spinner"

const HomeResume = () => {
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredData, setFilteredData] = useState([])
  const [allCVData, setAllCVData] = useState([])
  const [allTechData, setAllTechData] = useState([])
  const [deleteDataById, setdeleteDataById] = useState(null)
  const [deletePopup, setDeletePopup] = useState(false)
  const [loading, setLoading] = useState(false)

  // Local storage token Start
  const config = GetAuthToken()

  // Local storage token End

  document.title = "Resumes | TechAstha";

  // Delete popup Modal Start

  // Delete popup Modal Start
  function deletePopupFun() {
    setDeletePopup(!deletePopup)
  }
  // Delete popup Modal End

  // Delete popup Modal End

  // Search Filter Start

  const searchInputRef = useRef(null)

  const handleSearch = () => {
    const searchData = allCVData.filter(item => {
      const searchString = `${item.technology_name}` // Add more properties as needed
      return searchString.toLowerCase().includes(searchQuery.toLowerCase())
    })
    setFilteredData(searchData)
  }

  // Search Filter End
  // Pagenation Start
  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(+event.target.value)
    setPage(0)
  }
  // Pagenation End

  // get All CV data start
  const getAllResumeData = async () => {
    try {
      setLoading(true)
      const { data } = await axios.get(API_TECHNOLOGY_POST_GET, config)
      setAllTechData(data.data)
      setLoading(false)
    } catch (error) {
      console.log(error);
    }
  }
  // get All CV data End

  // get All Tech Data data start
  const getAllTechData = async () => {
    try {
      const { data } = await axios.get(API_RESUME_GET_ALL, config)
      setAllCVData(data.data)
    } catch (error) {
      console.log(error);
    }
  }
  // get All CV data End

  const deleteResume = async () => {
    try {
      const { data } = await axios.delete(
        `${API_RESUME_UPLOAD_DELETE}${deleteDataById}/`,
        config
      )
      toast.success(`Technology Deleted successfully`, {
        position: "top-center",
        autoClose: 3000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      })
      getAllTechData()
    } catch (error) {
      console.log(error)
      toast.error("something went wrong", {
        position: "top-center",
        autoClose: 3000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      })
    }
  }

  useEffect(() => {
    handleSearch()
  }, [searchQuery, allCVData])

  useEffect(() => {
    getAllResumeData()
    getAllTechData()
  }, [])


  return (
    <>
      <div className="page-content">
        <Container fluid={true}>
          <Row>
            <Col xl={12}>
              <Card>
                <CardBody className="d-flex justify-content-between">
                  <h3>Candidate Resume</h3>
                  <Link to="/ta-hrm/resume-upload-add">
                    <Button className="px-4" color="primary">
                      Create
                    </Button>
                  </Link>
                </CardBody>
              </Card>
            </Col>
          </Row>
          {/*Search filter  */}

          <div className="d-flex mb-3 justify-content-center">
            <input
              className="rounded-4 w-25 border-0 shadow-sm  bg-body-tertiary rounded px-3 "
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              ref={searchInputRef}
            />
            {searchQuery.length >= 1 ? (
              <Button
                className="btn btn-sm "
                onClick={() => {
                  const input = searchInputRef.current
                  if (input) {
                    input.select()
                    document.execCommand("cut")
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
                    <Table className="align-middle  ">
                      <thead className="table-light">
                        <tr>
                          <th className="text-center">No.</th>
                          <th className="text-center">Technology</th>
                          <th className="text-center">CV Download</th>
                          <th className="text-center">Actions</th>
                        </tr>
                      </thead>

                      <tbody className="">
                        {(searchQuery
                          ? filteredData
                          : allCVData &&
                          allCVData.slice(
                            page * rowsPerPage,
                            page * rowsPerPage + rowsPerPage
                          )
                        ).map((item, index) => (
                          <tr key={item.id}>
                            <th scope="row" className="text-center">{index + 1}</th>
                            <td className="text-center">{item.technology_name}</td>
                            <td className="text-center">
                              <a
                                href={`${API_BASE_URL}${item.upload_cv}`}
                                target="cv"
                                rel="noopener noreferrer"
                              >
                                {item.upload_cv.split("/").pop()}
                              </a>
                            </td>
                            <td className="text-center">
                              <Button
                                color="danger"
                                className="btn btn-warning btn-sm ms-2"
                                onClick={() => {
                                  setdeleteDataById(item.id) 
                                  deletePopupFun()
                                }}
                              >
                                <i className="fas fa-trash-alt"></i>
                              </Button>
                            </td>
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
                  count={allCVData.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </Card>
            </Col>
          </Row>
        </Container>
        {/* Delete Popup Modal start */}
        <div>
          <Modal
            isOpen={deletePopup}
            toggle={() => {
              deletePopupFun()
            }}
            centered
          >
            <div className="modal-header">
              <h5 className="modal-title mt-0">Delete VC</h5>
              <button
                type="button"
                onClick={() => {
                  deletePopupFun()
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
              <p>Are you sure you want to delete this CV?</p>
            </div>

            <div className="modal-footer">
              <Button
                color="danger"
                className="btn btn-warning  ms-2 px-4"
                onClick={() => {
                  deleteResume() // Execute the deleteLeveById function
                  deletePopupFun() // Close the modal
                }}
              >
                Confirm Delete
              </Button>
              <Button
                color="secondary"
                className="btn btn-secondary  ms-2 px-5"
                onClick={() => {
                  deletePopupFun() // Close the modal without deleting
                }}
              >
                Cancel
              </Button>
            </div>
          </Modal>
        </div>
        {/* Delete Popup Modal End */}
      </div>
    </>
  )
}

export default HomeResume
