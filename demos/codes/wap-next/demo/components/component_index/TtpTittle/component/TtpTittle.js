import React,{Component} from 'react';
import commen from '../../../../assets/js/commenFunc';
import '../css/ttpTittle.css';
export default class TtpTittle extends Component{
    constructor(props){

        super(props);
        this.state={


        };

    }
    componentWillMount(){


    }
    render(){


        return(

                <div className="nb_ttp_title" id="early">
                    <a className={'nb_timeType'}>{this.props.ttpName}</a>
                </div>

        )
    }
}