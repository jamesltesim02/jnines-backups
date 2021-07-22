import React,{Component} from 'react';
import '../../IndexBetGtp16/css/IndexBetGtp16.css'
class IndexBetGtp18 extends Component{
    render(){
        return(

            <div className={'nb_gtp18_Wrap'}>
                <div className={'nb_gtp18'}>
                    <div className={'nb_gtp18_htn'}>
                        <p className={'nb_gtp18_ovalue'}>大于2</p>
                        <p className={'nb_gtp18_odds'}>1.905</p>
                    </div>
                    <div className={'nb_gtp18_atn'}>
                        <p className={'nb_gtp18_ovalue'}>小于2</p>
                        <p className={'nb_gtp18_odds'}>1.83</p>
                    </div>
                </div>
            </div>

        )
    }
}
export default IndexBetGtp18