import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { App, ConfigProvider, message } from 'antd'

import RouterProvider from './router/RouterProvider'
import { store } from './store/configureStore.ts'
import { antdTheme } from '@/core'

import dayjs from 'dayjs'
import ru_RU from 'antd/lib/locale/ru_RU'
import 'dayjs/locale/ru'

import 'antd/dist/reset.css'
import '@coreui/coreui/dist/css/coreui.min.css'
import './styles/reset.css'
import './styles/app.css'
import './styles/scrollbar.css'

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
				<RouterProvider />
			</App>
		</ConfigProvider>
	</Provider>
)
