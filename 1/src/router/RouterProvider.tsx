import { type JSX } from 'react'
import { createBrowserRouter, RouterProvider as RouterProviderReact } from 'react-router-dom'
import { routesConfig } from './entities/routes.config'
import { AnimatePresence } from 'framer-motion'

const RouterProvider = (): JSX.Element => {
    const router = createBrowserRouter(routesConfig)

    return (
        <AnimatePresence mode='wait'>
            <RouterProviderReact router={router} key={1} />
        </AnimatePresence>
    )
}

export default RouterProvider
