import { Controller, Get, Res } from '@nestjs/common'
import { Response } from 'express'

@Controller()
export class AppController {
	@Get()
	getHome() {
		return { message: 'home' }
	}

	@Get('favicon.ico')
	getFavicon(@Res() res: Response) {
		res.status(204).send()
	}
}
