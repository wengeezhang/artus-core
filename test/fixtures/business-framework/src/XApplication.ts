import { ArtusApplication } from '../../../../src/application';
import { Manifest } from '../../../../src/loader';
import Koa from 'koa'
import { Context, Input, MiddlewareInput } from '@artus/pipeline';
import { Container } from '@artus/injection';
import { DefaultContext } from 'koa';
import compose from 'koa-compose'

export class XApplication extends ArtusApplication{
    private protocolServer: Koa; // protocol-related dep (koa/express/fastify/hapi)
    private manifestItems: Manifest;
    constructor(initOpts: {manifest: string}){
        super()
        // can be replaced by express/fastify/hapi, even a rpc server
        this.protocolServer = new Koa(); 
        
        this.manifestItems = XApplication.getJson(initOpts.manifest);
    }

    async init(): Promise<void> {
        // step1: call artus/core load: load items to ioc container
        await this.load(this.manifestItems);
        
        // step2: prepare protocol-related middlewares and controllers, 
        // then wrap them in artus/pipeline use "this.trigger.use"
        const middlewareAndHandler = await this.protocolHandles(this.container);
        middlewareAndHandler.forEach((middleware) => {
            this.trigger.use(middleware)
        });
    }

    async start(port){
        // create link between "protocol-related dep (koa/express/fastify/hapi)" and "artus trigger"
        this.protocolServer.use(async (koaCtx: DefaultContext) => {
            const input = new Input();
            const { req, res } = koaCtx;
            input.params = { koaCtx, req, res };
            await this.trigger.startPipeline(input);
          });
        // step3: start
        this.protocolServer.listen(port);
    }

    // prepare protocol-related middlewares and controllers
    // find by decorators in container
    async protocolHandles(container: Container): Promise<MiddlewareInput[]>{
        // middlewares
        const middlewares = [];

        // may be more aop handlers: filter、interceptor
        // ...

        // controllers
        const controllers = [];
        return middlewares.concat(compose(controllers));
    }


    static getJson(manifest): Manifest{
        return require(manifest);
    }
}