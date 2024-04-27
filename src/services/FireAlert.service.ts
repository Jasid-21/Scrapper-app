import Swal, { SweetAlertIcon, SweetAlertOptions } from "sweetalert2";

const default_icon: SweetAlertIcon = 'info',
default_title: string = 'System Message',
default_message: string = '';

export default async function FireAlert(options: SweetAlertOptions) {
  return await Swal.fire(options);
}

export function ComposeAlert(
  msg: string,
  icon?: SweetAlertIcon,
  cancelable: boolean = false,
  title?: string,
) {
  const options: SweetAlertOptions = {
    text: msg || default_message,
    icon: icon || default_icon,
    title: title || default_title,
    showCancelButton: cancelable,
  }

  return FireAlert(options);
}
