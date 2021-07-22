const Controller = require('egg').Controller

class UserController extends Controller {
    async create() {
        let {ctx, service} = this
        let user = await service.user.create(ctx.request.body)
        ctx.body = {
            success: true,
            data: user
        }
    }
    async login() {
        let {ctx, service} = this
        let user = ctx.request.body
        try {
            ctx.body = {
                success: true,
                data: await service.user.login(user)
            }
            ctx.status = 200
        } catch(e) {
            ctx.body = {
                success: false,
                message: e.message
            }
        }
    }
}

module.exports = UserController