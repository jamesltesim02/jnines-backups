import React, { useState } from 'react';
import dayjs from "dayjs";
import ImageCalender from "../../../pages/Transaction/img/calender.svg";
import { Calendar } from "antd-mobile";

const now = new Date()

function TimePicker(
  {
    startTime,
    limitTime,
    onConfirm
  }: {
    startTime: number,
    limitTime: number,
    onConfirm: (startDateTime?: Date, endDateTime?: Date) => void;
  }
) {
  // 显示日期选择
  const [showCalendar, setShowCalendar] = useState(false)
  return (
    <>
      <div
        onClick={() => setShowCalendar(true)}
        className="condition-timepicker"
      >
        <div>日期</div>
        <div>
          <span>{dayjs(startTime).format("YYYY/MM/DD")}</span>
          -
          <span>{dayjs(limitTime - 86400000).format("YYYY/MM/DD")}</span>
          <img src={ImageCalender} alt=""/>
        </div>
      </div>
      <div className="calender">
        <Calendar
          visible={showCalendar}
          onCancel={() => setShowCalendar(false)}
          onConfirm={((startDateTime, endDateTime) => {
            onConfirm(startDateTime, endDateTime)
            setShowCalendar(false)
          })}
          defaultDate={now}
          minDate={new Date(+now - 2592000000)}
          maxDate={now}
        />
      </div>
    </>
  );
}

export default TimePicker;