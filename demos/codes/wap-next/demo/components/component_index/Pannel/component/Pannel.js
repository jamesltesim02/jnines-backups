import React,{Component} from 'react';
import '../css/pannel.css';
class Pannel extends Component{


    render(){
        return(
                <div className={'nb_index_pannel'}>
                    <div id={'nb_search_wrap'}>
                        <span className={'nb_search_input'}>{this.props.language.ind12}</span>
                    </div>
                    <div id={'nb_pannelTypes_wrap'}>

                        <div className={'nb_pannel_row'}>
                            <a className={'nb_link_live'} href="#"><i></i><p>{this.props.language.ind01}</p></a>
                            <a className={'nb_link_today'} href="#"><i></i><p>{this.props.language.ind02}</p></a>
                            <a className={'nb_link_early'} href="#"><i></i><p>{this.props.language.ind03}</p></a>
                            <a className={'nb_link_football'} href="#"><i></i><p>{this.props.language.ind04}</p></a>
                            <a className={'nb_link_basketball'} href="#">
                                <i>
                                    <span className={'nb_basket_01'}></span>
                                    <span className={'nb_basket_02'}></span>
                                    <span className={'nb_basket_03'}></span>
                                    <span className={'nb_basket_04'}></span>
                                    <span className={'nb_basket_05'}></span>
                                </i>
                                <p>{this.props.language.ind05}</p>
                            </a>

                        </div>
                        <div className={'nb_pannel_row'}>
                            <a className={'nb_link_tennis'} href="#"><p>{this.props.language.ind06}</p></a>
                        </div>
                    </div>
                </div>
        )
    }
}
export default Pannel