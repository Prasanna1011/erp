import React from "react"
import { useField } from "formik"
import Select from "react-select"

// const optionGroup = [
//   {
//     label: "Picnic",
//     options: [
//       { label: "Mustard", value: "Mustard" },
//       { label: "Ketchup", value: "Ketchup" },
//       { label: "Relish", value: "Relish" },
//     ],
//   },
//   {
//     label: "Camping",
//     options: [
//       { label: "Tent", value: "Tent" },
//       { label: "Flashlight", value: "Flashlight" },
//       { label: "Toilet Paper", value: "Toilet Paper" },
//     ],
//   },
// ]
// const optionGroup = [
//   { label: "Rohan", value: 1 },
//   { label: "Mandeep", value: 2 },
//   { label: "Prasanna", value: 3 },
//   { label: "Pavan", value: 4 },
//   { label: "Aman", value: 5 },
//   { label: "Prashant", value: 6 },
// ]

const FormikSelect = ({ label, isMulti, options, ...props }) => {
  const [field, meta, helpers] = useField(props.name)

  function handleMulti(selectedMulti) {
    helpers.setValue(selectedMulti)
  }

  return (
    <div className="mb-3">
      <label className="control-label">{label}</label>
      <Select
        {...field}
        value={field.value || []}
        isMulti={isMulti}
        onChange={selectedOption => {
          handleMulti(selectedOption)
        }}
        options={options}
        className={`select2-selection ${
          meta.touched && meta.error ? "is-invalid" : ""
        }`}
      />
      {meta.touched && meta.error && (
        <div className="invalid-feedback">{meta.error}</div>
      )}
    </div>
  )
}

export default FormikSelect
