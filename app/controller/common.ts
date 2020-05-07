import { Controller } from 'egg';

export default class CommonController extends Controller {
  public healthExamination() {
    this.ctx.success();
  }
}
