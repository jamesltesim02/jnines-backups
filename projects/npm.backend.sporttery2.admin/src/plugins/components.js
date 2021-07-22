import Vue from 'vue';
import Modal from '@/components/common/Modal';
import BPagination from '@/components/common/BPagination';
import DateTimePicker from '@/components/common/DateTimePicker';
import ColorListPicker from '@/components/common/ColorListPicker';
import Tags from '@/components/common/Tags';
import BSelect from '@/components/common/BSelect';
import ImageUploader from '@/components/common/ImageUploader';
import CkEditor from '@/components/common/CkEditor';

export default {
  install () {
    Vue.component('modal', Modal);
    Vue.component('b-pagination', BPagination);
    Vue.component('date-time-picker', DateTimePicker);
    Vue.component('color-list-picker', ColorListPicker);
    Vue.component('tags', Tags);
    Vue.component('b-select', BSelect);
    Vue.component('image-uploader', ImageUploader)
    Vue.component('ck-editor', CkEditor)
  }
}
