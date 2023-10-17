import CanvasAPI, { minimalErrorHandler } from '@kth/canvas-api';
const Canvas = CanvasAPI.default;

export async function getCanvas(realm, token)
{
	// Only HTTPS allowed anways, we're not sending tokens over HTTP
	const canvas = new Canvas(`https://${realm}/api/v1`, token, {timeout: 6000});
	canvas.errorHandler = minimalErrorHandler;

	const userRequest = await canvas.get('users/self');
	const userData = userRequest.body;
	
	return { canvas, userData };
}
