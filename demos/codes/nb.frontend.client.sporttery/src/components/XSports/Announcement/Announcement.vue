<template>
  <home-notice>
    <horn />
  </home-notice>
</template>

<script>
import Horn from './icons/HornFilter';
import HomeNotice from '@/components/Home/HomeNotice';

export default {
  name: 'Announcement',
  components: { Horn, HomeNotice },
};
</script>
