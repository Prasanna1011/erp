import * as Yup from "yup"

export const validationSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  estimate_cost: Yup.number().notRequired(),
  estimate_hours: Yup.number().notRequired(),
  // select_client: Yup.array().required("Select client is required"),
  developers: Yup.array()
    .min(1, "Select at least one member")
    .required("Select members is required"),
  description: Yup.string().required("Description is required"),
  // select_file: Yup.string().required("Select file is required"),
})
