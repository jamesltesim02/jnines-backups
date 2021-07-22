import React from 'react';
import mergeClass from "../../utils/mergeClass";

function Steps(
  {
    current,
    children,
  }: {
    current: number
    children: JSX.Element | JSX.Element[]
  }
) {
  
  return (
    <div className="steps">
      <div className="steps-process">
        {
          React.Children.map(children, (child, index) => {
            return (
              <>
                {
                  index !== 0
                  &&
                  <div className={mergeClass({
                    "steps-process-dot": true,
                    "active": current >= index
                  })}
                  />
                }
                <div
                  className={mergeClass({
                    "steps-process-item": true,
                    "active": current >= index
                  })}
                >
                  <span className="steps-process-icon">
                    <img
                      src={
                        current >= index
                          ? child.props.activeIcon
                          : child.props.icon
                      }
                      alt=""
                    />
                  </span>
                  <span className="steps-process-text">
                    {child.props.title}
                  </span>
                </div>
              </>
            )
          })
        }
      </div>
      {
        React.Children.map(children, ((child, index) => {
          return (
            current === index
            &&
            child.props.children
          )
        }))
      }
    </div>
  );
}

export default Steps;