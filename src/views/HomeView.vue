<template>
  <div class="home">
    <WebsiteDisplayer></WebsiteDisplayer>

    <Teleport to="#utils">
      <WorkspaceNav></WorkspaceNav>
      <SideNavContainer></SideNavContainer>
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
</script>
