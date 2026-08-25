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

export const sweetErrorHandling = async (err: any) => {
  const error = err.response?.data ?? err;
  const message = error?.message ?? Messages.error1;
  await Swal.fire({
    icon: "error",
    title: "Unable to complete request",
    text: message,
    confirmButtonText: "Close",
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
    title: "Unable to complete request",
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
