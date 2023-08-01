import React, { useState } from 'react'

import {
    DndContext,
    DragEndEvent,
    DragOverEvent,
    DragOverlay,
    UniqueIdentifier,
} from '@dnd-kit/core'
import { rectIntersection } from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'

import { DraggableItem } from './components/DraggableItem'

import { Row, Col, Item } from './styles/Grid'
import { AppPreview } from './components/AppPreview'
import { BlockSquare } from './styles/Blocks'

const id_gen = (() => {
    let id = 0
    return () => id++
})()

export interface ItemType {
    id: UniqueIdentifier
    color: string
}

const App = () => {
    const [draggables, setDraggables] = useState([
        { color: '#000000', id: id_gen(), origin: 'searchable-block' },
        { color: '#32dddd', id: id_gen(), origin: 'banner-block' },
    ])

    const [previewBlocks, setPreviewBlocks] = useState<ItemType[]>(() =>
        ['red', 'green', 'blue'].map((color) => ({ id: id_gen(), color }))
    )

    const [activeDraggable, setActiveDraggable] = useState<ItemType | null>(
        null
    )
    const [activeDraggableOrigin, setActiveDraggableOrigin] = useState<
        string | null
    >(null)

    const handleDragEnd = ({ active, over }: DragEndEvent) => {
        if (!over) {
            setActiveDraggable(null)
            setActiveDraggableOrigin(null)
            return
        }

        const findDraggable = draggables.find(
            (draggable) => draggable.id === active.id
        )
        const findDraggableIndex = draggables.findIndex(
            (draggable) => draggable.id === active.id
        )

        if (over.id === findDraggable?.id || over.id === 'previewBlocks') {
            const updatedDraggables = [...draggables]
            updatedDraggables[findDraggableIndex].color = getItem(
                active.id
            )?.color
            updatedDraggables[findDraggableIndex].id = id_gen()
            updatedDraggables[findDraggableIndex].origin = findDraggable.origin

            setDraggables(updatedDraggables)
        }
        setActiveDraggable(null)
        setActiveDraggableOrigin(null)
    }

    const getItem = (id: UniqueIdentifier) => {
        const findDraggable = draggables.find(
            (draggable) => draggable.id === id
        )

        if (findDraggable) return { id, color: findDraggable.color }
        return previewBlocks.find((x) => x.id === id)!
    }

    const onDragOver = ({ active, over }: DragOverEvent) => {
        const findDraggable = draggables.find(
            (draggable) => draggable.id === active.id
        )
        const findDraggableIndex = draggables.findIndex(
            (draggable) => draggable.id === active.id
        )
        if (!over) {
            if (activeDraggableOrigin === null) return
            const indx = previewBlocks.findIndex((x) => x.id === active.id)
            if (indx === -1) return
            setPreviewBlocks(previewBlocks.filter((x) => x.id !== active.id))
            if (activeDraggableOrigin === findDraggable?.origin) {
                const updatedDraggablesState = [...draggables]

                const updatedDraggable = {
                    ...updatedDraggablesState[findDraggableIndex],
                    id: id_gen(),
                }

                updatedDraggablesState[findDraggableIndex] = updatedDraggable

                setDraggables(updatedDraggablesState)
            }
            return
        }

        const active_indx = previewBlocks.findIndex((x) => x.id === active.id)
        const over_indx = previewBlocks.findIndex((x) => x.id === over.id)

        if (active_indx !== -1 && over_indx !== -1) {
            if (active_indx === over_indx) return
            setPreviewBlocks(arrayMove(previewBlocks, active_indx, over_indx))
        } else if (over.id === 'previewBlocks') {
            const blockItem = previewBlocks.findIndex(
                (item) => item.id === active.id
            )

            if (over.id === 'previewBlocks' && blockItem >= 0) {
                return
            }
            if (previewBlocks.findIndex((x) => x.id === active.id) === -1) {
                if (active.id === findDraggable?.id) {
                    setPreviewBlocks([
                        ...previewBlocks,
                        { id: findDraggable.id, color: findDraggable.color },
                    ])
                }
            }
        }
    }

    return (
        <div>
            <DndContext
                onDragStart={({ active }) => {
                    const findActive = draggables.find((draggable) => {
                        return draggable.id === active.id
                    })
                    if (findActive) setActiveDraggableOrigin(findActive.origin)

                    setActiveDraggable(getItem(active.id))
                    if (findActive) setActiveDraggable(getItem(findActive.id))
                    if (findActive) setActiveDraggableOrigin(findActive.origin)
                }}
                onDragOver={onDragOver}
                onDragCancel={() => {
                    setActiveDraggable(null)
                    setActiveDraggableOrigin(null)
                }}
                onDragEnd={handleDragEnd}
                collisionDetection={rectIntersection}
            >
                <Row>
                    <Col>
                        {draggables.map((draggable) => {
                            return (
                                <Item key={draggable.id}>
                                    <p>{draggable.origin}</p>
                                    <DraggableItem
                                        color={draggable.color}
                                        id={draggable.id}
                                    />
                                </Item>
                            )
                        })}
                    </Col>

                    <Col>
                        <p>App Preview</p>
                        <AppPreview items={previewBlocks} />
                    </Col>
                </Row>

                <DragOverlay>
                    {activeDraggable ? (
                        <BlockSquare color={activeDraggable.color} />
                    ) : null}
                </DragOverlay>
            </DndContext>
        </div>
    )
}

export default App
