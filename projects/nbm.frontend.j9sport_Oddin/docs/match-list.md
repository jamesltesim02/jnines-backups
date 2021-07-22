```typescript
type MatchFilterProps = {
  /** 当前体育项 */
  sportId: Sports,
  /** 当前可被用于筛选的联赛列表 */
  tourIds?: [],
  /** 当前状态 */
  state: number,
  /**  是否需要显示状态栏 */
  statable: boolean,
  /** 是否需要显示时间筛选栏 */
  datable: boolean,
  /** 是否需要显示体育类型筛选栏 */
  sportable: boolean,
  /** 更新事件 */
  onChange: function (
    {
      state?: number,
      sportId?: Sports,
      tourIds?: Array<string>,
      date?: Date,
      times?: Array<Date>
    }
  ) 
}

function MatchFilter (props: MatchFilterProps): JSX.Element {}
```

* 状态筛选 (推荐, 滚球, 今日, 早盘, 串关, 赛果, 直播)
  1. 具体体育项目页面才会显示
  2. 滚球,今日,早盘通过接口查询
    接口: http://docs.nbmm.co:39999/pages/viewpage.action?pageId=8061096 
  3. 其他项手动添加
    参考值: 参考枚举 0:早盘 -1:今日 1:滚球 99:串关 100:即将开赛
    推荐的值需要和ted确认
    赛果直播待确认
  ** 查询比赛接口:
    http://docs.nbmm.co:39999/pages/viewpage.action?pageId=8061047

* 时间筛选
  1. 我的赛程, 滚球, 状态为推荐 不显示时间筛选
  2. 如果状态为早盘,串关, 则从接口查询
    接口: http://docs.nbmm.co:39999/pages/viewpage.action?pageId=8061054
  3. 今日,构造今日时间段 (取时间戳)
    从中午12点至明日中午12点 (12-16, 16-20, 20-24, 0-4, 4-8, 8-12, 0-4, 4-8, 8-12)
    只显示当前时间以后的时间段 (当前段以now的时间戳开始)
  4. 赛果当前时间往前推15天 (取日期)
  5. 直播 当前时间往后推7天
  
* 联赛筛选
  1. 从接口查询 (我的赛程, 赛果, 直播 除外)
    接口: http://docs.nbmm.co:39999/pages/viewpage.action?pageId=8061052
  2. 我的赛程, 赛果, 直播
    从查询到的比赛数据中摘取

* 球类筛选
  1. 只会在一级赛果和直播页面显示

