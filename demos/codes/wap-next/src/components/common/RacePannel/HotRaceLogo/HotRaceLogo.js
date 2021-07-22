import React, {Component} from 'react';
import './HotRaceLogo.css';
import MatchIcon from '@/components/common/icons/MatchIcon/MatchIcon';

class HotRaceLogo extends Component {

    constructor(){
        super();
        this.nextRaces=this.nextRaces.bind(this);
        this.page=1;
    }
    nextRaces(){
        this.page++;
        this.props.changeRace({
            page:this.page
        })
    }
    render() {
        return (
            <a className="nb_change_races" onClick={this.nextRaces}>
                <div className="nb_iconitem">
                    <MatchIcon />
                </div>
                <p className="nb_iconitemp color_60">换一批</p>
            </a>

        )
    }
}

export default HotRaceLogo