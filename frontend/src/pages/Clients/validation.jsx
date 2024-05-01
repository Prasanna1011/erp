import * as Yup from "yup"

export const validationSchema = Yup.object({
    client_name: Yup.string().required("Please Enter Client Name"),
    client_phone_no: Yup.string()
      .required("Please Enter Phone No")
      .matches(/^[0-9]{10}$/, "Please enter a valid 10-digit  phone number"),
      username: Yup.string()
      .matches(/^[a-zA-Z_]+$/, 'Username can only contain letters and underscores')
      .required('Username is required'),

    client_email: Yup.string()
      .email("Invalid email address")
      .required("Please Enter Client email"),
    client_phone_no: Yup.string()
      .matches(/^\d+$/, "Phone number must contain only digits")
      .min(10, "Phone number must be at least 10 digits")
      .max(10, "Phone number must not exceed 10 digits")
      .required("Please Enter Your client_phone_no"),

    client_address: Yup.string().required("Please Enter Client Address"),
    password: Yup.string().required("Password is Required"),
    client_role: Yup.number().required("Role is Required")
  })