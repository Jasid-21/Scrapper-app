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

const website = useWebsiteStore();
const modelsStore = useModelsStore();
const training_model = computed(() => modelsStore.trainingModel);
const training = computed(() => modelsStore.training);
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

watch(clicked_el, (el, old) => {
  if (!el) return;
  if (!training.value || !training_model.value) return;
  const selector = ComposeSelector(el);
  console.log(selector);
  if (!training_model.value.train_context) {
    modelsStore.setTrainingContext(selector);
    return;
  }

  modelsStore.trainProerty(el);
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
