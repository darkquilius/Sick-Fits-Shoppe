const { forwardTo } = require('prisma-binding');

const Query = {
    // ALSO CAN USE FOR NO AUTHENTICATION
    items: forwardTo('db'),

    item: forwardTo('db'),

    itemsConnection: forwardTo('db'),

    me(parent, args, ctx, info) {
        // check if there is a current user ID
        if (!ctx.request.userId) {
          return null;
        }
        return ctx.db.query.user(
          {
            where: { id: ctx.request.userId },
          },
          info
        );
      },
    // async items(parent, args, ctx, info){
    //     const item = await ctx.db.query.items({...args}, info);

    //     return item
    // }


};

module.exports = Query;
