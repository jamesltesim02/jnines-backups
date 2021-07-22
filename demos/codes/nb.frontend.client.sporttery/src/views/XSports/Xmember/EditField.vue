<template>
  <div class="x-nickname">
    <nav-bar
      title="个人信息"
      slot="header"
    >
      <v-touch
        tag="button"
        class="btn-save"
        @tap="saveField"
      >保存</v-touch>
    </nav-bar>
    <input
      v-if="fieldname === 'nickname'"
      class="info-field"
      v-model="nickName"
      maxlength="5"
      placeholder="起个响亮的名字吧… (2-5字)"
    />
    <textarea
      v-if="fieldname === 'introduction'"
      class="info-field"
      placeholder="写写我的自介，让大家更了解你… (6-50字)"
      v-model="introduction"
      maxlength="50"
    ></textarea>
  </div>
</template>
<script>
import { mapState, mapMutations } from 'vuex';
import { modifyNickname, modifyRemark } from '@/api/activity';

export default {
  props: {
    fieldname: {
      type: String,
      default: 'nickname',
    },
  },
  data() {
    return {
      nickName: '',
      introduction: '',
    };
  },
  computed: {
    ...mapState('member', ['memberInfo']),
  },
  created() {
    this.nickName = this.memberInfo.nickName;
    this.introduction = this.memberInfo.remark;
  },
  watch: {
    memberInfo: {
      deep: true,
      handler() {
        this.nickName = this.memberInfo.nickName;
        this.introduction = this.memberInfo.remark;
      },
    },
  },
  methods: {
    ...mapMutations('member', ['setMemberInfo']),
    async saveField() {
      try {
        this.$loading(this.$t('message.submitting'));
        if (this.fieldname === 'nickname' && !/^.{2,6}$/.test(this.nickName)) {
          this.$toast('昵称必须为2~6个字符');
          return;
        }
        if (this.fieldname === 'introduction' && !/^.{6,50}$/.test(this.introduction)) {
          this.$toast('自我介绍必须为6~50个字符');
          return;
        }
        await ({
          nickname: modifyNickname,
          introduction: modifyRemark,
        })[this.fieldname]({
          userId: this.memberInfo.userId,
          nickName: this.nickName,
          remark: this.introduction,
        });
        this.setMemberInfo({
          ...this.memberInfo,
          nickName: this.nickName,
          remark: this.introduction,
        });
        this.$toast(this.$t('message.success'));
        this.$router.replace('/member/info');
      } finally {
        this.$loading.close();
      }
    },
  },
};
</script>
<style lang="less">
.x-nickname {
  .btn-save {
    padding: .1rem;
    margin-right: .1rem;
  }
  .info-field {
    display: block;
    width: 100%;
    border: 0;
    padding: 0 .25rem;
  }
  input.info-field {
    line-height: .5rem;
    margin: .1rem 0;
    box-shadow: 0 10px 20px 0 rgba(0, 0, 0, 0.03);
  }
  textarea.info-field {
    padding: .18rem;
    height: 1.5rem;
    background: transparent;
  }
}
.blue .x-nickname {
  .btn-save { color: #ecebeb; }
  input.info-field {
    box-shadow: 0 .02rem .12rem 0 rgba(0,0,0,.1);
    border: 1px solid #2b2b2b;
    background: linear-gradient(to bottom, #323137, #302f35);
    color: #cccccc;
  }
  textarea.info-field { background: transparent; color: #cccccc; }
  textarea.info-field::-webkit-input-placeholder { color: #666666; }
}
</style>
