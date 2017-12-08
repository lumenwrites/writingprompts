import { Router } from 'express'
const router = new Router()

/* Import controllers */
import * as mainControllers from '../controllers/main.controllers';


/* Cache */
import mcache from 'memory-cache'
var cache = (duration) => {
    return (req, res, next) => {
	let key = '__express__' + req.originalUrl || req.url
	let cachedBody = mcache.get(key)
	if (cachedBody) {
	    res.send(cachedBody)
	    return
	} else {
	    res.sendResponse = res.send
	    res.send = (body) => {
		mcache.put(key, body, duration * 1000);
		res.sendResponse(body)
	    }
	    next()
	}
    }
}

/* Home */
router.route('/').get(mainControllers.home);
router.route('/topauthors').get(mainControllers.topAuthors);
router.route('/stories').get(mainControllers.topStories);
router.route('/prompts').get(mainControllers.hotPrompts);


export default router

