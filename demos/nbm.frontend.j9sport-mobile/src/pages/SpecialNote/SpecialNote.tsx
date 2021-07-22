import React from 'react';
import M from '../../components/common/m'
import BackButton from "../../components/common/BackButton";

const BBS_LINK = 'https://lgclub.com/'

const CONTENTS = [
  'pages.special_note.content_1',
  'pages.special_note.content_2',
  'pages.special_note.content_3',
  'pages.special_note.content_4',
  'pages.special_note.content_5',
  'pages.special_note.content_6',
  'pages.special_note.content_7',
];

/* eslint-disable react/jsx-no-target-blank */
const SpecialNote = () => {
  return (
    <div className="special-note">
      <div className="content">
        <section className="container">
          <div className="header dark">
            <BackButton/>
            <M id="pages.special_rules"/>
          </div>
          <ol className="list">
            {
              CONTENTS.map((item, index) => (
                <li key={index}>
                  {
                    index === 6 ? (
                      <M
                        id={item}
                        values={{
                          anchor: (
                            <a target="_blank" href={BBS_LINK} rel="noreferrer">
                              <M id="pages.special_note.bbc"/>
                            </a>
                          )
                        }}
                      />
                    ) : (<M id={item}/>)
                  }
                </li>
              ))
            }
          </ol>
        </section>
      </div>
    </div>
  );
};

export default SpecialNote;