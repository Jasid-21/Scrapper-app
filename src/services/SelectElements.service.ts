export function GetMainContext(): Document | undefined {
  const iframe = document.querySelector('iframe#website-displayer') as HTMLIFrameElement | null;
  return iframe?.contentWindow?.document || undefined;
}

export default function SelectElements(selector: string, ctx?: Element):
  NodeListOf<Element> |  undefined {
  if (!ctx) ctx = GetMainContext()?.querySelector('body') || undefined;
  if (!ctx) return;
  let els: NodeListOf<Element> | undefined = undefined;
  try {
    els = ctx.querySelectorAll(selector);
  } catch (err) {
    return undefined;
  }

  return els;
}
