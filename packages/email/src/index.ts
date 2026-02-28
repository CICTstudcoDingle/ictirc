export { SubmissionConfirmationEmail } from "./templates/submission-confirmation";
export { PlagiarismPassEmail } from "./templates/plagiarism-pass";
export { StatusChangeEmail, type StatusChangeType } from "./templates/status-change";
export { getResendClient } from "./client";
export { sendSubmissionConfirmation, sendPlagiarismPassEmail, sendStatusChangeEmail } from "./send";
