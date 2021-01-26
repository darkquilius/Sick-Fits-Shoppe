const { SingleFieldSubscriptions, singleFieldOnlyMessage } = require("graphql/validation/rules/SingleFieldSubscriptions");
const bcrypt = require("bcryptjs");const jwt = require("jsonwebtoken");

const Mutations = {
    async createItem(parent, args, ctx, info){
        // CHECK IF LOGGED IN

        const item = await ctx.db.mutation.createItem({
            data: {...args}
        }, info);

        return item;
    },

    updateItem(parent, args, ctx, info){

        // COPY UPDATES
        const updates = { ...args };

        // REMOVE ID TO ASSIGN NEW ONE
        delete updates.id;

        // RUN THE UPDATE METHOD
        return ctx.db.mutation.updateItem({
            data: updates, 
            where: {id: args.id}
        }, info);

    },

    async deleteItem(parent, args, ctx, info){
        const where = {id: args.id};

        // FIND ITEM
        const item = await ctx.db.query.item({where}, `{id title}`);

        // CHECK IF EXISTS AND IF PERMITTED
        
        // DELETE ITEM
        return ctx.db.mutation.deleteItem({ where }, info);
    },

    async signup(parent, args, ctx, info){
        // MAKE YOUR INFO UNIFORM AKA LOWERCASED, ETC.
        args.email = args.email.toLowerCase();

        // HASH PASSWORD
        const password = await bcrypt.hash(args.password, 10);

        // CREATE USER IN DB
        const user = await ctx.db.mutation.createUser({
            data: {
                ...args,
                password,
                permissions:{ set: ["USER"]}
                }
            }, info
        );

        // CREATE TOKEN TO AUTOSIGNIN
        const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);

        // SET TOKEN AS A COOKIE FOR PAGE SWITCHES
        ctx.response.cookie("token", token, {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24 * 365, // SET A 1 YEAR COOKIE
        });

        // RETURN TO BROWSER
        return user;
    },

    async signin(parent, {email, password}, ctx, info){
        // CHECK IF EXISTING USER
        const user = await ctx.db.query.user({ where: { email }});

        if(!user) {
            throw new Error(`${email} does not exist... Try signing up!!`)
        };

        // CHECK IF PASSWORD MATCHES
        const valid = await bcrypt.compare(password, user.password);

        if(!valid){
            throw new Error("Invalid Password...")
        };

        // CREATE TOKEN TO AUTOSIGNIN
        const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);

        // SET TOKEN AS A COOKIE FOR PAGE SWITCHES
        ctx.response.cookie("token", token, {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24 * 365, // SET A 1 YEAR COOKIE
        });

        // RETURN TO BROWSER
        return user;
    },

    signout(parent, args, ctx, info){
        ctx.response.clearCookie('token');

        return {message: "See Ya Later!"}
    }
};

module.exports = Mutations;
