import React, { Component } from 'react';
import Commen from '../assets/js/commenFunc';

export default (WrappedComponent, ajaxParam) => {//ajaxParam的handleData方法需要返回数据
    class NewComponent extends Component {
        constructor () {
            super()
            this.state = { data: null }
        }

        componentWillMount () {

            let obj = null;
            Commen.ajax({
                url: ajaxParam.url,
                data:ajaxParam.data,
                async: false,
                success: function (res) {
                    if (res.result === 200) {
                        return obj = ajaxParam.handleData(res);
                    }
                }

            });
            this.setState({ data:obj })
        }

        render () {
            return <WrappedComponent data={this.state.data} />
        }
    }
    return NewComponent
}