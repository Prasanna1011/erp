import React from "react";
import { FormGroup, InputGroup, Label } from "reactstrap";
import Flatpickr from "react-flatpickr";
import { useField } from "formik";

const DatePicker = ({ label, ...props }) => {
  const [field, meta, helpers] = useField(props);

 
  const handleDateChange = (dates) => {
    const formattedDate = dates[0].toISOString(); // or use your preferred date formatting library
    helpers.setValue(formattedDate);
  };
  

  return (
    <FormGroup className="mb-4">
      <Label>{label}</Label>
      <InputGroup>
        <Flatpickr
          {...field}
          className={`form-control d-block ${meta.touched && meta.error ? "is-invalid" : ""}`}
          placeholder="Select Date and Time"
          options={{
            altInput: true,
            altFormat: "F j, Y h:i K",
            dateFormat: "Y-m-d H:i",
            enableTime: true,  // Enable time selection
            time_24hr: false,  // Use 12-hour format
          }}
          onChange={handleDateChange}
        />
      </InputGroup>
      {meta.touched && meta.error && (
        <div className="invalid-feedback">{meta.error}</div>
      )}
    </FormGroup>
  );
};

export default DatePicker;
