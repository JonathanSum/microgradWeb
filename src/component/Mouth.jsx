import React from 'react'
import { arc } from 'd3';
const Mouth = ({
  mouthRadius,
  mouthWidth
}) => {
  const mouthArc = arc()
    .innerRadius(mouthRadius)
    .outerRadius(mouthRadius + mouthWidth)
    .startAngle(Math.PI / 2).endAngle(Math.PI * 1.5)
  return (
    <>
      <path d={mouthArc()} />
    </>
  )
}

export default Mouth