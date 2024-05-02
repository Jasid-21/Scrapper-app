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
    const links = context.value?.querySelectorAll('[href]');
    if (!links || !links.length) return;
    links.forEach(l => l.classList.remove('xvx_highlighted'));
  }

  if (v == 'links-finder') {
    const links = context.value?.querySelectorAll('[href]');
    if (!links || !links.length) return;
    links.forEach(l => l.classList.add('xvx_highlighted'));
  }
});

watch(clicked_el, (el, old) => {
  console.log(active_tool);
  console.log(el);
  if (!el) return;
  if (training.value) {
    if (!training_model.value) return;
    const selector = ComposeSelector(el);
    console.log(selector);
    if (!training_model.value.train_context) {
      modelsStore.setTrainingContext(selector);
      return;
    }
    modelsStore.trainProerty(el);
    return;
  }

  if (active_tool.value == 'element-remover') {
    ComposeAlert('Are you sure you want to delete this element?', 'warning', true)
    .then((resp) => {
      if (resp.isDismissed) return;
      tools.removeElement();
    })

    return;
  }

  if (active_tool.value == 'links-finder') {
    const links = el.querySelectorAll('[href]:not(link)');
    if (!links.length) {
      ComposeAlert('Links not found');
      return;
    }

    const hrefs: string[] = [];
    links.forEach(l => {
      const href = l.getAttribute('href');
      if (!href) return;
      hrefs.push(href);
    });
    console.log(hrefs);

    return;
  }
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

      nextTick(() => {
        if (!context.value) return;
        if (!wrapper.value) return;

        wrapper.value.addEventListener('click', (ev) => {
          ev.stopPropagation();
          website.setClickedElement();
        });

        let max_z = -1;
        const dialogs = context.value.querySelectorAll('dialog');
        dialogs.forEach(d => {
          const zIndex = getComputedStyle(d).zIndex;
          if (isNaN(Number(zIndex))) return;
          if (Number(zIndex) > max_z) max_z = Number(zIndex);
        });
        wrapper.value.style.zIndex = max_z.toString();

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
}

.iframe-mask {
  position: absolute;
  top: 0; left: 0;
  width: 100vw;
  height: 100vh;
}
</style>
