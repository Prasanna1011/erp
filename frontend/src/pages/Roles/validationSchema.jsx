import * as Yup from "yup"

export const validationSchema =  Yup.object({
    role_name: Yup.string().required("Please Enter Title"),
    role_description: Yup.string().required("Leave Days Must Be Required"),
    role_status: Yup.boolean(),
})