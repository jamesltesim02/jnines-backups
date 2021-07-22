import React from 'react';
import { useApi } from '../../../../apis';
import Payment from '../../../../apis/Payment';
import LoadingBar from '../../../../components/common/LoadingBar';

function PayForm () {
  const { payment }: { payment: Payment } = useApi({ payment: Payment });

  React.useEffect(
    () => {
      const params = new URLSearchParams(window.location.search);
      payment.orderForm({
        payType: params.get('pay_type') as string,
        token: params.get('token') as string,
      }).then((payForm: any) => {
        const formDom = document.createElement('form');
        formDom.action = payForm.orderUrl;
        formDom.method = 'POST';
        formDom.style.display = 'none';
        formDom.innerHTML = (
          Object.entries(payForm.orderMap).map(
            ([k, v]) => (`<input type="hidden" name="${k}" value="${v}">`)
          ).join('')
        )
        document.body.appendChild(formDom);
        formDom.submit();
      });
    },
    []
  );

  return (
    <LoadingBar />
  );
}

export default PayForm;
