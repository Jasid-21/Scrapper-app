export default function HandleHref(el: Element) {
  const href = el.getAttribute('href');
  if (!href) return;
  el.removeAttribute('href');
  el.setAttribute('data-href', href);
}
