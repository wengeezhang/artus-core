import { ArtusApplication } from '../../../../src/application';
import { Manifest } from '../../../../src/loader';
import Koa from 'koa'
import { Context, Input, MiddlewareInput } from '@artus/pipeline';
import { Container } from '@artus/injection';
import { DefaultContext } from 'koa';
import compose from 'koa-compose'

export class XApplication extends ArtusApplication{
    private server: Koa; // protocol-related dep (koa/express/fastify/hapi)
    private manifestItems: Manifest;
    constructor(initOpts: {manifest: string}){
        super()
        // can be replaced by express/fastify/hapi, even a rpc server
        this.server = new Koa(); 
        
        this.manifestItems = XApplication.getJson(initOpts.manifest);
    }

    // prepare
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

    // start: ship routes and listen
    async start(port){
        // create link between "protocol-related dep (koa/express/fastify/hapi)" and "artus trigger"
        this.server.use(async (koaCtx: DefaultContext) => {
            const input = new Input();
            const { req, res } = koaCtx;
            input.params = { koaCtx, req, res };
            await this.trigger.startPipeline(input);
          });
        // step3: start
        this.server.listen(port);
    }

    // prepare protocol-related middlewares and controllers
    // find by decorators in container
    async protocolHandles(container: Container): Promise<MiddlewareInput[]>{
        // middlewares
        const middlewares = [];

        // may be more aop handlers: filter、interceptor
        // const filters = [];
        // const interceptors = [];

        // controllers
        const controllers = [];
        {
            // todo: how to get all controllers?
            // const controllers = await container.getAsync();
        }
        const result = [];
        result.push(...middlewares);
        // result.push(...filters);
        // result.push(...interceptors);
        result.push(compose(controllers));

        return result;
    }


    static getJson(manifest): Manifest{
        return require(manifest);
    }
}