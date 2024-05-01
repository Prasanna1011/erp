import { API_BASE_URL, API_GET_SCREENSHOTS, API_GET_USERS } from "Apis/api";
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  Col,
  Container,
  Input,
  Modal,
  ModalBody,
  ModalHeader,
  Row,
  Table,
} from "reactstrap";
import GetAuthToken from "TokenImport/GetAuthToken";

const ScreenShots = () => {
  const [screenshots, setScreenShots] = useState();
  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [employee, setEmployee] = useState();
  const [selectedEmployee, setSelectedEmployee] = useState("")
  const [loading, setLoading] = useState(false);
  const [nextPage, setNextPage] = useState(null);
  const [previousPage, setPreviousPage] = useState(null);
  const [visiblePageNumbers, setVisiblePageNumbers] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const config = GetAuthToken();
  

  const getUsersData = async () => {
    try {
      const { data } = await axios.get(API_GET_USERS, config);
      setEmployee(data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };



  const getScreenshots = async () => {
    try {
      const { data } = await axios.get(
        `${API_GET_SCREENSHOTS}?from_date=${fromDate}&to_date=${toDate}&user_id=${selectedEmployee}&page=${pageNumber}&page_size=${pageSize}`,
        config
      );
      setScreenShots(data.results);
      setLoading(false);
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
    } catch (error) {
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

  useEffect(() => {
    getScreenshots();
  }, [pageNumber, pageSize, selectedEmployee]);

  useEffect(() => {
    getUsersData()
  }, [])

  return (
    <div>
      <div className="page-content">
        <Modal show={showModal} onHide={handleCloseModal}>
          {/* <ModalHeader closeButton>
            <ModalTitle>Full Screenshot</ModalTit>
          </ModalHeader> */}
          <ModalBody>
            <img
              src={selectedImage}
              alt="Full Screenshot"
              style={{ width: "100%" }}
            />
          </ModalBody>
        </Modal>
        <Row>
          <Col xl={12}>
            <Card>
              <CardBody className="d-flex justify-content-between">
                <div><h3>Screenshots</h3></div>
                <div>
                <Input type="select" onChange={(e) => setSelectedEmployee(e.target.value)}>
                  <option value="">Select User to see screenshots</option>
                  {employee&&employee.map((eachUser) => (
                    <option key={eachUser.id} value={eachUser.id}>{eachUser.firstname + " " + eachUser.lastname}</option>
                  ))}
                </Input>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
        <div>
         
        <Col xl={12}>
          <div className="table-responsive">
            <Table className="align-middle ">
              <thead className="table-light">
                <tr>
                  <th className="text-center">No.</th>
                  <th className="text-center">Employee</th>
                  <th className="text-center">Time</th>
                  <th className="text-center">Screenshot</th>
                </tr>
              </thead>
              <tbody>
                {screenshots &&
                  screenshots.map((eachScreenShot, index) => (
                    <tr key={index}>
                      <td className="text-center">{index + 1}</td>
                      <td className="text-center">
                        {eachScreenShot?.user
                          ? eachScreenShot?.user?.firstname +
                            " " +
                            eachScreenShot?.user?.lastname
                          : "-"}
                      </td>
                      <td className="text-center">
                        {new Date(eachScreenShot?.timestamp).toLocaleString(
                          "en-US",
                          {
                            dateStyle: "short",
                            timeStyle: "short",
                          }
                        )}
                      </td>
                      <td className="text-center">
                        <img
                          src={eachScreenShot?.image}
                          alt="screenshot"
                          style={{ height: "100px", width: "100px", margin: "10px"}}
                        />
                        <a href={eachScreenShot.image} target="_blank">
                          <button className="btn btn-sm btn-primary">
                            View Screenshot
                          </button>
                        </a>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </Table>
          </div>
        </Col>
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
        </div>
      </div>
    </div>
  );
};

export default ScreenShots;
