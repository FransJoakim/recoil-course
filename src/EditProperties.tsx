import {InputGroup, InputRightElement, NumberInput, NumberInputField, Text, VStack} from '@chakra-ui/react'
import {selector, selectorFamily, useRecoilState, useRecoilValue} from 'recoil'
import {selectedElementState} from './Canvas'
import {elementState} from './components/Rectangle/Rectangle'
import _ from 'lodash'
import produce from 'immer'
import {ImageInfo, ImageLoading} from './components/ImageInfo'
import {Suspense} from 'react'

export const editProperty = selectorFamily<any, {path: string; id: number}>({
    key: 'editProperty',
    get:
        ({path, id}) =>
        ({get}) => {
            const element = get(elementState(id))
            return _.get(element, path)
        },
    set:
        ({path, id}) =>
        ({get, set}, newValue) => {
            const element = get(elementState(id))
            const newElement = produce(element, (draft) => {
                _.set(draft, path, newValue)
            })

            set(elementState(id), newElement)
        },
})

// The selector uses the above selector, editProperty, but adds a layer that makes sure the aspect-ratio of an an image stays in tact
const editSize = selectorFamily<any, {dimension: 'width' | 'height'; id: number}>({
    key: 'editSize',
    get:
        ({dimension, id}) =>
        ({get}) => {
            return get(editProperty({path: `style.size.${dimension}`, id}))
        },
    set:
        ({dimension, id}) =>
        ({get, set}, newValue) => {
            const hasImage = get(editProperty({path: 'image', id})) !== undefined
            if (!hasImage) {
                set(editProperty({path: `style.size.${dimension}`, id}), newValue)
                return
            }

            const size = editProperty({path: 'style.size', id})
            const {width, height} = get(size)
            const aspectRation = width / height

            if (dimension === 'width') {
                set(size, {
                    width: Math.round(newValue),
                    height: Math.round(newValue / aspectRation),
                })
            } else {
                set(size, {
                    height: Math.round(newValue),
                    width: Math.round(newValue * aspectRation),
                })
            }
        },
})

const hasImageState = selector({
    key: 'hasImage',
    get: ({get}) => {
        const elementId = get(selectedElementState)
        if (elementId == null) return

        const element = get(elementState(elementId))
        return element.image !== undefined
    },
})

export const EditProperties = () => {
    const selectedElementId = useRecoilValue(selectedElementState)
    const hasImage = useRecoilValue(hasImageState)
    if (selectedElementId == null) return null

    return (
        <Card>
            <Section heading="Position">
                <Property label="Top" path="style.position.top" id={selectedElementId} />
                <Property label="Left" path="style.position.left" id={selectedElementId} />
            </Section>
            <Section heading="Size">
                <SizeProperty label="Width" dimension="width" id={selectedElementId} />
                <SizeProperty label="Height" dimension="height" id={selectedElementId} />
            </Section>
            {hasImage && (
                <Section heading="Image">
                    <Suspense fallback={<ImageLoading />}>
                        <ImageInfo />
                    </Suspense>
                </Section>
            )}
        </Card>
    )
}

const Section: React.FC<{heading: string}> = ({heading, children}) => {
    return (
        <VStack spacing={2} align="flex-start">
            <Text fontWeight="500">{heading}</Text>
            {children}
        </VStack>
    )
}

// The following components render out the property-component using different selector-states; one adjusting for aspect-ratio and the other not
const SizeProperty = ({label, dimension, id}: {label: string; dimension: 'width' | 'height'; id: number}) => {
    const [value, setValue] = useRecoilState(editSize({dimension, id}))

    return <PropertyInput label={label} value={value} onChange={setValue} />
}
const Property = ({label, path, id}: {label: string; path: string; id: number}) => {
    const [value, setValue] = useRecoilState(editProperty({path, id}))

    return <PropertyInput label={label} value={value} onChange={setValue} />
}

const PropertyInput = ({label, value, onChange}: {label: string; value: number; onChange: (value: number) => void}) => {
    return (
        <div>
            <Text fontSize="14px" fontWeight="500" mb="2px">
                {label}
            </Text>
            <InputGroup size="sm" variant="filled">
                <NumberInput value={value} onChange={(_, value) => onChange(value)}>
                    <NumberInputField borderRadius="md" />
                    <InputRightElement pointerEvents="none" children="px" lineHeight="1" fontSize="12px" />
                </NumberInput>
            </InputGroup>
        </div>
    )
}

const Card: React.FC = ({children}) => (
    <VStack
        position="absolute"
        top="20px"
        right="20px"
        backgroundColor="white"
        padding={2}
        boxShadow="md"
        borderRadius="md"
        spacing={3}
        align="flex-start"
        onClick={(e) => e.stopPropagation()}
    >
        {children}
    </VStack>
)
