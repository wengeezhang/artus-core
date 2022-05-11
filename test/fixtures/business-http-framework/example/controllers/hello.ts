import { Controller } from '../../src/decorator'
import { ScopeEnum } from '@artus/injection'
import { getEventListeners } from 'koa';

@Controller({
  scope: ScopeEnum.EXECUTION
})
export default class HelloController {
  async index () {
    return {
      status: 200,
      content: 'Hello Artus'
    };
  }
}