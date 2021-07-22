import { Toast } from 'antd-mobile';
import dayjs from 'dayjs';
import React from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import { useIntl } from 'react-intl';
import { useHistory, useLocation } from 'react-router';
import { useApi } from '../../apis';
import Promotion from '../../apis/Promotion';
import EmptyList from '../../components/common/EmptyList';
import LoadingBar from '../../components/common/LoadingBar';
import NavBar from '../../components/common/NavBar';

import memberStore from '../../stores/member';
import mergeClass from '../../utils/mergeClass';

/* eslint-disable react-hooks/exhaustive-deps */
function RedEnvelopeRecords () {
  const intl = useIntl();
  const history = useHistory();
  const location = useLocation();
  const { promotion }: { promotion: Promotion } = useApi({ promotion: Promotion });

  const { isLoged } = memberStore;

  const [loading, setLoading] = React.useState(true);
  const [hasMore, setHasMore] = React.useState(true);
  const [pageIndex, setPageIndex] = React.useState(1);
  const [list, setList] = React.useState<any>([]);

  React.useEffect(
    () => {
      if (!isLoged) {
        Toast.fail(intl.formatMessage({ id: 'common.sign_first' }));
        setTimeout(
          () => history.replace(`/login?from=${location.pathname}`),
          1500
        );
        return;
      }
      if (!hasMore) {
        return;
      }
      setLoading(true);
      promotion.getMyRedEnvelopes({ pageIndex }).then(
        (result: any) => {
          if (result.list?.length > 0) {
            if (pageIndex === 1) {
              setList(result.list);
            } else {
              setList((old: any) => ([...old, ...result.list]))
            }
          } else {
            setHasMore(false);
          }
        }
      ).finally(
        () => setLoading(false)
      );
    },
    [promotion, pageIndex, setLoading, setHasMore, setList]
  );

  return (
    <>
      <NavBar title={intl.formatMessage({id: 'pages.red_record'})} />
      <InfiniteScroll
        initialLoad={false}
        hasMore={hasMore}
        pageStart={0}
        useWindow
        className={mergeClass('scrollable-match-list', '')}
        loadMore={() => {
          if (hasMore && !loading) {
            setPageIndex(pageIndex + 1)
          }
        }}
      >
      {
        list.length ? (
          <>
          {
            list.map((item: any, index: number) => (
              <div
                key={index}
                className="record-item"
              >
                <div>
                  <label>{item.tournamentName}</label>
                  <span>{item.matchName}</span>
                </div>
                <var>{item.amount}</var>
                <time>{dayjs(+item.createTime).format('MM/DD HH:mm')}</time>
              </div>
            ))
          }
          {
            loading
            ? <LoadingBar />
            : null
          }
          </>
        ) : (
          <div className="scrollable-match-list fullscreen">
          {
            loading
            ? <LoadingBar className="full"/>
            : <EmptyList />
          }
          </div>
        )
      }
      </InfiniteScroll>
    </>
  );
}

export default RedEnvelopeRecords;
