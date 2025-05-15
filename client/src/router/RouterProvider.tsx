import { type JSX } from 'react'
import {
	createBrowserRouter,
	RouterProvider as RouterProviderReact
} from 'react-router-dom'
import { routesConfig } from './entities/routes.config'

const RouterProvider = (): JSX.Element => {
	const router = createBrowserRouter(routesConfig)

	return <RouterProviderReact router={router} key={1} />
}

export default RouterProvider
