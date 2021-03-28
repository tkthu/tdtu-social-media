const exposeTemplates = (req, res, next)  => {
	res.locals.layout = 'shared-templates';
	next();
}

module.exports = {exposeTemplates}