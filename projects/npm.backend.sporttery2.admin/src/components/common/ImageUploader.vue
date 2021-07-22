<template>
  <div class="image-uploader">
    <input
      ref="fileCom"
      type="file"
      accept="image/*"
      :multiple="multiple"
      @change="handleChange"
    />
    <ul class="gallerys">
      <li
        v-for="(p, i) in photos"
        :key="p"
      >
        <a :href="baseUrl + p"><img :src="baseUrl + p" /></a>
        <button
          class="btn btn-xs btn-default"
          type="button"
          @click="remove(i)"
        >
          <i class="fa fa-times"></i>
        </button>
      </li>

      <li
        v-if="multiple || !value"
        class="add"
        @click="() => $refs.fileCom.click()"
      >
        添加图片
      </li>
    </ul>
  </div>
</template>
<script>
import { uploadFiles } from '@/api/files'
import opsConfig from '@/config/config.ops'

const $ = window.jQuery

export default {
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    multiple: {
      type: Boolean,
      default: false
    },
    value: {},
    name: {}
  },
  computed: {
    photos () {
      if (!this.value) {
        return []
      }

      if (!this.multiple) {
        return [this.value]
      }

      return this.value
    },
    baseUrl () {
      return opsConfig.RESOURCE_URL
    }
  },
  watch: {
    value (n) {
      if (!n || (Array.isArray(n) && !n.length)) {
        this.$refs.fileCom.value = ''
        return
      }
      $('.gallerys', this.$el).magnificPopup({
        type: 'image',
        delegate: 'a',
        gallery: {
          enabled:true
        }
      })
    }
  },
  methods: {
    async handleChange(e) {
      const files = e.target.files
      if (!files.length) {
        return
      }

      const formData = new FormData();
      files.forEach(file => {
        formData.append('files', file)
      })
      formData.append('property', this.name)

      try {
        this.$loading('上传中...')
        const result = await uploadFiles(formData)
        this.$emit(
          'change',
          (
            this.multiple
            ? [...this.value, ...result]
            : result[0]
          )
        )
      } catch (e) {
        // TODO 
      } finally {
        this.$loading.close()
      }
    },
    remove (index) {
      if (!this.value || !this.value.length) {
        return
      }
      if (!this.multiple) {
        this.$emit('change', null)
        return
      }

      // 删除指定下标处图片
      this.value.splice(index, 1)
      this.$emit('change', [...this.value])
    }
  }
}
</script>
<style scoped>
.image-uploader {
  position: relative;
}
input {
  opacity: 0;
  position: absolute;
  top: 0;
  left: 0;
  z-index: -1;
}
ul {
  padding: 0;
  margin: 0;
  padding-top: 10px;
  display: flex;
  flex-wrap: wrap;
}
li {
  position: relative;
  list-style-type: none;
  margin-right: 5px;
  margin-bottom: 5px;
  border: 1px dotted #ccc;
}
li img {
  height: 70px;
}
li button {
  position: absolute;
  right: 0;
  bottom: 0;
  color: #ff5353;
  background: transparent;
  border: none;
}
.add {
  height: 72px;
  width: 72px;
  border: 1px dashed #aaa;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
</style>