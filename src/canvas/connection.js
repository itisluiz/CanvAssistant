import CanvasAPI, { minimalErrorHandler } from '@kth/canvas-api';
const Canvas = CanvasAPI.default;

export async function getCanvas(realm, token)
{
	const canvas = new Canvas(realm, token);
	canvas.errorHandler = minimalErrorHandler;

	const userRequest = await canvas.get('users/self');
	const userData = userRequest.body;
	
	return { canvas, userData };
}
