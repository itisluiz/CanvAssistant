import CanvasAPI, { minimalErrorHandler } from '@kth/canvas-api';
const Canvas = CanvasAPI.default;

export async function getCanvas(realm, token, fetchUserData = true)
{
	// Only HTTPS allowed anways, we're not sending tokens over HTTP
	const canvas = new Canvas(`https://${realm}/api/v1`, token, {timeout: 6500});
	canvas.errorHandler = minimalErrorHandler;

	let userData = null;
	if (fetchUserData)
	{
		const userRequest = await canvas.get('users/self');
		userData = userRequest.body;
	}

	return { canvas, userData };
}
