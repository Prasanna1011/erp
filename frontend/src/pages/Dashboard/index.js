import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import "@fullcalendar/bootstrap/main.css";
import { useState } from "react";
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
  Tooltip,
} from "reactstrap";
import axios from "axios";
import { connect } from "react-redux";
import {
  API_CALENDAR_EVENTS,
  API_GET_DASHBOARD_AWARDS,
  API_PARTICULAR_USER_CHECKIN_CHECKOUT_DATA,
  API_BASE_URL,
} from "Apis/api";
import { getBreaksData, getCheckinData } from "store/ReportsData/actions";
import GetAuthToken from "TokenImport/GetAuthToken";
import { useEffect } from "react";
import FastMarquee from "react-fast-marquee";
import Confetti from "react-confetti";
import "./dashboard.css";

const Dashboard = ({
  checkinData,
  breaksData,
  getCheckinData,
  getBreaksData,
}) => {
  const [checkinCheckOutDetails, setCheckinCheckOutDetails] = useState();
  const [events, setEvents] = useState();
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [confetti, setConfetti] = useState(false);
  const [confettiTriggered, setConfettiTriggered] = useState(false);
  const [awardsData, setAwardsData] = useState();
  const config = GetAuthToken();

  document.title = "Dashboard | TechAstha";

  // Iterate through events and update the year for Birth Day and Anniversary types
  const updatedEvents =
    events &&
    events.map((event) => {
      if (event?.type === "Birth Day" || event?.type === "Anniversary") {
        // Update the year to the current year
        event.date = `${currentYear}-${event.date.substr(5)}`;
      }
      return event;
    });

  const getAwards = async () => {
    try {
      const { data } = await axios.get(API_GET_DASHBOARD_AWARDS, config);
      setAwardsData(data);
    } catch (error) {
      console.log(error);
    }
  };

  const AwardMarquee = ({ data }) => {
    useEffect(() => {
      let confettiTimeout;
      let intervalId;

      if (!confettiTriggered) {
        setConfettiTriggered(true);

        setConfetti(true);

        confettiTimeout = setTimeout(() => {
          setConfetti(false);
          setConfettiTriggered(false);
        }, 1000);

        intervalId = setInterval(() => {
          if (Date.now() - confettiTimeout > 1000) {
            setConfetti(false);
            setConfettiTriggered(false);
            clearInterval(intervalId);
          }
        }, 100);
      }

      return () => {
        clearTimeout(confettiTimeout);
        clearInterval(intervalId);
      };
    }, [confettiTriggered]);

    return (
      <Container className="d-flex justify-content-center align-items-center">


        <Row>
          {confetti && <Confetti width={window.innerWidth} />}
          <Col>
            <FastMarquee pauseOnHover>
              {data &&
                data.map((award) => (
                  <div
                    key={award?.id}
                    className="marquee-item"
                    style={{
                      padding: "5px",
                      backgroundColor: "#f8f9fa",
                      borderRadius: "8px",
                      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                      margin: "0 10px",
                    }}
                  >
                    <img
                      src={`${API_BASE_URL}${award?.employee?.choose_profile_picture}`}
                      alt="User"
                      style={{
                        width: "20px",
                        height: "20px",
                        margin: "5px",
                        borderRadius: "20px",
                      }}
                    />
                    <span
                      style={{
                        fontSize: "14px",
                        fontWeight: "bold",
                        color: "#556EE6",
                      }}
                    >
                      {award?.title}
                    </span>
                  </div>
                ))}
            </FastMarquee>
          </Col>
        </Row>
      </Container>
    );
  };

  const formattedCheckinTime =
    checkinData &&
    new Date(checkinData?.checkin_time).toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

  const formattedCheckoutTime =
    checkinData && checkinData?.checkout_time === null
      ? "Yet To be Checked Out"
      : checkinData &&
      new Date(checkinData?.checkout_time).toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });

  const getCalendarEventData = async (month, year) => {
    try {
      const { data } = await axios.get(
        `${API_CALENDAR_EVENTS}?month=${month}&year=${year}`,
        config
      );
      setEvents(data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleMonthChange = (info) => {
    const newMonth = info.view.currentStart.getMonth() + 1;
    const newYear = info.view.currentStart.getFullYear();
  
    setCurrentMonth(newMonth);
    setCurrentYear(newYear);
  
    // Fetch events for the new month and year
    getCalendarEventData(newMonth, newYear);
  };
  

  useEffect(() => {
    getAwards();
    getCheckinData();
    getBreaksData();
  }, []);

  useEffect(() => {
    getCalendarEventData();
  }, [currentMonth, currentYear]);

  return (
    <div className="page-content">
      <div style={{ height: "50px", width: "100%" }}>
        <AwardMarquee data={awardsData && awardsData} />
      </div>
      <div className="d-flex">
        <button className="btn btn-sm btn-warning m-1">Holiday</button>
        <button className="btn btn-sm btn-primary m-1">Birthday</button>
        <button className="btn btn-sm btn-danger m-1">Anniversary</button>
        <button className="btn btn-sm btn-secondary m-1">Leave</button>
      </div>
      <Row>
        <Col md={8}>
          <FullCalendar
            plugins={[dayGridPlugin]}
            initialView="dayGridMonth"
            weekends={true}
            events={updatedEvents&&updatedEvents}
            eventContent={(eventInfo) => (
              <EventContent key={eventInfo.event.id} eventInfo={eventInfo} />
            )}
            selectable={true}
            selectMirror={true}
            dayMaxEvents={true}
            dayCellContent={(arg) => {
              return (
                <div
                  style={{
                    fontSize: "12px",
                    fontWeight: "700",
                    color: "black",
                  }}
                >
                  {arg.dayNumberText}
                </div>
              );
            }}
            eventClassNames={(arg) =>
              `calender-event-${arg.event.extendedProps.type}`
            }
            datesSet={handleMonthChange}
          />
        </Col>
        <Col md={4}>
          <div>
            <h5 className="text-dark">Latest Checkin CheckOut</h5>
            <div className="table-responsive">
              <Table className="align-middle ">
                <thead className="table-light">
                  <tr>
                    <th className="text-center">No</th>
                    <th className="text-center">Date</th>
                    <th className="text-center">CheckIn</th>
                    <th className="text-center">CheckOut</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="text-center">1</td>
                    <td className="text-center">
                      {checkinData && checkinData?.working_date}
                    </td>
                    <td className="text-center">{formattedCheckinTime}</td>
                    <td className="text-cente">{formattedCheckoutTime}</td>
                  </tr>
                </tbody>
              </Table>
            </div>
            <h5 className="mt-2">Today's Breaks</h5>
            <div className="table-responsive">
              <Table className="align-middle ">
                <thead className="table-light">
                  <tr>
                    <th className="text-center">No</th>
                    <th className="text-center">Start Time</th>
                    <th className="text-center">End Time</th>
                    <th className="text-center">Duration</th>
                  </tr>
                </thead>
                <tbody>
                  {breaksData &&
                    breaksData.map((item, index) => (
                      <tr key={index}>
                        <td className="text-center">{index + 1}</td>
                        <td className="text-center">
                          {item?.start_time && item?.start_time
                            ? item?.start_time
                            : "_ _ : _ _"}
                        </td>
                        <td className="text-center">
                          {item?.end_time && item?.end_time
                            ? item?.end_time
                            : "_ _ : _ _"}
                        </td>
                        <td className="text-center">
                          {item?.durations && item?.durations
                            ? item?.durations
                            : "_ _ : _ _"}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </Table>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

const EventContent = ({ eventInfo }) => {
  const [tooltipOpen, setTooltipOpen] = useState(false);

  const toggleTooltip = () => {
    setTooltipOpen(!tooltipOpen);
  };

  return (
    <div
      style={{
        height: "14px",
        verticalAlign: "center",
        textAlign: "center",
        margin: "0px",
        overflow: "hidden",
      }}
    >
      <p
        style={{ color: "white", fontSize: "10px", fontWeight: "500" }}
        id={`tooltip-${eventInfo.event.id}`}
        onClick={toggleTooltip}
      >
        {eventInfo.event.title}
      </p>
      <Tooltip
        placement="top"
        isOpen={tooltipOpen}
        target={`tooltip-${eventInfo.event.id}`}
        toggle={toggleTooltip}
      >
        {eventInfo.event.title}
      </Tooltip>
    </div>
  );
};

const mapStateToProps = (state) => ({
  checkinData: state?.dashboardDataReducers?.dashboardCheckInData?.data,
  breaksData: state?.dashboardDataReducers?.dashboardBreaksData?.results,
});

const mapDispatchToProps = {
  getCheckinData,
  getBreaksData,
};

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
