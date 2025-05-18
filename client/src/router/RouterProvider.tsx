import type { FC } from 'react'
import {
	createBrowserRouter,
	RouterProvider as RouterProviderReact
} from 'react-router-dom'
import { routesConfig } from './entities/routes.config'

const RouterProvider: FC = () => {
	const router = createBrowserRouter(routesConfig)

	return <RouterProviderReact router={router} />
}

export default RouterProvider
