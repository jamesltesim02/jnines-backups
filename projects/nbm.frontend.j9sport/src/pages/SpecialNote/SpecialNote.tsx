import React from 'react';
import SimpleBar from "simplebar-react";
import M from '../../components/common/m'
// import Navs from "../../components/common/Navs";
import Back from "../Member/Settings/Back";

const BBS_LINK = 'https://lgclub.com/community/details?id=2039019'

// const navs = [
//   {
//     textKey: 'pages.special_rules',
//     path: '/specialnote'
//   }
// ];

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
    <SimpleBar className="special-note">
      {/* <Navs list={navs} /> */}
      <Back title={<M id="pages.special_rules" />} />
      <div className="content">
        <section className="container">
          {/* <span className="header">
            <M id="pages.special_rules" />
          </span> */}
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
                              <M id="pages.special_note.bbc" />
                            </a>
                          )
                        }}
                      />
                    ) : (<M id={item} />)
                  }
                </li>
              ))
            }
          </ol>
        </section>
      </div>
    </SimpleBar>
  );
};

export default SpecialNote;