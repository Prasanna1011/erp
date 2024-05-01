import * as Yup from "yup";

export const getValidationSchema = (step) => {
  switch (step) {
    case 1:
      return Yup.object().shape({
        // tab1
        firstname: Yup.string().required("Please Enter  First Name"),
        middlename: Yup.string().required("Please Enter  Middle Name"),
        lastname: Yup.string().required("Please Enter  Last Name"),
        gender: Yup.string().required(" Please Select Gender"),

        permanent_address: Yup.string().required(
          "Permanent address is required"
        ),
        current_address: Yup.string().when("same_as_permanent_address", {
          is: () => false,
          then: () => Yup.string().required("Current address is required"),
        }),

        phone_no: Yup.string()
          .required("Please Enter Phone No")
          .matches(
            /^[0-9]{10}$/,
            "Please enter a valid 10-digit  phone number"
          ),

        personal_email_id: Yup.string()
          .email("Please enter a valid personal email")
          .required("Please enter personal email"),
        company_email_id: Yup.string()
          .email("Please enter a valid company email")
          .required("Please enter company email"),
        pan_no: Yup.string()
          .required("Please enter a PAN card number")
          .matches(
            /^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}$/,
            "Please enter a valid PAN card number"
          ),

        d_o_b: Yup.string().required("Please Enter Birth Date"),
        blood_group: Yup.string(),
        married_status: Yup.string().oneOf(
          ["Single", "Married"],
          "Please select Married Status"
        ),

        marriage_anniversary_date: "",

        skype_id: Yup.string()
          .required("Please enter skype email"),
        status: Yup.boolean(),

        native_place: Yup.string().required("Please Enter Native Place"),
        emergency_contact_name: Yup.string().required(
          "Please Enter Emergency Contact Name"
        ),
        emergency_phone_no: Yup.string()
          .required("Please Enter Phone No")
          .matches(/^[0-9]{10}$/, "Please enter a valid 10-digit phone number"),

        relation_with_emergency_phone_no_id: Yup.string().required(
          "Please Select Relationship With Emergency Contact No."
        ),
        reference_name: "",
        reference_email: "",
        reference_contact: "",
        reference_designation: "",
        comments: "",
      });
    case 2:
      return Yup.object().shape({
        // Tab 2
        date_of_joing: Yup.string().required("Please Enter Date Of Joining"),
        date_of_resignation: Yup.string().notRequired(),
        date_of_reliving: Yup.string().notRequired(),
        select_user_role_id: Yup.number().required("Please Select User Role"),
        select_senior_authority_id: Yup.array().notRequired(),
      });
    case 3:
      return Yup.object().shape({
        // Tab 3
        is_fresher: Yup.boolean(),

        last_company_name: "",

        last_company_designation: "",

        last_company_skills: "",

        last_company_joining_date: "",

        last_company_reliving_date: "",

      });

    case 4:
      return Yup.object().shape({
        //   Tab 4

        last_degree_cretificate: Yup.string().required(
          "This Field Is Required"
        ),
        last_qualification_year: Yup.number().required(
          "This Field Is Required"
        ),
        last_university_name: Yup.string().required("This Field Is Required"),
        last_qualification_cgpa: Yup.string()
          .matches(/^[0-9]+(\.[0-9]+)?%?$/, "Please enter a valid CGPA")
          .required("This Field Is Required"),
      });
    case 5:
      return Yup.object().shape({
        // Tab 5
        // aadhar_card: Yup.mixed().test(
        //   "fileType",
        //   "Unsupported file format",
        //   value => !!value
        // ),
        // pan_card: Yup.mixed().test(
        //   "fileType",
        //   "Unsupported file format",
        //   value => !!value
        // ),
        // last_qualification_certificate: Yup.mixed().test(
        //   "fileType",
        //   "Unsupported file format",
        //   value => !!value
        // ),
      });
    case 6:
      return Yup.object().shape({
        // tab 6
        username: Yup.string(),
        password: Yup.string().required("this field is required"),
        ip_address: Yup.string().required("this field is required"),
        is_remote: Yup.boolean(),
        select_department_id: Yup.string().required("this field is required"),
        select_position_id: Yup.string().required("this field is required"),
      });
  }
};
