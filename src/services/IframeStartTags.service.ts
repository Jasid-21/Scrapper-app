export function AddStyles(context: Document, styles: string[]) {
  if (!context) return;
  const style_tags = styles.map(s => {
    const style = context.createElement('style');
    style.innerHTML = s;
    return style;
  });
  style_tags.forEach(s => context.head.appendChild(s));

  const sel_styles = context.createElement('style');
  sel_styles.innerHTML = `.xvx_focused { box-shadow: 0 0 4px 2px purple !important; }`;
  context.head.appendChild(sel_styles);
}

export function RemoveLinks(context: Document) {
  const links = context.querySelectorAll('link');
  links.forEach(l => l.remove());
}

export function RemoveScripts(context: Document) {
  const scripts = context.querySelectorAll('script');
  console.log(scripts);
  scripts.forEach(s => s.remove());
}
