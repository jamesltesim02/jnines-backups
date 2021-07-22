import React,{Component} from 'react';
import './notice.css';
class Notice extends Component{
    render(){
        return(
            <div className={'nb_notices'}>
                <p className="nb_noticesp">这里是消息通知</p>
            </div>
        )
    }
}
export default Notice