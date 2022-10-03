import {atom, useRecoilState, useRecoilValue} from 'recoil'

const darkmodeState = atom({
    key: 'darkmode',
    default: false,
})

const DarkmodeSwitch = () => {
    const [darkmode, setDarkmode] = useRecoilState(darkmodeState)

    return <input type="checkbox" onChange={() => setDarkmode(!darkmode)} />
}

const Button = () => {
    const darkmode = useRecoilValue(darkmodeState)

    return (
        <button style={{color: darkmode ? 'white' : 'black', backgroundColor: darkmode ? 'black' : 'white'}}>
            Why am I a button!?
        </button>
    )
}

export const Atom = () => {
    return (
        <div>
            <div>
                <DarkmodeSwitch />
            </div>
            <div>
                <Button />
            </div>
        </div>
    )
}
