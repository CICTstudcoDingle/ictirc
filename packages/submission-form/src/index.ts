// Shared Submission Form Package
// Used by both apps/web and apps/author

export { SubmissionWizard, type SubmissionWizardProps } from "./components/submission-wizard";
export { submitPaper, getCategories } from "./actions/submit-paper";
export {
  paperDetailsSchema,
  authorsStepSchema,
  uploadSchema,
  type AuthorFormData,
  type PaperDetailsFormData,
} from "./validation/schemas";
