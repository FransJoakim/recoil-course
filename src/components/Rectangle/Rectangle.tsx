import {Suspense} from 'react'
import {useRecoilState, atomFamily} from 'recoil'
import {selectedElementState} from '../../Canvas'
import {Drag} from '../Drag'
import {Resize} from '../Resize'
import {RectangleContainer} from './RectangleContainer'
import {RectangleInner} from './RectangleInner'
import {RectangleLoading} from './RectangleLoading'

export type ElementStyle = {
    position: {top: number; left: number}
    size: {width: number; height: number}
}

export type Element = {
    image?: {id: number; src: string}
    style: ElementStyle
}

export const defaultElement = {
    style: {
        position: {top: 100, left: 100},
        size: {width: 250, height: 250},
    },
}

export const elementState = atomFamily<Element, number>({
    key: 'element',
    default: defaultElement,
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
                            ...element,
                            style: {
                                ...element.style,
                                position,
                            },
                        })
                    }}
                >
                    <div>
                        <Suspense fallback={<RectangleLoading selected={seleceted} />}>
                            <RectangleInner selected={seleceted} id={id} />
                        </Suspense>
                    </div>
                </Drag>
            </Resize>
        </RectangleContainer>
    )
}
