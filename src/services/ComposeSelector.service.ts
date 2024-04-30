function ElementSelector(el: Element): string {
  const el_tag = el.tagName.toLowerCase(),
  el_class = Array.from(el.classList).filter(c => c != 'xvx_focused');
  return el_tag + (el_class.length ? '.' + el_class.join('.') : '');
}

export default function ComposeSelector(el: Element): string {
  let selector = '';

  const el_sel = ElementSelector(el);
  selector = el_sel;
  const parent = el.parentElement;
  if (parent) {
    const parent_sel = ElementSelector(parent);
    selector = parent_sel + ' > ' + selector;
    console.log(selector);

    const grandparent = parent.parentElement;
    if (grandparent) {
      const grand_sel = ElementSelector(grandparent);
      selector = grand_sel + ' > ' + selector;;
    }
  }

  return selector;
}
