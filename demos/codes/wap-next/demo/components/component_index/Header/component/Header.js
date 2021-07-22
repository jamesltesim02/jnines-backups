import React,{Component} from 'react';
import '../css/header.css';
import AjaxComponent from '../../../../HigherComponnent/AjaxComponent';
import server from '../../../../server_config'
class Header extends Component{
    render(){
        return(

                <div id={'nb_index_header'}>
                    <div className={'nb_header_left clearfix'}>
                        <span className={'nb_side_menu'}></span>
                        {/*<span className={'nb_logo'}></span>*/}
                        <img src={require('../img/logo.svg')} style={{height:'1rem'}} alt=""/>
                    </div>
                    <div className={'nb_header_right'}>

                    </div>
                </div>

        )
    }
}


let AjaxHeader=AjaxComponent(Header,{
    url:server.homeMatch,
    data:{
            hot: 1,
            gtp: '16,18',
            level: 2,
            bstage: '0,1000,2000',
            bcontent: 1,
            sortBy: 'sortByTime'
        },
    async:false,
    handleData:function (res) {
        return res.data
    }
})

export default AjaxHeader