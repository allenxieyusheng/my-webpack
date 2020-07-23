
import { add } from './add.js'
export const say = function (str) {
	return str + add();
}