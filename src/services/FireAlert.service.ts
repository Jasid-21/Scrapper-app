export default async function FireAlert(
  msg: string, cancelable: boolean = false
): Promise<boolean> {
  console.log("Hey");
  if (cancelable) return confirm(msg);
  alert(msg);
  return true;
}
