import {Container, Heading, Text} from '@chakra-ui/layout'
import {Button} from '@chakra-ui/react'
import {Select} from '@chakra-ui/select'
import {Suspense} from 'react'
import {ErrorBoundary, FallbackProps} from 'react-error-boundary'
import {atom, atomFamily, selector, selectorFamily, useRecoilState, useRecoilValue, useSetRecoilState} from 'recoil'
import {getWeather} from './fakeAPI'

const userIdState = atom<number | undefined>({
    key: 'userId',
    default: undefined,
})

const userState = selectorFamily({
    key: 'user',
    get: (userId: number) => async () => {
        const userData = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`).then((data) => data.json())
        if (userId === 4) throw new Error('The user does not exist')
        return userData
    },
})

// The bellow atomFamily and function is are used to refresh cashed data that Recoil stores when fetching async --- Not working
const weatherRequestIdState = atomFamily({
    key: 'weatherRequestId',
    default: 0,
})
const useRefetchWeather = (userId: number) => {
    const setRequestId = useSetRecoilState(weatherRequestIdState(userId))
    setRequestId((id) => id + 1)
}

const weatherState = selectorFamily({
    key: 'weatherState',
    get:
        (userId: number) =>
        async ({get}) => {
            get(weatherRequestIdState(userId))

            const user = get(userState(userId))
            const weather = await getWeather(user.address.city)
            return weather
        },
})

const UserWeather = ({userId}: {userId: number}) => {
    const user = useRecoilValue(userState(userId))
    const weatherAtLocation = useRecoilValue(weatherState(userId))
    const refetch = useRefetchWeather(userId)
    return (
        <div>
            <Text>
                <b>Weather for {user.address.city}:</b> {weatherAtLocation}℃
            </Text>
            {/* @ts-ignore */}
            <Text onClick={refetch}>Refetch weather</Text>
        </div>
    )
}

const UserData = ({userId}: {userId: number}) => {
    const user = useRecoilValue(userState(userId))
    return (
        <div>
            <Heading as="h2" size="md" mb={1}>
                User data:
            </Heading>
            <Text>
                <b>Name:</b> {user.name}
            </Text>
            <Text>
                <b>Phone:</b> {user.phone}
            </Text>
            <Suspense fallback={<div>Loading weather...</div>}>
                <UserWeather userId={userId} />
            </Suspense>
        </div>
    )
}

const ErrorFallback = ({error, resetErrorBoundary}: FallbackProps) => {
    return (
        <div>
            <Heading as="h2" size="md" mb={1}>
                Something went wrong
            </Heading>
            <Text>{error.message}</Text>
            <Button onClick={resetErrorBoundary}>OK</Button>
        </div>
    )
}

export const Async = () => {
    const [userId, setUserId] = useRecoilState(userIdState)

    return (
        <Container py={10}>
            <Heading as="h1" mb={4}>
                View Profile
            </Heading>
            <Heading as="h2" size="md" mb={1}>
                Choose a user:
            </Heading>
            <Select
                placeholder="Choose a user"
                mb={4}
                value={userId}
                onChange={(event) => {
                    const value = event.target.value
                    setUserId(value ? parseInt(value) : undefined)
                }}
            >
                <option value="1">User 1</option>
                <option value="2">User 2</option>
                <option value="3">User 3</option>
                <option value="4">User 4</option>
            </Select>
            <ErrorBoundary
                FallbackComponent={ErrorFallback}
                onReset={() => {
                    setUserId(undefined)
                }}
                resetKeys={[userId]}
            >
                <Suspense fallback={<div>Loading...</div>}>
                    {userId !== undefined && <UserData userId={userId} />}
                </Suspense>
            </ErrorBoundary>
        </Container>
    )
}
