import React, { FC } from 'react'
import { BlockSquare } from '../styles/Blocks'
import { useDraggable } from '@dnd-kit/core'

interface Props {
    id: string | number
    color: string
}

export const DraggableItem: FC<Props> = ({ id, color }) => {
    const { attributes, listeners, setNodeRef } = useDraggable({
        id,
    })

    const style = {
        color: 'white',
        border: '1px dashed black',
    }

    return (
        <li ref={setNodeRef} style={style} {...attributes} {...listeners}>
            <BlockSquare color={color}>{id}</BlockSquare>
        </li>
    )
}
