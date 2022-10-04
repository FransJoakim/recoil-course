import {useRecoilState, atomFamily} from 'recoil'
import {selectedElementState} from '../../Canvas'
import {Drag} from '../Drag'
import {Resize} from '../Resize'
import {RectangleContainer} from './RectangleContainer'
import {RectangleInner} from './RectangleInner'

export type ElementStyle = {
    position: {top: number; left: number}
    size: {width: number; height: number}
}

export type Element = {style: ElementStyle}

export const elementState = atomFamily<Element, number>({
    key: 'element',
    default: {
        style: {
            position: {top: 100, left: 100},
            size: {width: 50, height: 50},
        },
    },
})

export const Rectangle = ({id}: {id: number}) => {
    const [element, setElement] = useRecoilState(elementState(id))
    const [selectedElement, setSelectedElement] = useRecoilState(selectedElementState)

    const seleceted = id === selectedElement

    return (
        <RectangleContainer
            position={element.style.position}
            size={element.style.size}
            onSelect={() => {
                setSelectedElement(id)
            }}
        >
            <Resize
                selected={seleceted}
                position={element.style.position}
                size={element.style.size}
                onResize={(style) => {
                    setElement({
                        ...element,
                        style,
                    })
                }}
            >
                <Drag
                    position={element.style.position}
                    onDrag={(position) => {
                        setElement({
                            style: {
                                ...element.style,
                                position,
                            },
                        })
                    }}
                >
                    <div>
                        <RectangleInner selected={seleceted} />
                    </div>
                </Drag>
            </Resize>
        </RectangleContainer>
    )
}
