import React from 'react';
import { observer } from "mobx-react";
import Dialog from "../Dialog";
import mergeClass from "../../../utils/mergeClass";
import member from "../../../stores/member";
import encodeSearchParams from "../../../utils/encodeSearchParams";
import memberStore from "../../../stores/member";
import appStore from "../../../stores/app";

function CurrencyDialog(
  {
    open,
    onClose
  }: {
    open: boolean
    onClose: any
  }
) {
  const isUSDT = [2, 96].includes(member.currency)

  const changeCurrency = (currency: number) => {
    const src = `${window.location.origin}?${encodeSearchParams({
      currency,
      frontId: "10077100werw564wesfx",
      origin: appStore.origin,
      j9Token: memberStore.agToken,
      locale: appStore.locale,
    })}`;
    window.location.href = src
  }

  return (
    <Dialog
      className="currency"
      open={open}
      onClose={onClose}
      closeButton
    >
      <div className="currency-dialog">
        <header>请选择您的货币类型</header>
        <button
          onClick={() => {
            !isUSDT
            &&
            changeCurrency(2)
          }}
          className={
            mergeClass({
              'currency-dialog-selected': isUSDT
            })
          }>
          USDT(1:1) {!isUSDT && "立即切换"}
        </button>
        <button
          onClick={() => {
            isUSDT
            &&
            changeCurrency(1)
          }}
          className={
            mergeClass({
              'currency-dialog-selected': !isUSDT
            })
          }
        >
          CNY(1:7) {isUSDT && "立即切换"}
        </button>
      </div>
    </Dialog>
  );
}

export default observer(CurrencyDialog);