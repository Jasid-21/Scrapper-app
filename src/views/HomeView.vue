<template>
  <div class="home">
    <WebsiteDisplayer></WebsiteDisplayer>

    <Teleport to="#utils">
      <WorkspaceNav></WorkspaceNav>
      <SideNavContainer></SideNavContainer>
      <AdviceDisplayer></AdviceDisplayer>
    </Teleport>

    <Teleport to="#modals">
      <ModalsDisplayer></ModalsDisplayer>
    </Teleport>
  </div>
</template>

<script lang="ts" setup>
import WebsiteDisplayer from '@/components/utils/WebsiteDisplayer.vue';
import WorkspaceNav from '@/components/utils/WorkspaceNav.vue';
import SideNavContainer from '@/components/utils/SideNavContainer.vue';
import ModalsDisplayer from '@/components/modals/ModalsDisplayer.vue';
import AdviceDisplayer from '@/components/utils/AdviceDisplayer.vue';
</script>

<style scoped lang="scss">
.home {
  max-width: 100%;
  height: 100vh;
  overflow: hidden;
}
</style>
