import React, {Suspense} from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import Canvas from './Canvas'
import {ChakraProvider} from '@chakra-ui/react'
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import {RecoilRoot} from 'recoil'
import {Atom} from './examples/Atom'
import {Selectors} from './examples/Selectors'
import {Async} from './examples/Async'
import {AtomEffects_singleAtom} from './examples/AtomEffects_singleAtom'
import {AtomEffects} from './examples/AtomEffects_atomFamily'

ReactDOM.render(
    <React.StrictMode>
        <RecoilRoot>
            <ChakraProvider>
                <Router>
                    <Switch>
                        <Route path="/examples/atoms">
                            <Atom />
                        </Route>
                        <Route path="/examples/selectors">
                            <Selectors />
                        </Route>
                        <Route path="/examples/atomeffects/single">
                            <AtomEffects_singleAtom />
                        </Route>
                        <Route path="/examples/atomeffects/family">
                            <AtomEffects />
                        </Route>
                        <Route path="/examples/async">
                            <Suspense fallback={<div>Loading...</div>}>
                                <Async />
                            </Suspense>
                        </Route>
                        <Route>
                            <Canvas />
                        </Route>
                    </Switch>
                </Router>
            </ChakraProvider>
        </RecoilRoot>
    </React.StrictMode>,
    document.getElementById('root'),
)
