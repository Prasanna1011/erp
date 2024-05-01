import React, { useState, useRef, useEffect } from "react";
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
import { TablePagination } from "@mui/material";
import GetAuthToken from "TokenImport/GetAuthToken";
import { API_DELETE_TECHNOLOGY, API_TECHNOLOGY_POST_GET, } from "Apis/api";
import axios from "axios";
import { toast } from "react-toastify";
import { useDispatch, useSelector, connect } from "react-redux";
import { getTechnologyRequest } from "store/actions";
const HomeTechnology = ({ technologyData, getTechnologyRequest }) => {
  const [technology, settechnology] = useState([]);
  const [deletePopup, setdeletePopup] = useState(false);
  const [deleteTechnologyById, setdeleteTechnologyById] = useState(null);

  document.title = "Technology | TechAstha";


  const config = GetAuthToken();


  function deletePopupFun() {
    setdeletePopup(!deletePopup);
  }

  const deleteLeveById = async () => {
    try {
      const { data } = await axios.delete(
        `${API_DELETE_TECHNOLOGY}${deleteTechnologyById}/`,
        config
      );
      toast.success(`Technology Deleted successfully`, {
        position: "top-center",
        autoClose: 3000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
      getTechnologyRequest();
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
  };


  useEffect(() => {
    getTechnologyRequest();
  }, []);

  return (
    <>
      <div className="page-content">
        <Container fluid={true}>
          <Row>
            <Col xl={12}>
              <Card>
                <CardBody className="d-flex justify-content-between">
                  <h3>Technology</h3>
                  <Link to="/ta-tech-add">
                    <Button className="px-4" color="primary">
                      Create
                    </Button>
                  </Link>
                </CardBody>
              </Card>
            </Col>
          </Row>

          <Row>
            <Col xl={12}>
              <Card className="pb-5">
                <CardBody>
                  <div className="table-responsive">
                    <Table className="align-middle">
                      <thead className="table-light">
                        <tr>
                          <th className="text-center">No.</th>
                          <th className="text-center">Technology</th>
                          <th className="text-center">Status</th>
                          <th className="text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {technologyData&&technologyData?.data?.map((technology, index) => (
                          <tr key={technology?.id}>
                            <th scope="row" className="text-center">{index + 1}</th>
                            <td className="text-center">{technology?.technology_name}</td>
                            <td className="text-center">
                              {technology?.is_active === true ? (
                                <Button
                                  type="button"
                                  className="btn btn-success btn-sm"
                                >
                                  <i className="bx bx-check-double font-size-16 align-middle me-2"></i>
                                  Active
                                </Button>
                              ) : (
                                <Button
                                  type="button"
                                  className="btn btn-danger btn-sm"
                                >
                                  <i className="bx bx-block font-size-16 align-middle me-2"></i>
                                  Inactive
                                </Button>
                              )}
                            </td>
                            <td className="text-center">
                              <Link
                                to={`/ta-tech-edit/${technology?.technology_id}`}
                              >
                                <Button color="warning" className="btn btn-sm">
                                  <i className="fas fa-pen-fancy"></i>
                                </Button>
                              </Link>
                              <Button
                                color="danger"
                                className="btn btn-warning btn-sm ms-2"
                                onClick={() => {
                                  setdeleteTechnologyById(
                                    technology?.technology_id
                                  );
                                  deletePopupFun();
                                }}
                              >
                                <i className="fas fa-trash-alt"></i>
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
        <div>
          <Modal
            isOpen={deletePopup}
            toggle={() => {
              deletePopupFun();
            }}
            centered
          >
            <div className="modal-header">
              <h5 className="modal-title mt-0">Delete Technology</h5>
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
            <div className="modal-body">
              <p>Are you sure you want to delete this Technology ?</p>
            </div>
            <div className="modal-footer">
              <Button
                color="danger"
                className="btn btn-warning btn-sm ms-2"
                onClick={() => {
                  deleteLeveById(); 
                  deletePopupFun(); 
                }}
              >
                Confirm Delete
              </Button>
              <Button
                color="secondary"
                className="btn btn-secondary btn-sm ms-2"
                onClick={() => {
                  deletePopupFun(); 
                }}
              >
                Cancel
              </Button>
            </div>
          </Modal>
        </div>
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({
  technologyData: state.getTechnologyReducer?.data,
});

const mapDispatchToProps = {
  getTechnologyRequest,
};

export default connect(mapStateToProps, mapDispatchToProps)(HomeTechnology);
