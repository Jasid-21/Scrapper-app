<template>
  <iframe ref="iframe" class="website-displayer" frameborder="0"></iframe>
</template>

<script setup lang="ts">
import HandleHref from '@/services/HandleHref.service';
import { useWebsiteStore } from '@/stores/website';
import { computed, nextTick, ref, watch } from 'vue';

const iframe = ref<HTMLIFrameElement>();
const website = useWebsiteStore();
const styles = computed(() => website.styles.map(s => `<style>${s}</style>`));
const content = computed(() => website.content);

watch(content, v => {
  if (!iframe.value) return;
  iframe.value.contentWindow?.document.open();
  iframe.value.contentWindow?.document.write(v);
  iframe.value.contentWindow?.document.close();

  nextTick(() => {
    if (!iframe.value) return;

    const style_tags = styles.value.map(s => {
      const style = document.createElement('style');
      style.innerHTML = s;
      return style;
    });
    style_tags.forEach(s => iframe.value?.contentWindow?.document.head.appendChild(s));
    const sel_styles = document.createElement('style');
    sel_styles.innerHTML = `
      .xvx_focused {
        box-shadow: 0 0 4px 2px purple !important;
      }
    `;
    iframe.value.contentWindow?.document.body.appendChild(sel_styles);

    const els = iframe.value.contentWindow?.document.querySelectorAll('*');
    if (!els) return;
    els.forEach(el => {
      el.addEventListener('mouseover', (ev) => {
        ev.stopPropagation();
        el.classList.add('xvx_focused');
      });
      el.addEventListener('mouseout', (ev) => {
        ev.stopPropagation();
        el.classList.remove('xvx_focused');
      });

      HandleHref(el);
    });
  });
});
</script>

<style scoped lang="scss">
iframe.website-displayer {
  width: 100vw;
  height: 100vh;
}
</style>
