import React from 'react';
import { observer } from "mobx-react";
import appStore from "../../../../stores/app";
import { SkinType } from "../../../../consts/app";

function IconMember (
  {
    children,
    size = 48,
    active = false,
    name
  }: {
    children: any,
    /** 图标大小 */
    size?: number,
    /** 是否高亮 */
    active?: boolean,
    /** 图标名称 */
    name: string,
  }
) {
  const linearGradientWhite = [
    {
      id: `${name}-linear1`,
      normal: {
        x1: '50%',
        x2: '50%',
        y1: '0%',
        y2: '100%',
        color1: '#ECECEC',
        color2: '#D4D4D4',
      },
      active: {
        x1: '.186%',
        x2: '100%',
        y1: '50%',
        y2: '50%',
        color1: '#DF4141',
        color2: '#B90404',
      }
    },
    {
      id: `${name}-linear2`,
      normal: {
        x1: '50.093%',
        x2: '50.093%',
        y1: '.093%',
        y2: '99.907%',
        color1: '#2D2D2D',
        color2: '#2D2D2D',
      },
      active: {
        x1: '50%',
        x2: '50%',
        y1: '0%',
        y2: '100%',
        color1: '#F4DEB7',
        color2: '#F4DEB7',
      }
    }
  ]

  const linearGradientsDark = [
    {
      id: `${name}-linear1`,
      normal: {
        x1: '50%',
        x2: '50%',
        y1: '0%',
        y2: '100%',
        color1: '#61616F',
        color2: '#32323C',
      },
      active: {
        x1: '.186%',
        x2: '100%',
        y1: '50%',
        y2: '50%',
        color1: '#E2B271',
        color2: '#F6D99D',
      }
    },
    {
      id: `${name}-linear2`,
      normal: {
        x1: '50.093%',
        x2: '50.093%',
        y1: '.093%',
        y2: '99.907%',
        color1: '#BBBBD7',
        color2: '#6D6D7C',
      },
      active: {
        x1: '50%',
        x2: '50%',
        y1: '0%',
        y2: '100%',
        color1: '#B7885A',
        color2: '#8F5721',
      }
    }
  ];

  const linearGradient = appStore.skin === SkinType.WHITE ? linearGradientWhite : linearGradientsDark

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
    >
      <defs>
        {
          linearGradient.map(item => {
            const detail = active ? item.active : item.normal;
            return (
              <linearGradient
                key={item.id}
                id={item.id}
                x1={detail.x1}
                x2={detail.x2}
                y1={detail.y1}
                y2={detail.y2}
              >
                <stop offset="0%" stopColor={detail.color1} />
                <stop offset="100%" stopColor={detail.color2} />
              </linearGradient>
            )
          })
        }
      </defs>
      <g fill="none" fillRule="evenodd">
        <g>
          {children}
        </g>
      </g>
    </svg>
  );
}

export default observer(IconMember);
