* 串关
1. 同比赛投注项不能串
2. 单式点水返回的odds单式赔率, 串关点水返回的odds为串关赔率(comboOdds)

function BetContainer (
  {
    option,
    market,
    match,
    children
  }: {
    option: OptionStore,
    market: MarketStore,
    match: MatchStore,
    children: Function
  }
) {}


<BetContainer>
  {
    (
      {
        checked,
        onToggle,
      }: {
        checked: boolean,
        onToggle: Function,
      }
    ) => (
      <div
        onClick={onToggle}
        className={checked ? 'checked' : ''}
      >
        <label>aaa</label>
        <span>1.80</span>
      </div>
    )
  }
</BetContainer>