import { Toast } from 'antd-mobile';
import { observer } from 'mobx-react';
import React from 'react';
import { withApi } from '../../../apis';
import User from '../../../apis/User';

import memberStore from '../../../stores/member';
import J9Button from '../../common/J9Button';
import Dialog from '../Dialog';


type RealnameDialogState = {
  open: boolean,
  reject: Function,
  resolve: Function,
  verified?: boolean,
  value: string,
  submitting?: boolean,
};

const DEFAULT_STATE = {
  open: false,
  value: '',
  reject: () => {},
  resolve: () => {},
  submitting: false,
};

class RealnameDialog extends React.PureComponent<any> {

  state: RealnameDialogState = { ...DEFAULT_STATE };

  constructor (props: any) {
    super(props);
  }

  /** 校验是否有做真实姓名验证 */
  checkVerify () : Promise<boolean> {
    const {
      props: {
        api: { user }
      }
    } = this;
    return new Promise<boolean>((resolve, reject) => {
      user.checkRealname().then(((verified: boolean) => {
        if (verified) {
          resolve(true);
          return;
        }
        this.setState(() => ({
          ...DEFAULT_STATE,
          open: true,
          reject,
          resolve
        }));
      }));
    });
  }

  /** 提交真实姓名验证  */
  async handleSubmit () {
    const {
      state: {
        value,
        submitting,
        resolve
      },
      props: {
        api: { user }
      }
    } = this;

    if (!value.length || submitting) {
      return;
    }

    try {
      this.setState(state => ({
        ...state,
        submitting: true,
      }));
      await user.setRealname({
        userName: value,
        init: true
      });
      Toast.success('姓名提交成功');
      resolve(true);
      this.setState(state => ({
        ...state,
        open: false
      }))
    } finally {
      this.setState(state => ({
        ...state,
        submitting: false,
      }));
    }
  }

  render () {
    if (!memberStore.isLoged) {
      return null;
    }

    const {
      open,
      value,
      resolve,
      submitting
    } = this.state;

    return (
      <Dialog
        open={open}
        closeButton
        onClose={() => {
          this.setState(state => ({
            ...state,
            open: false,
          }));
          setTimeout(() => resolve(false), 200);
        }}
        className="realname-dialog"
      >
        <Dialog.Title>姓名验证</Dialog.Title>
        <Dialog.SubTitle>为了保障您的资金安全，需进行验证，充值提现必须使用该名下的银行卡，否则充提不会到账。</Dialog.SubTitle>
        <Dialog.FormField
          label="真实姓名:"
          inline
        >
          <input
            type="text"
            value={value}
            placeholder="提交后不可修改，请仔细核对"
            onChange={
              ({ target: { value } }) => this.setState(state => ({ ...state, value }))
            }
          />
        </Dialog.FormField>
        <J9Button
          submit
          available={value.length > 0}
          loading={submitting}
          onClick={this.handleSubmit.bind(this)}
        >提交</J9Button>
      </Dialog>
    );
  }
}

export default withApi({ user: User })(
  observer(RealnameDialog)
);
