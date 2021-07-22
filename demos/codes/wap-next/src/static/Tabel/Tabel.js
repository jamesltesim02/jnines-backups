import React,{Component} from 'react';
import './Tabel.css';

class Tabel extends Component{
    render(){
        return(
            <div className="nb_Tabelbox">
            {/* 主客标题 */}
                <div className="nb_Tabeltit">
                    <div className="nb_Tabeltitpage">
                        <p>主</p>
                        <p>客</p>
                    </div>
                    <div className="nb_Tabeltitpage">
                        <p>主</p>
                        <p>客</p>
                    </div>
                </div>
            {/* 主客数据 */}
                <div className="nb_TabelItems">
                    <div className="nb_TabelItemspage">
                        <p>2.5</p>
                        <p>1.890</p>
                    </div>
                    <div className="nb_TabelItemspage">
                        <p>2.5</p>
                        <p>1.890</p>
                    </div>
                    <div className="nb_TabelItemspage">
                        <p>2.5</p>
                        <p>1.890</p>
                    </div>
                    <div className="nb_TabelItemspage">
                        <p>2.5</p>
                        <p>1.890</p>
                    </div>
                </div>
                <div className="nb_TabelItems">
                    <div className="nb_TabelItemspage nb_curret">
                        <p>2.5</p>
                        <p>1.890</p>
                    </div>
                </div>
                <div className="nb_TabelItems">
                <div className="nb_TabelItemspage">
                        <p>2.5</p>
                        <p>1.890</p>
                    </div>
                    <div className="nb_TabelItemspage">
                        <p>2.5</p>
                        <p>1.890</p>
                    </div>
                </div>
                <div className="nb_TabelItems">
                    
                </div>
            </div>
        )
    }
}
export default Tabel