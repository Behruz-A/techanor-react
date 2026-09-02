/** SweetAlertHandling **/
import Swal from "sweetalert2";
import { Messages } from "./config";

const techanorAlertClasses = {
  container: "techanor-alert-container",
  popup: "techanor-alert-card",
  icon: "techanor-alert-icon",
  title: "techanor-alert-title",
  htmlContainer: "techanor-alert-message",
  actions: "techanor-alert-actions",
  confirmButton: "techanor-alert-confirm",
  cancelButton: "techanor-alert-cancel",
  closeButton: "techanor-alert-close",
};

interface ErrorFeedback {
  title: string;
  message: string;
  confirmText: string;
}

const getErrorFeedback = (err: unknown): ErrorFeedback => {
  if (typeof err === "string" && err.trim()) {
    return { title: "We couldn't complete that", message: err, confirmText: "Try again" };
  }

  const error = err as {
    code?: string;
    message?: string;
    response?: { status?: number; data?: { message?: string } };
  } | null;
  const status = error?.response?.status;
  const apiMessage = error?.response?.data?.message;

  if (error?.message === Messages.error2) {
    return { title: "Sign in required", message: "Please sign in to continue with this action.", confirmText: "Got it" };
  }
  if (error?.message === "Network Error" || error?.code === "ERR_NETWORK") {
    return { title: "Connection unavailable", message: "We couldn't reach the server. Check your connection and try again.", confirmText: "Try again" };
  }

  const statusFeedback: Record<number, ErrorFeedback> = {
    400: { title: "Check your information", message: "Some information is missing or invalid. Please review it and try again.", confirmText: "Review" },
    401: { title: "Session expired", message: "Please sign in again to continue securely.", confirmText: "Got it" },
    403: { title: "Action not available", message: "You don't have permission to complete this action.", confirmText: "Close" },
    404: { title: "Service unavailable", message: "The requested service or information isn't available right now. Please try again later.", confirmText: "Got it" },
    409: { title: "Unable to update", message: "The information has changed. Refresh the page and try again.", confirmText: "Got it" },
    429: { title: "Too many attempts", message: "Please wait a moment before trying again.", confirmText: "Got it" },
    500: { title: "Server issue", message: "Something went wrong on our side. Please try again shortly.", confirmText: "Try again" },
  };
  const statusMatch = status ? statusFeedback[status] : undefined;
  if (statusMatch) {
    return { ...statusMatch, message: typeof apiMessage === "string" && apiMessage.trim() ? apiMessage : statusMatch.message };
  }

  const message = typeof apiMessage === "string" && apiMessage.trim()
    ? apiMessage
    : typeof error?.message === "string" && error.message.trim() ? error.message : Messages.error1;
  return { title: "We couldn't complete that", message, confirmText: "Try again" };
};

export const sweetErrorHandling = async (err: unknown) => {
  const feedback = getErrorFeedback(err);
  await Swal.fire({
    icon: "error",
    title: feedback.title,
    text: feedback.message,
    confirmButtonText: feedback.confirmText,
    showCloseButton: true,
    buttonsStyling: false,
    customClass: techanorAlertClasses,
  });
};

export const sweetTopSuccessAlert = async (
  msg: string,
  duration: number = 2000,
) => {
  await Swal.fire({
    position: "top-end",
    icon: "success",
    title: msg,
    showConfirmButton: false,
    timer: duration,
  });
};

export const sweetConfirm = async (title: string, message: string, confirmText: string, variant: "default" | "danger" | "success" = "default"): Promise<boolean> => {
  const customClass = variant === "danger" ? {
    ...techanorAlertClasses,
    popup: `${techanorAlertClasses.popup} techanor-alert-danger`,
    confirmButton: `${techanorAlertClasses.confirmButton} techanor-alert-confirm-danger`,
  } : variant === "success" ? {
    ...techanorAlertClasses,
    popup: `${techanorAlertClasses.popup} techanor-alert-success`,
    confirmButton: `${techanorAlertClasses.confirmButton} techanor-alert-confirm-success`,
  } : techanorAlertClasses;
  const result = await Swal.fire({
    icon: variant === "success" ? "success" : "question",
    title,
    text: message,
    confirmButtonText: confirmText,
    cancelButtonText: "Go back",
    showCancelButton: true,
    buttonsStyling: false,
    customClass,
    reverseButtons: true,
  });
  return result.isConfirmed;
};

export const sweetTopSmallSuccessAlert = async (
  msg: string,
  duration: number = 2000,
) => {
  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: duration,
    timerProgressBar: true,
  });

  Toast.fire({
    icon: "success",
    title: msg,
  }).then();
};

export const sweetFailureProvider = (
  msg: string,
  show_button: boolean = false,
  forward_url: string = "",
) => {
  Swal.fire({
    icon: "error",
    title: "Something went wrong",
    text: msg,
    showConfirmButton: show_button,
    showCloseButton: true,
    confirmButtonText: "Close",
    buttonsStyling: false,
    customClass: techanorAlertClasses,
  }).then(() => {
    if (forward_url !== "") {
      window.location.replace(forward_url);
    }
  });
};
