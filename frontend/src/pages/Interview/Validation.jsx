import * as Yup from "yup";

export const validationSchema = Yup.object().shape({
  is_fresher: Yup.boolean(),
  is_walk_in: Yup.boolean(),
  candidate_name: Yup.string().required("Candidate name is required"),
  total_work_experience: Yup.string().when(["is_fresher"], {
    is: false,
    then: () => Yup.string().required("Total work experience is required"),
    otherwise: () => Yup.string().nullable(),
  }),
  interview_link: Yup.string().when(["is_walk_in"], {
    is: false,
    then: () =>
      Yup.string()
        .url("Invalid URL format")
        .required("Interview link is required"),
    otherwise: () => Yup.string().nullable(),
  }),
  interview_date: Yup.date().required("Interview date is required"),
  interview_notes: Yup.string(),
  interview_status: Yup.object(),
  // interview_assign_to: Yup.string().notRequired(),
  // select_technology: Yup.number().notRequired(),
  feedback_note: Yup.string().when(["interview_status"], {
    is: (val) => val.value === "Completed",
    then: () => Yup.string().required("feedback_note  is required"),
    otherwise: () => Yup.string(),
  }),
});
export const feedbackValidation = Yup.object().shape({
  feedback_note: Yup.string().required("feedback is required"),
});
