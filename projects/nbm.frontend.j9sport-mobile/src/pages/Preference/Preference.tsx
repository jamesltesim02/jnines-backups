import React, { useEffect, useState } from 'react';
import { observer } from "mobx-react";
import BackButton from "../../components/common/BackButton";
import appStore from "../../stores/app";
import { GoalSoundType, Locales, OddsAccept, SkinType } from "../../consts/app";
// import { GoalSoundType, Locales, OddsAccept, SkinType } from "../../consts/app";
import M from "../../components/common/m"
import { useIntl } from "react-intl";

import EngImg from './img/english.png'
import CnImg from './img/chinese.png'
import Switch from "../../components/common/Switch";
import mergeClass from "../../utils/mergeClass";
import { Toast } from "antd-mobile";

/* eslint-disable react-hooks/exhaustive-deps */
function Preference() {

  const InitialSettings = {
    locale: appStore.locale,
    skinType: appStore.skin,
    accept: appStore.oddsAccept,
    goalSound: appStore.goalSound,
    acceptAmount: appStore.acceptAmount,
    matchOrderBy: appStore.matchOrderBy
  }

  const intl = useIntl()

  // 设置项
  const [settings, setSettings] = useState({...InitialSettings})
  // 是否有变化
  const [isChanged, setIsChanged] = useState(false)

  const {accept, acceptAmount, goalSound, locale, matchOrderBy, skinType} = settings

  const handleSetSettings = (obj: Object) => {
    setSettings({
      ...settings,
      ...obj
    })
  }

  const saveSetting = () => {
    if (isChanged) {
      appStore.skin = skinType
      appStore.acceptAmount = acceptAmount
      appStore.oddsAccept = accept
      appStore.goalSound = goalSound
      appStore.matchOrderBy = matchOrderBy
      appStore.locale = locale
      setIsChanged(false)
      Toast.info(intl.formatMessage({id: 'settings.save_success'}))
    }
  }

  // 修改接受赔率
  const changeOddsAccept = (val: number) => {
    if (val === settings.accept) {
      val === OddsAccept.BETTER
        ? handleSetSettings({accept: OddsAccept.NO})
        : handleSetSettings({accept: OddsAccept.BETTER})
    } else if (
      settings.accept === OddsAccept.ALL
      &&
      val === OddsAccept.BETTER) {
      handleSetSettings({accept: OddsAccept.NO})
    } else {
      handleSetSettings({accept: val})
    }
  }

  useEffect(() => {
    setIsChanged(JSON.stringify(settings) !== JSON.stringify(InitialSettings))
  }, [settings])

  return (
    <div className="preference">
      {/*偏好设置*/}
      <div className="header">
        <BackButton/>
        <span>
          <M id="settings.title" />
        </span>
        <button
          className={
            mergeClass({
              "save": true,
              "changed": isChanged
            })
          }
          onClick={saveSetting}
        >
          <M id="settings.save" />
        </button>
      </div>
      <div className="preference-container">
        {/*赔率变化*/}
        <div className="preference-item">
          <div className="tit">
            <M id="settings.odds_change" />
          </div>
          <div>
            <M id="bet.accept_all" />
            <Switch
              onChange={() => changeOddsAccept(OddsAccept.ALL)}
              checked={accept === OddsAccept.ALL}
            />
          </div>
          <div>
            <M id="bet.accept_better" />
            <Switch
              onChange={() => changeOddsAccept(OddsAccept.BETTER)}
              checked={accept === OddsAccept.BETTER || accept === OddsAccept.ALL}
            />
          </div>
        </div>
        {/*快捷金额设置*/}
        <div className="preference-item">
          <div className="tit">
            <M id="settings.amount_label" />
          </div>
          <input
            type="tel"
            maxLength={7}
            placeholder={intl.formatMessage({id: 'settings.amount_holder'})}
            value={acceptAmount}
            onChange={(ev) => {
              handleSetSettings({acceptAmount: parseInt(ev.target.value) || ''})
            }}
          />
        </div>
        {/*列表排序设置*/}
        {/*<div className="preference-item">*/}
        {/*  <div className="tit">列表排序设置</div>*/}
        {/*  <div className={*/}
        {/*    mergeClass({*/}
        {/*      "radio": true,*/}
        {/*      "active": matchOrderBy === MatchOrderby.BY_TIME_ASC*/}
        {/*    })*/}
        {/*  }>*/}
        {/*    按比赛时间排序*/}
        {/*    <button onClick={() => handleSetSettings({matchOrderBy: MatchOrderby.BY_TIME_ASC})}>*/}
        {/*      <i/>*/}
        {/*    </button>*/}
        {/*  </div>*/}
        {/*  <div className={*/}
        {/*    mergeClass({*/}
        {/*      "radio": true,*/}
        {/*      "active": matchOrderBy === MatchOrderby.BY_TOUR*/}
        {/*    })*/}
        {/*  }>*/}
        {/*    按联赛名次排序*/}
        {/*    <button onClick={() => handleSetSettings({matchOrderBy: MatchOrderby.BY_TOUR})}>*/}
        {/*      <i/>*/}
        {/*    </button>*/}
        {/*  </div>*/}
        {/*</div>*/}
        {/*语言选择*/}
        {/* <div className="preference-item">
          <div className="tit">
            <M id="settings.locale" />
          </div>
          <div className={
            mergeClass({
              "radio": true,
              "active": locale === Locales.ZH_CN
            })
          }>
            <span>
              <img src={CnImg} alt=""/>
              <M id="locale.zh" />
            </span>
            <button onClick={() => handleSetSettings({locale: Locales.ZH_CN})}>
              <i/>
            </button>
          </div>
          <div className={
            mergeClass({
              "radio": true,
              "active": locale === Locales.EN_US
            })
          }>
            <span>
              <img src={EngImg} alt=""/>
              <M id="locale.en" />
            </span>
            <button onClick={() => handleSetSettings({locale: Locales.EN_US})}>
              <i/>
            </button>
          </div>
        </div> */}
        {/*声音设置*/}
        <div className="preference-item">
          <div className="tit">
            <M id="settings.sound" />
          </div>
          <div>
            <M id="settings.goal_sound" />
            <Switch
              onChange={(checked: boolean) => {
                handleSetSettings(
                  checked
                    ? {goalSound: GoalSoundType.UNMUTED}
                    : {goalSound: GoalSoundType.MUTED}
                )
              }}
              checked={goalSound === GoalSoundType.UNMUTED}
            />
          </div>
        </div>
        {/*皮肤设置*/}
        <div className="preference-item">
          <div className="tit">
            <M id="settings.theme" />
          </div>
          <div className="skin">
            <span
              className={
                mergeClass({
                  "active": skinType === SkinType.WHITE
                })
              }
              onClick={() => handleSetSettings({skinType: SkinType.WHITE})}
            >
              <M id="settings.light" />
            </span>
            <span
              className={
                mergeClass({
                  "active": skinType === SkinType.BLACK
                })
              }
              onClick={() => handleSetSettings({skinType: SkinType.BLACK})}
            >
              <M id="settings.dark" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default observer(Preference);