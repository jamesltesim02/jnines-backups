import { message } from 'antd';
import React from 'react';
import { useApi } from '../../../apis';
import User from '../../../apis/User';
import mergeClass from '../../../utils/mergeClass';
import LoadingBar from '../../common/LoadingBar';
import Dialog from '../Dialog';

function CreditPasswordDialog (
  {
    open,
    init,
    onClose,
    onFinish
  }: {
    open: boolean,
    init: boolean,
    onClose: () => void,
    onFinish: Function | (() => void)
  }
) {
  const { user }: { user: User } = useApi({ user: User });

  const [submitting, setSubmitting] = React.useState(false);
  const [password, setPassword] = React.useState('');
  const [confirm, setConfirm] = React.useState('');

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      await user.setCreditPassword({
        securityPwd: password,
        init
      });
      message.success(`${init ? '设置' : '更新'}资金密码成功`);
      onFinish();
    } finally {
      setSubmitting(false);
    }
  };

  React.useEffect(
    () => {
      setPassword('');
      setConfirm('');
    },
    [open]
  );

  return (
    <Dialog
      open={open}
      closeButton
      imgbg
      className="credit-password-dialog"
      onClose={onClose}
    >
      <header>设置资金密码</header>
      <p>资金密码启用后，进入游戏场馆，积分兑换，提现要进行资金密码验证，可进一步保护您的资金安全</p>
      <div className="input-item">
        <label>
          <b>*</b>资金密码:
        </label>
        <div>
          <input
            placeholder="请输入6位数数字密码"
            type="password"
            value={password}
            maxLength={6}
            onChange={({ target: { value } }) => setPassword(value.replace(/\D/, ''))}
          />
        </div>
      </div>
      <div className="input-item">
        <label>
          <b>*</b>确认密码:
        </label>
        <div>
          <input
            placeholder="请再次输入6位数字密码"
            type="password"
            value={confirm}
            maxLength={6}
            onChange={({ target: { value } }) => setConfirm(value.replace(/\D/, ''))}
          />
        </div>
      </div>
      <button
        className={mergeClass({
          submit: true,
          'single-submit': true,
          available: (
            !submitting
            &&
            confirm.length === 6 && confirm === password
          )
        })}
        onClick={
          (
            !submitting
            &&
            confirm.length === 6 && confirm === password
          ) ? handleSubmit : undefined
        }
      >
        {
          submitting
          ? <LoadingBar />
          : '确定'
        }
      </button>
    </Dialog>
  );
}

export default CreditPasswordDialog;
