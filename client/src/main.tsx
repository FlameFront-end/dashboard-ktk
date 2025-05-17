import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { App, ConfigProvider, message } from 'antd'
import { ThemeProvider } from 'styled-components'
import dayjs from 'dayjs'
import 'dayjs/locale/ru'
import ru_RU from 'antd/lib/locale/ru_RU'

import RouterProvider from './router/RouterProvider'
import { store } from './store/configureStore.ts'
import { darkTheme, antdTheme } from '@/core'

import 'antd/dist/reset.css'
import 'react-toastify/dist/ReactToastify.css'
import 'react-loading-skeleton/dist/skeleton.css'
import '@coreui/coreui/dist/css/coreui.min.css'
import './styles/reset.css'
import './styles/app.css'

const container = document.getElementById('root') as HTMLElement
const root = createRoot(container)

dayjs.locale('ru')

message.config({
	duration: 2
})

root.render(
	<Provider store={store}>
		<ConfigProvider theme={antdTheme} locale={ru_RU}>
			<App>
				<ThemeProvider theme={darkTheme}>
					<RouterProvider />
				</ThemeProvider>
			</App>
		</ConfigProvider>
	</Provider>
)
