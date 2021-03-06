/**
 * ViewController
 *
 * @description :: Server-side logic for managing Views
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

// TODO: update
module.exports = {
    create: create,

    destroy: destroy,
};

function create(req, res) {
    var user = req.user;
    if (!user) {
        return res.forbidden();
    }
    View
        .create({
            user: user.id,
            recipe: req.param('id') || req.param('recipe'),
        })
        .then(function (view) {
            return res.ok(view);
        })
        .catch(function (error) {
            return res.ok(error);
        });
}

function destroy(req, res) {
    var criteria = {};
    var recipe = req.param('id');

    if (recipe) {
        criteria.recipe = parseInt(recipe);
    }

    async.waterfall([
        canDestroy,

        destroyView,
    ], serviceUtil.response(req, res));

    function canDestroy(cb) {
        if (req.user.isAdmin) {
            return cb();
        }

        View
            .find(criteria)
            .then(function (views) {
                if (!views) {
                    return cb(new sError.Service("User.Not.Viewd"));
                }

                return cb(null, views);
            })
            .catch(cb);
    }

    function destroyView(views, cb) {
        var matches = [];

        views.forEach(function (view, idx) {
            matches.push(view.id);
        });

        View
            .destroy(matches)
            .then(function (view) {
                return cb(null, view);
            })
            .catch(cb);
    }
}
