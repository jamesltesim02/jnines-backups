import React from 'react';
import { Link } from 'react-router-dom';
import { useApi } from '../../../apis';
import User from '../../../apis/User';
import mergeClass from '../../../utils/mergeClass';
import LoadingBar from '../../common/LoadingBar';
import Dialog from '../Dialog';

function CreditPasswordVerify (
  {
    open,
    onClose,
    onFinish
  }: {
    open: boolean,
    onClose: () => void,
    onFinish: Function
  }
) {

  const { user }: { user: User } = useApi({ user: User })
  const [submitting, setSubmitting] = React.useState(false);
  const [pass, setPass] = React.useState('');

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      await user.verifyCreditPassword(pass);
      onFinish();
    } finally {
      setSubmitting(false)
    }
  };

  React.useEffect(
    () => {
      setPass('');
    },
    [open]
  );

  return (
    <Dialog
      open={open}
      closeButton
      imgbg
      onClose={onClose}
      className="credit-password-verify-dialog"
    >
      <header>输入六位资金密码</header>
      <div className="input-item credit-pass">
        <div>
          <input
            type="password"
            maxLength={6}
            value={pass}
            onChange={({ target: { value } }) => setPass(value.replace(/\D+/gi, ''))}
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
            pass.length === 6
          )
        })}
        onClick={
          (
            !submitting
            &&
            pass.length === 6
          ) ? handleSubmit : undefined
        }
      >
        {
          submitting
          ? <LoadingBar />
          : '确定'
        }
      </button>
      <div className="remark">
        <Link to="/member/settings">忘记资金密码?</Link>
      </div>
    </Dialog>
  );
}

export default CreditPasswordVerify;
