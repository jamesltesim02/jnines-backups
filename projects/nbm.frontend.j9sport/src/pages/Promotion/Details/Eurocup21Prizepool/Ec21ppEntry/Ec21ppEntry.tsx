import React from 'react';
import { CloseCircleOutlined } from '@ant-design/icons';
import { useHistory } from 'react-router-dom';
import mergeClass from '../../../../../utils/mergeClass';
import EntryImage from '../images/pc-fixed-entry@2x.png';
import ReactDOM from 'react-dom';

function Ec21ppEntry () {
  const history = useHistory();
  const [visible, setVisible] = React.useState(true);
  return ReactDOM.createPortal(
    (
      <div className={mergeClass({
        'ec21pp-entry': true,
        visible
      })}>
        <button
          className="icon-button"
          onClick={() => {
            if (!visible) {
              return setVisible(true)
            }
            history.push('/promo-detail/european-cup');
          }}
        >
          <img src={EntryImage} />
        </button>
        <button
          className="close-button"
          onClick={() => setVisible(false)}
        >
          <CloseCircleOutlined />
        </button>
      </div>
    ),
    document.body
  );
}

export default Ec21ppEntry;
