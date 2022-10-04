import React, {Suspense} from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import Canvas from './Canvas'
import {ChakraProvider} from '@chakra-ui/react'
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import {RecoilRoot} from 'recoil'
import {Atom} from './example/Atom'
import {Selectors} from './example/Selectors'
import {Async} from './example/Async'

ReactDOM.render(
    <React.StrictMode>
        <RecoilRoot>
            <ChakraProvider>
                <Router>
                    <Switch>
                        <Route path="/example/atoms">
                            <Atom />
                        </Route>
                        <Route path="/example/selectors">
                            <Selectors />
                        </Route>
                        <Route path="/example/async">
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
