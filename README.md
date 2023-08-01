# Prototype for a DndKit implementation with a Reusable Blocks Bank

## Libraries
- Typescript
- DndKit (@dnd-kit/core, @dnd-kit/sortable): https://docs.dndkit.com/
- Styled Components

## Architecture 

### Components

`App.tsx`
- Contains state for blocks bank (draggable blocks)
- Contains state for preview blocks (blocks live in `AppPreview.tsx`
- Contains all `DndConext` functionality
  - onDragOver: handles drag overlay, sets preview blocks to pull in new draggable (`setPreviewBlocks(arrayMove(previewBlocks, active_index, over_index) 
  - handleDragEnd: drag end logic (checks for droppable placement, logic for replacing a draggable block that has been pulled into blocksPreview
  - onDragStart: sets active draggable state and active draggable origin state
  - onDragCancel: resets active draggable state and active draggable origin state to null

`AppPreview.tsx`
- Contains `SortableContext` (https://docs.dndkit.com/presets/sortable/sortable-context)
  - items props iterates through the blocks that have been added to the app preview
- Inside of `SortableContext` component, a ref from the `useDroppable` hook is applied to the div that encompasses the block items that are iterated through 

`DraggableItem.tsx`
- Contains `useDraggable` hook from dnd-kit/core
- Receives id from available draggables that are iterated through in App.jsx (aka: bank blocks)

`SortableItem.tsx`
- Contains `useSortableHook` (https://docs.dndkit.com/presets/sortable/usesortable)
  - In addition to the attributes, listeners,transform and setNodeRef arguments (also provided by `useDraggable` hook) a transition argument is provided as well
  - transition: disables transform transitions while not dragging, but ensures that items transition back to their final positions when the drag operation is ended or cancelled
