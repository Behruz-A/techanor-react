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
  closeButton: "techanor-alert-close",
};

const getErrorMessage = (err: any): string => {
  const apiMessage = err?.response?.data?.message;

  if (typeof apiMessage === "string" && apiMessage.trim()) {
    return apiMessage;
  }

  const message = err?.message;
  if (message === "Network Error" || err?.code === "ERR_NETWORK") {
    return "We couldn't connect to the server. Check your connection and try again.";
  }

  if (typeof message === "string" && message.trim()) {
    return message;
  }

  return Messages.error1;
};

export const sweetErrorHandling = async (err: any) => {
  await Swal.fire({
    icon: "error",
    title: "Something went wrong",
    text: getErrorMessage(err),
    confirmButtonText: "Got it",
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
