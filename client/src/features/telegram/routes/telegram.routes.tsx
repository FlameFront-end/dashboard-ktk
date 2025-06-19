import { telegramPaths } from './telegram.paths.ts'
import { TelegramSettingsForm } from '../pages/TelegramSettingsForm'

export const telegramRoutes = [
	{
		path: telegramPaths.bot,
		element: <TelegramSettingsForm />
	}
]
