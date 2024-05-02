import Swal, { SweetAlertIcon, SweetAlertOptions } from "sweetalert2";

const default_icon: SweetAlertIcon = 'info',
default_title: string = 'System Message',
default_message: string = '';

function composeHtml(msg: string): string {
  return `
  <div style="margin-left: auto; margin-right: auto;
    max-width: 300px; max-height: 250px; overflow: auto;">
    ${msg}
  </div>
  `;
}

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
    html: composeHtml(msg || default_message),
    icon: icon || default_icon,
    title: title || default_title,
    showCancelButton: cancelable,
  }

  return FireAlert(options);
}
