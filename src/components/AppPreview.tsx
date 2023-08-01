import React, { FC } from 'react'
import styled from 'styled-components'
import type { ItemType } from '../App'

import { SortableContext, rectSortingStrategy } from '@dnd-kit/sortable'
import { useDroppable } from '@dnd-kit/core'

import { Item } from '../styles/Grid'
import { SortableItem } from './SortableItem'

const List = styled.ul`
    min-width: 200px;
    padding: 20px 10px;
    border: 1px solid black;
    border-radius: 5px;
    list-style-type: none;
`

interface Props {
    items: ItemType[]
    width?: string
}

export const AppPreview: FC<Props> = ({ items }) => {
    const { setNodeRef } = useDroppable({ id: 'previewBlocks' })

    return (
        <SortableContext
            items={items.map((item) => item.id)}
            strategy={rectSortingStrategy}
        >
            <List ref={setNodeRef}>
                {items.map(({ id, color }) => (
                    <Item key={id}>
                        <SortableItem color={color} id={id} />
                    </Item>
                ))}
            </List>
        </SortableContext>
    )
}
