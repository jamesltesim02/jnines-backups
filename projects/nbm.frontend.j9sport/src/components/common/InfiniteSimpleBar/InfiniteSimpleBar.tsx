import React, { useEffect, useRef } from 'react';
import { throttle } from "lodash";
import mergeClass from "../../../utils/mergeClass";
import SimpleBar from "simplebar-react";
import LoadingBar from "../LoadingBar";

function InfiniteSimpleBar(
  {
    className,
    children,
    loading,
    onLoadMore,
    hasMore
  }: {
    className: string
    children: any,
    onLoadMore?: () => void
    hasMore: boolean
    loading: boolean
  }
) {
  const scrollRef: any = useRef(null)
  useEffect(() => {
    const scrollEl = scrollRef.current?.getScrollElement()
    const loadMore = throttle((event: any) => {
      if (event.target.clientHeight >= event.target.scrollHeight - event.target.scrollTop) {
        if (!loading && hasMore && onLoadMore) {
          onLoadMore()
        }
      }
    }, 500)
    if (scrollEl) {
      scrollEl.addEventListener('scroll', loadMore)
    }
    return () => {
      scrollEl?.removeEventListener('scroll', loadMore)
    }
  })
  return (
    <SimpleBar
      ref={scrollRef}
      className={mergeClass({
        [className]: !!className
      })}
    >
      {children}
      {loading ? (<LoadingBar/>) : null}
    </SimpleBar>
  );
}

export default InfiniteSimpleBar;