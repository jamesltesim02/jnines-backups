<template>
<div class="row">
  <BetChart />
  <UserChart />
</div>
</template>
<script>
import BetChart from '@/components/Report/BetChart'
import UserChart from '@/components/Report/UserChart'

export default {
  components: {
    BetChart,
    UserChart
  }
}
</script>