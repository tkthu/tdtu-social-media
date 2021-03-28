const {hbs} = require('../config/hbs/index')

const exposeTemplates = (req, res, next)  => {
	res.locals.layout = 'shared-templates';
	next();
}

module.exports = {exposeTemplates}