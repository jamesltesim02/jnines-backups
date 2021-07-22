import React from 'react';
import mergeClass from '../../../utils/mergeClass';

/** 轮播滑动组件 */
class QuickSlider extends React.PureComponent {
  state: {
    items: any[],
    visibleItems: number[],
    index: number,
    nexting: boolean,
    preving: boolean
  };
  containerRef: React.RefObject<HTMLDivElement>;

  constructor (
    props: {
      ref: Function,
      onIndexChange?: Function,
      children: any[]
    }
  ) {
    super(props);
    const items = (
      props.children.filter(
        item => React.isValidElement(item)
      ).map((item, index) => (
        <div
          key={index}
          className="j9s-quickbet-slider-item"
        >{item}</div>
      ))
    );
    this.state = {
      items,
      visibleItems: this.getVisibleItems(items.length, 0),
      index: 0,
      nexting: false,
      preving: false
    };
    this.containerRef = React.createRef<HTMLDivElement>();
  }

  private getVisibleItems (count: number, index: number) : number[] {
    return [
      (
        index === 0
        ? count - 1
        : index - 1
      ),
      index,
      (
        index === count - 1
        ? 0
        : index + 1
      )
    ];
  }

  public toNext () {
    const {
      items,
      index,
      nexting,
      preving,
    } = this.state;

    if (nexting || preving) {
      return;
    }
    this.setState({
      ...this.state,
      nexting: true,
      index: (
        index === items.length - 1
        ? 0
        : index + 1
      )
    });
  }
  public toPrev () {
    const {
      items,
      index,
      nexting,
      preving,
    } = this.state;
    if (nexting || preving) {
      return;
    }
    this.setState({
      ...this.state,
      preving: true,
      index: (
        index === 0
        ? items.length - 1
        : index - 1
      )
    });
  }

  handleTransitionEnd () {
    this.setState({
      preving: false,
      nexting: false,
      visibleItems: this.getVisibleItems(this.state.items.length, this.state.index)
    })
  }

  render () {
    return (
      <div className={mergeClass({
        'j9s-quickbet-slider': true,
        'j9s-to-next': this.state.nexting,
        'j9s-to-prev': this.state.preving
      })}>
        <div
          className="j9s-quickbet-slider-container"
          ref={this.containerRef}
          onTransitionEnd={this.handleTransitionEnd.bind(this)}
        >
          {
            this.state.visibleItems.map(
              (vi, index) => (
                <React.Fragment key={index}>
                  {this.state.items[vi]}
                </React.Fragment>
              )
            )
          }
        </div>
      </div>
    );
  }
}

export default QuickSlider;