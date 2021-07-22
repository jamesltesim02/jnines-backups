import React from 'react';

import M from '../../components/common/m';
import MarketName from '../../components/matchs/MarketName';
import {toOptionName} from '../../components/matchs/OptionName';

function TicketOptionName(options: any) {
	const {
		marketType,
		marketGroup,
		betBar,
		betOption,
		matchName,
		sportId,
		marketStage,
		marketParam,
		odds
	} = options

	const on = toOptionName(
		marketType,
		marketGroup,
		betBar,
		betOption
	);

	let optionName = null;
	if ([1, 16, 186, 14, 153, 9059, 9002].includes(marketType)) {
		if (String(betOption).toLowerCase() === 'home') {
			options.betOption = 1
		}
		if (String(betOption).toLowerCase() === 'away') {
			options.betOption = 2
		}
		optionName = (
			<>
				{
					betOption === 'X'
						? <M id="option.XX"/>
						: matchName.split(' vs ')[Number(options.betOption) - 1]
				}
			</>
		);
	} else {
		optionName = (
			<>
				{on.prefix || ''}
				{
					on.key && (
						<M
							id={`option.${on.key}`}
							values={{
								...on.params,
								betOption: betOption,
								betBar: betBar
							}}
						/>
					)
				}
				{on.value || ''}
			</>
		);
	}
	return (
		<span>
      <span>
        <MarketName
					sportId={sportId}
					marketGroup={marketGroup}
					marketStage={marketStage}
					marketType={marketType}
					marketParam={marketParam}
				/>&nbsp;&nbsp;
				{optionName}
      </span>
			{on.suffix ? <var>{on.suffix || ''}</var> : null}
			@
			{Number(odds).toFixed(2)}
    </span>
	);
}

export default TicketOptionName;