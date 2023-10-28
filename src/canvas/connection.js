import CanvasAPI, { minimalErrorHandler } from '@kth/canvas-api';
import { getSelf } from './data/user.js';
import { dataHash } from '../util/hashing.js';
const Canvas = CanvasAPI.default;

export async function getCanvas(realm, token, validate = true)
{
	// Only HTTPS allowed anways, we're not sending tokens over HTTP
	const canvas = new Canvas(`https://${realm}/api/v1`, token, {timeout: 6500});
	canvas.errorHandler = minimalErrorHandler;

	canvas.uniqueRealmId = dataHash(realm);
	canvas.uniqueUserId = dataHash(realm, token);

	return { canvas, user: validate ? await getSelf(canvas, true) : null };
}
