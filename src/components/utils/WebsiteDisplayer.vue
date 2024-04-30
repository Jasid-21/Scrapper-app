<template>
  <iframe ref="iframe" id="website-displayer"class="website-displayer"
    frameborder="0">
  </iframe>
</template>

<script setup lang="ts">
import HandleHref from '@/services/HandleHref.service';
import { useWebsiteStore } from '@/stores/website';
import { useModelsStore } from '@/stores/models';
import { computed, nextTick, ref, watch } from 'vue';
import ComposeSelector from '@/services/ComposeSelector.service';
import { AddStyles, RemoveLinks } from '@/services/IframeStartTags.service';

const website = useWebsiteStore();
const modelsStore = useModelsStore();
const training_model = computed(() => modelsStore.trainingModel);
const training = computed(() => modelsStore.training);
const styles = computed(() => website.styles.map(s => `<style>${s}</style>`));
const content = computed(() => website.content);
const iframe = ref<HTMLIFrameElement>();

watch(content, v => {
  if (!iframe.value) return;
  iframe.value.contentWindow?.document.open();
  iframe.value.contentWindow?.document.write(v);
  iframe.value.contentWindow?.document.close();

  const doc = iframe.value.contentWindow?.document;
  if (doc) website.setIframeDoc(doc);

  nextTick(() => {
    if (!iframe.value) return;
    const context = iframe.value?.contentWindow?.document;
    if (!context) return;

    AddStyles(context, styles.value);
    //RemoveLinks(context);

    const els = context?.querySelectorAll('*');
    if (!els) return;
    els.forEach(el => {
      el.addEventListener('click', (ev) => {
        ev.stopPropagation();
        if (!training.value || !training_model.value) return;
        const selector = ComposeSelector(el);
        console.log(selector);
        if (!training_model.value.train_context) {
          modelsStore.setTrainingContext(selector);
          return;
        }
      
        modelsStore.trainProerty(el);
      });

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

.iframe-mask {
  position: absolute;
  top: 0; left: 0;
  width: 100vw;
  height: 100vh;
}
</style>
