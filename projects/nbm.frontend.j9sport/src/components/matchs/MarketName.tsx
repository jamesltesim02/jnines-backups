import React from 'react';
import M from '../common/m';

function MarketName (
  {
    sportId,
    marketGroup,
    marketStage,
    marketType,
    marketParam
  }: {
    sportId: number,
    marketGroup: number,
    marketStage: number,
    marketType: number,
    marketParam?: number
  }
) {
  return (
    <M
      id={`market.${sportId}.${marketGroup}_${marketStage}_${marketType}`}
      values={{ y: marketParam }}
    />
  );
}

export default MarketName;
