import React,{Component} from 'react';
import IndexRace from '../components/component_index/IndexMatch/component/IndexRace';

// import NBBase from '../base.js';

import {indexRaceReducers} from '../reducers/indexRace';

import {connect} from "react-redux";
class IndexRaceContainer extends Component{






        componentWillMount(){
        this.props.hasMatches({
            matches:this.props.race
        })
    }


    render(){
        return(
            <div>

                {this.props.raceReducers.showRace?<IndexRace {...this.props}/>:null}

            </div>

        )
    }
}



const mapStateToProps = (state) => {
    return state
};

const mapDispatchToProps = (dispatch) => {
    return {
        hasMatches: (matchObj) => {
            dispatch(indexRaceReducers.createActions.hasMatches(matchObj))
        },

    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(IndexRaceContainer)




// export default IndexContainer