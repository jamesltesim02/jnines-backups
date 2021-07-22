import React, {useState, forwardRef } from "react";
import {observer} from 'mobx-react';
import {Button, Input, message} from 'antd';
import {CloseOutlined} from '@ant-design/icons'
import {GoalSoundType, OddsAccept, SkinType} from "../../../../../consts/app";
import appStore from '../../../../../stores/app'
import memberStore from '../../../../../stores/member'
import Switch from "../../../Switch";

import blackImg from '../../../../icons/icon-lang/lang_black.png'
import blackImgActive from '../../../../icons/icon-lang/lang_black_active.png'
import whiteImg from '../../../../icons/icon-lang/lang_white.png'
import whiteImgActive from '../../../../icons/icon-lang/lang_white_active.png'

import M from '../../../../common/m';
import { useIntl } from "react-intl";
import { withApi } from "../../../../../apis";
import Pull from "../../../../../apis/Pull";

function Preference(
  {
    api: { pull },
    onClose = () => {}
  }: {
    api: { pull: Pull },
    onClose: () => void
  },
  ref: any
){
  const intl = useIntl();
  // 皮肤颜色: 炫晶白 = WHITE, 尊贵黑 = BLACK
  const [skinType, setSkinType] = useState(appStore.skin)

  // accept: 是否接受赔率变化  NO: 不接受, BETTER: 接受更好赔率, ALL: 接受所有赔率
  const [accept, setAccept] = useState(appStore.oddsAccept)

  // 进球提示音
  const [goalSound, setGoalSound] = useState(appStore.goalSound)

  // 金额
  const [amount, setAmount] = useState(appStore.acceptAmount)

  // 修改接受赔率
  const changeOddsAccept = (val: number) => {
    if (val === accept){
      val === OddsAccept.BETTER
        ? setAccept(OddsAccept.NO)
        : setAccept(OddsAccept.BETTER)
    }else if (
      accept === OddsAccept.ALL
      &&
      val === OddsAccept.BETTER){
      setAccept(OddsAccept.NO)
    }else {
      setAccept(val)
    }
  }

  const saveToStore = () => {
    appStore.skin = skinType
    appStore.acceptAmount = amount
    appStore.oddsAccept = accept
    appStore.goalSound = goalSound
    message.success(
      intl.formatMessage({ id: 'bet.error_msg.200' })
    );
    onClose();
  };

  // 保存设置
  const saveSetting = () => {
    if (!memberStore.isLoged) {
      saveToStore();
      return;
    }
    const hide = message.loading(
      intl.formatMessage({ id: 'pages.faving' })
    );

    pull.saveSettings({
      accept,
      language: appStore.locale,
      goalNotify: goalSound,
      theme: skinType,
      stake: amount,
    }).then(saveToStore).finally(hide);
  }

  return (
    <div
      ref={ref}
      className="preference-wrapper"
      onClick={()=>{onClose()}}
    >
      <div
        className="options-preference"
        onClick={e=>e.stopPropagation()}
      >
        <div className="title">
          <span><M id="settings.title" /></span>
          <span onClick={onClose}><CloseOutlined/></span>
        </div>
        <div className="content">
          {/*赔率调整*/}
          <div className="preference-item">
            <div><M id="settings.odds_change" /></div>
            <div>
              <div><M id="bet.accept_all" /></div>
              <Switch
                onChange={()=>changeOddsAccept(OddsAccept.ALL)}
                checked={accept === OddsAccept.ALL}
              />
            </div>
            <div>
              <div><M id="bet.accept_better" /></div>
              <Switch
                onChange={()=>changeOddsAccept(OddsAccept.BETTER)}
                checked={accept === OddsAccept.BETTER || accept === OddsAccept.ALL}
              />
            </div>
          </div>
          {/*金额设置*/}
          <div className="preference-item">
            <div><M id="settings.amount_label" /></div>
            <div style={{
              lineHeight: "34px"
            }}
            >
              <div><M id="settings.amount" /></div>
              <Input
                placeholder={
                  intl.formatMessage({ id: 'settings.amount_holder' })
                }
                min={0}
                type="number"
                value={amount || ''} 
                onChange={(ev) => setAmount(Number(ev.target.value))}
              />
            </div>
          </div>
          {/*其他设置*/}
          <div className="preference-item">
            <div><M id="settings.others" /></div>
            <div>
              <div><M id="settings.goal_sound" /></div>
              <Switch
                onChange={(checked: boolean) => {
                  setGoalSound(
                    checked
                    ? GoalSoundType.UNMUTED
                    : GoalSoundType.MUTED
                  )
                }}
                checked={goalSound === GoalSoundType.UNMUTED}
              />
            </div>
          </div>
          {/*皮肤选择*/}
          <div className="preference-item">
            <div><M id="settings.theme" /></div>
            <div className="skin">
              <img
                className={skinType === SkinType.WHITE ? 'skin_active' : ''}
                src={skinType === SkinType.WHITE ? whiteImgActive : whiteImg}
                onClick={() => setSkinType(SkinType.WHITE)}
                alt={intl.formatMessage({ id: 'settings.light' })}
              />
              <img
                className={skinType === SkinType.BLACK ? 'skin_active' : ''}
                src={skinType === SkinType.BLACK ? blackImgActive : blackImg}
                onClick={() => setSkinType(SkinType.BLACK)}
                alt={intl.formatMessage({ id: 'settings.dark' })}
              />
            </div>
          </div>
          {/*保存按钮*/}
          <Button
            type="primary"
            className="save-btn"
            onClick={saveSetting}
          >
            <M id="common.save" />
          </Button>
          <p className="tips">
            <M id="settings.savetip" />
          </p>
        </div>
      </div>
    </div>
  )
}

export default withApi({ pull: Pull })(
  observer(forwardRef(Preference))
);