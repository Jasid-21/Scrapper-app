export function GetMainContext(): Document | undefined {
  const iframe = document.querySelector('iframe#website-displayer') as HTMLIFrameElement | null;
  return iframe?.contentWindow?.document || undefined;
}

export default function SelectElements(selector: string, doc?: Document):
  NodeListOf<Element> |  undefined {
  if (!doc) doc = GetMainContext();
  if (!doc) return;
  let els: NodeListOf<Element> | undefined = undefined;
  try {
    els = doc.querySelectorAll(selector);
  } catch (err) {
    return undefined;
  }

  return els;
}
