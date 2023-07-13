import React from 'react';
import './slider.less';

import { Slider, RangeSlider } from 'rsuite';

export default function StakeSelector() {
    return (
      <RangeSlider defaultValue={[10, 50]} />
    );
  }