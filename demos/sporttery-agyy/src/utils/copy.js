import ClipboardJS from 'clipboard';
import store from '@/store';

const { document } = window;

let cliper;
let clipdom;
let copyTarget = { content: '' };

export default (data = {}) => {
  if (!data.content) {
    return;
  }
  copyTarget = data;

  if (!cliper) {
    clipdom = document.createElement('button');
    clipdom.className = 'clip-button';
    clipdom.style.display = 'none';
    document.body.appendChild(clipdom);

    cliper = new ClipboardJS(
      '.clip-button',
      {
        text() {
          return copyTarget.content;
        },
      },
    );

    cliper.on('success', () => {
      store.commit(
        'app/toast',
        {
          msg: 'message.copySuccess',
          params: copyTarget,
        },
      );
    });

    cliper.on('error', (e) => {
      store.commit('app/toast', 'message.copyFail');
      console.error(e);
    });
  }
  clipdom.click();
};
