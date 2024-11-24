import React from 'react'
import useCanvas from '../canvas/UseCanvas'


const Canvas = (props) => {
    const { draw, ...rest } = props
    const ref = useCanvas(draw)


    return (
        <canvas ref={ref} {...rest} />
    )
}

export default Canvas