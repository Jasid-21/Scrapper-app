<template>
  <iframe ref="iframe" id="website-displayer"class="website-displayer"
    frameborder="0">
  </iframe>
</template>

<script setup lang="ts">
import { useWebsiteStore } from '@/stores/website';
import { useModelsStore } from '@/stores/models';
import { computed, nextTick, onMounted, ref, watch } from 'vue';
import ComposeSelector from '@/services/ComposeSelector.service';
import { ComposeAlert } from '@/services/FireAlert.service';
import { useToolsStore } from '@/stores/tools';
import DownloadText from '@/services/DownloadText.service';
import DownloadImage from '@/services/DownloadImage.service';

const link_selector = process.env.VUE_APP_LINK_SELECTOR;
const img_selector = process.env.VUE_APP_IMG_SELECTOR;
const website = useWebsiteStore();
const modelsStore = useModelsStore();
const training = computed(() => modelsStore.training);
const training_model = computed(() => modelsStore.trainingModel);
const tools = useToolsStore();
const active_tool = computed(() => tools.active_tool);

const content = computed(() => website.content);
const clicked_el = computed(() => website.clicked_el);
const iframe = ref<HTMLIFrameElement>();
const context = ref<Document | null>();
const wrapper = ref<HTMLElement>();
watch(context, v => {
  const w = v?.querySelector('dialog#xxv_element_wrapper') as HTMLElement | null;
  if (!w) return;
  wrapper.value = w;
}, { deep: true });

watch(active_tool, (v, old) => {
  console.log(v);
  if (old == 'links-finder') {
    const links = context.value?.querySelectorAll(link_selector);
    if (!links || !links.length) return;
    links.forEach(l => l.classList.remove('xvx_highlighted'));
  }

  if (v == 'links-finder') {
    const links = context.value?.querySelectorAll(link_selector);
    if (!links || !links.length) return;
    links.forEach(l => l.classList.add('xvx_highlighted'));
  }

  if (old == 'images-finder') {
    const links = context.value?.querySelectorAll(img_selector);
    if (!links || !links.length) return;
    links.forEach(l => l.classList.remove('xvx_highlighted'));
  }

  if (v == 'images-finder') {
    const links = context.value?.querySelectorAll(img_selector);
    if (!links || !links.length) return;
    links.forEach(l => l.classList.add('xvx_highlighted'));
  }
});

watch(clicked_el, (el, old) => {
  if (!el) return;
  if (training.value) {
    if (!training_model.value?.train_context) {
      modelsStore.setTrainingContext(el);
      return;
    }
    modelsStore.trainProperty(el);
    website.setClickedElement(null);
    return;
  }

  if (active_tool.value == 'element-remover') {
    ComposeAlert('Are you sure you want to delete this element?', 'warning', true)
    .then((resp) => {
      if (!resp.isDismissed) tools.removeElement();
      website.setClickedElement(null);
    });
    return;
  }

  if (active_tool.value == 'links-finder') {
    const hrefs: string[] = [];
    const el_href = el.getAttribute('href');
    const el_src = el.getAttribute('src');
    if (el_href) hrefs.push(el_href);
    if (el_src) hrefs.push(el_src);

    const links = el.querySelectorAll(link_selector) as NodeListOf<Element>;
    if (!links.length && !hrefs.length) {
      ComposeAlert('Links not found. Try selecting another container.');
      website.setClickedElement(null);
      return;
    }

    links.forEach(l => {
      const href = l.getAttribute('href');
      const src = l.getAttribute('src');
      if (href) hrefs.push(href);
      if (src) hrefs.push(src);
    });
    console.log(hrefs);

    ComposeAlert(`Found ${hrefs.length} links. Do you want to download them?`, 'info', true)
    .then((resp) => {
      if (!resp.isDismissed) DownloadText('Links.txt', hrefs.join('\n'));
      website.setClickedElement(null);
    });
    return;
  }

  if (active_tool.value == 'images-finder') {
    const srcs: string[] = [];
    const el_src = el.getAttribute('src');
    if (el_src) srcs.push(el_src);

    const links = el.querySelectorAll(img_selector) as NodeListOf<Element>;
    if (!links.length && !srcs.length) {
      ComposeAlert('Images with available source not found. Try selecting another container.');
      website.setClickedElement(null);
      return;
    }

    links.forEach(l => {
      const src = l.getAttribute('src');
      if (src) srcs.push(src);
    });
    console.log(srcs);

    ComposeAlert(`Found ${srcs.length} images. Do you want to download them?`, 'info', true)
    .then((resp) => {
      if (!resp.isDismissed) srcs.forEach(src => DownloadImage(src));
      website.setClickedElement(null);
    });
    return;
  }

  console.log("It reachs");
  website.setClickedElement(null);
});

onMounted(() => {
  if (!iframe.value) return;
  iframe.value.onerror = (err) => {
    console.log(err);
  }

  window.onmessage = function(ev: MessageEvent) {
    if (ev.data == 'loaded') {
      const ctx = iframe.value?.contentWindow?.document;
      context.value = ctx;
      website.setContext(ctx || null);

      nextTick(() => {
        if (!context.value) return;
        if (!wrapper.value) return;

        wrapper.value.addEventListener('click', (ev) => {
          ev.stopPropagation();
          website.setClickedElement();
        });

        const z_indexes: number[] = [];
        const els = context.value.querySelectorAll('*');
        els.forEach(d => {
          const zIndex = getComputedStyle(d).getPropertyValue('z-index');
          if (isNaN(Number(zIndex))) return;
          z_indexes.push(Number(zIndex));
        });
        const max = Math.max(...z_indexes, -1);
        wrapper.value.style.zIndex = max.toString();

        context.value.addEventListener('mousemove', updateWrapper);
      });
    }
  }
});

const updateWrapper = (ev: MouseEvent) => {
  ev.stopPropagation();
  if (!wrapper.value) return;
  if (!context.value) return;
  let max_z = Number(getComputedStyle(wrapper.value).zIndex);

  const { clientX, clientY } = ev;
  const els = context.value.elementsFromPoint(clientX, clientY);
  if (!els[0]) return;
  const el_idx = els[0].id == 'xxv_element_wrapper' ? 1 : 0;
  const el = els[el_idx];
  if (!el) return;

  const { top, left, width, height } = el.getBoundingClientRect();
  const raw_zindex = Number(getComputedStyle(el).zIndex);

  if (!isNaN(raw_zindex)) max_z = Math.max(max_z, Number(raw_zindex));
  wrapper.value.style.top = top - scrollY + 'px';
  wrapper.value.style.left = left + 'px';
  wrapper.value.style.width = width + 'px';
  wrapper.value.style.height = height + 'px';
  wrapper.value.style.zIndex = (max_z + 100).toString();

  website.setFocusedElement(el);
}

watch(content, v => {
  if (!iframe.value) return;
  iframe.value.contentWindow?.document.open();
  iframe.value.contentWindow?.document.write(v);
  iframe.value.contentWindow?.document.close();
});
</script>

<style scoped lang="scss">
iframe.website-displayer {
  width: 100vw;
  height: 100vh;
  max-width: 100%;
  max-height: 100vh;
}

.iframe-mask {
  position: absolute;
  top: 0; left: 0;
  width: 100vw;
  height: 100vh;
}
</style>
