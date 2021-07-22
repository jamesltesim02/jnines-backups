import React from 'react';
import { PaymentProtocol } from '../../../../apis/Payment';

function ProtocolList (
  {
    protocols,
    current,
    onChange = () => {}
  } : {
    protocols: PaymentProtocol[],
    current: PaymentProtocol,
    onChange: (protocol: PaymentProtocol) => void
  }
) {
  return (
    <div className="protocols">
      {
        protocols.map(prot => (
          <button
            key={prot.payId}
            className={
              prot === current ? 'active' : undefined
            }
            onClick={() => onChange(prot)}
          >
            {prot.name}
            <i />
          </button>
        ))
      }
    </div>
  );
}

export default ProtocolList;
